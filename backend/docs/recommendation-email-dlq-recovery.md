# Recommendation email DLQ recovery

Recommendation email messages rejected without requeue are routed from
`recommendation.email.queue` through `recommendation.email.exchange.dlq` to
`recommendation.email.queue.dlq`. There is no automatic replay.

## Inspect before recovery

Use the RabbitMQ management UI or an approved broker administration tool to
inspect the DLQ message body and headers. Check:

- `x-outbox-event-id` / AMQP `message_id` to locate the originating outbox event
- `subscriberId` and `recommendationIds` in the JSON body
- `x-email-attempt` and `x-original-routing-key`
- `x-itjob-failure-category`, `x-itjob-failure-reason`, and `x-itjob-failure-at`
- RabbitMQ `x-death` entries for the dead-letter reason, queue, routing key,
  count, and timestamp

Malformed JSON may not reach the application listener, so it may have no
`x-itjob-failure-*` headers. Its body, publisher identity headers, and RabbitMQ
`x-death` metadata remain available for diagnosis.

## Manual replay and delivery ledger

The consumer uses `outbox:<x-outbox-event-id>` as its delivery identity. For
legacy/manual messages without a publisher identity, it derives a stable key
from the subscriber and sorted recommendation IDs (or the raw body for invalid
messages). The durable row is in `recommendation_email_deliveries`.

1. Preserve the original body and headers, confirm the cause is fixed, and
   inspect `recommendation_email_deliveries`, `email_send_history`, and the
   recommendation rows. `SENT` is acknowledged without another SMTP send.
2. A `PROCESSING` row means the send outcome may be unknown, including a crash
   after SMTP accepted the email. Check SMTP/provider logs before deciding to
   replay. `FAILED` deliveries also require an explicit operator decision.
3. To replay, an authorized operator must reset that same delivery identity to
   `PENDING` and reset the affected recommendation rows to `PENDING` with the
   intended `retry_count`. Keep `email_send_history` unchanged. Resetting a
   `PROCESSING`, `FAILED`, or `SENT` record explicitly accepts the possibility
   of another email if the prior SMTP operation succeeded.
4. Republish the message as persistent to
   `recommendation.email.exchange`, using `x-original-routing-key` (normally
   `recommendation.email.routingKey`). Set `x-email-attempt` to the intended
   next attempt and add an operator/replay marker. Retain the event ID and
   message ID so this remains the same delivery identity.
5. Verify that the message was accepted by the broker and reached the main
   queue, then acknowledge/remove the original DLQ copy. Do not remove the DLQ
   copy before confirming the republish.

The database update and manual broker republish are not atomic. Coordinate the
recovery so the application does not consume the message before both database
resets are complete. If the republish result is uncertain, inspect the main
queue before trying again.

The ledger prevents automatic duplicate sends after redelivery and concurrent
delivery. It cannot prove whether SMTP delivered an email when the process
crashes after SMTP acceptance but before the `SENT` transaction commits.
Replaying that uncertain delivery may send a duplicate; ordinary SMTP does not
provide exactly-once delivery.

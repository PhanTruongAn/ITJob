package vn.phantruongan.backend.outbox.services;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.recommendation.dtos.RecommendationEmailMessage;
import vn.phantruongan.backend.outbox.entities.OutboxEvent;
import vn.phantruongan.backend.outbox.enums.OutboxStatus;
import vn.phantruongan.backend.outbox.repositories.OutboxEventRepository;

@Service
@RequiredArgsConstructor
public class OutboxEventService {

    public static final String RECOMMENDATION_EMAIL_EVENT = "RECOMMENDATION_EMAIL";
    private static final String SUBSCRIBER_AGGREGATE = "SUBSCRIBER";

    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    @Transactional(propagation = Propagation.MANDATORY)
    public void saveRecommendationEmailEvents(List<RecommendationEmailMessage> messages) {
        if (messages == null || messages.isEmpty()) {
            return;
        }

        Instant now = Instant.now();
        List<OutboxEvent> events = new ArrayList<>(messages.size());
        for (RecommendationEmailMessage message : messages) {
            OutboxEvent event = new OutboxEvent();
            event.setEventType(RECOMMENDATION_EMAIL_EVENT);
            event.setAggregateType(SUBSCRIBER_AGGREGATE);
            event.setAggregateId(message.getSubscriberId());
            event.setPayload(serialize(message));
            event.setStatus(OutboxStatus.PENDING);
            event.setRetryCount(0);
            event.setNextAttemptAt(now);
            events.add(event);
        }

        outboxEventRepository.saveAll(events);
    }

    private String serialize(RecommendationEmailMessage message) {
        try {
            return objectMapper.writeValueAsString(message);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Unable to serialize recommendation email outbox event", e);
        }
    }
}

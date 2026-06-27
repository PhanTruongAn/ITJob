package vn.phantruongan.backend.recommendation.services;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.phantruongan.backend.common.email.EmailService;
import vn.phantruongan.backend.config.common.RabbitMQConfig;
import vn.phantruongan.backend.recommendation.dtos.RecommendationEmailMessage;
import vn.phantruongan.backend.recommendation.dtos.res.JobRecommendationResDTO;
import vn.phantruongan.backend.recommendation.entities.JobRecommendation;
import vn.phantruongan.backend.recommendation.enums.EmailStatus;
import vn.phantruongan.backend.recommendation.repositories.JobRecommendationRepository;

@Component
@RequiredArgsConstructor
@Slf4j
public class RecommendationEmailConsumer {

    private final JobRecommendationRepository jobRecommendationRepository;
    private final EmailService emailService;
    private final JobRecommendationService jobRecommendationService;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_RECOMMENDATION_EMAIL)
    public void consumeRecommendationEmail(RecommendationEmailMessage message) {
        log.info("Received recommendation email message from RabbitMQ: {}", message);

        List<Long> recIds = message.getRecommendationIds();
        if (recIds == null || recIds.isEmpty()) {
            log.warn("Received empty recommendation IDs list, skipping.");
            return;
        }

        // Fetch current recommendations from DB using eager loading (@EntityGraph) to avoid LazyInitializationException
        List<JobRecommendation> recommendations = jobRecommendationRepository.findAllByIdIn(recIds);
        if (recommendations.isEmpty()) {
            log.warn("No JobRecommendations found for IDs {}, skipping.", recIds);
            return;
        }

        // Map to ResDTO for template processing
        List<JobRecommendationResDTO> resDTOs = recommendations.stream()
                .map(jobRecommendationService::convertToResDTO)
                .collect(Collectors.toList());

        try {
            // Send email synchronously
            emailService.sendJobRecommendationsEmail(
                    message.getSubscriberEmail(),
                    null, // Subscriber full name can be set here if table is updated later
                    resDTOs
            );

            // On success, update status in DB
            jobRecommendationRepository.updateEmailStatusAndSentAtByIds(recIds, EmailStatus.SENT, Instant.now());
            log.info("Successfully processed and sent email to {}", message.getSubscriberEmail());

        } catch (Exception e) {
            log.error("Failed to send email to '{}': {}", message.getSubscriberEmail(), e.getMessage());
            handleEmailFailure(recIds, recommendations, e);
        } finally {
            // Rate limit throttling: limit to 1000 emails/minute (~70ms delay per subscriber message)
            try {
                Thread.sleep(70);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                log.warn("Throttle sleep interrupted", ie);
            }
        }
    }

    private void handleEmailFailure(List<Long> recIds, List<JobRecommendation> recommendations, Exception e) {
        boolean isTransient = isTransientException(e);
        int currentRetry = recommendations.get(0).getRetryCount() != null ? recommendations.get(0).getRetryCount() : 0;
        int newRetryCount = currentRetry + 1;

        if (isTransient) {
            if (newRetryCount < 3) {
                // Keep PENDING, increment retryCount
                jobRecommendationRepository.updateEmailStatusAndRetryCountByIds(recIds, EmailStatus.PENDING, newRetryCount);
                log.warn("Email failure is transient. Incremented retryCount to {} and kept status PENDING for IDs {}", newRetryCount, recIds);
            } else {
                // Max retries reached, mark as FAILED
                jobRecommendationRepository.updateEmailStatusAndRetryCountByIds(recIds, EmailStatus.FAILED, newRetryCount);
                log.error("Max transient retries reached (3). Marked status as FAILED for IDs {}", recIds);
            }
        } else {
            // Permanent failure, mark as FAILED immediately
            jobRecommendationRepository.updateEmailStatusByIds(recIds, EmailStatus.FAILED);
            log.error("Email failure is permanent (non-transient). Marked status as FAILED immediately for IDs {}", recIds);
        }
    }

    private boolean isTransientException(Throwable throwable) {
        if (throwable == null) return false;

        Throwable current = throwable;
        while (current != null) {
            String className = current.getClass().getName();
            if (current instanceof java.net.SocketTimeoutException ||
                current instanceof java.net.ConnectException ||
                current instanceof java.net.UnknownHostException ||
                className.contains("MailConnectException") ||
                className.contains("SocketException")) {
                return true;
            }

            if (className.contains("SMTPSendFailedException")) {
                try {
                    java.lang.reflect.Method getReturnCode = current.getClass().getMethod("getReturnCode");
                    int code = (Integer) getReturnCode.invoke(current);
                    if (code == 421 || code == 450 || code == 451 || code == 452) {
                        return true;
                    }
                } catch (Exception ex) {
                    // ignore and fallback to message pattern check
                }
            }

            String msg = current.getMessage();
            if (msg != null) {
                if (msg.contains("421") || msg.contains("450") || msg.contains("451") || msg.contains("452") ||
                    msg.toLowerCase().contains("timeout") || msg.toLowerCase().contains("connection reset")) {
                    return true;
                }
            }

            current = current.getCause();
        }
        return false;
    }
}

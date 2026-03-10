package vn.phantruongan.backend.recommendation.services;

import org.springframework.context.ApplicationEvent;

import lombok.Getter;

@Getter
public class RecommendationConfigUpdatedEvent extends ApplicationEvent {
    public RecommendationConfigUpdatedEvent(Object source, Object dummy) {
        super(source);
    }
}

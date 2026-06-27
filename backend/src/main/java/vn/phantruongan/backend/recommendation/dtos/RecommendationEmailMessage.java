package vn.phantruongan.backend.recommendation.dtos;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RecommendationEmailMessage implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long subscriberId;
    private String subscriberEmail;
    private String subscriberName;
    private List<Long> recommendationIds;
}

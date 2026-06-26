package vn.phantruongan.backend.recommendation.dtos.req;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import vn.phantruongan.backend.recommendation.dtos.res.JobRecommendationResDTO;
import vn.phantruongan.backend.subscriber.entities.Subscriber;

@Getter
@AllArgsConstructor
public class JobRecommendationEmailReqDTO {

    private Subscriber subscriber;

    private List<JobRecommendationResDTO> recommendations;

}

package vn.phantruongan.backend.subscriber.dtos.req.subscriber;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class GetListSubscriberReqDTO {
    private String email;
}

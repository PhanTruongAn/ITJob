package vn.phantruongan.backend.subscriber.dtos.req.subscriber;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class UpdateSubscriberReqDTO extends CreateSubscriberReqDTO {
    public long id;

}

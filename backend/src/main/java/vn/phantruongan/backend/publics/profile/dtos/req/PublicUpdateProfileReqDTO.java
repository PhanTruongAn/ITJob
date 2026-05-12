package vn.phantruongan.backend.publics.profile.dtos.req;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PublicUpdateProfileReqDTO {
    private String name;
    private String phone;
    private String address;
    private String avatar;

}

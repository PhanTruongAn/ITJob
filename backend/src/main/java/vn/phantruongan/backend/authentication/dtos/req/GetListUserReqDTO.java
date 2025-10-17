package vn.phantruongan.backend.authentication.dtos.req;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.phantruongan.backend.authentication.enums.GenderEnum;

@Getter
@Setter
@NoArgsConstructor
public class GetListUserReqDTO {
    private String name;
    private String phone;
    private String email;
    private GenderEnum gender;
}

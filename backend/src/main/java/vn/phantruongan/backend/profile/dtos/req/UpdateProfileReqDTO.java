package vn.phantruongan.backend.profile.dtos.req;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;
import vn.phantruongan.backend.authentication.enums.GenderEnum;

@Getter
@Setter
public class UpdateProfileReqDTO {
    private String name;
    private String phone;
    private String address;
    private GenderEnum gender;
    private String avatar;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate dob;
}

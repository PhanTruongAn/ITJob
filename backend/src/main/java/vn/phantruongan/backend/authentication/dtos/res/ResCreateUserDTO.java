package vn.phantruongan.backend.authentication.dtos.res;

import java.time.Instant;
import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;
import vn.phantruongan.backend.authentication.enums.GenderEnum;

@Getter
@Setter
public class ResCreateUserDTO {
    private String name;
    private String phone;
    private String email;
    private GenderEnum gender;
    private String address;
    private LocalDate dob;
    private Instant createdAt;

}

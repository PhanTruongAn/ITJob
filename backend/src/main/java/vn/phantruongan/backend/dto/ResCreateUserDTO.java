package vn.phantruongan.backend.dto;

import java.time.Instant;
import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;
import vn.phantruongan.backend.util.enums.GenderEnum;

@Getter
@Setter
public class ResCreateUserDTO {
    private String name;
    private String email;
    private GenderEnum gender;
    private String address;
    private LocalDate dob;
    private Instant createdAt;

}

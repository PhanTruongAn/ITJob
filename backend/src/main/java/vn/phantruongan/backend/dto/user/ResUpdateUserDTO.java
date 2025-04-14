package vn.phantruongan.backend.dto.user;

import java.time.Instant;
import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;
import vn.phantruongan.backend.util.enums.GenderEnum;

@Getter
@Setter
public class ResUpdateUserDTO {
    private long id;
    private String name;
    private String phone;
    private GenderEnum gender;
    private String address;
    private LocalDate dob;
    private Instant updatedAt;
}

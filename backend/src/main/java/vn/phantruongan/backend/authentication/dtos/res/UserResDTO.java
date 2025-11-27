package vn.phantruongan.backend.authentication.dtos.res;

import java.time.Instant;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.phantruongan.backend.authentication.enums.GenderEnum;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResDTO {
    private long id;
    private String name;
    private String phone;
    private String email;
    private LocalDate dob;
    private GenderEnum gender;
    private String address;
    private String avatar;
    private Instant createdAt;
    private Instant updatedAt;
    // private long roleId;
}

package vn.phantruongan.backend.dto.user;

import java.time.Instant;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.phantruongan.backend.util.enums.GenderEnum;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResUserDTO {
    private long id;
    private String name;
    private String phone;
    private String email;
    private LocalDate dob;
    private GenderEnum gender;
    private String address;
    private Instant createdAt;
    private Instant updatedAt;
}

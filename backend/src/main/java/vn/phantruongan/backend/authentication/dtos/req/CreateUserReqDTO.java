package vn.phantruongan.backend.authentication.dtos.req;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import vn.phantruongan.backend.authentication.enums.GenderEnum;

@Getter
@Setter
public class CreateUserReqDTO {
    @NotBlank(message = "User name must not be empty.")
    private String name;

    @NotBlank(message = "Phone number must not be empty.")
    private String phone;

    @NotBlank(message = "Password must not be empty.")
    private String password;

    @Email(message = "Invalid email format.")
    @NotBlank(message = "Email must not be empty.")
    private String email;

    private GenderEnum gender;
    private String address;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate dob;

}

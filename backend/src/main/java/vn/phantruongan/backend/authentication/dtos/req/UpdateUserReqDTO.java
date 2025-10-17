package vn.phantruongan.backend.authentication.dtos.req;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import vn.phantruongan.backend.authentication.enums.GenderEnum;

@Getter
@Setter
public class UpdateUserReqDTO {
    @NotNull
    private Long id;

    @NotBlank(message = "User name must not be empty.")
    private String name;

    @NotBlank(message = "Phone number must not be empty.")
    private String phone;

    private String address;
    private GenderEnum gender;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate dob;
}

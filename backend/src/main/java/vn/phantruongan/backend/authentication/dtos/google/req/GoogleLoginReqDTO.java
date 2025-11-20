package vn.phantruongan.backend.authentication.dtos.google.req;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleLoginReqDTO {
    @NotBlank(message = "Google ID Token must not be blank!")
    private String idToken;
}

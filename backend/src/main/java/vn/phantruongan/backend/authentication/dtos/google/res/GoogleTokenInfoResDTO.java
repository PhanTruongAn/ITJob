package vn.phantruongan.backend.authentication.dtos.google.res;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GoogleTokenInfoResDTO {
    private String sub;
    private String email;
    private String name;
    private String picture;
}

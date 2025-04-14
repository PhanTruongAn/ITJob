package vn.phantruongan.backend.dto.filter.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserFilter {
    private String name;
    private String phone;
}

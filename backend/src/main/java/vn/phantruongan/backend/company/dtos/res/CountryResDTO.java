package vn.phantruongan.backend.company.dtos.res;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CountryResDTO {
    private Long id;
    private String code;
    private String name;
}
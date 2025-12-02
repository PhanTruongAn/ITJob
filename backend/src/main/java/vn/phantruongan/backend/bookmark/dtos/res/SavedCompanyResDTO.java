package vn.phantruongan.backend.bookmark.dtos.res;

import lombok.Getter;
import lombok.Setter;
import vn.phantruongan.backend.company.dtos.res.CompanyResDTO;

@Getter
@Setter
public class SavedCompanyResDTO {
    private Long id;
    private CompanyResDTO company;
}

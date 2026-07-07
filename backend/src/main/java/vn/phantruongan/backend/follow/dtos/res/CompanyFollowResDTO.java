package vn.phantruongan.backend.follow.dtos.res;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyFollowResDTO {
    private Long id;
    private Long companyId;
    private String companyName;
    private String companyLogo;
    private boolean active;
}

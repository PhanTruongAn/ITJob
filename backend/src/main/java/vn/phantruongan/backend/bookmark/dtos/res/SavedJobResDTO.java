package vn.phantruongan.backend.bookmark.dtos.res;

import lombok.Getter;
import lombok.Setter;
import vn.phantruongan.backend.job.dtos.res.JobResDTO;

@Getter
@Setter
public class SavedJobResDTO {
    private Long id;
    private JobResDTO job;
}

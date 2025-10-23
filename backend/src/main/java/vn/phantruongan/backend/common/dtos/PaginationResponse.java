package vn.phantruongan.backend.common.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaginationResponse<T> {
    private List<T> result;
    private Meta meta;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Meta {
        private int pageNumber;
        private int pageSize;
        private long total;
        private int pages;
    }
}

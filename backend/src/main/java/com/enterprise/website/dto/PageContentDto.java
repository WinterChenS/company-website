package com.enterprise.website.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;

/**
 * PageContent DTO 集合
 */
public class PageContentDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String pageKey;
        private String contentKey;
        private String contentZh;
        private String contentEn;
        private Integer sortOrder;
        private LocalDateTime updatedAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotBlank(message = "pageKey 不能为空")
        @Size(max = 50, message = "pageKey 长度不能超过50")
        private String pageKey;

        @NotBlank(message = "contentKey 不能为空")
        @Size(max = 100, message = "contentKey 长度不能超过100")
        private String contentKey;

        @NotBlank(message = "中文内容不能为空")
        private String contentZh;

        @NotBlank(message = "英文内容不能为空")
        private String contentEn;

        @NotNull(message = "排序值不能为空")
        private Integer sortOrder;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        @NotBlank(message = "中文内容不能为空")
        private String contentZh;

        @NotBlank(message = "英文内容不能为空")
        private String contentEn;

        @NotNull(message = "排序值不能为空")
        private Integer sortOrder;
    }

    /** 统一响应 */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApiResponse<T> {
        private boolean success;
        private String message;
        private T data;

        public static <T> ApiResponse<T> ok(T data) {
            return ApiResponse.<T>builder().success(true).message("success").data(data).build();
        }

        public static <T> ApiResponse<T> ok(String message, T data) {
            return ApiResponse.<T>builder().success(true).message(message).data(data).build();
        }

        public static <T> ApiResponse<T> fail(String message) {
            return ApiResponse.<T>builder().success(false).message(message).build();
        }
    }

    /** 分页响应 */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PageResponse<T> {
        private boolean success;
        private String message;
        private PageData<T> data;

        public static <T> PageResponse<T> of(Page<T> page) {
            return PageResponse.<T>builder()
                .success(true)
                .message("success")
                .data(PageData.<T>builder()
                    .list(page.getContent())
                    .total(page.getTotalElements())
                    .page(page.getNumber())
                    .size(page.getSize())
                    .build())
                .build();
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PageData<T> {
        private List<T> list;
        private long total;
        private int page;
        private int size;
    }
}

package com.enterprise.website.dto;

import lombok.*;

/**
 * 主题 DTO
 */
public class SiteThemeDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String themeKey;
        private String themeName;
        private Boolean isActive;
        private String description;
    }
}

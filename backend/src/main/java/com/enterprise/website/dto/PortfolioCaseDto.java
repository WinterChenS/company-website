package com.enterprise.website.dto;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 案例数据传输对象（用于公共接口）
 */
@Data
public class PortfolioCaseDto {
    private Long id;
    private String title;
    private String client;
    private String industry;
    private String overview;
    private String challenge;
    private String solution;
    private String result;
    private String imageUrl;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
}
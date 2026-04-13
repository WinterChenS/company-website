package com.enterprise.website.dto;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 案例数据传输对象（用于管理后台）
 */
@Data
public class PortfolioCaseAdminDto {
    private Long id;
    private String titleZh;
    private String titleEn;
    private String clientZh;
    private String clientEn;
    private String industryZh;
    private String industryEn;
    private String overviewZh;
    private String overviewEn;
    private String challengeZh;
    private String challengeEn;
    private String solutionZh;
    private String solutionEn;
    private String resultZh;
    private String resultEn;
    private String imageUrl;
    private Integer sortOrder;
    private Boolean isPublished;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
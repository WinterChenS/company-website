package com.enterprise.website.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 公司案例实体类
 * 展示企业的成功项目、客户案例及解决方案，增强客户信任
 */
@Entity
@Table(name = "portfolio_case")
@Data
public class PortfolioCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 案例标题 - 中文 */
    @Column(name = "title_zh", nullable = false, length = 200)
    private String titleZh;

    /** 案例标题 - 英文 */
    @Column(name = "title_en", nullable = false, length = 200)
    private String titleEn;

    /** 客户名称 - 中文 */
    @Column(name = "client_zh", nullable = false, length = 200)
    private String clientZh;

    /** 客户名称 - 英文 */
    @Column(name = "client_en", nullable = false, length = 200)
    private String clientEn;

    /** 所属行业 - 中文 */
    @Column(name = "industry_zh", nullable = false, length = 100)
    private String industryZh;

    /** 所属行业 - 英文 */
    @Column(name = "industry_en", nullable = false, length = 100)
    private String industryEn;

    /** 概述 - 中文（简要介绍） */
    @Column(name = "overview_zh", columnDefinition = "TEXT", nullable = false)
    private String overviewZh;

    /** 概述 - 英文 */
    @Column(name = "overview_en", columnDefinition = "TEXT", nullable = false)
    private String overviewEn;

    /** 挑战与难点 - 中文 */
    @Column(name = "challenge_zh", columnDefinition = "TEXT", nullable = false)
    private String challengeZh;

    /** 挑战与难点 - 英文 */
    @Column(name = "challenge_en", columnDefinition = "TEXT", nullable = false)
    private String challengeEn;

    /** 解决方案 - 中文 */
    @Column(name = "solution_zh", columnDefinition = "TEXT", nullable = false)
    private String solutionZh;

    /** 解决方案 - 英文 */
    @Column(name = "solution_en", columnDefinition = "TEXT", nullable = false)
    private String solutionEn;

    /** 成果与效益 - 中文 */
    @Column(name = "result_zh", columnDefinition = "TEXT", nullable = false)
    private String resultZh;

    /** 成果与效益 - 英文 */
    @Column(name = "result_en", columnDefinition = "TEXT", nullable = false)
    private String resultEn;

    /** 案例图片URL（头图） */
    @Column(name = "image_url", length = 500, nullable = false)
    private String imageUrl = "";

    /** 排序权重（越大越靠前） */
    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;

    /** 是否发布 */
    @Column(name = "is_published", nullable = false)
    private Boolean published = true;

    /** 发布时间 */
    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    /** 创建时间 */
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /** 更新时间 */
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
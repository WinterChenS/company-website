package com.enterprise.website.repository;

import com.enterprise.website.entity.PortfolioCase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortfolioCaseRepository extends JpaRepository<PortfolioCase, Long> {

    /**
     * 查找已发布的案例（按排序权重倒序）
     */
    List<PortfolioCase> findByPublishedTrueOrderBySortOrderDesc();
    
    /**
     * 分页查找已发布的案例（按排序权重倒序）
     */
    Page<PortfolioCase> findByPublishedTrueOrderBySortOrderDesc(Pageable pageable);
    
    /**
     * 按行业筛选已发布的案例
     */
    @Query("SELECT c FROM PortfolioCase c WHERE c.published = true AND (c.industryZh LIKE %:industry% OR c.industryEn LIKE %:industry%) ORDER BY c.sortOrder DESC")
    List<PortfolioCase> findByIndustryContaining(@Param("industry") String industry);
    
    /**
     * 查找所有案例（管理员用）
     */
    @Query("SELECT c FROM PortfolioCase c ORDER BY c.sortOrder DESC, c.createdAt DESC")
    Page<PortfolioCase> findAllOrdered(Pageable pageable);
    
    /**
     * 按标题搜索案例（管理员用）
     */
    @Query("SELECT c FROM PortfolioCase c WHERE c.titleZh LIKE %:keyword% OR c.titleEn LIKE %:keyword% ORDER BY c.sortOrder DESC, c.createdAt DESC")
    Page<PortfolioCase> searchByTitle(@Param("keyword") String keyword, Pageable pageable);
}
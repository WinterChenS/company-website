package com.enterprise.website.service;

import com.enterprise.website.dto.PortfolioCaseAdminDto;
import com.enterprise.website.dto.PortfolioCaseDto;
import com.enterprise.website.entity.PortfolioCase;
import com.enterprise.website.repository.PortfolioCaseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PortfolioCaseService {

    private final PortfolioCaseRepository portfolioCaseRepository;

    /**
     * 获取公开的案例列表
     */
    public List<PortfolioCaseDto> getPublishedCases(String locale) {
        List<PortfolioCase> cases = portfolioCaseRepository.findByPublishedTrueOrderBySortOrderDesc();
        return cases.stream()
                .map(caseEntity -> toDto(caseEntity, locale))
                .collect(Collectors.toList());
    }

    /**
     * 获取公开案例分页
     */
    public Page<PortfolioCaseDto> getPublishedCasesPage(int page, int size, String locale) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "sortOrder"));
        Page<PortfolioCase> casePage = portfolioCaseRepository.findByPublishedTrueOrderBySortOrderDesc(pageable);
        return casePage.map(caseEntity -> toDto(caseEntity, locale));
    }

    /**
     * 按ID获取单个公开案例
     */
    public PortfolioCaseDto getCaseById(Long id, String locale) {
        PortfolioCase caseEntity = portfolioCaseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("案例不存在"));
        
        if (!caseEntity.getPublished()) {
            throw new IllegalStateException("该案例未发布");
        }
        
        return toDto(caseEntity, locale);
    }

    /**
     * 按行业筛选案例
     */
    public List<PortfolioCaseDto> getCasesByIndustry(String industry, String locale) {
        List<PortfolioCase> cases = portfolioCaseRepository.findByIndustryContaining(industry);
        return cases.stream()
                .map(caseEntity -> toDto(caseEntity, locale))
                .collect(Collectors.toList());
    }

    /**
     * 转换实体为DTO
     */
    private PortfolioCaseDto toDto(PortfolioCase caseEntity, String locale) {
        PortfolioCaseDto dto = new PortfolioCaseDto();
        dto.setId(caseEntity.getId());
        dto.setTitle(isZh(locale) ? caseEntity.getTitleZh() : caseEntity.getTitleEn());
        dto.setClient(isZh(locale) ? caseEntity.getClientZh() : caseEntity.getClientEn());
        dto.setIndustry(isZh(locale) ? caseEntity.getIndustryZh() : caseEntity.getIndustryEn());
        dto.setOverview(isZh(locale) ? caseEntity.getOverviewZh() : caseEntity.getOverviewEn());
        dto.setChallenge(isZh(locale) ? caseEntity.getChallengeZh() : caseEntity.getChallengeEn());
        dto.setSolution(isZh(locale) ? caseEntity.getSolutionZh() : caseEntity.getSolutionEn());
        dto.setResult(isZh(locale) ? caseEntity.getResultZh() : caseEntity.getResultEn());
        dto.setImageUrl(caseEntity.getImageUrl());
        dto.setPublishedAt(caseEntity.getPublishedAt());
        dto.setCreatedAt(caseEntity.getCreatedAt());
        return dto;
    }

    /**
     * 判断是否为中文环境
     */
    private boolean isZh(String locale) {
        return locale != null && locale.startsWith("zh");
    }

    /**
     * 管理员：获取所有案例分页
     */
    public Page<PortfolioCaseAdminDto> getAllCasesPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "sortOrder"));
        Page<PortfolioCase> casePage = portfolioCaseRepository.findAllOrdered(pageable);
        return casePage.map(this::toAdminDto);
    }

    /**
     * 管理员：搜索案例
     */
    public Page<PortfolioCaseAdminDto> searchCases(String keyword, int page, int size) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllCasesPage(page, size);
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "sortOrder"));
        Page<PortfolioCase> casePage = portfolioCaseRepository.searchByTitle(keyword.trim(), pageable);
        return casePage.map(this::toAdminDto);
    }

    /**
     * 管理员：获取案例详情
     */
    public PortfolioCaseAdminDto getCaseForAdmin(Long id) {
        PortfolioCase caseEntity = portfolioCaseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("案例不存在"));
        return toAdminDto(caseEntity);
    }

    /**
     * 管理员：保存或更新案例
     */
    @Transactional
    public PortfolioCaseAdminDto saveCase(PortfolioCaseAdminDto dto) {
        PortfolioCase caseEntity;
        
        if (dto.getId() != null) {
            // 更新现有案例
            caseEntity = portfolioCaseRepository.findById(dto.getId())
                    .orElseThrow(() -> new IllegalArgumentException("案例不存在"));
            
            // 如果从未发布状态改为已发布，设置发布时间
            if (!caseEntity.getPublished() && Boolean.TRUE.equals(dto.getIsPublished())) {
                caseEntity.setPublishedAt(LocalDateTime.now());
            }
        } else {
            // 创建新案例
            caseEntity = new PortfolioCase();
            if (Boolean.TRUE.equals(dto.getIsPublished())) {
                caseEntity.setPublishedAt(LocalDateTime.now());
            }
        }
        
        // 更新字段
        caseEntity.setTitleZh(dto.getTitleZh());
        caseEntity.setTitleEn(dto.getTitleEn());
        caseEntity.setClientZh(dto.getClientZh());
        caseEntity.setClientEn(dto.getClientEn());
        caseEntity.setIndustryZh(dto.getIndustryZh());
        caseEntity.setIndustryEn(dto.getIndustryEn());
        caseEntity.setOverviewZh(dto.getOverviewZh());
        caseEntity.setOverviewEn(dto.getOverviewEn());
        caseEntity.setChallengeZh(dto.getChallengeZh());
        caseEntity.setChallengeEn(dto.getChallengeEn());
        caseEntity.setSolutionZh(dto.getSolutionZh());
        caseEntity.setSolutionEn(dto.getSolutionEn());
        caseEntity.setResultZh(dto.getResultZh());
        caseEntity.setResultEn(dto.getResultEn());
        caseEntity.setImageUrl(dto.getImageUrl());
        caseEntity.setSortOrder(dto.getSortOrder());
        caseEntity.setPublished(dto.getIsPublished());
        
        PortfolioCase saved = portfolioCaseRepository.save(caseEntity);
        return toAdminDto(saved);
    }

    /**
     * 管理员：删除案例
     */
    @Transactional
    public void deleteCase(Long id) {
        if (!portfolioCaseRepository.existsById(id)) {
            throw new IllegalArgumentException("案例不存在");
        }
        portfolioCaseRepository.deleteById(id);
        log.info("删除了案例 ID: {}", id);
    }

    /**
     * 管理员：发布/取消发布案例
     */
    @Transactional
    public PortfolioCaseAdminDto togglePublishStatus(Long id, boolean publish) {
        PortfolioCase caseEntity = portfolioCaseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("案例不存在"));
        
        caseEntity.setPublished(publish);
        if (publish && caseEntity.getPublishedAt() == null) {
            caseEntity.setPublishedAt(LocalDateTime.now());
        }
        
        PortfolioCase saved = portfolioCaseRepository.save(caseEntity);
        return toAdminDto(saved);
    }

    /**
     * 转换实体为管理员DTO
     */
    private PortfolioCaseAdminDto toAdminDto(PortfolioCase caseEntity) {
        PortfolioCaseAdminDto dto = new PortfolioCaseAdminDto();
        dto.setId(caseEntity.getId());
        dto.setTitleZh(caseEntity.getTitleZh());
        dto.setTitleEn(caseEntity.getTitleEn());
        dto.setClientZh(caseEntity.getClientZh());
        dto.setClientEn(caseEntity.getClientEn());
        dto.setIndustryZh(caseEntity.getIndustryZh());
        dto.setIndustryEn(caseEntity.getIndustryEn());
        dto.setOverviewZh(caseEntity.getOverviewZh());
        dto.setOverviewEn(caseEntity.getOverviewEn());
        dto.setChallengeZh(caseEntity.getChallengeZh());
        dto.setChallengeEn(caseEntity.getChallengeEn());
        dto.setSolutionZh(caseEntity.getSolutionZh());
        dto.setSolutionEn(caseEntity.getSolutionEn());
        dto.setResultZh(caseEntity.getResultZh());
        dto.setResultEn(caseEntity.getResultEn());
        dto.setImageUrl(caseEntity.getImageUrl());
        dto.setSortOrder(caseEntity.getSortOrder());
        dto.setIsPublished(caseEntity.getPublished());
        dto.setPublishedAt(caseEntity.getPublishedAt());
        dto.setCreatedAt(caseEntity.getCreatedAt());
        dto.setUpdatedAt(caseEntity.getUpdatedAt());
        return dto;
    }
}
package com.enterprise.website.service;

import com.enterprise.website.dto.PageContentDto;
import com.enterprise.website.entity.PageContent;
import com.enterprise.website.repository.PageContentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 页面内容配置业务逻辑层
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PageContentService {

    private final PageContentRepository repository;

    // ─────────────── 官网查询接口（Public）───────────────────

    @Transactional(readOnly = true)
    public List<PageContentDto.Response> getByPageKey(String pageKey) {
        log.debug("查询页面内容: pageKey={}", pageKey);
        return repository.findByPageKeyOrderBySortOrderAsc(pageKey.toUpperCase())
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<PageContent> findByPageKey(String pageKey) {
        log.debug("查询页面原始实体: pageKey={}", pageKey);
        return repository.findByPageKeyOrderBySortOrderAsc(pageKey.toUpperCase()).stream().findFirst();
    }

    @Transactional(readOnly = true)
    public Optional<PageContent> findByPageKeyAndContentKey(String pageKey, String contentKey) {
        log.debug("查询页面具体条目: pageKey={}, contentKey={}", pageKey, contentKey);
        return repository.findByPageKeyAndContentKey(pageKey.toUpperCase(), contentKey.toUpperCase());
    }

    // ─────────────── 管理后台接口（Admin）───────────────────

    /**
     * 分页获取全部内容配置
     */
    @Transactional(readOnly = true)
    public Page<PageContentDto.Response> getAllPaged(int page, int size, String pageKey) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(
            Sort.Order.asc("pageKey"),
            Sort.Order.asc("sortOrder")
        ));

        if (pageKey != null && !pageKey.isBlank()) {
            // 按页面Key筛选（全表查询 + 过滤，H2 演示够用）
            List<PageContentDto.Response> all = repository.findAll().stream()
                .filter(p -> p.getPageKey().equals(pageKey.toUpperCase()))
                .sorted((a, b) -> {
                    int cmp = a.getPageKey().compareTo(b.getPageKey());
                    return cmp != 0 ? cmp : a.getSortOrder().compareTo(b.getSortOrder());
                })
                .map(this::toResponse)
                .collect(Collectors.toList());

            int start = Math.min(page * size, all.size());
            int end = Math.min(start + size, all.size());
            List<PageContentDto.Response> pageContent = all.subList(start, end);
            return new PageImpl<>(pageContent, pageable, all.size());
        }

        return repository.findAll(pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public PageContentDto.Response getById(Long id) {
        return repository.findById(id)
            .map(this::toResponse)
            .orElseThrow(() -> new EntityNotFoundException("内容配置不存在: id=" + id));
    }

    @Transactional
    public PageContentDto.Response create(PageContentDto.CreateRequest request) {
        repository.findByPageKeyAndContentKey(
            request.getPageKey().toUpperCase(),
            request.getContentKey().toUpperCase()
        ).ifPresent(existing -> {
            throw new IllegalArgumentException(
                String.format("内容配置已存在: pageKey=%s, contentKey=%s",
                    request.getPageKey(), request.getContentKey())
            );
        });

        PageContent entity = PageContent.builder()
            .pageKey(request.getPageKey().toUpperCase())
            .contentKey(request.getContentKey().toUpperCase())
            .contentZh(request.getContentZh())
            .contentEn(request.getContentEn())
            .sortOrder(request.getSortOrder())
            .build();

        PageContent saved = repository.save(entity);
        log.info("创建内容配置: id={}, pageKey={}, contentKey={}", saved.getId(), saved.getPageKey(), saved.getContentKey());
        return toResponse(saved);
    }

    @Transactional
    public PageContentDto.Response update(Long id, PageContentDto.UpdateRequest request) {
        PageContent entity = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("内容配置不存在: id=" + id));

        entity.setContentZh(request.getContentZh());
        entity.setContentEn(request.getContentEn());
        entity.setSortOrder(request.getSortOrder());

        PageContent saved = repository.save(entity);
        log.info("更新内容配置: id={}", id);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("内容配置不存在: id=" + id);
        }
        repository.deleteById(id);
        log.info("删除内容配置: id={}", id);
    }

    @Transactional(readOnly = true)
    public List<String> getDistinctPageKeys() {
        return repository.findDistinctPageKeys();
    }

    private PageContentDto.Response toResponse(PageContent entity) {
        return PageContentDto.Response.builder()
            .id(entity.getId())
            .pageKey(entity.getPageKey())
            .contentKey(entity.getContentKey())
            .contentZh(entity.getContentZh())
            .contentEn(entity.getContentEn())
            .sortOrder(entity.getSortOrder())
            .updatedAt(entity.getUpdatedAt())
            .build();
    }
}

package com.enterprise.website.service;

import com.enterprise.website.dto.SiteThemeDto;
import com.enterprise.website.entity.SiteTheme;
import com.enterprise.website.repository.SiteThemeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 主题管理服务
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SiteThemeService {

    private final SiteThemeRepository repository;

    /**
     * 获取所有主题列表
     */
    @Transactional(readOnly = true)
    public List<SiteThemeDto.Response> getAll() {
        return repository.findAll().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    /**
     * 获取当前激活的主题
     */
    @Transactional(readOnly = true)
    public SiteThemeDto.Response getActive() {
        return repository.findByIsActiveTrue()
            .map(this::toResponse)
            .orElseThrow(() -> new IllegalStateException("未设置激活主题"));
    }

    /**
     * 切换激活主题
     */
    @Transactional
    public void activateTheme(String themeKey) {
        // 先取消所有激活状态
        repository.findAll().forEach(t -> t.setIsActive(false));
        repository.saveAll(repository.findAll());

        // 激活目标主题
        SiteTheme theme = repository.findByThemeKey(themeKey)
            .orElseThrow(() -> new IllegalArgumentException("主题不存在: " + themeKey));
        theme.setIsActive(true);
        repository.save(theme);

        log.info("切换主题: {}", themeKey);
    }

    private SiteThemeDto.Response toResponse(SiteTheme entity) {
        return SiteThemeDto.Response.builder()
            .id(entity.getId())
            .themeKey(entity.getThemeKey())
            .themeName(entity.getThemeName())
            .isActive(entity.getIsActive())
            .description(entity.getDescription())
            .build();
    }
}

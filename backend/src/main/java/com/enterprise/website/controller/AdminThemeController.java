package com.enterprise.website.controller;

import com.enterprise.website.dto.PageContentDto;
import com.enterprise.website.dto.SiteThemeDto;
import com.enterprise.website.service.SiteThemeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 管理后台 - 主题管理 API（需 JWT 鉴权）
 */
@RestController
@RequestMapping("/api/admin/themes")
@RequiredArgsConstructor
public class AdminThemeController {

    private final SiteThemeService service;

    /** 获取所有主题 */
    @GetMapping
    public ResponseEntity<PageContentDto.ApiResponse<java.util.List<SiteThemeDto.Response>>> getAll() {
        return ResponseEntity.ok(PageContentDto.ApiResponse.ok(service.getAll()));
    }

    /** 获取当前激活主题 */
    @GetMapping("/active")
    public ResponseEntity<PageContentDto.ApiResponse<SiteThemeDto.Response>> getActive() {
        return ResponseEntity.ok(PageContentDto.ApiResponse.ok(service.getActive()));
    }

    /** 切换主题 */
    @PutMapping("/activate")
    public ResponseEntity<PageContentDto.ApiResponse<Void>> activateTheme(
        @RequestBody Map<String, String> body
    ) {
        String themeKey = body.get("themeKey");
        if (themeKey == null || themeKey.isBlank()) {
            throw new IllegalArgumentException("themeKey 不能为空");
        }
        service.activateTheme(themeKey);
        return ResponseEntity.ok(PageContentDto.ApiResponse.ok("主题切换成功", null));
    }
}

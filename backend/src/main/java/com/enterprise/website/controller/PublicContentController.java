package com.enterprise.website.controller;

import com.enterprise.website.dto.*;
import com.enterprise.website.service.PageContentService;
import com.enterprise.website.service.ContactMessageService;
import com.enterprise.website.service.SiteThemeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 官网公开 API（无需鉴权）
 */
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicContentController {

    private final PageContentService pageContentService;
    private final ContactMessageService contactMessageService;
    private final SiteThemeService siteThemeService;

    /** 按页面Key获取内容 */
    @GetMapping("/content")
    public ResponseEntity<PageContentDto.ApiResponse<List<PageContentDto.Response>>> getByPageKey(
        @RequestParam(defaultValue = "HOME") String pageKey
    ) {
        return ResponseEntity.ok(PageContentDto.ApiResponse.ok(pageContentService.getByPageKey(pageKey)));
    }

    /** 获取所有页面Key */
    @GetMapping("/content/page-keys")
    public ResponseEntity<PageContentDto.ApiResponse<List<String>>> getPageKeys() {
        return ResponseEntity.ok(PageContentDto.ApiResponse.ok(pageContentService.getDistinctPageKeys()));
    }

    /** 提交联系消息 */
    @PostMapping("/contact")
    public ResponseEntity<PageContentDto.ApiResponse<ContactMessageDto.Response>> submitContact(
        @Valid @RequestBody ContactMessageDto.CreateRequest request
    ) {
        ContactMessageDto.Response saved = contactMessageService.submit(request);
        return ResponseEntity.ok(PageContentDto.ApiResponse.ok("消息已发送", saved));
    }

    /** 获取当前激活的主题 */
    @GetMapping("/theme")
    public ResponseEntity<PageContentDto.ApiResponse<SiteThemeDto.Response>> getActiveTheme() {
        return ResponseEntity.ok(PageContentDto.ApiResponse.ok(siteThemeService.getActive()));
    }
}

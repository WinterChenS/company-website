package com.enterprise.website.controller;

import com.enterprise.website.dto.*;
import com.enterprise.website.service.PageContentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 管理后台 - 内容配置 API（需 JWT 鉴权）
 */
@RestController
@RequestMapping("/api/admin/content")
@RequiredArgsConstructor
@Slf4j
public class AdminContentController {

    private final PageContentService service;

    /** 分页获取所有内容 */
    @GetMapping
    public ResponseEntity<PageContentDto.PageResponse<PageContentDto.Response>> getAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(required = false) String pageKey
    ) {
        return ResponseEntity.ok(PageContentDto.PageResponse.of(service.getAllPaged(page, size, pageKey)));
    }

    /** 按ID获取 */
    @GetMapping("/{id}")
    public ResponseEntity<PageContentDto.ApiResponse<PageContentDto.Response>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(PageContentDto.ApiResponse.ok(service.getById(id)));
    }

    /** 创建 */
    @PostMapping
    public ResponseEntity<PageContentDto.ApiResponse<PageContentDto.Response>> create(
        @Valid @RequestBody PageContentDto.CreateRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(PageContentDto.ApiResponse.ok("创建成功", service.create(request)));
    }

    /** 更新 */
    @PutMapping("/{id}")
    public ResponseEntity<PageContentDto.ApiResponse<PageContentDto.Response>> update(
        @PathVariable Long id,
        @Valid @RequestBody PageContentDto.UpdateRequest request
    ) {
        return ResponseEntity.ok(PageContentDto.ApiResponse.ok("更新成功", service.update(id, request)));
    }

    /** 删除 */
    @DeleteMapping("/{id}")
    public ResponseEntity<PageContentDto.ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(PageContentDto.ApiResponse.ok("删除成功", null));
    }

    /** 获取所有页面Key */
    @GetMapping("/page-keys")
    public ResponseEntity<PageContentDto.ApiResponse<String[]>> getPageKeys() {
        return ResponseEntity.ok(PageContentDto.ApiResponse.ok(service.getDistinctPageKeys().toArray(new String[0])));
    }
}

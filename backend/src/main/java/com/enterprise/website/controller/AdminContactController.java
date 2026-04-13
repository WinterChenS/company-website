package com.enterprise.website.controller;

import com.enterprise.website.dto.PageContentDto;
import com.enterprise.website.dto.ContactMessageDto;
import com.enterprise.website.service.ContactMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 管理后台 - 联系消息 API（需 JWT 鉴权）
 */
@RestController
@RequestMapping("/api/admin/messages")
@RequiredArgsConstructor
public class AdminContactController {

    private final ContactMessageService service;

    /** 分页获取消息列表 */
    @GetMapping
    public ResponseEntity<PageContentDto.PageResponse<ContactMessageDto.Response>> getMessages(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(PageContentDto.PageResponse.of(service.getMessages(page, size)));
    }

    /** 获取未读数量 */
    @GetMapping("/unread-count")
    public ResponseEntity<PageContentDto.ApiResponse<Long>> getUnreadCount() {
        return ResponseEntity.ok(PageContentDto.ApiResponse.ok(service.getUnreadCount()));
    }

    /** 标记为已读 */
    @PutMapping("/{id}/read")
    public ResponseEntity<PageContentDto.ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        service.markAsRead(id);
        return ResponseEntity.ok(PageContentDto.ApiResponse.ok("已标记为已读", null));
    }

    /** 删除消息 */
    @DeleteMapping("/{id}")
    public ResponseEntity<PageContentDto.ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(PageContentDto.ApiResponse.ok("删除成功", null));
    }
}

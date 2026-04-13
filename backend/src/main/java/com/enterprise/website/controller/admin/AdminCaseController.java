package com.enterprise.website.controller.admin;

import com.enterprise.website.dto.PortfolioCaseAdminDto;
import com.enterprise.website.service.PortfolioCaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/cases")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminCaseController {

    private final PortfolioCaseService portfolioCaseService;

    /**
     * 获取案例分页列表
     */
    @GetMapping
    public ResponseEntity<Page<PortfolioCaseAdminDto>> getCases(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<PortfolioCaseAdminDto> cases = portfolioCaseService.getAllCasesPage(page, size);
        return ResponseEntity.ok(cases);
    }

    /**
     * 搜索案例
     */
    @GetMapping("/search")
    public ResponseEntity<Page<PortfolioCaseAdminDto>> searchCases(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<PortfolioCaseAdminDto> cases = portfolioCaseService.searchCases(keyword, page, size);
        return ResponseEntity.ok(cases);
    }

    /**
     * 获取单个案例详情（管理员用）
     */
    @GetMapping("/{id}")
    public ResponseEntity<PortfolioCaseAdminDto> getCase(@PathVariable Long id) {
        PortfolioCaseAdminDto caseDto = portfolioCaseService.getCaseForAdmin(id);
        return ResponseEntity.ok(caseDto);
    }

    /**
     * 创建或更新案例
     */
    @PostMapping
    public ResponseEntity<PortfolioCaseAdminDto> saveCase(@RequestBody PortfolioCaseAdminDto dto) {
        PortfolioCaseAdminDto saved = portfolioCaseService.saveCase(dto);
        return ResponseEntity.ok(saved);
    }

    /**
     * 删除案例
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCase(@PathVariable Long id) {
        portfolioCaseService.deleteCase(id);
        return ResponseEntity.ok().build();
    }

    /**
     * 发布/取消发布案例
     */
    @PostMapping("/{id}/publish")
    public ResponseEntity<PortfolioCaseAdminDto> togglePublishStatus(
            @PathVariable Long id,
            @RequestParam boolean publish) {
        PortfolioCaseAdminDto updated = portfolioCaseService.togglePublishStatus(id, publish);
        return ResponseEntity.ok(updated);
    }
}
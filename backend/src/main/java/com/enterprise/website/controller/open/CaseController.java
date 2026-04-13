package com.enterprise.website.controller.open;

import com.enterprise.website.dto.PortfolioCaseDto;
import com.enterprise.website.service.PortfolioCaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // 允许前端本地开发端口
public class CaseController {

    private final PortfolioCaseService portfolioCaseService;

    /**
     * 获取所有已发布的案例列表
     */
    @GetMapping("/cases")
    public ResponseEntity<List<PortfolioCaseDto>> getAllCases(
            @RequestParam(defaultValue = "zh") String locale) {
        List<PortfolioCaseDto> cases = portfolioCaseService.getPublishedCases(locale);
        return ResponseEntity.ok(cases);
    }

    /**
     * 分页获取已发布的案例列表
     */
    @GetMapping("/cases/page")
    public ResponseEntity<Page<PortfolioCaseDto>> getCasesPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(defaultValue = "zh") String locale) {
        Page<PortfolioCaseDto> casePage = portfolioCaseService.getPublishedCasesPage(page, size, locale);
        return ResponseEntity.ok(casePage);
    }

    /**
     * 获取单个案例详情
     */
    @GetMapping("/cases/{id}")
    public ResponseEntity<PortfolioCaseDto> getCaseById(
            @PathVariable Long id,
            @RequestParam(defaultValue = "zh") String locale) {
        PortfolioCaseDto caseDto = portfolioCaseService.getCaseById(id, locale);
        return ResponseEntity.ok(caseDto);
    }

    /**
     * 按行业筛选案例
     */
    @GetMapping("/cases/industry/{industry}")
    public ResponseEntity<List<PortfolioCaseDto>> getCasesByIndustry(
            @PathVariable String industry,
            @RequestParam(defaultValue = "zh") String locale) {
        List<PortfolioCaseDto> cases = portfolioCaseService.getCasesByIndustry(industry, locale);
        return ResponseEntity.ok(cases);
    }
}

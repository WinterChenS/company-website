package com.enterprise.website.controller.open;

import com.enterprise.website.dto.PageContentDto;
import com.enterprise.website.service.PageContentService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 公开的站点元数据接口（无需登录）
 */
@RestController
@RequestMapping("/api/public/metadata")
@RequiredArgsConstructor
public class SiteMetadataController {

    private final PageContentService pageContentService;

    /** 双语元数据 DTO */
    @Data
    public static class BilingualMetadata {
        private final String zh;
        private final String en;
    }

    /**
     * 返回双语元数据：{ "COMPANY_NAME": { "zh": "...", "en": "..." }, ... }
     * 前端根据当前 locale 自行选择
     */
    @GetMapping
    public ResponseEntity<Map<String, BilingualMetadata>> getSiteMetadata() {
        List<PageContentDto.Response> metadataList = pageContentService.getByPageKey("METADATA");

        Map<String, BilingualMetadata> metadata = metadataList.stream()
                .collect(Collectors.toMap(
                        PageContentDto.Response::getContentKey,
                        item -> new BilingualMetadata(item.getContentZh(), item.getContentEn()),
                        (oldValue, newValue) -> oldValue
                ));

        return ResponseEntity.ok(metadata);
    }

    /**
     * 单独获取公司名称（很多场景只需要这个）
     */
    @GetMapping("/company-name")
    public ResponseEntity<String> getCompanyName() {
        return pageContentService.findByPageKeyAndContentKey("METADATA", "COMPANY_NAME")
                .map(pc -> ResponseEntity.ok(pc.getContentZh()))
                .orElseGet(() -> ResponseEntity.ok("EnterpriseXX 科技有限公司"));
    }

    /**
     * 单独获取 Logo（符号/图片 URL/SVG）
     */
    @GetMapping("/logo")
    public ResponseEntity<String> getLogo() {
        return pageContentService.findByPageKeyAndContentKey("METADATA", "LOGO_SYMBOL")
                .map(pc -> ResponseEntity.ok(pc.getContentZh()))
                .orElseGet(() -> ResponseEntity.ok("⬡"));
    }
}

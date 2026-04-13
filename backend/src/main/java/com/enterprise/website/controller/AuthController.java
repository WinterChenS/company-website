package com.enterprise.website.controller;

import com.enterprise.website.dto.AuthDto;
import com.enterprise.website.dto.PageContentDto;
import com.enterprise.website.service.AuthService;
import com.enterprise.website.service.CaptchaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * 认证相关 API（公开接口）
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CaptchaService captchaService;

    /**
     * 获取图形验证码
     * GET /api/auth/captcha
     */
    @GetMapping("/captcha")
    public ResponseEntity<PageContentDto.ApiResponse<CaptchaResult>> getCaptcha() {
        CaptchaService.CaptchaResult result = captchaService.generate();
        return ResponseEntity.ok(PageContentDto.ApiResponse.ok(CaptchaResult.from(result)));
    }

    /**
     * 管理员登录
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<PageContentDto.ApiResponse<AuthDto.LoginResponse>> login(
        @Valid @RequestBody AuthDto.LoginRequest request
    ) {
        AuthDto.LoginResponse response = authService.login(request);
        return ResponseEntity.ok(PageContentDto.ApiResponse.ok("登录成功", response));
    }

    /**
     * 修改密码（需鉴权）
     * PUT /api/auth/password
     */
    @PutMapping("/password")
    public ResponseEntity<PageContentDto.ApiResponse<Void>> changePassword(
        Authentication authentication,
        @Valid @RequestBody AuthDto.ChangePasswordRequest request
    ) {
        authService.changePassword(authentication.getName(), request);
        return ResponseEntity.ok(PageContentDto.ApiResponse.ok("密码修改成功", null));
    }

    /**
     * Token 心跳检查（前端定时调用，验证 token 是否有效）
     * GET /api/auth/check
     */
    @GetMapping("/check")
    public ResponseEntity<PageContentDto.ApiResponse<Void>> checkToken(Authentication authentication) {
        // 如果进入此方法，说明 token 有效（Spring Security 已鉴权）
        return ResponseEntity.ok(PageContentDto.ApiResponse.ok("Token有效", null));
    }

    /** 验证码结果（前端使用） */
    public record CaptchaResult(String captchaKey, String imageBase64) {
        static CaptchaResult from(CaptchaService.CaptchaResult r) {
            return new CaptchaResult(r.captchaKey(), r.imageBase64());
        }
    }
}

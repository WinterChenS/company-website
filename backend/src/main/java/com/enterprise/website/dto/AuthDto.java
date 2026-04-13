package com.enterprise.website.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * 认证相关 DTO
 */
public class AuthDto {

    /** 登录请求 */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank(message = "用户名不能为空")
        private String username;

        @NotBlank(message = "密码不能为空")
        private String password;

        @NotBlank(message = "验证码不能为空")
        private String captchaCode;

        @NotBlank(message = "验证码Key不能为空")
        private String captchaKey;
    }

    /** 登录响应 */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LoginResponse {
        private String token;
        private String username;
        private String displayName;
    }

    /** 修改密码请求 */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChangePasswordRequest {
        @NotBlank(message = "原密码不能为空")
        private String oldPassword;

        @NotBlank(message = "新密码不能为空")
        @Size(min = 6, max = 50, message = "新密码长度为6-50位")
        private String newPassword;
    }
}

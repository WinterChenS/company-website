package com.enterprise.website.service;

import com.enterprise.website.entity.AdminUser;
import com.enterprise.website.repository.AdminUserRepository;
import com.enterprise.website.security.JwtService;
import com.enterprise.website.dto.AuthDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * 认证服务
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CaptchaService captchaService;

    /**
     * 管理员登录
     */
    public AuthDto.LoginResponse login(AuthDto.LoginRequest request) {
        // 1. 验证验证码
        if (!captchaService.validate(request.getCaptchaKey(), request.getCaptchaCode())) {
            throw new IllegalArgumentException("验证码错误或已过期");
        }

        // 2. 查找用户
        AdminUser user = adminUserRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new IllegalArgumentException("用户名或密码错误"));

        if (!user.getEnabled()) {
            throw new IllegalArgumentException("账号已被禁用");
        }

        // 3. 验证密码
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("用户名或密码错误");
        }

        // 4. 生成 Token
        String token = jwtService.generateToken(user.getUsername());

        log.info("管理员登录成功: {}", user.getUsername());

        return AuthDto.LoginResponse.builder()
            .token(token)
            .username(user.getUsername())
            .displayName(user.getDisplayName())
            .build();
    }

    /**
     * 修改密码
     */
    public void changePassword(String username, AuthDto.ChangePasswordRequest request) {
        AdminUser user = adminUserRepository.findByUsername(username)
            .orElseThrow(() -> new EntityNotFoundException("用户不存在"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("原密码错误");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        adminUserRepository.save(user);
        log.info("管理员修改密码: {}", username);
    }
}

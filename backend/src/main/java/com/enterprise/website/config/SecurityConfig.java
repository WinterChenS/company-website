package com.enterprise.website.config;

import com.enterprise.website.security.JwtAuthenticationFilter;
import com.enterprise.website.security.JwtService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security 配置
 * <p>
 * - /api/public/** 全部放行
 * - /api/auth/** 放行（登录、验证码）
 * - /api/admin/** 需要 JWT 鉴权
 * - /h2-console 放行
 * </p>
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtService jwtService;

    public SecurityConfig(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .headers(headers -> headers.frameOptions(frame -> frame.disable()))  // H2 控制台需要
            .authorizeHttpRequests(auth -> auth
                // 公开接口
                .requestMatchers("/api/public/**").permitAll()
                // 登录 / 验证码
                .requestMatchers("/api/auth/**").permitAll()
                // H2 控制台
                .requestMatchers("/h2-console/**").permitAll()
                // 管理后台接口需要鉴权
                .requestMatchers("/api/admin/**").authenticated()
                // 其他全部放行（静态资源等）
                .anyRequest().permitAll()
            )
            .addFilterBefore(new JwtAuthenticationFilter(jwtService), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

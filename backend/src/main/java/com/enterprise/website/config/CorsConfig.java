package com.enterprise.website.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

/**
 * CORS 跨域配置
 * <p>
 * 生产环境请将 allowedOrigins 限制为具体域名，不要使用通配符
 * </p>
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // 允许的前端源（开发环境 Vite 默认端口）
        config.setAllowedOrigins(List.of(
            "http://localhost:5173",  // Vite 开发服务器
            "http://localhost:3000",  // 备用端口
            "http://127.0.0.1:5173"
        ));

        // 允许的 HTTP 方法
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // 允许的请求头
        config.setAllowedHeaders(List.of("*"));

        // 允许携带认证信息（Cookie）
        config.setAllowCredentials(true);

        // 预检请求缓存时间（秒）
        config.setMaxAge(3600L);

        // 暴露给前端可读取的响应头
        config.setExposedHeaders(List.of("Content-Disposition", "X-Request-Id"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);

        return new CorsFilter(source);
    }
}

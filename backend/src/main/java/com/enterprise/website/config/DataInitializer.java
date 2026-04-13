package com.enterprise.website.config;

import com.enterprise.website.entity.AdminUser;
import com.enterprise.website.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * 启动时初始化默认管理员（如果不存在）
 * <p>
 * 默认账号: admin / admin123
 * </p>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (adminUserRepository.findByUsername("admin").isEmpty()) {
            AdminUser admin = AdminUser.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .displayName("系统管理员")
                .enabled(true)
                .build();
            adminUserRepository.save(admin);
            log.info("已初始化默认管理员: admin / admin123");
        }
    }
}

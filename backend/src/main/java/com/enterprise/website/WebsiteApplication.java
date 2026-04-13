package com.enterprise.website;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 企业官网后端主启动类
 * 端口：8080
 * H2 控制台：http://localhost:8080/h2-console
 */
@SpringBootApplication
public class WebsiteApplication {
    public static void main(String[] args) {
        SpringApplication.run(WebsiteApplication.class, args);
    }
}

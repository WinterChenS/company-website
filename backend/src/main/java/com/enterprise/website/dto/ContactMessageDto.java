package com.enterprise.website.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 联系消息 DTO
 */
public class ContactMessageDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String name;
        private String email;
        private String subject;
        private String message;
        private Boolean isRead;
        private LocalDateTime createdAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotBlank(message = "姓名不能为空")
        @Size(max = 100, message = "姓名不超过100字")
        private String name;

        @NotBlank(message = "邮箱不能为空")
        @Email(message = "邮箱格式不正确")
        private String email;

        @Size(max = 200, message = "主题不超过200字")
        private String subject;

        @NotBlank(message = "消息内容不能为空")
        @Size(max = 2000, message = "消息不超过2000字")
        private String message;
    }
}

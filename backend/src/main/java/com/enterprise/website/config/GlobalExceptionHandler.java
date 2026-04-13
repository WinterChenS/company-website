package com.enterprise.website.config;

import com.enterprise.website.dto.PageContentDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

/**
 * 全局异常处理器
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<PageContentDto.ApiResponse<Void>> handleNotFound(EntityNotFoundException e) {
        log.warn("资源不存在: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(PageContentDto.ApiResponse.fail(e.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<PageContentDto.ApiResponse<Void>> handleIllegalArgument(IllegalArgumentException e) {
        log.warn("业务校验失败: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(PageContentDto.ApiResponse.fail(e.getMessage()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<PageContentDto.ApiResponse<Void>> handleIllegalState(IllegalStateException e) {
        log.warn("状态错误: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(PageContentDto.ApiResponse.fail(e.getMessage()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<PageContentDto.ApiResponse<Void>> handleAccessDenied(AccessDeniedException e) {
        log.warn("权限不足: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(PageContentDto.ApiResponse.fail("权限不足，请重新登录"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<PageContentDto.ApiResponse<Void>> handleValidation(MethodArgumentNotValidException e) {
        String errors = e.getBindingResult().getFieldErrors()
            .stream()
            .map(FieldError::getDefaultMessage)
            .collect(Collectors.joining("; "));
        log.warn("参数校验失败: {}", errors);
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
            .body(PageContentDto.ApiResponse.fail("参数校验失败: " + errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<PageContentDto.ApiResponse<Void>> handleGeneral(Exception e) {
        log.error("系统内部错误: {} - {}", e.getClass().getName(), e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(PageContentDto.ApiResponse.fail("服务器内部错误: " + e.getClass().getSimpleName() + ": " + e.getMessage()));
    }
}

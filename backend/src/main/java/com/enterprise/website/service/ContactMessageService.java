package com.enterprise.website.service;

import com.enterprise.website.dto.ContactMessageDto;
import com.enterprise.website.entity.ContactMessage;
import com.enterprise.website.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 联系消息服务
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ContactMessageService {

    private final ContactMessageRepository repository;

    /**
     * 提交联系消息（官网前端调用）
     */
    @Transactional
    public ContactMessageDto.Response submit(ContactMessageDto.CreateRequest request) {
        ContactMessage entity = ContactMessage.builder()
            .name(request.getName())
            .email(request.getEmail())
            .subject(request.getSubject())
            .message(request.getMessage())
            .build();

        ContactMessage saved = repository.save(entity);
        log.info("收到联系消息: id={}, name={}, email={}", saved.getId(), saved.getName(), saved.getEmail());
        return toResponse(saved);
    }

    /**
     * 分页查询消息（管理后台）
     */
    @Transactional(readOnly = true)
    public Page<ContactMessageDto.Response> getMessages(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("createdAt")));
        return repository.findAll(pageable).map(this::toResponse);
    }

    /**
     * 标记为已读
     */
    @Transactional
    public void markAsRead(Long id) {
        repository.findById(id).ifPresent(msg -> {
            msg.setIsRead(true);
            repository.save(msg);
        });
    }

    /**
     * 删除消息
     */
    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new jakarta.persistence.EntityNotFoundException("消息不存在: id=" + id);
        }
        repository.deleteById(id);
    }

    /**
     * 获取未读消息数
     */
    @Transactional(readOnly = true)
    public long getUnreadCount() {
        return repository.countByIsReadFalse();
    }

    private ContactMessageDto.Response toResponse(ContactMessage entity) {
        return ContactMessageDto.Response.builder()
            .id(entity.getId())
            .name(entity.getName())
            .email(entity.getEmail())
            .subject(entity.getSubject())
            .message(entity.getMessage())
            .isRead(entity.getIsRead())
            .createdAt(entity.getCreatedAt())
            .build();
    }
}

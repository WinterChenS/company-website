package com.enterprise.website.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "site_theme")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteTheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "theme_key", nullable = false, unique = true, length = 50)
    private String themeKey;

    @Column(name = "theme_name", nullable = false, length = 100)
    private String themeName;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = false;

    @Column(name = "description", nullable = false, length = 500)
    @Builder.Default
    private String description = "";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}

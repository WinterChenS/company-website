package com.enterprise.website.repository;

import com.enterprise.website.entity.SiteTheme;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SiteThemeRepository extends JpaRepository<SiteTheme, Long> {
    Optional<SiteTheme> findByIsActiveTrue();
    Optional<SiteTheme> findByThemeKey(String themeKey);
}

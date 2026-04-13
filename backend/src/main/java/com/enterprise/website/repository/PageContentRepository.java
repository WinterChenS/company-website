package com.enterprise.website.repository;

import com.enterprise.website.entity.PageContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * PageContent 数据访问层
 */
@Repository
public interface PageContentRepository extends JpaRepository<PageContent, Long> {

    /**
     * 按页面标识查询所有内容，按 sortOrder 升序排列
     *
     * @param pageKey 页面标识，如 "HOME"
     * @return 对应页面的内容列表
     */
    List<PageContent> findByPageKeyOrderBySortOrderAsc(String pageKey);

    /**
     * 按页面标识和内容Key精确查询（唯一记录）
     */
    Optional<PageContent> findByPageKeyAndContentKey(String pageKey, String contentKey);

    /**
     * 查询所有不重复的页面Key（用于后台下拉选择）
     */
    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.pageKey FROM PageContent p ORDER BY p.pageKey")
    List<String> findDistinctPageKeys();
}

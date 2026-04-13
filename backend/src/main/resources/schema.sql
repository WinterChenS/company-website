-- =====================================================
-- schema.sql: 建表脚本（H2 兼容语法）
-- =====================================================

-- 页面内容配置表
CREATE TABLE IF NOT EXISTS page_content (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    page_key    VARCHAR(50)  NOT NULL,
    content_key VARCHAR(100) NOT NULL,
    content_zh  TEXT         NOT NULL,
    content_en  TEXT         NOT NULL,
    sort_order  INT          NOT NULL DEFAULT 0,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_page_content UNIQUE (page_key, content_key)
);

-- 管理员表
CREATE TABLE IF NOT EXISTS admin_user (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    password    VARCHAR(200) NOT NULL,
    display_name VARCHAR(50) NOT NULL DEFAULT '',
    enabled     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- 联系消息表
CREATE TABLE IF NOT EXISTS contact_message (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL,
    subject     VARCHAR(200) NOT NULL DEFAULT '',
    message     TEXT         NOT NULL,
    is_read     BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- 主题配置表
CREATE TABLE IF NOT EXISTS site_theme (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    theme_key   VARCHAR(50)  NOT NULL UNIQUE,
    theme_name  VARCHAR(100) NOT NULL,
    is_active   BOOLEAN      NOT NULL DEFAULT FALSE,
    description VARCHAR(500) NOT NULL DEFAULT '',
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- 公司案例表
CREATE TABLE IF NOT EXISTS portfolio_case (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    title_zh    VARCHAR(200) NOT NULL,
    title_en    VARCHAR(200) NOT NULL,
    client_zh   VARCHAR(200) NOT NULL DEFAULT '',
    client_en   VARCHAR(200) NOT NULL DEFAULT '',
    industry_zh VARCHAR(100) NOT NULL DEFAULT '',
    industry_en VARCHAR(100) NOT NULL DEFAULT '',
    overview_zh TEXT         NOT NULL DEFAULT '',
    overview_en TEXT         NOT NULL DEFAULT '',
    challenge_zh TEXT        NOT NULL DEFAULT '',
    challenge_en TEXT        NOT NULL DEFAULT '',
    solution_zh TEXT         NOT NULL DEFAULT '',
    solution_en TEXT         NOT NULL DEFAULT '',
    result_zh   TEXT         NOT NULL DEFAULT '',
    result_en   TEXT         NOT NULL DEFAULT '',
    image_url   VARCHAR(500) NOT NULL DEFAULT '',
    sort_order  INT          NOT NULL DEFAULT 0,
    is_published BOOLEAN     NOT NULL DEFAULT TRUE,
    published_at TIMESTAMP   DEFAULT NULL,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

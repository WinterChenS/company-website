# 🚀 Enterprise Website — 企业官网 + 后台管理系统

> 前后端分离的现代化企业官网 + 内容管理系统  
> **后端：** Java 21 + Spring Boot 3 + H2 内存数据库  
> **前端：** React 18 + Vite + TypeScript + Ant Design Pro + Framer Motion

---

## 📐 架构概览

```
enterprise-website/
├── backend/           # Spring Boot 后端（端口 8080）
│   └── src/main/java/com/enterprise/website/
│       ├── entity/          PageContent.java    ← JPA 实体
│       ├── repository/      PageContentRepository.java
│       ├── service/         PageContentService.java
│       ├── controller/      PublicContentController.java  ← 官网接口
│       │                    AdminContentController.java   ← 管理接口
│       ├── dto/             PageContentDto.java
│       └── config/          CorsConfig.java / GlobalExceptionHandler.java
│
└── frontend/          # Vite + React 前端（端口 5173）
    └── src/
        ├── api/             content.ts          ← Axios API 客户端
        ├── components/
        │   ├── website/     官网组件（Navbar/Hero/Stats/About/Services/Contact）
        │   └── admin/       管理后台组件（预留扩展）
        ├── hooks/           usePageContent.ts   ← 数据获取 Hook
        ├── locales/         zh.ts / en.ts       ← i18n 语言包
        ├── pages/
        │   ├── website/     官网页面
        │   └── admin/       管理后台页面
        ├── router/          路由配置
        ├── store/           i18n Context
        ├── styles/          global.css
        └── types/           TypeScript 类型定义
```

---

## 🖥️ 快速启动

### 先决条件

| 工具 | 版本要求 |
|------|---------|
| JDK  | 21+     |
| Maven | 3.8+   |
| Node.js | 18+  |
| pnpm / npm | 最新版 |

---

### 1️⃣ 启动后端

```bash
cd backend

# 方式一：Maven 直接运行
./mvnw spring-boot:run

# 方式二：先打包再运行
./mvnw clean package -DskipTests
java -jar target/website-backend-1.0.0.jar
```

后端启动成功后：
- **API 服务：** http://localhost:8080
- **H2 控制台：** http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:websitedb`
  - 用户名: `sa`  密码: *(空)*

**验证接口：**
```bash
# 官网公开接口
curl "http://localhost:8080/api/public/content?pageKey=HOME"

# 管理接口
curl "http://localhost:8080/api/admin/content"
```

---

### 2️⃣ 启动前端

```bash
cd frontend

# 安装依赖
npm install
# 或
pnpm install

# 启动开发服务器
npm run dev
# 或
pnpm dev
```

前端启动成功后：
- **官网首页：** http://localhost:5173
- **管理后台：** http://localhost:5173/admin

---

## 🎯 功能说明

### 官网功能
| 功能 | 说明 |
|------|------|
| 科技感深色设计 | 深色渐变背景 + 紫色科技主题 |
| 动态内容渲染 | 所有文案来自后端 API，支持实时更新 |
| Framer Motion 动效 | Hero 入场动画 / 服务卡片 3D 倾斜 / 滚动视差 |
| 双语国际化 | 中英文一键切换，记住用户选择 |
| 导航栏透明/实心切换 | 滚动时背景毛玻璃效果 |
| 响应式设计 | 适配桌面 / 平板 / 移动端 |

### 管理后台功能
| 功能 | 说明 |
|------|------|
| 内容列表 | 展示所有页面配置项，可按页面Key筛选 |
| 编辑内容 | 修改中英文文案及排序值 |
| 新增内容 | 添加新的页面内容配置项 |
| 删除内容 | 带二次确认的安全删除 |

---

## 🌐 API 文档

### 公开接口（官网使用）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/public/content?pageKey=HOME` | 获取指定页面内容 |
| GET | `/api/public/content/page-keys` | 获取所有页面Key |

### 管理接口（后台使用）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/content` | 获取全部内容 |
| GET | `/api/admin/content/{id}` | 获取单条内容 |
| POST | `/api/admin/content` | 创建内容 |
| PUT | `/api/admin/content/{id}` | 更新内容 |
| DELETE | `/api/admin/content/{id}` | 删除内容 |
| GET | `/api/admin/content/page-keys` | 获取页面Key列表 |

### 响应格式

```json
{
  "success": true,
  "message": "success",
  "data": [...]
}
```

---

## 🗄️ 数据模型

### PageContent 字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | Long | 自增主键 |
| `pageKey` | String | 页面标识，如 `HOME`、`ABOUT` |
| `contentKey` | String | 内容块标识，如 `HERO_TITLE` |
| `contentZh` | String | 中文文案 |
| `contentEn` | String | 英文文案 |
| `sortOrder` | Integer | 排序值（升序） |
| `createdAt` | DateTime | 创建时间 |
| `updatedAt` | DateTime | 更新时间 |

---

## 🔧 技术栈

### 后端
- Java 21 + Spring Boot 3.2
- Spring Data JPA + H2 Database
- Lombok + MapStruct
- 全局异常处理 + 统一响应格式
- CORS 跨域配置

### 前端
- React 18 + TypeScript + Vite 5
- React Router 6（官网/管理双路由）
- React-Intl（国际化）
- Framer Motion（动画）
- Ant Design 5 + Ant Design Pro Components（管理后台）
- Axios（HTTP 客户端）
- CSS Modules（样式隔离）

---

## 📦 生产部署建议

1. **后端：** 将 H2 替换为 MySQL / PostgreSQL，修改 `application.yml` 中的数据源配置
2. **前端：** 执行 `npm run build` 构建静态资源，部署到 Nginx / CDN
3. **CORS：** 修改 `CorsConfig.java` 中的 `allowedOrigins` 为实际域名
4. **安全：** 为 `/api/admin/**` 接口添加 Spring Security JWT 鉴权

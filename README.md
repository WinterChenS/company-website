# Claw 企业网站项目

一个完整的企业级网站项目，包含前后端分离架构，支持多语言、多主题、内容管理和响应式设计。

## 🚀 项目特性

### 前端 (React 18 + TypeScript)
- **现代化技术栈**: React 18, TypeScript, Vite, Ant Design 5
- **多语言支持**: 中文/英文国际化，使用 react-intl
- **多主题系统**: Blue/Gold/Orange/Green四种主题，CSS变量切换
- **响应式设计**: 适配桌面、平板、手机等所有设备
- **SEO优化**: 动态meta标签，支持搜索引擎优化
- **组件化架构**: 模块化、可复用的组件设计

### 后端 (Spring Boot 3.x)
- **RESTful API**: 完整的REST API设计
- **数据库**: H2嵌入式数据库，支持持久化存储
- **安全认证**: JWT令牌认证，Spring Security集成
- **内容管理**: 动态页面内容、主题、案例、消息管理
- **国际化**: 支持双语内容存储和检索

### 管理后台
- **内容管理**: 动态编辑网站内容（首页、关于、服务等）
- **案例管理**: 客户成功案例的增删改查
- **主题管理**: 网站主题切换和配置
- **消息管理**: 联系表单消息查看和处理
- **站点设置**: 公司名称、Logo、联系信息配置

## 📁 项目结构

```
company-website/
├── frontend/                 # 前端项目
│   ├── src/
│   │   ├── api/             # API接口定义
│   │   ├── components/      # 组件库
│   │   ├── pages/          # 页面组件
│   │   ├── store/          # 状态管理
│   │   ├── locales/        # 国际化文件
│   │   └── styles/         # 样式文件
│   └── package.json
│
├── backend/                 # 后端项目
│   ├── src/main/java/
│   │   ├── controller/     # 控制器层
│   │   ├── service/        # 服务层
│   │   ├── repository/     # 数据访问层
│   │   ├── entity/         # 实体类
│   │   └── config/         # 配置类
│   └── pom.xml
│
└── README.md
```

## 🛠️ 快速开始

### 环境要求
- **Node.js**: 18+ (推荐20.18.0)
- **Java**: 17+ (21.0.5)
- **Maven**: 3.9+
- **Git**: 2.30+

### 后端启动
```bash
cd backend
mvn spring-boot:run
```
后端服务将在 http://localhost:8080 启动

### 前端启动
```bash
cd frontend
npm install
npm run dev
```
前端服务将在 http://localhost:5173 启动

### 管理后台访问
- **URL**: http://localhost:5173/admin/login
- **默认账号**: admin
- **默认密码**: admin123

## 🔧 功能模块

### 1. 首页展示
- 响应式英雄区域
- 服务特色介绍
- 成功案例展示
- 数据统计展示
- 联系我们表单

### 2. 案例页面
- 客户案例筛选（按行业）
- 详细案例展示
- 关键成果指标展示
- 多语言案例描述

### 3. 管理后台
- **仪表盘**: 系统概览
- **内容管理**: 编辑各页面内容
- **案例管理**: 管理客户案例
- **主题管理**: 切换网站主题
- **消息管理**: 查看联系消息
- **站点设置**: 配置网站基本信息

### 4. 国际化支持
- 中英文自动切换
- 动态翻译内容
- 语言偏好记忆
- SEO多语言支持

### 5. 主题系统
- 四种预设主题：蓝/金/橙/绿
- CSS变量动态切换
- 主题持久化存储
- 管理后台实时预览

## 🔐 安全特性
- JWT令牌认证
- 跨域请求保护
- 输入验证和过滤
- SQL注入防护
- 敏感数据加密

## 📈 性能优化
- 代码分割和懒加载
- 图片懒加载
- API响应缓存
- 数据库查询优化
- CDN就绪的静态资源

## 🔄 开发工作流

### 代码规范
- ESLint + Prettier 代码格式化
- TypeScript 严格模式
- 组件化开发规范
- 统一的命名约定

### Git工作流
- 功能分支开发
- Pull Request审核
- 语义化版本控制
- 自动化测试集成

## 🚢 部署

### 开发环境
```bash
# 后端
mvn spring-boot:run

# 前端
npm run dev
```

### 生产环境
```bash
# 后端打包
mvn clean package
java -jar target/*.jar

# 前端构建
npm run build
# 将dist目录部署到Nginx/Apache
```

### Docker部署
```bash
# 构建镜像
docker build -t company-website-backend:latest ./backend
docker build -t company-website-frontend:latest ./frontend

# 运行容器
docker run -p 8080:8080 company-website-backend:latest
docker run -p 80:80 company-website-frontend:latest
```

## 📚 文档

### API文档
启动后端后访问: http://localhost:8080/swagger-ui.html

### 数据库结构
详见 `backend/src/main/resources/schema.sql`

### 国际化配置
详见 `frontend/src/locales/`

### 主题配置
详见 `frontend/src/styles/global.css`

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 支持

- **问题报告**: [GitHub Issues](https://github.com/WinterChenS/company-website/issues)
- **功能建议**: [GitHub Discussions](https://github.com/WinterChenS/company-website/discussions)

---

**项目状态**: 生产就绪  
**最后更新**: 2026年4月13日
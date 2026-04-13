// 类型定义
export interface PageContent {
  id: number;
  pageKey: string;
  contentKey: string;
  contentZh: string;
  contentEn: string;
  sortOrder: number;
  updatedAt?: string;
}

export interface CreatePageContentRequest {
  pageKey: string;
  contentKey: string;
  contentZh: string;
  contentEn: string;
  sortOrder: number;
}

export interface UpdatePageContentRequest {
  contentZh: string;
  contentEn: string;
  sortOrder: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PageData<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
}

export interface PageResponse<T> {
  success: boolean;
  message: string;
  data: PageData<T>;
}

export type Locale = 'zh' | 'en';
export type ContentMap = Record<string, string>;

// 联系消息
export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
}

export interface CreateContactRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

// 主题
export interface SiteTheme {
  id: number;
  themeKey: string;
  themeName: string;
  isActive: boolean;
  description: string;
}

// 登录
export interface LoginRequest {
  username: string;
  password: string;
  captchaCode: string;
  captchaKey: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  displayName: string;
}

export interface CaptchaResult {
  captchaKey: string;
  imageBase64: string;
}

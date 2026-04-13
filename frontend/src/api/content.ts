import axios from 'axios';
import type { ApiResponse, PageResponse, PageContent, CreatePageContentRequest, UpdatePageContentRequest, ContactMessage, CreateContactRequest, LoginRequest, LoginResponse, CaptchaResult, SiteTheme } from '@/types';

// Axios 实例
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// 请求拦截器：自动附加 JWT Token
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('enterprise_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：401 自动跳转登录
http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('enterprise_token');
      localStorage.removeItem('enterprise_user');
      // 避免在登录页无限循环
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    const message = error.response?.data?.message || error.message || '网络错误';
    return Promise.reject(new Error(message));
  }
);

// ─────────────── 认证接口 ───────────────

export async function getCaptcha(): Promise<CaptchaResult> {
  const res = await http.get<ApiResponse<CaptchaResult>>('/api/auth/captcha');
  return res.data.data;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await http.post<ApiResponse<LoginResponse>>('/api/auth/login', data);
  return res.data.data;
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  await http.put('/api/auth/password', { oldPassword, newPassword });
}

// ─────────────── 官网公开接口 ───────────────

export async function fetchPageContent(pageKey: string): Promise<PageContent[]> {
  const res = await http.get<ApiResponse<PageContent[]>>('/api/public/content', {
    params: { pageKey },
  });
  return res.data.data;
}

export async function fetchPageKeys(): Promise<string[]> {
  const res = await http.get<ApiResponse<string[]>>('/api/public/content/page-keys');
  return res.data.data;
}

export async function submitContact(data: CreateContactRequest): Promise<ContactMessage> {
  const res = await http.post<ApiResponse<ContactMessage>>('/api/public/contact', data);
  return res.data.data;
}

export async function fetchActiveTheme(): Promise<SiteTheme> {
  const res = await http.get<ApiResponse<SiteTheme>>('/api/public/theme');
  return res.data.data;
}

export interface BilingualMetadata {
  zh: string;
  en: string;
}

export async function fetchSiteMetadata(): Promise<Record<string, BilingualMetadata>> {
  const res = await http.get<Record<string, any>>('/api/public/metadata');
  const rawData = res.data;
  
  // 兼容两种格式：双语对象格式 {zh: "...", en: "..."} 或直接字符串
  const result: Record<string, BilingualMetadata> = {};
  
  for (const [key, value] of Object.entries(rawData)) {
    if (typeof value === 'object' && value !== null && ('zh' in value || 'en' in value)) {
      // 已经是双语对象格式
      result[key] = {
        zh: value.zh || '',
        en: value.en || value.zh || '',
      };
    } else if (typeof value === 'string') {
      // 直接字符串格式，作为中文值，英文值相同
      result[key] = {
        zh: value,
        en: value,
      };
    } else {
      // 其他格式，使用空值
      result[key] = { zh: '', en: '' };
    }
  }
  
  return result;
}

// ─────────────── 管理后台 - 内容配置 ───────────────

export async function adminGetContentPaged(page = 0, size = 20, pageKey?: string): Promise<PageResponse<PageContent>['data']> {
  const res = await http.get<PageResponse<PageContent>>('/api/admin/content', {
    params: { page, size, pageKey: pageKey || undefined },
  });
  return res.data.data;
}

export async function adminGetContent(id: number): Promise<PageContent> {
  const res = await http.get<ApiResponse<PageContent>>(`/api/admin/content/${id}`);
  return res.data.data;
}

export async function adminCreateContent(data: CreatePageContentRequest): Promise<PageContent> {
  const res = await http.post<ApiResponse<PageContent>>('/api/admin/content', data);
  return res.data.data;
}

export async function adminUpdateContent(id: number, data: UpdatePageContentRequest): Promise<PageContent> {
  const res = await http.put<ApiResponse<PageContent>>(`/api/admin/content/${id}`, data);
  return res.data.data;
}

export async function adminDeleteContent(id: number): Promise<void> {
  await http.delete(`/api/admin/content/${id}`);
}

export async function adminGetPageKeys(): Promise<string[]> {
  const res = await http.get<ApiResponse<string[]>>('/api/admin/content/page-keys');
  return res.data.data;
}

// ─────────────── 管理后台 - 联系消息 ───────────────

export async function adminGetMessages(page = 0, size = 20): Promise<PageResponse<ContactMessage>['data']> {
  const res = await http.get<PageResponse<ContactMessage>>('/api/admin/messages', {
    params: { page, size },
  });
  return res.data.data;
}

export async function adminGetUnreadCount(): Promise<number> {
  const res = await http.get<ApiResponse<number>>('/api/admin/messages/unread-count');
  return res.data.data;
}

export async function adminMarkAsRead(id: number): Promise<void> {
  await http.put(`/api/admin/messages/${id}/read`);
}

export async function adminDeleteMessage(id: number): Promise<void> {
  await http.delete(`/api/admin/messages/${id}`);
}

// ─────────────── 管理后台 - 主题管理 ───────────────

export async function adminGetThemes(): Promise<SiteTheme[]> {
  const res = await http.get<ApiResponse<SiteTheme[]>>('/api/admin/themes');
  return res.data.data;
}

export async function adminGetActiveTheme(): Promise<SiteTheme> {
  const res = await http.get<ApiResponse<SiteTheme>>('/api/admin/themes/active');
  return res.data.data;
}

export async function adminActivateTheme(themeKey: string): Promise<void> {
  await http.put('/api/admin/themes/activate', { themeKey });
}

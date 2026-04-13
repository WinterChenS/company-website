import axios from 'axios';

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

// 响应拦截器：401/403 自动跳转登录页
http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // 触发全局登出事件，让 AuthProvider 清理状态
      localStorage.removeItem('enterprise_token');
      localStorage.removeItem('enterprise_user');
      // 派发自定义事件
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      // 使用 React Router 导航（如果有 router context 的话用 window.location 兜底）
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// 封装请求方法
export function request<T = any>(config: any): Promise<T> {
  return http(config);
}

// 简化 GET 请求
export function get<T = any>(url: string, params?: any): Promise<T> {
  return request({ method: 'GET', url, params });
}

// 简化 POST 请求
export function post<T = any>(url: string, data?: any): Promise<T> {
  return request({ method: 'POST', url, data });
}

// 简化 PUT 请求
export function put<T = any>(url: string, data?: any): Promise<T> {
  return request({ method: 'PUT', url, data });
}

// 简化 DELETE 请求
export function del<T = any>(url: string, data?: any): Promise<T> {
  return request({ method: 'DELETE', url, data });
}
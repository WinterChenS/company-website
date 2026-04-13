/**
 * Auth Store：JWT Token 管理 + 登录状态
 */
import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';

const TOKEN_KEY = 'enterprise_token';
const USER_KEY = 'enterprise_user';

interface UserInfo {
  username: string;
  displayName: string;
}

interface AuthContextValue {
  token: string | null;
  user: UserInfo | null;
  isAuthenticated: boolean;
  login: (token: string, user: UserInfo) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  token: null,
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<UserInfo | null>(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = !!token;

  const login = useCallback((newToken: string, newUser: UserInfo) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // 监听全局未授权事件（来自 API 拦截器）
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
      // 如果当前在管理后台，跳转到登录页（通过 window.location 确保同步）
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login';
      }
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [logout]);

  // Token 心跳检查：每 2.5 分钟调用 /api/auth/check，如果 401 会自动触发未授权事件
  useEffect(() => {
    const checkToken = () => {
      if (!window.location.pathname.startsWith('/admin')) return;
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) return;
      const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) || '';
      fetch(`${baseUrl}/api/auth/check`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
        })
        .catch(() => {
          // fetch 失败（网络问题或 CORS）不影响，保持静默
        });
    };

    // 首次进入页面立即检查一次
    checkToken();

    const interval = setInterval(checkToken, 2.5 * 60 * 1000); // 2.5分钟一次
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

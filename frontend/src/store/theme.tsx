/**
 * Theme Store：多主题 CSS 变量切换
 * 以后端数据库为权威来源，官网启动时拉取当前激活主题
 */
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type ThemeKey = 'tech' | 'home' | 'design' | 'retail';

const THEME_STORAGE_KEY = 'enterprise_theme';

interface ThemeContextValue {
  activeTheme: ThemeKey;
  setActiveTheme: (key: ThemeKey) => void;
  themeConfig: ThemeConfig;
}

export interface ThemeConfig {
  key: ThemeKey;
  name: string;
  cssVars: Record<string, string>;
}

export const themes: Record<ThemeKey, ThemeConfig> = {
  tech: {
    key: 'tech',
    name: '科技公司',
    cssVars: {
      '--color-primary': '#6366f1',
      '--color-primary-hover': '#4f46e5',
      '--color-primary-light': 'rgba(99, 102, 241, 0.15)',
      '--bg-base': '#050510',
      '--bg-surface': '#0d0d1a',
      '--bg-elevated': '#12122a',
      '--bg-card': 'rgba(255, 255, 255, 0.04)',
      '--text-primary': '#f0f0ff',
      '--text-secondary': 'rgba(240, 240, 255, 0.65)',
      '--text-muted': 'rgba(240, 240, 255, 0.35)',
      '--border-subtle': 'rgba(255, 255, 255, 0.08)',
      '--border-default': 'rgba(255, 255, 255, 0.12)',
      '--gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
      '--gradient-title': 'linear-gradient(135deg, #f0f0ff 0%, #c7d2fe 40%, #6366f1 100%)',
      '--gradient-hero': 'radial-gradient(ellipse at 60% 30%, rgba(99,102,241,0.25) 0%, transparent 60%), radial-gradient(ellipse at 20% 70%, rgba(6,182,212,0.15) 0%, transparent 50%), linear-gradient(180deg, #050510 0%, #0d0d1a 100%)',
    },
  },
  home: {
    key: 'home',
    name: '家装公司',
    cssVars: {
      '--color-primary': '#b8860b',
      '--color-primary-hover': '#996f09',
      '--color-primary-light': 'rgba(184, 134, 11, 0.15)',
      '--bg-base': '#faf7f2',
      '--bg-surface': '#f5f0e8',
      '--bg-elevated': '#fffdf8',
      '--bg-card': 'rgba(184, 134, 11, 0.04)',
      '--text-primary': '#2c1810',
      '--text-secondary': 'rgba(44, 24, 16, 0.65)',
      '--text-muted': 'rgba(44, 24, 16, 0.35)',
      '--border-subtle': 'rgba(44, 24, 16, 0.08)',
      '--border-default': 'rgba(44, 24, 16, 0.15)',
      '--gradient-primary': 'linear-gradient(135deg, #b8860b 0%, #d4a843 50%, #8b6914 100%)',
      '--gradient-title': 'linear-gradient(135deg, #2c1810 0%, #8b6914 40%, #b8860b 100%)',
      '--gradient-hero': 'radial-gradient(ellipse at 60% 30%, rgba(184,134,11,0.12) 0%, transparent 60%), radial-gradient(ellipse at 20% 70%, rgba(139,105,20,0.08) 0%, transparent 50%), linear-gradient(180deg, #faf7f2 0%, #f5f0e8 100%)',
    },
  },
  design: {
    key: 'design',
    name: '设计公司',
    cssVars: {
      '--color-primary': '#f97316',
      '--color-primary-hover': '#ea580c',
      '--color-primary-light': 'rgba(249, 115, 22, 0.12)',
      '--bg-base': '#0a0a0a',
      '--bg-surface': '#141414',
      '--bg-elevated': '#1a1a1a',
      '--bg-card': 'rgba(255, 255, 255, 0.03)',
      '--text-primary': '#fafafa',
      '--text-secondary': 'rgba(250, 250, 250, 0.6)',
      '--text-muted': 'rgba(250, 250, 250, 0.3)',
      '--border-subtle': 'rgba(255, 255, 255, 0.06)',
      '--border-default': 'rgba(255, 255, 255, 0.1)',
      '--gradient-primary': 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #f59e0b 100%)',
      '--gradient-title': 'linear-gradient(135deg, #fafafa 0%, #fb923c 40%, #ea580c 100%)',
      '--gradient-hero': 'radial-gradient(ellipse at 70% 20%, rgba(249,115,22,0.18) 0%, transparent 55%), radial-gradient(ellipse at 30% 80%, rgba(245,158,11,0.1) 0%, transparent 50%), linear-gradient(180deg, #0a0a0a 0%, #141414 100%)',
    },
  },
  retail: {
    key: 'retail',
    name: '零售公司',
    cssVars: {
      '--color-primary': '#22c55e',
      '--color-primary-hover': '#16a34a',
      '--color-primary-light': 'rgba(34, 197, 94, 0.12)',
      '--bg-base': '#f0fdf4',
      '--bg-surface': '#f8fafc',
      '--bg-elevated': '#ffffff',
      '--bg-card': 'rgba(34, 197, 94, 0.03)',
      '--text-primary': '#1a2e05',
      '--text-secondary': 'rgba(26, 46, 5, 0.65)',
      '--text-muted': 'rgba(26, 46, 5, 0.35)',
      '--border-subtle': 'rgba(26, 46, 5, 0.08)',
      '--border-default': 'rgba(26, 46, 5, 0.15)',
      '--gradient-primary': 'linear-gradient(135deg, #22c55e 0%, #4ade80 50%, #16a34a 100%)',
      '--gradient-title': 'linear-gradient(135deg, #1a2e05 0%, #22c55e 40%, #16a34a 100%)',
      '--gradient-hero': 'radial-gradient(ellipse at 60% 30%, rgba(34,197,94,0.12) 0%, transparent 60%), radial-gradient(ellipse at 20% 70%, rgba(22,163,74,0.08) 0%, transparent 50%), linear-gradient(180deg, #f0fdf4 0%, #f8fafc 100%)',
    },
  },
};

/** 判断是否为浅色主题（根据 bg-base 判断） */
function isLightTheme(key: ThemeKey): boolean {
  return key === 'home' || key === 'retail';
}

/** 把主题 CSS 变量写入 :root */
function applyThemeCssVars(key: ThemeKey) {
  const config = themes[key];
  if (!config) return;
  const root = document.documentElement;
  Object.entries(config.cssVars).forEach(([k, v]) => root.style.setProperty(k, v));
  // 亮暗主题类标记
  root.classList.toggle('theme-light', isLightTheme(key));
  root.classList.toggle('theme-dark', !isLightTheme(key));
}

const ThemeContext = createContext<ThemeContextValue>({
  activeTheme: 'tech',
  setActiveTheme: () => {},
  themeConfig: themes.tech,
});

export function ThemeProvider({ children, defaultTheme = 'tech' }: { children: ReactNode; defaultTheme?: ThemeKey }) {
  // 初始值优先用 localStorage（避免白屏闪烁），随后被后端值覆盖
  const [activeTheme, setActiveThemeState] = useState<ThemeKey>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeKey | null;
    return saved && themes[saved] ? saved : defaultTheme;
  });

  // 立即应用初始主题（防止页面刷新时短暂闪烁默认样式）
  useEffect(() => {
    applyThemeCssVars(activeTheme);
  }, [activeTheme]);

  // 启动时从后端同步激活主题（以数据库为权威来源）
  useEffect(() => {
    const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) || '';
    fetch(`${baseUrl}/api/public/theme`)
      .then((r) => r.json())
      .then((res) => {
        const key = res?.data?.themeKey as ThemeKey | undefined;
        if (key && themes[key] && key !== activeTheme) {
          localStorage.setItem(THEME_STORAGE_KEY, key);
          setActiveThemeState(key);
        }
      })
      .catch(() => {
        // 后端不可达时静默降级，沿用本地缓存
      });
    // 仅在挂载时执行一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const themeConfig = themes[activeTheme];

  const setActiveTheme = useCallback((key: ThemeKey) => {
    if (themes[key]) {
      localStorage.setItem(THEME_STORAGE_KEY, key);
      setActiveThemeState(key);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme, themeConfig }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

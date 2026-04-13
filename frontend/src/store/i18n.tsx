import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import type { Locale } from '@/types';
import zhMessages from '@/locales/zh';
import enMessages from '@/locales/en';

const LOCALE_STORAGE_KEY = 'enterprise_locale';

interface I18nContextValue {
  locale: Locale;
  toggleLocale: () => void;
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'zh',
  toggleLocale: () => {},
});

const messages: Record<Locale, Record<string, string>> = {
  zh: zhMessages,
  en: enMessages,
};

interface I18nProviderProps {
  children: ReactNode;
}

/**
 * 国际化 Provider
 * - 从 localStorage 恢复用户语言选择
 * - 提供 toggleLocale 方法切换语言
 */
export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    return (saved === 'en' ? 'en' : 'zh') as Locale;
  });

  // 同步到 html lang 属性（SEO + 无障碍）
  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
  }, [locale]);

  const toggleLocale = () => {
    const next: Locale = locale === 'zh' ? 'en' : 'zh';
    setLocale(next);
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
  };

  return (
    <I18nContext.Provider value={{ locale, toggleLocale }}>
      <IntlProvider
        locale={locale === 'zh' ? 'zh-CN' : 'en'}
        messages={messages[locale]}
        defaultLocale="zh-CN"
      >
        {children}
      </IntlProvider>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

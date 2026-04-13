/**
 * 站点元数据 Store
 * - 应用启动时从 /api/public/metadata 拉取配置（公司名、Logo 等）
 * - 自动根据当前 locale 返回对应语言版本
 */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { fetchSiteMetadata, type BilingualMetadata } from '@/api/content';
import { useI18n } from '@/store/i18n';

interface SiteMetadataContextValue {
  /** 当前语言的公司名称 */
  siteName: string;
  /** Logo 符号 */
  logoSymbol: string;
  /** 完整双语元数据（原始数据，供需要自定义的场景使用） */
  metadata: Record<string, BilingualMetadata>;
}

const DEFAULT_SITE_NAME = 'Claw';
const DEFAULT_LOGO = '⬡';

const SiteMetadataContext = createContext<SiteMetadataContextValue>({
  siteName: DEFAULT_SITE_NAME,
  logoSymbol: DEFAULT_LOGO,
  metadata: {},
});

export function SiteMetadataProvider({ children }: { children: ReactNode }) {
  const { locale } = useI18n();
  const [metadata, setMetadata] = useState<Record<string, BilingualMetadata>>({});

  useEffect(() => {
    fetchSiteMetadata()
      .then((data) => {
        console.log('Site metadata loaded:', data);
        setMetadata(data);
      })
      .catch((err) => {
        console.warn('Failed to load site metadata:', err);
        // 拉取失败静默处理，使用默认值
      });
  }, []);

  const pick = (key: string, fallback: string) => {
    const item = metadata[key];
    if (!item) return fallback;
    return locale === 'zh' ? (item.zh || fallback) : (item.en || item.zh || fallback);
  };

  const siteName = pick('COMPANY_NAME', DEFAULT_SITE_NAME);
  const logoSymbol = pick('LOGO_SYMBOL', DEFAULT_LOGO);

  return (
    <SiteMetadataContext.Provider value={{ siteName, logoSymbol, metadata }}>
      {children}
    </SiteMetadataContext.Provider>
  );
}

export function useSiteMetadata() {
  return useContext(SiteMetadataContext);
}

/**
 * 自定义 Hook：加载页面内容并转换为 ContentMap
 * 用法：const { contentMap, loading } = usePageContent('HOME')
 * 访问：contentMap['HERO_TITLE'] → 当前语言的标题文案
 */
import { useState, useEffect } from 'react';
import { fetchPageContent } from '@/api/content';
import { useI18n } from '@/store/i18n';
import type { ContentMap } from '@/types';

interface UsePageContentResult {
  contentMap: ContentMap;
  loading: boolean;
  error: string | null;
}

export function usePageContent(pageKey: string): UsePageContentResult {
  const { locale } = useI18n();
  const [contentMap, setContentMap] = useState<ContentMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchPageContent(pageKey)
      .then((items) => {
        if (cancelled) return;
        // 将数组转换为 map：{ HERO_TITLE: '引领科技未来...' }
        const map: ContentMap = {};
        items.forEach((item) => {
          map[item.contentKey] = locale === 'zh' ? item.contentZh : item.contentEn;
        });
        setContentMap(map);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [pageKey, locale]); // locale 变化时重新映射

  return { contentMap, loading, error };
}

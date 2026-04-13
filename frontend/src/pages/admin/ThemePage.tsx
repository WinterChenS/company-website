/**
 * 主题管理页面（管理后台）
 */
import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Card, Button, Tag, message, Typography } from 'antd';
import { CheckCircleOutlined, SwapOutlined } from '@ant-design/icons';
import { adminGetThemes, adminActivateTheme, adminGetActiveTheme } from '@/api/content';
import { useTheme } from '@/store/theme';
import type { ThemeKey } from '@/store/theme';
import type { SiteTheme } from '@/types';
import styles from './ThemePage.module.css';

const { Title, Text } = Typography;

const themePreviews: Record<string, { bg: string; gradient: string }> = {
  tech:   { bg: '#050510', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)' },
  home:   { bg: '#faf7f2', gradient: 'linear-gradient(135deg, #b8860b, #d4a843, #8b6914)' },
  design: { bg: '#0a0a0a', gradient: 'linear-gradient(135deg, #f97316, #fb923c, #f59e0b)' },
  retail: { bg: '#f0fdf4', gradient: 'linear-gradient(135deg, #22c55e, #4ade80, #16a34a)' },
};

export default function ThemePage() {
  const intl = useIntl();
  const [themeList, setThemeList] = useState<SiteTheme[]>([]);
  const [activeThemeKey, setActiveThemeKey] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { setActiveTheme } = useTheme();

  const loadData = async () => {
    try {
      const [all, active] = await Promise.all([adminGetThemes(), adminGetActiveTheme()]);
      setThemeList(all);
      setActiveThemeKey(active.themeKey);
    } catch (err) {
      message.error((err as Error).message);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleActivate = async (themeKey: string) => {
    if (themeKey === activeThemeKey) return;
    setLoading(true);
    try {
      await adminActivateTheme(themeKey);
      setActiveThemeKey(themeKey);
      setActiveTheme(themeKey as ThemeKey);
      message.success(intl.formatMessage({ id: 'admin.theme.switchSuccess' }));
    } catch (err) {
      message.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Title level={4} className={styles.pageTitle}>
        {intl.formatMessage({ id: 'admin.theme.title' })}
      </Title>
      <Text type="secondary" className={styles.pageDesc}>
        {intl.formatMessage({ id: 'admin.theme.desc' })}
      </Text>

      <div className={styles.themeGrid}>
        {themeList.map((theme) => {
          const preview = themePreviews[theme.themeKey] || themePreviews.tech;
          const isActive = theme.themeKey === activeThemeKey;

          return (
            <Card
              key={theme.id}
              className={`${styles.themeCard} ${isActive ? styles.active : ''}`}
              hoverable={!isActive}
              onClick={() => !isActive && handleActivate(theme.themeKey)}
            >
              {isActive && (
                <Tag color="blue" className={styles.activeTag}>
                  <CheckCircleOutlined /> {intl.formatMessage({ id: 'admin.theme.current' })}
                </Tag>
              )}

              <div className={styles.preview} style={{ background: preview.bg }}>
                <div className={styles.previewBar} style={{ background: preview.gradient }} />
              </div>

              <div className={styles.info}>
                <Title level={5}>{theme.themeName}</Title>
                <Text type="secondary">{theme.description}</Text>
              </div>

              {!isActive && (
                <Button
                  type="primary"
                  size="small"
                  icon={<SwapOutlined />}
                  loading={loading}
                  onClick={(e) => { e.stopPropagation(); handleActivate(theme.themeKey); }}
                  className={styles.switchBtn}
                >
                  {intl.formatMessage({ id: 'admin.theme.switch' })}
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

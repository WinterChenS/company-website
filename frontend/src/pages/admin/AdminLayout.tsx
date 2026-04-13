/**
 * 管理后台布局（需登录）
 */
import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ProLayout } from '@ant-design/pro-components';
import { ConfigProvider, theme, Button, Badge, Tooltip } from 'antd';
import {
  FileTextOutlined,
  HomeOutlined,
  GlobalOutlined,
  MessageOutlined,
  BgColorsOutlined,
  LogoutOutlined,
  UserOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useIntl } from 'react-intl';
import { useI18n } from '@/store/i18n';
import { useAuth } from '@/store/auth';
import { adminGetUnreadCount } from '@/api/content';
import { SEOHead } from '@/components/common/SEOHead';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const intl = useIntl();
  const { locale, toggleLocale } = useI18n();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // 菜单项在组件内定义，这样可以使用 intl
  const menuItems = [
    { path: '/admin/content',  name: intl.formatMessage({ id: 'admin.menu.content' }),  icon: <FileTextOutlined /> },
    { path: '/admin/cases',    name: intl.formatMessage({ id: 'admin.menu.cases' }),    icon: <AppstoreOutlined /> },
    { path: '/admin/messages', name: intl.formatMessage({ id: 'admin.menu.messages' }), icon: <MessageOutlined /> },
    { path: '/admin/themes',   name: intl.formatMessage({ id: 'admin.menu.themes' }),   icon: <BgColorsOutlined /> },
    { path: '/admin/settings', name: intl.formatMessage({ id: 'admin.menu.settings' }), icon: <SettingOutlined /> },
  ];

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const count = await adminGetUnreadCount();
        setUnreadCount(count);
      } catch { /* ignore */ }
    };
    fetchUnread();
    const timer = setInterval(fetchUnread, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const LogoIcon = () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="14,2 25,8 25,20 14,26 3,20 3,8" fill="none" stroke="#6366f1" strokeWidth="2" />
      <polygon points="14,6 21,10 21,18 14,22 7,18 7,10" fill="#6366f1" fillOpacity="0.3" />
    </svg>
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#6366f1',
          borderRadius: 8,
          colorBgContainer: '#12122a',
          colorBgLayout: '#0d0d1a',
          colorBgElevated: '#1a1a35',
        },
      }}
    >
      {/* 动态设置管理后台页面SEO信息 */}
      <SEOHead 
        title={intl.formatMessage({ id: 'admin.title' })}
        description={intl.formatMessage({ id: 'admin.description' })}
        useSiteName={false}
      />
      
      <ProLayout
        title={intl.formatMessage({ id: 'admin.title' })}
        logo={<LogoIcon />}
        layout="side"
        route={{ routes: menuItems }}
        location={location}
        menuItemRender={(item, dom) => (
          <a
            onClick={() => item.path && navigate(item.path)}
            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>{dom}</span>
            {item.path === '/admin/messages' && unreadCount > 0 && (
              <Badge count={unreadCount} size="small" style={{ marginLeft: 8 }} />
            )}
          </a>
        )}
        avatarProps={{
          src: undefined,
          title: user?.displayName || 'Admin',
          size: 'small',
          icon: <UserOutlined />,
        }}
        actionsRender={() => [
          <Tooltip key="lang" title={locale === 'zh' ? 'Switch to English' : '切换中文'}>
            <Button
              type="text"
              size="small"
              onClick={toggleLocale}
              icon={<GlobalOutlined />}
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              {locale === 'zh' ? 'EN' : '中文'}
            </Button>
          </Tooltip>,
          <Tooltip key="home" title={intl.formatMessage({ id: 'admin.action.previewSite' })}>
            <Button
              type="text"
              size="small"
              icon={<HomeOutlined />}
              onClick={() => window.open('/', '_blank')}
              style={{ color: 'rgba(255,255,255,0.65)' }}
            />
          </Tooltip>,
          <Tooltip key="logout" title={intl.formatMessage({ id: 'admin.action.logout' })}>
            <Button
              type="text"
              size="small"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            />
          </Tooltip>,
        ]}
        style={{ minHeight: '100vh' }}
      >
        <Outlet />
      </ProLayout>
    </ConfigProvider>
  );
}


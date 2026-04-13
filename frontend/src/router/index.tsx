import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';

// 官网页面
const WebsiteLayout = lazy(() => import('@/pages/website/WebsiteLayout'));
const HomePage = lazy(() => import('@/pages/website/HomePage'));
const CasesPage = lazy(() => import('@/pages/website/CasesPage'));

// 管理后台
const LoginPage = lazy(() => import('@/pages/admin/LoginPage'));
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'));
const ContentListPage = lazy(() => import('@/pages/admin/ContentListPage'));
const CaseListPage = lazy(() => import('@/pages/admin/CaseListPage'));
const MessageListPage = lazy(() => import('@/pages/admin/MessageListPage'));
const ThemePage = lazy(() => import('@/pages/admin/ThemePage'));
const SiteSettingsPage = lazy(() => import('@/pages/admin/SiteSettingsPage'));



/** 路由守卫：未登录跳转登录页 */
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function PageLoaderFallback() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#0a0a0a', color: '#6366f1', fontSize: 16
    }}>
      Loading...
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoaderFallback />}>
        <Routes>
          {/* 官网路由（公开访问）*/}
          <Route path="/" element={<WebsiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="cases" element={<CasesPage />} />
          </Route>

          {/* 登录页 */}
          <Route path="/login" element={<LoginPage />} />

          {/* 管理后台路由（需要登录）*/}
          <Route path="/admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
            <Route index element={<Navigate to="/admin/content" replace />} />
            <Route path="content" element={<ContentListPage />} />
            <Route path="cases" element={<CaseListPage />} />
            <Route path="messages" element={<MessageListPage />} />
            <Route path="themes" element={<ThemePage />} />
            <Route path="settings" element={<SiteSettingsPage />} />
          </Route>

          {/* 404 → 首页 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

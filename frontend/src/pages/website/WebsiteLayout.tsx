import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/website/Navbar';
import { SEOHead } from '@/components/common/SEOHead';

/**
 * 官网布局：顶部导航 + 页面内容
 */
export default function WebsiteLayout() {
  return (
    <>
      {/* 动态设置页面SEO信息 */}
      <SEOHead />
      
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

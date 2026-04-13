/**
 * 官网首页
 * 动态渲染组件：根据后端返回的 ContentMap 渲染各区块
 */
import { usePageContent } from '@/hooks/usePageContent';
import { HeroSection } from '@/components/website/HeroSection';
import { StatsSection } from '@/components/website/StatsSection';
import { AboutSection } from '@/components/website/AboutSection';
import { ServicesSection } from '@/components/website/ServicesSection';
import { CasesSection } from '@/components/website/CasesSection';
import { ContactSection } from '@/components/website/ContactSection';
import styles from './HomePage.module.css';

export default function HomePage() {
  const { contentMap, loading, error } = usePageContent('HOME');

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>⚠️ {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <>
      {/* Hero 区块 */}
      <HeroSection contentMap={contentMap} />

      {/* 数据统计 */}
      <StatsSection contentMap={contentMap} />

      {/* 关于我们 */}
      <AboutSection contentMap={contentMap} />

      {/* 核心服务 */}
      <ServicesSection contentMap={contentMap} />

      {/* 成功案例 */}
      <CasesSection />

      {/* 联系我们 + 页脚 */}
      <ContactSection contentMap={contentMap} />
    </>
  );
}

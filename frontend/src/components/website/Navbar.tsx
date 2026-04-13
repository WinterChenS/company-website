/**
 * 网站导航栏
 * - 滚动后背景变实心（blur 效果）
 * - 语言切换按钮
 * - 平滑滚动到锚点（支持从子页面跳回首页后滚动）
 */
import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useI18n } from '@/store/i18n';
import { useSiteMetadata } from '@/store/siteMetadata';
import styles from './Navbar.module.css';

/** 锚点导航项（首页内各 section） */
const ANCHOR_LINKS = [
  { id: 'nav.home',     anchor: '#home' },
  { id: 'nav.about',    anchor: '#about' },
  { id: 'nav.services', anchor: '#services' },
  { id: 'nav.contact',  anchor: '#contact' },
];

/** 页面导航项（跳转到其他路由） */
const PAGE_LINKS = [
  { id: 'nav.cases', path: '/cases' },
];

export function Navbar() {
  const intl = useIntl();
  const { toggleLocale } = useI18n();
  const { siteName, logoSymbol } = useSiteMetadata();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isOnHomePage = location.pathname === '/';

  /** 等待 DOM 节点出现后滚动（最多等 2s，每 100ms 轮询一次，兼容首页异步渲染） */
  const scrollToAnchor = (anchor: string, retries = 20) => {
    const target = document.querySelector(anchor);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (retries > 0) {
      setTimeout(() => scrollToAnchor(anchor, retries - 1), 100);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 从其他页面 navigate('/') 跳回首页后，读取 sessionStorage 滚动目标
  useEffect(() => {
    if (!isOnHomePage) return;
    const scrollTarget = sessionStorage.getItem('scrollTo');
    if (scrollTarget) {
      sessionStorage.removeItem('scrollTo');
      scrollToAnchor(scrollTarget);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnHomePage]);

  /** 点击锚点按钮 */
  const handleAnchorClick = (anchor: string) => {
    setMenuOpen(false);
    if (isOnHomePage) {
      scrollToAnchor(anchor);
    } else {
      sessionStorage.setItem('scrollTo', anchor);
      navigate('/');
    }
  };

  /** 点击页面跳转链接 */
  const handlePageClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    setMenuOpen(false);
    navigate(path);
  };

  // 按 NAV 顺序排列所有链接（用于渲染时保持顺序）
  const NAV_ORDER = ['nav.home', 'nav.about', 'nav.services', 'nav.cases', 'nav.contact'];

  const renderNavItem = (id: string, className: string) => {
    const anchor = ANCHOR_LINKS.find((l) => l.id === id);
    const page = PAGE_LINKS.find((l) => l.id === id);

    if (anchor) {
      return (
        <button
          key={id}
          type="button"
          className={`${className}`}
          onClick={() => handleAnchorClick(anchor.anchor)}
        >
          {intl.formatMessage({ id })}
        </button>
      );
    }
    if (page) {
      const isActive = location.pathname === page.path;
      return (
        <a
          key={id}
          href={page.path}
          className={`${className} ${isActive ? styles.navLinkActive : ''}`}
          onClick={(e) => handlePageClick(e, page.path)}
        >
          {intl.formatMessage({ id })}
        </a>
      );
    }
    return null;
  };

  return (
    <motion.header
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className={styles.inner}>
        {/* Logo */}
        <button
          type="button"
          className={styles.logo}
          onClick={() => handleAnchorClick('#home')}
        >
          <span className={styles.logoIcon}>{logoSymbol}</span>
          <span className={styles.logoText}>{siteName}</span>
        </button>

        {/* 桌面导航 */}
        <nav className={styles.desktopNav}>
          {NAV_ORDER.map((id) => renderNavItem(id, styles.navLink))}
        </nav>

        {/* 右侧操作 */}
        <div className={styles.actions}>
          <button className={styles.langBtn} onClick={toggleLocale}>
            {intl.formatMessage({ id: 'nav.switchLang' })}
          </button>
          {/* 移动端汉堡菜单 */}
          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className={menuOpen ? styles.closeIcon : styles.hamIcon}>
              {menuOpen ? '✕' : '☰'}
            </span>
          </button>
        </div>
      </div>

      {/* 移动端菜单 */}
      {menuOpen && (
        <motion.div
          className={styles.mobileMenu}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {NAV_ORDER.map((id) => renderNavItem(id, styles.mobileLink))}
        </motion.div>
      )}
    </motion.header>
  );
}

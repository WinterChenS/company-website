/**
 * Hero 区块
 * - 全屏渐变背景 + 粒子光效
 * - Framer Motion 入场动画（stagger）
 * - 动态内容来自后端 API
 */
import { motion } from 'framer-motion';
import type { ContentMap } from '@/types';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  contentMap: ContentMap;
}

// 动画变体
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export function HeroSection({ contentMap }: HeroSectionProps) {
  const title = contentMap['HERO_TITLE'] || '';
  const subtitle = contentMap['HERO_SUBTITLE'] || '';
  const ctaPrimary = contentMap['HERO_CTA_PRIMARY'] || 'Get Started';
  const ctaSecondary = contentMap['HERO_CTA_SECONDARY'] || 'Learn More';

  return (
    <section id="home" className={styles.hero}>
      {/* 背景光效 */}
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />
      <div className={styles.bgGrid} />

      {/* 漂浮粒子 */}
      <div className={styles.particles}>
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className={styles.particle} style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
          }} />
        ))}
      </div>

      <div className={`container ${styles.content}`}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={styles.textBlock}
        >
          {/* 标签徽章 */}
          <motion.div variants={itemVariants} className={styles.badge}>
            <span className={styles.badgeDot} />
            AI · Cloud · Data · Innovation
          </motion.div>

          {/* 主标题 */}
          <motion.h1 variants={itemVariants} className={styles.title}>
            {title.split('，').map((part, idx, arr) => (
              <span key={idx}>
                {part}
                {idx < arr.length - 1 && <br />}
              </span>
            ))}
          </motion.h1>

          {/* 副标题 */}
          <motion.p variants={itemVariants} className={styles.subtitle}>
            {subtitle}
          </motion.p>

          {/* CTA 按钮组 */}
          <motion.div variants={itemVariants} className={styles.ctaGroup}>
            <a href="#contact" className={styles.btnPrimary}>
              {ctaPrimary}
              <span className={styles.btnArrow}>→</span>
            </a>
            <a href="#services" className={styles.btnSecondary}>
              {ctaSecondary}
            </a>
          </motion.div>

          {/* 滚动提示 */}
          <motion.div
            variants={itemVariants}
            className={styles.scrollHint}
          >
            <span className={styles.scrollDot} />
            <span className={styles.scrollLine} />
          </motion.div>
        </motion.div>

        {/* 右侧装饰性 3D 卡片 */}
        <motion.div
          className={styles.decorCard}
          initial={{ opacity: 0, x: 60, rotateY: -20 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
        >
          <div className={styles.decorInner}>
            <div className={styles.decorChart}>
              {[40, 65, 50, 80, 70, 90, 75].map((h, i) => (
                <motion.div
                  key={i}
                  className={styles.bar}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className={styles.decorLabel}>AI Performance Index</div>
            <div className={styles.decorValue}>+127%</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

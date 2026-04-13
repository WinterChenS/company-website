/**
 * 关于我们区块
 */
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { ContentMap } from '@/types';
import styles from './AboutSection.module.css';

interface AboutSectionProps {
  contentMap: ContentMap;
}

const FEATURES = [
  { icon: '⚡', label: '极速交付' },
  { icon: '🔒', label: '安全可靠' },
  { icon: '🌍', label: '全球服务' },
  { icon: '💡', label: '持续创新' },
];

const FEATURES_EN = [
  { icon: '⚡', label: 'Fast Delivery' },
  { icon: '🔒', label: 'Secure & Reliable' },
  { icon: '🌍', label: 'Global Service' },
  { icon: '💡', label: 'Continuous Innovation' },
];

export function AboutSection({ contentMap }: AboutSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  // 简单判断当前语言
  const isEn = !!(contentMap['ABOUT_TITLE'] && /[a-zA-Z]/.test(contentMap['ABOUT_TITLE']));
  const features = isEn ? FEATURES_EN : FEATURES;

  return (
    <section id="about" className={styles.section} ref={ref}>
      <div className="container">
        <div className={styles.layout}>
          {/* 左侧：视觉装饰 */}
          <motion.div
            className={styles.visual}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.visualCard}>
              {/* 轨道动画 */}
              <div className={styles.orbit1}>
                <div className={styles.orbitDot} />
              </div>
              <div className={styles.orbit2}>
                <div className={styles.orbitDot} />
              </div>
              <div className={styles.coreCircle}>
                <span>⬡</span>
              </div>
              {/* 特性徽章 */}
              {features.map((f, idx) => (
                <motion.div
                  key={idx}
                  className={styles.featureBadge}
                  style={{
                    top: `${[10, 70, 10, 70][idx]}%`,
                    left: `${[5, 5, 75, 75][idx]}%`,
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.4 + idx * 0.15 }}
                >
                  <span>{f.icon}</span>
                  <span>{f.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 右侧：文案 */}
          <motion.div
            className={styles.textSide}
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <h2 className="section-title">{contentMap['ABOUT_TITLE'] || 'About Us'}</h2>
            <p className={styles.desc}>{contentMap['ABOUT_DESCRIPTION']}</p>

            {/* 进度条 */}
            <div className={styles.bars}>
              {[
                { label: 'AI & Machine Learning', pct: 95 },
                { label: 'Cloud Architecture', pct: 90 },
                { label: 'Data Engineering', pct: 88 },
              ].map((bar) => (
                <div key={bar.label} className={styles.barItem}>
                  <div className={styles.barLabel}>
                    <span>{bar.label}</span>
                    <span>{bar.pct}%</span>
                  </div>
                  <div className={styles.barTrack}>
                    <motion.div
                      className={styles.barFill}
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${bar.pct}%` } : {}}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

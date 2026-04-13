/**
 * 数据统计区块（Hero 下方）
 * 显示客户数、项目数、年限、专家数
 */
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import type { ContentMap } from '@/types';
import styles from './StatsSection.module.css';

interface StatsSectionProps {
  contentMap: ContentMap;
}

export function StatsSection({ contentMap }: StatsSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { value: contentMap['STATS_CLIENTS'], label: contentMap['STATS_CLIENTS_LABEL'] },
    { value: contentMap['STATS_PROJECTS'], label: contentMap['STATS_PROJECTS_LABEL'] },
    { value: contentMap['STATS_YEARS'], label: contentMap['STATS_YEARS_LABEL'] },
    { value: contentMap['STATS_EXPERTS'], label: contentMap['STATS_EXPERTS_LABEL'] },
  ].filter(s => s.value && s.label);

  return (
    <section className={styles.stats} ref={ref}>
      <div className="container">
        <div className={styles.grid}>
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              className={styles.item}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className={styles.value}>{stat.value}</div>
              <div className={styles.label}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

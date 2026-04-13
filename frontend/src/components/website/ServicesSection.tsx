/**
 * 服务区块
 * 4 个服务卡片，hover 时有 3D 倾斜效果
 */
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { ContentMap } from '@/types';
import styles from './ServicesSection.module.css';

interface ServicesSectionProps {
  contentMap: ContentMap;
}

const SERVICE_ICONS = ['🤖', '☁️', '📊', '🚀'];

export function ServicesSection({ contentMap }: ServicesSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const services = [1, 2, 3, 4].map((n) => ({
    title: contentMap[`SERVICE_${n}_TITLE`] || '',
    desc: contentMap[`SERVICE_${n}_DESC`] || '',
    icon: SERVICE_ICONS[n - 1],
  })).filter(s => s.title);

  return (
    <section id="services" className={styles.section} ref={ref}>
      <div className="container">
        {/* 区块标题 */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">{contentMap['SERVICES_TITLE'] || 'Core Services'}</h2>
        </motion.div>

        {/* 服务卡片网格 */}
        <div className={styles.grid}>
          {services.map((service, idx) => (
            <ServiceCard
              key={idx}
              {...service}
              delay={idx * 0.1}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ServiceCardProps {
  title: string;
  desc: string;
  icon: string;
  delay: number;
  inView: boolean;
}

function ServiceCard({ title, desc, icon, delay, inView }: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D 鼠标倾斜效果
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
  };

  return (
    <motion.div
      ref={cardRef}
      className={styles.card}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.iconWrap}>{icon}</div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDesc}>{desc}</p>
      <div className={styles.cardGlow} />
    </motion.div>
  );
}

/**
 * 首页案例展示区块（完整国际化）
 */
import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { motion } from 'framer-motion';
import { Button, Card, Tag } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { getPublicCases, PortfolioCase } from '@/api/case';
import { useI18n } from '@/store/i18n';
import styles from './CasesSection.module.css';

export function CasesSection() {
  const intl = useIntl();
  const { locale } = useI18n();
  const [cases, setCases] = useState<PortfolioCase[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCases = async () => {
      try {
        setLoading(true);
        const data = await getPublicCases(locale);
        setCases(data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load cases:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCases();
  }, [locale]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (cases.length === 0) {
    return null;
  }

  return (
    <section className={styles.section} id="cases">
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.heading}>
            <h2 className={styles.title}>
              {intl.formatMessage({ id: 'cases.sectionTitle' })}
            </h2>
            <p className={styles.subtitle}>
              {intl.formatMessage({ id: 'cases.sectionSubtitle' })}
            </p>
          </div>
          <motion.div
            className={styles.cta}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              type="primary"
              size="large"
              href="/cases"
              className={styles.viewAllBtn}
            >
              {intl.formatMessage({ id: 'cases.viewAll' })}
              <ArrowRightOutlined />
            </Button>
          </motion.div>
        </motion.div>

        <div className={styles.caseGrid}>
          {cases.map((caseItem, index) => (
            <motion.div
              key={caseItem.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={styles.caseCard}
                hoverable
                cover={
                  <div className={styles.imageContainer}>
                    <img
                      src={caseItem.imageUrl}
                      alt={caseItem.title}
                      className={styles.caseImage}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop';
                      }}
                    />
                    <div className={styles.imageOverlay} />
                  </div>
                }
                onClick={() => { window.location.href = '/cases'; }}
              >
                <Tag className={styles.industryTag}>
                  {caseItem.industry}
                </Tag>
                <h3 className={styles.caseTitle}>{caseItem.title}</h3>
                <p className={styles.clientName}>
                  <strong>{intl.formatMessage({ id: 'cases.clientLabel' })}:</strong>{' '}
                  {caseItem.client}
                </p>
                <p className={styles.caseOverview}>
                  {caseItem.overview.length > 100
                    ? `${caseItem.overview.substring(0, 100)}...`
                    : caseItem.overview}
                </p>
                <div className={styles.cardFooter}>
                  <span className={styles.resultHighlight}>
                    {extractKeyResult(caseItem.result, locale, intl)}
                  </span>
                  <Button
                    type="text"
                    className={styles.viewBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = '/cases';
                    }}
                  >
                    {intl.formatMessage({ id: 'cases.viewDetails' })}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** 从成果描述中提取关键数据，支持中英文 */
function extractKeyResult(
  result: string,
  locale: string,
  intl: ReturnType<typeof useIntl>
): string {
  const improved = intl.formatMessage({ id: 'cases.resultImproved' });
  const growth   = intl.formatMessage({ id: 'cases.resultGrowth' });
  const saved    = intl.formatMessage({ id: 'cases.resultSaved' });
  const fallback = intl.formatMessage({ id: 'cases.resultHighlight' });

  // 百分比
  const pctMatch = result.match(/(\d+(?:\.\d+)?\s*%)/);
  if (pctMatch) return `${pctMatch[0]} ${improved}`;

  if (locale === 'zh') {
    // 中文：倍数
    const timesMatch = result.match(/(\d+(?:\.\d+)?\s*倍)/);
    if (timesMatch) return `${timesMatch[0]}${growth}`;

    // 中文：金额
    const numMatch = result.match(/(\d+(?:\.\d+)?(?!%))\s*(万元|亿元|万|亿)/);
    if (numMatch) return `${saved}${numMatch[0]}`;
  } else {
    // 英文：times / x
    const timesMatchEn = result.match(/(\d+(?:\.\d+)?)\s*(?:times?|x\b)/i);
    if (timesMatchEn) return `${timesMatchEn[0]} ${growth}`;

    // 英文：金额
    const moneyMatch = result.match(/(\$[\d,.]+(?:\s*(?:million|billion|M|B))?)/i);
    if (moneyMatch) return `${saved} ${moneyMatch[0]}`;
  }

  return fallback;
}

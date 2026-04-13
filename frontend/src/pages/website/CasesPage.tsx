/**
 * 公司案例展示页面
 * - 案例网格展示
 * - 行业筛选
 * - 案例详情模态框
 */
import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { motion } from 'framer-motion';
import { Card, Tag, Button, Empty, Spin, message } from 'antd';
import { EyeOutlined, CalendarOutlined, BuildOutlined } from '@ant-design/icons';
import { getPublicCases, getCasesByIndustry, PortfolioCase } from '@/api/case';
import { useI18n } from '@/store/i18n';
import styles from './CasesPage.module.css';

export default function CasesPage() {
  const intl = useIntl();
  const { locale } = useI18n();
  const [cases, setCases] = useState<PortfolioCase[]>([]);
  const [filteredCases, setFilteredCases] = useState<PortfolioCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState<PortfolioCase | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [industries, setIndustries] = useState<string[]>([]);

  // 加载案例数据
  useEffect(() => {
    setSelectedIndustry(null); // locale 切换时重置筛选
    fetchCases();
  }, [locale]);

  // 处理筛选
  useEffect(() => {
    if (selectedIndustry) {
      filterByIndustry(selectedIndustry);
    } else {
      setFilteredCases(cases);
    }
  }, [cases, selectedIndustry]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const data = await getPublicCases(locale);
      setCases(data);
      
      // 动态提取行业数据（完全来自 API，跟随 locale）
      const uniqueIndustries = [...new Set(data.map((c: PortfolioCase) => c.industry))];
      setIndustries(uniqueIndustries);
    } catch (error) {
      message.error(intl.formatMessage({ id: 'cases.loadFailed' }));
      console.error('Failed to load cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterByIndustry = async (industry: string) => {
    try {
      setLoading(true);
      const data = await getCasesByIndustry(industry, locale);
      setFilteredCases(data);
    } catch (error) {
      message.error(intl.formatMessage({ id: 'cases.filterFailed' }));
    } finally {
      setLoading(false);
    }
  };

  const handleIndustryClick = (industry: string) => {
    if (selectedIndustry === industry) {
      setSelectedIndustry(null);
    } else {
      setSelectedIndustry(industry);
    }
  };

  const handleCaseClick = (caseItem: PortfolioCase) => {
    setSelectedCase(caseItem);
  };

  const handleCloseModal = () => {
    setSelectedCase(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return intl.formatDate(date, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className={styles.container}>
      {/* 页面头部 */}
      <div className={styles.header}>
        <motion.div 
          className={styles.hero}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className={styles.title}>
            {intl.formatMessage({ id: 'cases.title' })}
          </h1>
          <p className={styles.subtitle}>
            {intl.formatMessage({ id: 'cases.subtitle' })}
          </p>
        </motion.div>
      </div>

      {/* 行业筛选 */}
      <div className={styles.filterSection}>
        <div className={styles.filterInner}>
          <Tag 
            className={`${styles.industryTag} ${!selectedIndustry ? styles.active : ''}`}
            onClick={() => setSelectedIndustry(null)}
          >
            {intl.formatMessage({ id: 'cases.all' })}
          </Tag>
          {industries.map((industry) => (
            <Tag
              key={industry}
              className={`${styles.industryTag} ${selectedIndustry === industry ? styles.active : ''}`}
              onClick={() => handleIndustryClick(industry)}
            >
              {industry}
            </Tag>
          ))}
        </div>
      </div>

      {/* 案例网格 */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>
            <Spin size="large" tip={intl.formatMessage({ id: 'cases.loading' })} />
          </div>
        ) : filteredCases.length === 0 ? (
          <div className={styles.empty}>
            <Empty
              description={intl.formatMessage({ id: 'cases.noData' })}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <motion.div 
            className={styles.caseGrid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredCases.map((caseItem) => (
              <motion.div
                key={caseItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
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
                  onClick={() => handleCaseClick(caseItem)}
                >
                  <div className={styles.cardContent}>
                    <Tag className={styles.industryTagSmall}>
                      {caseItem.industry}
                    </Tag>
                    <h3 className={styles.caseTitle}>{caseItem.title}</h3>
                    <div className={styles.clientInfo}>
                      <BuildOutlined className={styles.clientIcon} />
                      <span className={styles.clientName}>{caseItem.client}</span>
                    </div>
                    <p className={styles.caseOverview}>{caseItem.overview}</p>
                    <div className={styles.cardFooter}>
                      <div className={styles.dateInfo}>
                        <CalendarOutlined className={styles.dateIcon} />
                        <span className={styles.dateText}>
                          {formatDate(caseItem.publishedAt)}
                        </span>
                      </div>
                      <Button 
                        type="text" 
                        icon={<EyeOutlined />}
                        className={styles.viewBtn}
                      >
                        {intl.formatMessage({ id: 'cases.viewDetails' })}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* 案例详情模态框 */}
      {selectedCase && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <motion.div 
            className={styles.modalContent}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderLeft}>
                <Tag className={styles.industryTagSmall}>{selectedCase.industry}</Tag>
                <h2 className={styles.modalTitle}>{selectedCase.title}</h2>
              </div>
              <Button 
                type="text" 
                className={styles.closeBtn}
                onClick={handleCloseModal}
              >
                ×
              </Button>
            </div>
            
            <div className={styles.modalImageContainer}>
              <img 
                src={selectedCase.imageUrl} 
                alt={selectedCase.title}
                className={styles.modalImage}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop';
                }}
              />
            </div>

            <div className={styles.modalBody}>
              <div className={styles.clientCard}>
                <div className={styles.clientHeader}>
                  <BuildOutlined className={styles.clientCardIcon} />
                  <div>
                    <h4 className={styles.clientCardTitle}>
                      {intl.formatMessage({ id: 'cases.client' })}
                    </h4>
                    <p className={styles.clientCardName}>{selectedCase.client}</p>
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  {intl.formatMessage({ id: 'cases.challenge' })}
                </h3>
                <p className={styles.sectionText}>{selectedCase.challenge}</p>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  {intl.formatMessage({ id: 'cases.solution' })}
                </h3>
                <p className={styles.sectionText}>{selectedCase.solution}</p>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  {intl.formatMessage({ id: 'cases.result' })}
                </h3>
                <p className={styles.sectionText}>{selectedCase.result}</p>
              </div>

              <div className={styles.metaInfo}>
                <div className={styles.metaItem}>
                  <CalendarOutlined />
                  <span>{intl.formatMessage({ id: 'cases.publishedAt' })}:</span>
                  <strong>{formatDate(selectedCase.publishedAt)}</strong>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
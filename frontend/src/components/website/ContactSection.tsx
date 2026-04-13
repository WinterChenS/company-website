/**
 * 联系我们区块 + 页脚（对接真实 API，完整国际化）
 */
import { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { motion, useInView } from 'framer-motion';
import { message } from 'antd';
import type { ContentMap } from '@/types';
import { submitContact } from '@/api/content';
import { useSiteMetadata } from '@/store/siteMetadata';
import styles from './ContactSection.module.css';

interface ContactSectionProps {
  contentMap: ContentMap;
}

export function ContactSection({ contentMap }: ContactSectionProps) {
  const intl = useIntl();
  const { siteName } = useSiteMetadata();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string || '';
    const msg = formData.get('message') as string;

    if (!name || !email || !msg) {
      message.warning(intl.formatMessage({ id: 'contact.required' }));
      return;
    }

    setSubmitting(true);
    try {
      await submitContact({ name, email, subject, message: msg });
      message.success(intl.formatMessage({ id: 'contact.success' }));
      form.reset();
    } catch (err) {
      message.error((err as Error).message || intl.formatMessage({ id: 'contact.error' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section id="contact" className={styles.section} ref={ref}>
        <div className="container">
          <motion.div
            className={styles.header}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">{contentMap['CONTACT_TITLE'] || intl.formatMessage({ id: 'nav.contact' })}</h2>
            <p className={`section-subtitle ${styles.subtitle}`}>{contentMap['CONTACT_SUBTITLE']}</p>
          </motion.div>

          <div className={styles.layout}>
            {/* 联系信息 */}
            <motion.div
              className={styles.infoSide}
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {[
                { icon: '📍', titleKey: 'contact.infoAddress', value: contentMap['CONTACT_ADDRESS'], fallback: '待添加地址信息' },
                { icon: '📧', titleKey: 'contact.infoEmail',   value: contentMap['CONTACT_EMAIL'],   fallback: '待添加邮箱信息' },
                { icon: '📞', titleKey: 'contact.infoPhone',   value: contentMap['CONTACT_PHONE'],   fallback: '待添加电话信息' },
              ].map((item) => (
                <div key={item.titleKey} className={styles.infoItem}>
                  <span className={styles.infoIcon}>{item.icon}</span>
                  <div>
                    <div className={styles.infoTitle}>{intl.formatMessage({ id: item.titleKey, defaultMessage: item.titleKey })}</div>
                    <div className={styles.infoValue}>
                      {item.value || (intl.locale === 'zh' ? item.fallback : `To be added: ${item.titleKey.replace('contact.info', '').toLowerCase()}`)}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* 联系表单 */}
            <motion.form
              className={styles.form}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>
                    {intl.formatMessage({ id: 'contact.name' })} *
                  </label>
                  <input
                    className={styles.input}
                    type="text"
                    name="name"
                    placeholder={intl.formatMessage({ id: 'contact.namePlaceholder' })}
                    required
                    disabled={submitting}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>
                    {intl.formatMessage({ id: 'contact.email' })} *
                  </label>
                  <input
                    className={styles.input}
                    type="email"
                    name="email"
                    placeholder={intl.formatMessage({ id: 'contact.emailPlaceholder' })}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>
                  {intl.formatMessage({ id: 'contact.subject' })}
                </label>
                <input
                  className={styles.input}
                  type="text"
                  name="subject"
                  placeholder={intl.formatMessage({ id: 'contact.subjectPlaceholder' })}
                  disabled={submitting}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>
                  {intl.formatMessage({ id: 'contact.message' })} *
                </label>
                <textarea
                  className={styles.textarea}
                  name="message"
                  rows={5}
                  placeholder={intl.formatMessage({ id: 'contact.messagePlaceholder' })}
                  required
                  disabled={submitting}
                />
              </div>
              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting
                  ? intl.formatMessage({ id: 'contact.sending' })
                  : intl.formatMessage({ id: 'contact.send' })}
                {!submitting && <span>→</span>}
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerInner}>
            <div className={styles.footerLogo}>
              <span>⬡</span> {siteName}
            </div>
            <p className={styles.footerCopy}>{contentMap['FOOTER_COPYRIGHT']}</p>
          </div>
        </div>
      </footer>
    </>
  );
}

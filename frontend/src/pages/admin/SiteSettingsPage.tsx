/**
 * 站点设置页面（管理后台）
 * 可视化编辑公司名称（中英文）、Logo 符号等元数据
 * 底层复用 page_content 表的 METADATA 分区
 */
import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Form, Input, Button, message, Typography, Card, Space, Divider, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { adminGetContentPaged, adminUpdateContent } from '@/api/content';
import type { PageContent } from '@/types';

const { Title, Text } = Typography;

/** METADATA 条目列表 */
const METADATA_KEYS = ['COMPANY_NAME', 'LOGO_SYMBOL'];

export default function SiteSettingsPage() {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  /** key → PageContent（包含 id，用于更新） */
  const [recordMap, setRecordMap] = useState<Record<string, PageContent>>({});

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await adminGetContentPaged(0, 50, 'METADATA');
      const map: Record<string, PageContent> = {};
      data.list.forEach((item) => { map[item.contentKey] = item; });
      setRecordMap(map);

      // 把值填入表单
      form.setFieldsValue({
        COMPANY_NAME_ZH: map['COMPANY_NAME']?.contentZh ?? '',
        COMPANY_NAME_EN: map['COMPANY_NAME']?.contentEn ?? '',
        LOGO_SYMBOL:     map['LOGO_SYMBOL']?.contentZh ?? '⬡',
      });
    } catch {
      message.error(intl.formatMessage({ id: 'admin.settings.loadFailed' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSettings(); }, []);

  const handleSave = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      const updates: Promise<unknown>[] = [];

      // 更新 COMPANY_NAME
      const companyRecord = recordMap['COMPANY_NAME'];
      if (companyRecord) {
        updates.push(adminUpdateContent(companyRecord.id, {
          contentZh: values.COMPANY_NAME_ZH,
          contentEn: values.COMPANY_NAME_EN,
          sortOrder: companyRecord.sortOrder,
        }));
      }

      // 更新 LOGO_SYMBOL
      const logoRecord = recordMap['LOGO_SYMBOL'];
      if (logoRecord) {
        updates.push(adminUpdateContent(logoRecord.id, {
          contentZh: values.LOGO_SYMBOL,
          contentEn: values.LOGO_SYMBOL,
          sortOrder: logoRecord.sortOrder,
        }));
      }

      await Promise.all(updates);
      message.success(intl.formatMessage({ id: 'admin.settings.saveSuccess' }));
      // 重新加载，确保 recordMap 同步
      await loadSettings();
    } catch {
      message.error(intl.formatMessage({ id: 'admin.settings.saveFailed' }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: 720 }}>
      <Title level={4}>{intl.formatMessage({ id: 'admin.settings.title' })}</Title>
      <Text type="secondary">{intl.formatMessage({ id: 'admin.settings.desc' })}</Text>

      <Divider />

      <Spin spinning={loading}>
        <Card bordered={false} style={{ background: 'transparent' }}>
          <Form form={form} layout="vertical">
            {/* 公司名称 */}
            <Form.Item
              label={intl.formatMessage({ id: 'admin.settings.companyNameZh' })}
              name="COMPANY_NAME_ZH"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input maxLength={100} placeholder="如：EnterpriseXX 科技有限公司" />
            </Form.Item>

            <Form.Item
              label={intl.formatMessage({ id: 'admin.settings.companyNameEn' })}
              name="COMPANY_NAME_EN"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input maxLength={100} placeholder="e.g. EnterpriseXX Technology Co., Ltd." />
            </Form.Item>

            {/* Logo 符号 */}
            <Form.Item
              label={intl.formatMessage({ id: 'admin.settings.logoSymbol' })}
              name="LOGO_SYMBOL"
              extra={intl.formatMessage({ id: 'admin.settings.logoSymbolExtra' })}
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input maxLength={10} style={{ width: 120, fontSize: 20, textAlign: 'center' }} />
            </Form.Item>

            <Form.Item style={{ marginTop: 32 }}>
              <Space>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  loading={saving}
                  onClick={handleSave}
                >
                  {intl.formatMessage({ id: 'admin.settings.save' })}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </div>
  );
}

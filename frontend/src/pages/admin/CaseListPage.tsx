/**
 * 案例管理页面 - 管理员用（完整国际化）
 */
import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import {
  Table, Button, Input, Modal, Space, Tag, message,
  Popconfirm, Tooltip, Card, Col, Row, Divider, Switch
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  EyeOutlined, EyeInvisibleOutlined, SearchOutlined, ReloadOutlined
} from '@ant-design/icons';
import { PortfolioCaseAdmin, adminGetCases, adminSearchCases, adminDeleteCase, adminTogglePublishCase } from '@/api/case';
import CaseFormModal from './components/CaseFormModal';

export default function CaseListPage() {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState<PortfolioCaseAdmin[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCase, setEditingCase] = useState<PortfolioCaseAdmin | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewCase, setPreviewCase] = useState<PortfolioCaseAdmin | null>(null);

  const loadCases = async (page = current, size = pageSize) => {
    try {
      setLoading(true);
      const data = searchKeyword.trim()
        ? await adminSearchCases(searchKeyword, page - 1, size)
        : await adminGetCases(page - 1, size);
      setCases(data.content);
      setTotal(data.totalElements);
      setCurrent(data.number + 1);
      setPageSize(data.size);
    } catch (error) {
      message.error(intl.formatMessage({ id: 'admin.case.loadFailed' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCases(); }, []);

  const handleSearch = async () => { await loadCases(1, pageSize); };

  const handleDelete = async (id: number) => {
    try {
      await adminDeleteCase(id);
      message.success(intl.formatMessage({ id: 'admin.case.deleteSuccess' }));
      loadCases();
    } catch {
      message.error(intl.formatMessage({ id: 'admin.case.deleteFailed' }));
    }
  };

  const handleTogglePublish = async (id: number, publish: boolean) => {
    try {
      await adminTogglePublishCase(id, publish);
      message.success(intl.formatMessage({ id: publish ? 'admin.case.published' : 'admin.case.unpublished' }));
      loadCases();
    } catch {
      message.error(intl.formatMessage({ id: 'admin.operateFailed' }));
    }
  };

  const columns = [
    {
      title: intl.formatMessage({ id: 'admin.case.caseTitle' }),
      dataIndex: 'titleZh',
      key: 'titleZh',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'admin.case.client' }),
      dataIndex: 'clientZh',
      key: 'clientZh',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'admin.case.industry' }),
      dataIndex: 'industryZh',
      key: 'industryZh',
      render: (industry: string) => <Tag color="blue">{industry}</Tag>,
    },
    {
      title: intl.formatMessage({ id: 'admin.case.sortOrder' }),
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
      sorter: true,
    },
    {
      title: intl.formatMessage({ id: 'admin.case.publishStatus' }),
      dataIndex: 'isPublished',
      key: 'isPublished',
      width: 120,
      render: (published: boolean, record: PortfolioCaseAdmin) => (
        <Switch
          checked={published}
          checkedChildren={intl.formatMessage({ id: 'admin.case.published' })}
          unCheckedChildren={intl.formatMessage({ id: 'admin.case.unpublished' })}
          onChange={(checked) => handleTogglePublish(record.id!, checked)}
        />
      ),
    },
    {
      title: intl.formatMessage({ id: 'admin.case.publishedAt' }),
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      width: 180,
      render: (date: string) => (
        <span>
          {date
            ? new Date(date).toLocaleString(intl.locale, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
            : intl.formatMessage({ id: 'admin.case.unpublished' })}
        </span>
      ),
    },
    {
      title: intl.formatMessage({ id: 'admin.case.updatedAt' }),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (date: string) => (
        <span>
          {date && new Date(date).toLocaleString(intl.locale, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
    {
      title: intl.formatMessage({ id: 'admin.actions' }),
      key: 'actions',
      width: 200,
      render: (_: unknown, record: PortfolioCaseAdmin) => (
        <Space size="small">
          <Tooltip title={intl.formatMessage({ id: 'admin.case.preview.tooltip' })}>
            <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => { setPreviewCase(record); setPreviewVisible(true); }} />
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'admin.case.edit.tooltip' })}>
            <Button type="text" icon={<EditOutlined />} size="small" onClick={() => { setEditingCase(record); setModalVisible(true); }} />
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'admin.case.publishToggle.tooltip' })}>
            <Button
              type="text"
              icon={record.isPublished ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              size="small"
              onClick={() => handleTogglePublish(record.id!, !record.isPublished)}
            />
          </Tooltip>
          <Popconfirm
            title={intl.formatMessage({ id: 'admin.case.deleteConfirm' })}
            onConfirm={() => handleDelete(record.id!)}
            okText={intl.formatMessage({ id: 'admin.delete' })}
            cancelText={intl.formatMessage({ id: 'common.cancel' })}
          >
            <Tooltip title={intl.formatMessage({ id: 'admin.case.delete.tooltip' })}>
              <Button type="text" danger icon={<DeleteOutlined />} size="small" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      <Card title={intl.formatMessage({ id: 'admin.case.title' })} bordered={false}>
        {/* 搜索栏 */}
        <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
            <Input
              placeholder={intl.formatMessage({ id: 'admin.case.searchPlaceholder' })}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onPressEnter={handleSearch}
              style={{ flex: 1 }}
              allowClear
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              {intl.formatMessage({ id: 'admin.case.search' })}
            </Button>
            <Button icon={<ReloadOutlined />} onClick={() => { setSearchKeyword(''); loadCases(1, pageSize); }}>
              {intl.formatMessage({ id: 'admin.case.reset' })}
            </Button>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingCase(null); setModalVisible(true); }}>
            {intl.formatMessage({ id: 'admin.case.add' })}
          </Button>
        </div>

        {/* 统计信息 */}
        <div style={{ marginBottom: '16px', display: 'flex', gap: '24px' }}>
          <div>
            <span style={{ color: '#8c8c8c', marginRight: '8px' }}>{intl.formatMessage({ id: 'admin.case.totalCount' })}:</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{total}</span>
          </div>
          <div>
            <span style={{ color: '#8c8c8c', marginRight: '8px' }}>{intl.formatMessage({ id: 'admin.case.publishedCount' })}:</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }}>
              {cases.filter(c => c.isPublished).length}
            </span>
          </div>
          <div>
            <span style={{ color: '#8c8c8c', marginRight: '8px' }}>{intl.formatMessage({ id: 'admin.case.unpublishedCount' })}:</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#faad14' }}>
              {cases.filter(c => !c.isPublished).length}
            </span>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={cases}
          rowKey="id"
          loading={loading}
          pagination={{
            current, pageSize, total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (t) => intl.formatMessage({ id: 'admin.case.records' }, { total: t }),
            onChange: (page, size) => { setCurrent(page); setPageSize(size || 10); loadCases(page, size); },
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <CaseFormModal
        visible={modalVisible}
        editingCase={editingCase}
        onClose={() => { setModalVisible(false); setEditingCase(null); }}
        onSaveSuccess={() => { setModalVisible(false); setEditingCase(null); loadCases(); }}
      />

      {/* 案例预览 */}
      <Modal
        title={intl.formatMessage({ id: 'admin.case.preview' })}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            {intl.formatMessage({ id: 'admin.case.close' })}
          </Button>,
        ]}
        width={800}
      >
        {previewCase && (
          <div style={{ padding: '20px 0' }}>
            <div style={{ marginBottom: '24px' }}>
              <h3>{previewCase.titleZh}</h3>
              <p style={{ color: '#666' }}>{previewCase.titleEn}</p>
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: '12px' }}>
                  <strong>{intl.formatMessage({ id: 'admin.case.preview.client' })}:</strong>{' '}
                  {previewCase.clientZh} ({previewCase.clientEn})
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: '12px' }}>
                  <strong>{intl.formatMessage({ id: 'admin.case.preview.industry' })}:</strong>{' '}
                  {previewCase.industryZh} ({previewCase.industryEn})
                </div>
              </Col>
            </Row>
            {previewCase.imageUrl && (
              <div style={{ marginBottom: '24px' }}>
                <img src={previewCase.imageUrl} alt={previewCase.titleZh} style={{ width: '100%', borderRadius: '8px' }} />
              </div>
            )}
            <Divider>{intl.formatMessage({ id: 'admin.case.preview.overviewZh' })}</Divider>
            <p style={{ whiteSpace: 'pre-wrap', marginBottom: 24 }}>{previewCase.overviewZh}</p>
            <Divider>{intl.formatMessage({ id: 'admin.case.preview.overviewEn' })}</Divider>
            <p style={{ whiteSpace: 'pre-wrap', marginBottom: 24 }}>{previewCase.overviewEn}</p>

            <Divider>{intl.formatMessage({ id: 'admin.case.preview.challengeLabel' })}</Divider>
            <p><strong>{intl.formatMessage({ id: 'admin.case.preview.zh' })}:</strong> {previewCase.challengeZh}</p>
            <p style={{ marginBottom: 24 }}><strong>{intl.formatMessage({ id: 'admin.case.preview.en' })}:</strong> {previewCase.challengeEn}</p>

            <Divider>{intl.formatMessage({ id: 'admin.case.preview.solutionLabel' })}</Divider>
            <p><strong>{intl.formatMessage({ id: 'admin.case.preview.zh' })}:</strong> {previewCase.solutionZh}</p>
            <p style={{ marginBottom: 24 }}><strong>{intl.formatMessage({ id: 'admin.case.preview.en' })}:</strong> {previewCase.solutionEn}</p>

            <Divider>{intl.formatMessage({ id: 'admin.case.preview.resultLabel' })}</Divider>
            <p><strong>{intl.formatMessage({ id: 'admin.case.preview.zh' })}:</strong> {previewCase.resultZh}</p>
            <p><strong>{intl.formatMessage({ id: 'admin.case.preview.en' })}:</strong> {previewCase.resultEn}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

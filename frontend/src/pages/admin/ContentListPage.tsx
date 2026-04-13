/**
 * 内容配置列表页（服务端分页）
 */
import { useState, useCallback, useRef } from 'react';
import { useIntl } from 'react-intl';
import {
  ProTable, type ProColumns, type ActionType,
  ModalForm, ProFormText, ProFormTextArea, ProFormDigit, ProFormSelect,
} from '@ant-design/pro-components';
import { Button, Space, Popconfirm, message, Tag, Tooltip, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  adminGetContentPaged, adminCreateContent, adminUpdateContent,
  adminDeleteContent, adminGetPageKeys,
} from '@/api/content';
import type { PageContent, CreatePageContentRequest, UpdatePageContentRequest } from '@/types';
import styles from './ContentListPage.module.css';

type EditMode = 'create' | 'edit';

export default function ContentListPage() {
  const intl = useIntl();
  const [pageKeys, setPageKeys] = useState<string[]>([]);
  const [filterPageKey, setFilterPageKey] = useState<string>('');
  const actionRef = useRef<ActionType>();

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<EditMode>('create');
  const [editingRecord, setEditingRecord] = useState<PageContent | null>(null);

  const loadPageKeys = useCallback(async () => {
    try {
      const keys = await adminGetPageKeys();
      setPageKeys(keys);
    } catch { /* ignore */ }
  }, []);

  useState(() => { loadPageKeys(); });

  const openEdit = (record: PageContent) => {
    setEditMode('edit');
    setEditingRecord(record);
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditMode('create');
    setEditingRecord(null);
    setModalOpen(true);
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      if (editMode === 'create') {
        const createData: CreatePageContentRequest = {
          pageKey: values.pageKey as string,
          contentKey: values.contentKey as string,
          contentZh: values.contentZh as string,
          contentEn: values.contentEn as string,
          sortOrder: Number(values.sortOrder) || 0,
        };
        await adminCreateContent(createData);
        message.success(intl.formatMessage({ id: 'admin.createSuccess' }));
      } else if (editingRecord) {
        const updateData: UpdatePageContentRequest = {
          contentZh: values.contentZh as string,
          contentEn: values.contentEn as string,
          sortOrder: Number(values.sortOrder) || 0,
        };
        await adminUpdateContent(editingRecord.id, updateData);
        message.success(intl.formatMessage({ id: 'admin.updateSuccess' }));
      }
      loadPageKeys();
      actionRef.current?.reload();
      return true;
    } catch (err: unknown) {
      message.error((err as Error).message || intl.formatMessage({ id: 'admin.operateFailed' }));
      return false;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminDeleteContent(id);
      message.success(intl.formatMessage({ id: 'admin.deleteSuccess' }));
      actionRef.current?.reload();
      return true;
    } catch (err: unknown) {
      message.error((err as Error).message || intl.formatMessage({ id: 'admin.operateFailed' }));
      return false;
    }
  };

  const columns: ProColumns<PageContent>[] = [
    {
      title: intl.formatMessage({ id: 'admin.pageKey' }),
      dataIndex: 'pageKey',
      width: 100,
      render: (text) => <Tag color="purple">{text as string}</Tag>,
    },
    {
      title: intl.formatMessage({ id: 'admin.contentKey' }),
      dataIndex: 'contentKey',
      width: 160,
      render: (text) => (
        <code style={{ fontSize: 12, color: '#a5b4fc', background: 'rgba(99,102,241,0.1)', padding: '2px 6px', borderRadius: 4 }}>
          {text as string}
        </code>
      ),
    },
    {
      title: intl.formatMessage({ id: 'admin.contentZh' }),
      dataIndex: 'contentZh',
      ellipsis: true,
      search: false,
      render: (text) => (
        <Tooltip title={text as string}>
          <span style={{ color: '#e2e8f0' }}>{text as string}</span>
        </Tooltip>
      ),
    },
    {
      title: intl.formatMessage({ id: 'admin.contentEn' }),
      dataIndex: 'contentEn',
      ellipsis: true,
      search: false,
      render: (text) => (
        <Tooltip title={text as string}>
          <span style={{ color: '#94a3b8' }}>{text as string}</span>
        </Tooltip>
      ),
    },
    {
      title: intl.formatMessage({ id: 'admin.sortOrder' }),
      dataIndex: 'sortOrder',
      width: 70,
      align: 'center',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'admin.updatedAt' }),
      dataIndex: 'updatedAt',
      width: 160,
      search: false,
      render: (text) => text
        ? new Date(text as string).toLocaleString(intl.locale, { timeZone: 'Asia/Shanghai' })
        : '-',
    },
    {
      title: intl.formatMessage({ id: 'admin.actions' }),
      width: 120,
      fixed: 'right',
      search: false,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>
            {intl.formatMessage({ id: 'admin.edit' })}
          </Button>
          <Popconfirm
            title={intl.formatMessage({ id: 'admin.deleteConfirm' })}
            description={intl.formatMessage({ id: 'admin.deleteConfirmDesc' })}
            onConfirm={() => handleDelete(record.id)}
            okText={intl.formatMessage({ id: 'admin.delete' })}
            cancelText={intl.formatMessage({ id: 'common.cancel' })}
            okButtonProps={{ danger: true }}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              {intl.formatMessage({ id: 'admin.delete' })}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <ProTable<PageContent>
        headerTitle={intl.formatMessage({ id: 'admin.contentList' })}
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        search={false}
        scroll={{ x: 1000 }}
        params={{ filterPageKey }}
        request={async (params) => {
          try {
            const { current = 1, pageSize = 20, filterPageKey: pageKey } = params as {
              current?: number; pageSize?: number; filterPageKey?: string
            };
            const data = await adminGetContentPaged(current - 1, pageSize, pageKey || undefined);
            return { data: data.list, total: data.total, success: true };
          } catch {
            return { data: [], total: 0, success: false };
          }
        }}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showTotal: (total) => intl.formatMessage({ id: 'admin.total' }, { total }),
        }}
        toolBarRender={() => [
          <Select
            key="filter"
            className={styles.filterSelect}
            value={filterPageKey || undefined}
            placeholder={intl.formatMessage({ id: 'admin.filterByPage' })}
            allowClear
            style={{ minWidth: 140 }}
            onChange={(val: string | undefined) => setFilterPageKey(val ?? '')}
            options={pageKeys.map((k) => ({ label: k, value: k }))}
          />,
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            {intl.formatMessage({ id: 'admin.addConfig' })}
          </Button>,
        ]}
      />

      <ModalForm
        title={editMode === 'create'
          ? intl.formatMessage({ id: 'admin.addContent' })
          : intl.formatMessage({ id: 'admin.editContent' })}
        open={modalOpen}
        onOpenChange={(open) => { setModalOpen(open); if (!open) setEditingRecord(null); }}
        onFinish={handleSubmit}
        initialValues={
          editMode === 'edit' && editingRecord
            ? { contentZh: editingRecord.contentZh, contentEn: editingRecord.contentEn, sortOrder: editingRecord.sortOrder }
            : { sortOrder: 0 }
        }
        modalProps={{ destroyOnClose: true, width: 600 }}
        submitter={{
          searchConfig: {
            submitText: intl.formatMessage({ id: 'common.save' }),
            resetText: intl.formatMessage({ id: 'common.cancel' }),
          },
        }}
      >
        {editMode === 'create' && (
          <>
            <ProFormSelect
              name="pageKey"
              label="Page Key"
              placeholder={intl.formatMessage({ id: 'admin.filterByPage' })}
              options={pageKeys.map((k) => ({ label: k, value: k }))}
              rules={[{ required: true, message: 'Required' }]}
              fieldProps={{ showSearch: true, allowClear: true }}
            />
            <ProFormText
              name="contentKey"
              label="Content Key"
              placeholder="e.g. HERO_TITLE"
              rules={[
                { required: true, message: 'Required' },
                { pattern: /^[A-Z0-9_]+$/, message: 'Uppercase letters, digits and underscores only' },
              ]}
              fieldProps={{ style: { textTransform: 'uppercase' } }}
            />
          </>
        )}

        {editMode === 'edit' && editingRecord && (
          <div className={styles.readonlyInfo}>
            <span><strong>Page:</strong> <Tag color="purple">{editingRecord.pageKey}</Tag></span>
            <span><strong>Key:</strong> <code>{editingRecord.contentKey}</code></span>
          </div>
        )}

        <ProFormTextArea
          name="contentZh"
          label={intl.formatMessage({ id: 'admin.contentZh' })}
          placeholder="请输入中文文案"
          rules={[{ required: true, message: 'Required' }]}
          fieldProps={{ rows: 3, showCount: true, maxLength: 500 }}
        />
        <ProFormTextArea
          name="contentEn"
          label={intl.formatMessage({ id: 'admin.contentEn' })}
          placeholder="Enter English copy"
          rules={[{ required: true, message: 'Required' }]}
          fieldProps={{ rows: 3, showCount: true, maxLength: 500 }}
        />
        <ProFormDigit
          name="sortOrder"
          label={intl.formatMessage({ id: 'admin.sortOrder' })}
          min={0}
          max={9999}
          fieldProps={{ precision: 0 }}
          rules={[{ required: true, message: 'Required' }]}
        />
      </ModalForm>
    </div>
  );
}

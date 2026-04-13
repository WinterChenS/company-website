/**
 * 联系消息列表页（管理后台）
 */
import { useIntl } from 'react-intl';
import { ProTable, type ProColumns } from '@ant-design/pro-components';
import { Button, Space, Popconfirm, message, Tag, Tooltip, Badge } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { adminGetMessages, adminMarkAsRead, adminDeleteMessage } from '@/api/content';
import type { ContactMessage } from '@/types';
import styles from './MessageListPage.module.css';

export default function MessageListPage() {
  const intl = useIntl();

  const handleMarkRead = async (id: number) => {
    try {
      await adminMarkAsRead(id);
      message.success(intl.formatMessage({ id: 'admin.message.markReadSuccess' }));
      return true;
    } catch (err) {
      message.error((err as Error).message);
      return false;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminDeleteMessage(id);
      message.success(intl.formatMessage({ id: 'admin.message.deleteSuccess' }));
      return true;
    } catch (err) {
      message.error((err as Error).message);
      return false;
    }
  };

  const columns: ProColumns<ContactMessage>[] = [
    {
      title: intl.formatMessage({ id: 'admin.message.status' }),
      dataIndex: 'isRead',
      width: 70,
      align: 'center',
      render: (_, record) => (
        record.isRead
          ? <Tag color="default">{intl.formatMessage({ id: 'admin.message.read' })}</Tag>
          : <Badge status="processing" text={<span style={{ color: '#6366f1' }}>{intl.formatMessage({ id: 'admin.message.unread' })}</span>} />
      ),
    },
    {
      title: intl.formatMessage({ id: 'admin.message.name' }),
      dataIndex: 'name',
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'admin.message.email' }),
      dataIndex: 'email',
      width: 180,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'admin.message.subject' }),
      dataIndex: 'subject',
      width: 150,
      ellipsis: true,
      render: (text) => <Tooltip title={text as string}>{text as string || '-'}</Tooltip>,
    },
    {
      title: intl.formatMessage({ id: 'admin.message.content' }),
      dataIndex: 'message',
      ellipsis: true,
      search: false,
      render: (text) => (
        <Tooltip title={text as string}>
          <span>{text as string}</span>
        </Tooltip>
      ),
    },
    {
      title: intl.formatMessage({ id: 'admin.message.createdAt' }),
      dataIndex: 'createdAt',
      width: 170,
      search: false,
      render: (text) => text
        ? new Date(text as string).toLocaleString(intl.locale, { timeZone: 'Asia/Shanghai' })
        : '-',
    },
    {
      title: intl.formatMessage({ id: 'admin.actions' }),
      width: 140,
      fixed: 'right',
      search: false,
      render: (_, record) => (
        <Space>
          {!record.isRead && (
            <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleMarkRead(record.id)}>
              {intl.formatMessage({ id: 'admin.message.markRead' })}
            </Button>
          )}
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
      <ProTable<ContactMessage>
        headerTitle={intl.formatMessage({ id: 'admin.message.title' })}
        rowKey="id"
        columns={columns}
        search={false}
        scroll={{ x: 900 }}
        request={async (params) => {
          try {
            const { current = 1, pageSize = 20 } = params;
            const data = await adminGetMessages(current - 1, pageSize);
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
      />
    </div>
  );
}

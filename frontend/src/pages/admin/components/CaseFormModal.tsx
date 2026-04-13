/**
 * 案例表单模态框组件（完整国际化）
 */
import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Modal, Form, Input, InputNumber, Switch, Button, Row, Col, message, Upload } from 'antd';
import { PortfolioCaseAdmin, adminSaveCase, adminGetCaseById } from '@/api/case';
import { PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface CaseFormModalProps {
  visible: boolean;
  editingCase: PortfolioCaseAdmin | null;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function CaseFormModal({ visible, editingCase, onClose, onSaveSuccess }: CaseFormModalProps) {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    if (editingCase && visible) {
      loadCaseData();
    } else if (!editingCase && visible) {
      form.resetFields();
      setFileList([]);
    }
  }, [editingCase, visible]);

  const loadCaseData = async () => {
    if (!editingCase?.id) return;
    try {
      setLoading(true);
      const caseData = await adminGetCaseById(editingCase.id);
      form.setFieldsValue({ ...caseData, isPublished: Boolean(caseData.isPublished) });
      if (caseData.imageUrl) {
        setFileList([{ uid: '-1', name: 'case-image', status: 'done', url: caseData.imageUrl }]);
      }
    } catch {
      message.error(intl.formatMessage({ id: 'admin.case.loadDataFailed' }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      setLoading(true);

      const formData = {
        ...values,
        id: editingCase?.id,
        isPublished: Boolean(values.isPublished),
        sortOrder: values.sortOrder || 0,
      };

      if (fileList.length > 0 && fileList[0].url) {
        formData.imageUrl = fileList[0].url;
      } else if (!formData.imageUrl) {
        formData.imageUrl = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop';
      }

      await adminSaveCase(formData);
      message.success(intl.formatMessage({ id: editingCase ? 'admin.case.updateSuccess' : 'admin.case.saveSuccess' }));
      onSaveSuccess();
    } catch {
      message.error(intl.formatMessage({ id: 'admin.case.saveFailed' }));
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      if (!file.type.startsWith('image/')) {
        message.error(intl.formatMessage({ id: 'admin.case.form.imageTypeError' }));
        return false;
      }
      if (file.size / 1024 / 1024 >= 5) {
        message.error(intl.formatMessage({ id: 'admin.case.form.imageSizeError' }));
        return false;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          setFileList([{ uid: '-1', name: file.name, status: 'done', url: result as string }]);
          form.setFieldValue('imageUrl', result);
        }
      };
      reader.readAsDataURL(file);
      return false;
    },
    listType: 'picture-card' as const,
    maxCount: 1,
    fileList,
    onRemove: () => { setFileList([]); form.setFieldValue('imageUrl', ''); },
    onChange: ({ fileList: newFileList }: any) => setFileList(newFileList),
  };

  const req = (msgKey: string) => [{ required: true, message: intl.formatMessage({ id: msgKey }) }];

  return (
    <Modal
      title={intl.formatMessage({ id: editingCase ? 'admin.case.edit' : 'admin.case.add' })}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          {intl.formatMessage({ id: 'admin.case.form.cancel' })}
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          {intl.formatMessage({ id: 'admin.case.form.save' })}
        </Button>,
      ]}
      width={900}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '10px' }}
        initialValues={{ sortOrder: 0, isPublished: true }}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label={intl.formatMessage({ id: 'admin.case.form.coverImage' })}
              name="imageUrl"
              extra={intl.formatMessage({ id: 'admin.case.form.coverImageExtra' })}
            >
              <Upload {...uploadProps}>
                {fileList.length >= 1 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>{intl.formatMessage({ id: 'admin.case.form.uploadImage' })}</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={intl.formatMessage({ id: 'admin.case.form.titleZh' })} name="titleZh" rules={req('admin.case.form.titleZh')}>
              <Input maxLength={200} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={intl.formatMessage({ id: 'admin.case.form.titleEn' })} name="titleEn" rules={req('admin.case.form.titleEn')}>
              <Input maxLength={200} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={intl.formatMessage({ id: 'admin.case.form.clientZh' })} name="clientZh" rules={req('admin.case.form.clientZh')}>
              <Input maxLength={200} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={intl.formatMessage({ id: 'admin.case.form.clientEn' })} name="clientEn" rules={req('admin.case.form.clientEn')}>
              <Input maxLength={200} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={intl.formatMessage({ id: 'admin.case.form.industryZh' })} name="industryZh" rules={req('admin.case.form.industryZh')}>
              <Input maxLength={100} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={intl.formatMessage({ id: 'admin.case.form.industryEn' })} name="industryEn" rules={req('admin.case.form.industryEn')}>
              <Input maxLength={100} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label={intl.formatMessage({ id: 'admin.case.form.overviewZh' })} name="overviewZh" rules={req('admin.case.form.overviewZh')}>
              <TextArea rows={4} maxLength={2000} showCount />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={intl.formatMessage({ id: 'admin.case.form.overviewEn' })} name="overviewEn" rules={req('admin.case.form.overviewEn')}>
              <TextArea rows={4} maxLength={2000} showCount />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label={intl.formatMessage({ id: 'admin.case.form.challengeZh' })} name="challengeZh" rules={req('admin.case.form.challengeZh')}>
              <TextArea rows={4} maxLength={4000} showCount />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={intl.formatMessage({ id: 'admin.case.form.challengeEn' })} name="challengeEn" rules={req('admin.case.form.challengeEn')}>
              <TextArea rows={4} maxLength={4000} showCount />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label={intl.formatMessage({ id: 'admin.case.form.solutionZh' })} name="solutionZh" rules={req('admin.case.form.solutionZh')}>
              <TextArea rows={4} maxLength={4000} showCount />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={intl.formatMessage({ id: 'admin.case.form.solutionEn' })} name="solutionEn" rules={req('admin.case.form.solutionEn')}>
              <TextArea rows={4} maxLength={4000} showCount />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label={intl.formatMessage({ id: 'admin.case.form.resultZh' })} name="resultZh" rules={req('admin.case.form.resultZh')}>
              <TextArea rows={4} maxLength={4000} showCount />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={intl.formatMessage({ id: 'admin.case.form.resultEn' })} name="resultEn" rules={req('admin.case.form.resultEn')}>
              <TextArea rows={4} maxLength={4000} showCount />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label={intl.formatMessage({ id: 'admin.case.form.sortOrder' })}
              name="sortOrder"
              tooltip={intl.formatMessage({ id: 'admin.case.form.sortOrderTooltip' })}
            >
              <InputNumber min={-100} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={intl.formatMessage({ id: 'admin.case.form.publishStatus' })} name="isPublished" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

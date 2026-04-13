/**
 * 管理后台登录页
 */
import { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined, ReloadOutlined } from '@ant-design/icons';
import { getCaptcha, login } from '@/api/content';
import { useAuth } from '@/store/auth';
import type { CaptchaResult } from '@/types';
import styles from './LoginPage.module.css';

const { Title, Text } = Typography;

export default function LoginPage() {
  const { login: doLogin, isAuthenticated } = useAuth();
  const [captcha, setCaptcha] = useState<CaptchaResult | null>(null);
  const [loading, setLoading] = useState(false);

  // 如果已登录，跳转到管理后台
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/admin';
    }
  }, [isAuthenticated]);

  const loadCaptcha = useCallback(async () => {
    try {
      const res = await getCaptcha();
      setCaptcha(res);
    } catch {
      message.error('验证码加载失败');
    }
  }, []);

  useEffect(() => {
    loadCaptcha();
  }, [loadCaptcha]);

  const handleSubmit = async (values: { username: string; password: string; captchaCode: string }) => {
    if (!captcha) {
      message.error('请先获取验证码');
      return;
    }

    setLoading(true);
    try {
      const res = await login({
        username: values.username,
        password: values.password,
        captchaCode: values.captchaCode,
        captchaKey: captcha.captchaKey,
      });
      doLogin(res.token, { username: res.username, displayName: res.displayName });
      message.success('登录成功');
      window.location.href = '/admin';
    } catch (err) {
      message.error((err as Error).message);
      loadCaptcha(); // 刷新验证码
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.logo}>⬡</div>
          <Title level={3} className={styles.title}>管理后台</Title>
          <Text type="secondary">请输入管理员账号登录</Text>
        </div>

        <Form onFinish={handleSubmit} size="large" autoComplete="off">
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="管理员账号" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item
            name="captchaCode"
            rules={[{ required: true, message: '请输入验证码' }]}
          >
            <div className={styles.captchaRow}>
              <Input
                prefix={<SafetyCertificateOutlined />}
                placeholder="验证码"
                className={styles.captchaInput}
              />
              <div className={styles.captchaImgWrap} onClick={loadCaptcha} title="点击刷新">
                {captcha && (
                  <img
                    src={captcha.imageBase64}
                    alt="验证码"
                    className={styles.captchaImg}
                  />
                )}
                <ReloadOutlined className={styles.captchaRefresh} />
              </div>
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} className={styles.submitBtn}>
              登 录
            </Button>
          </Form.Item>
        </Form>

        <div className={styles.footer}>
          <Text type="secondary" className={styles.hint}>
            默认账号: admin / admin123
          </Text>
        </div>
      </div>
    </div>
  );
}

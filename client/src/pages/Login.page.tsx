import { useState } from 'react';

import { Button, Card, Form, Input } from 'antd';

import { useAuth } from '@contexts/Auth.context';
import { useNavigate } from 'react-router';

export function Login() {
    const [isSending, setIsSending] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form] = Form.useForm<{ email: string; password: string }>();

    const onFinish = async (values: { email: string; password: string }) => {
        setIsSending(true);
        const ok = await login(values.email, values.password);
        setIsSending(false);
        if (ok) navigate('/', { replace: true });
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: 24 }}>
            <Card title="Entrar" style={{ width: 360 }}>
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                            { required: true, message: 'Informe o e-mail.' },
                            { type: 'email', message: 'E-mail inválido.' },
                        ]}
                    >
                        <Input type="email" placeholder="E-mail" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Senha"
                        rules={[{ required: true, message: 'Informe a senha.' }]}
                    >
                        <Input.Password placeholder="Senha" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isSending} block>
                            Entrar
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

import { Fragment } from 'react';

import { Form, Input } from 'antd';

export type Values = {
    full_name: string;
    cpf: string;
    email: string;
    birth_date: string;
};

export function PersonFields() {
    return (
        <Fragment>
            <Form.Item<Values>
                name="full_name"
                label="Nome completo"
                rules={[{ required: true, message: 'Por favor, digite o nome completo.' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item<Values>
                name="cpf"
                label="CPF"
                rules={[{ required: true, message: 'Por favor, digite o CPF.' }]}
            >
                <Input placeholder="000.000.000-00" />
            </Form.Item>

            <Form.Item<Values>
                name="email"
                label="E-mail"
                rules={[
                    { required: true, message: 'Por favor, digite o e-mail.' },
                    { type: 'email', message: 'E-mail inválido.' },
                ]}
            >
                <Input type="email" />
            </Form.Item>

            <Form.Item<Values>
                name="birth_date"
                label="Data de nascimento"
                rules={[{ required: true, message: 'Por favor, informe a data de nascimento.' }]}
            >
                <Input type="date" />
            </Form.Item>
        </Fragment>
    );
}

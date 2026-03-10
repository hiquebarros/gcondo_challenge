import { Fragment } from 'react';

import { Form, Input } from 'antd';

import { formatCep } from '@services/Receitaws.service';

export type Values = {
    name: string,
    zip_code: string,
    url: string,
};

type CepInputProps = {
    value?: string;
    onChange?: (value: string) => void;
};

function CepInput({ value, onChange }: CepInputProps) {
    const digits = (value ?? '').replace(/\D/g, '').slice(0, 8);
    const display = formatCep(digits);
    return (
        <Input
            placeholder="00000-000"
            value={display}
            maxLength={9}
            onChange={e => {
                const next = e.target.value.replace(/\D/g, '').slice(0, 8);
                onChange?.(next);
            }}
            inputMode="numeric"
            autoComplete="postal-code"
        />
    );
}

export function CondominiumFields() {
    return (
        <Fragment>
            <Form.Item<Values>
                name="name"
                label="Nome"
                rules={[{ required: true, message: 'Por favor, digite um nome.' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item<Values>
                name="zip_code"
                label="CEP"
                rules={[
                    { required: true, message: 'Por favor, digite um CEP.' },
                    { pattern: /^\d{8}$/, message: 'CEP deve ter 8 dígitos.' },
                ]}
            >
                <CepInput />
            </Form.Item>

            <Form.Item<Values>
                name="url"
                label="URL"
                rules={[{ required: true, message: 'Por favor, digite uma URL.' }]}
            >
                <Input />
            </Form.Item>
        </Fragment>
    );
}

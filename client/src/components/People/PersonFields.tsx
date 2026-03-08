import { Fragment } from 'react';

import { Checkbox, Form, Input } from 'antd';

export const DECLARATION_TEXT =
    'Declaro que os dados informados são verdadeiros e estou ciente de que este registro poderá ser utilizado por outros condomínios da Gcondo.';

export type Values = {
    full_name: string;
    cpf: string;
    email: string;
    birth_date: string;
    declaration_accepted?: boolean;
};

function formatCpfDisplay(value: string | undefined): string {
    if (!value) return '';
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

type CpfInputProps = {
    value?: string;
    onChange?: (value: string) => void;
};

function CpfInput({ value, onChange }: CpfInputProps) {
    const display = formatCpfDisplay(value);
    return (
        <Input
            placeholder="000.000.000-00"
            value={display}
            maxLength={14}
            onChange={e => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
                onChange?.(digits);
            }}
            inputMode="numeric"
            autoComplete="off"
        />
    );
}

function getMaxBirthDateForAdult(): string {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().slice(0, 10);
}

type PersonFieldsProps = { showDeclaration?: boolean };

export function PersonFields({ showDeclaration = true }: PersonFieldsProps) {
    const maxBirthDate = getMaxBirthDateForAdult();

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
                rules={[
                    { required: true, message: 'Por favor, digite o CPF.' },
                    { len: 11, message: 'CPF deve ter 11 dígitos.' },
                ]}
            >
                <CpfInput />
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
                rules={[
                    { required: true, message: 'Por favor, informe a data de nascimento.' },
                    {
                        validator: (_, birthDate: string) => {
                            if (!birthDate) return Promise.resolve();
                            const max = getMaxBirthDateForAdult();
                            if (birthDate > max) {
                                return Promise.reject(new Error('A pessoa deve ser maior de idade (18 anos ou mais).'));
                            }
                            return Promise.resolve();
                        },
                    },
                ]}
            >
                <Input type="date" max={maxBirthDate} />
            </Form.Item>

            {showDeclaration && (
                <Form.Item<Values>
                    name="declaration_accepted"
                    valuePropName="checked"
                    rules={[
                        {
                            validator: (_, value) =>
                                value === true
                                    ? Promise.resolve()
                                    : Promise.reject(new Error('É necessário aceitar a declaração para continuar.')),
                        },
                    ]}
                >
                    <Checkbox>{DECLARATION_TEXT}</Checkbox>
                </Form.Item>
            )}
        </Fragment>
    );
}

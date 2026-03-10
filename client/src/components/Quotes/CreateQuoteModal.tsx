import { useState } from 'react';

import { App, Divider, Form, Input, Modal, Select } from 'antd';

import { useQuotesContext } from '@contexts/Quotes.context';
import { handleServiceError, hasServiceError } from '@helpers/Service.helper';
import { sleep } from '@lib/Sleep';
import { createQuote } from '@services/Quote.service';

/** Formata valor para máscara BR: R$ 1.234,56. O value é sempre em centavos (ex.: "8000" = 80,00). */
function formatCurrencyDisplay(value: string | undefined): string {
    if (!value) return '';
    let digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    digits = digits.replace(/^0+/, '') || '0';
    const intPart = digits.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, '.') || '0';
    const decPart = digits.slice(-2).padStart(2, '0');
    return `${intPart},${decPart}`;
}

/** Converte o valor do form para string em reais para a API. 1–2 dígitos = reais inteiros (ex.: "80" → "80,00"); 3+ = centavos (ex.: "8000" → "80,00"). */
function amountForApi(value: string): string {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits.length <= 2) return `${digits},00`;
    return formatCurrencyDisplay(digits);
}

type CurrencyInputProps = {
    value?: string;
    onChange?: (value: string) => void;
};

function CurrencyInput({ value, onChange }: CurrencyInputProps) {
    const display = formatCurrencyDisplay(value);
    return (
        <Input
            placeholder="0,00"
            value={display}
            maxLength={18}
            addonBefore="R$"
            onChange={e => {
                let digits = e.target.value.replace(/\D/g, '').slice(0, 14);
                if (digits.length > 1) digits = digits.replace(/^0+/, '') || '0';
                onChange?.(digits);
            }}
            inputMode="numeric"
            autoComplete="off"
        />
    );
}

export type CreateQuoteValues = {
    supplier_id: number | null;
    condominium_id: number | null;
    title: string;
    description: string;
    /** Valor em dígitos (ex.: "123456" = R$ 1.234,56); enviado mascarado para API (ex.: "1.234,56") */
    amount: string;
    quote_category_id: number | null;
    quote_status_id: number | null;
};

export function CreateQuoteModal() {
    const [isSending, setIsSending] = useState(false);
    const { setIsCreateModalVisible, fetchQuotes, condominiums, quoteCategories, quoteStatuses, suppliers } = useQuotesContext();
    const [form] = Form.useForm<CreateQuoteValues>();
    const app = App.useApp();

    const close = () => setIsCreateModalVisible(false);

    const onFinish = async (values: CreateQuoteValues) => {
        if (
            values.supplier_id == null ||
            values.condominium_id == null ||
            values.quote_category_id == null ||
            values.quote_status_id == null ||
            !values.amount
        ) return;
        setIsSending(true);
        const amountMasked = amountForApi(values.amount);
        const response = await createQuote({
            supplier_id: values.supplier_id,
            condominium_id: values.condominium_id,
            title: values.title.trim(),
            description: values.description.trim(),
            amount: amountMasked,
            quote_category_id: values.quote_category_id,
            quote_status_id: values.quote_status_id,
        });
        await sleep(500);
        setIsSending(false);
        if (hasServiceError(response)) return handleServiceError(app, response);
        close();
        fetchQuotes();
    };

    return (
        <Modal
            open
            title="Cadastrar orçamento"
            confirmLoading={isSending}
            onOk={() => form.submit()}
            okText="Cadastrar"
            onCancel={close}
            cancelText="Cancelar"
            width={520}
        >
            <Divider />
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                initialValues={{
                    supplier_id: null,
                    condominium_id: null,
                    title: '',
                    description: '',
                    amount: '',
                    quote_category_id: null,
                    quote_status_id: null,
                }}
            >
                <Form.Item<CreateQuoteValues>
                    name="title"
                    label="Título"
                    rules={[{ required: true, message: 'Informe o título.' }]}
                >
                    <Input placeholder="Título do orçamento" />
                </Form.Item>
                <Form.Item<CreateQuoteValues>
                    name="description"
                    label="Descrição do serviço"
                    rules={[{ required: true, message: 'Informe a descrição do serviço.' }]}
                >
                    <Input.TextArea rows={3} placeholder="Descrição do serviço" />
                </Form.Item>
                <Form.Item<CreateQuoteValues>
                    name="supplier_id"
                    label="Fornecedor"
                    rules={[{ required: true, message: 'Selecione o fornecedor.' }]}
                >
                    <Select
                        placeholder="Selecione o fornecedor"
                        allowClear
                        options={suppliers.map((s) => ({ value: s.id, label: s.legal_name }))}
                    />
                </Form.Item>
                <Form.Item<CreateQuoteValues>
                    name="condominium_id"
                    label="Condomínio"
                    rules={[{ required: true, message: 'Selecione o condomínio.' }]}
                >
                    <Select
                        placeholder="Selecione o condomínio"
                        allowClear
                        options={condominiums.map((c) => ({ value: c.id, label: c.name }))}
                    />
                </Form.Item>
                <Form.Item<CreateQuoteValues>
                    name="amount"
                    label="Valor"
                    rules={[{ required: true, message: 'Informe o valor.' }]}
                >
                    <CurrencyInput />
                </Form.Item>
                <Form.Item<CreateQuoteValues>
                    name="quote_category_id"
                    label="Categoria"
                    rules={[{ required: true, message: 'Selecione a categoria.' }]}
                >
                    <Select
                        placeholder="Selecione a categoria"
                        allowClear
                        options={quoteCategories.map((c) => ({ value: c.id, label: c.name }))}
                    />
                </Form.Item>
                <Form.Item<CreateQuoteValues>
                    name="quote_status_id"
                    label="Status"
                    rules={[{ required: true, message: 'Selecione o status.' }]}
                >
                    <Select
                        placeholder="Selecione o status"
                        allowClear
                        options={quoteStatuses.map((s) => ({ value: s.id, label: s.name }))}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}

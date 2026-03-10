import { useEffect, useState } from 'react';

import { App, Divider, Form, Input, Modal, Select, Spin } from 'antd';

import { useQuotesContext } from '@contexts/Quotes.context';
import { handleServiceError, hasServiceError } from '@helpers/Service.helper';
import { sleep } from '@lib/Sleep';
import type { Quote } from '@internal-types/Quote.type';
import { findQuote, updateQuote } from '@services/Quote.service';

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

/** Converte o valor do form para string em reais para a API. */
function amountForApi(value: string): string {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits.length <= 2) return `${digits},00`;
    return formatCurrencyDisplay(digits);
}

/** Converte valor da API (ex.: "80.00") para centavos no form (ex.: "8000"). */
function amountFromApi(value: string | null | undefined): string {
    if (value == null || value === '') return '';
    const n = Number(value);
    if (Number.isNaN(n)) return '';
    const cents = Math.round(n * 100);
    return String(cents);
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

export type EditQuoteValues = {
    supplier_id: number | null;
    condominium_id: number | null;
    title: string;
    description: string;
    amount: string;
    quote_category_id: number | null;
    quote_status_id: number | null;
};

export function EditQuoteModal() {
    const [isSending, setIsSending] = useState(false);
    const [quote, setQuote] = useState<Quote.Model | null>(null);
    const { quoteIdForEdit, setQuoteIdForEdit, fetchQuotes, filter, condominiums, quoteCategories, quoteStatuses, suppliers } = useQuotesContext();
    const [form] = Form.useForm<EditQuoteValues>();
    const app = App.useApp();

    const close = () => {
        setQuoteIdForEdit(null);
        setQuote(null);
    };

    useEffect(() => {
        if (quoteIdForEdit == null) {
            setQuote(null);
            return;
        }
        let cancelled = false;
        (async () => {
            const response = await findQuote(quoteIdForEdit);
            if (cancelled) return;
            if (hasServiceError(response)) {
                handleServiceError(app, response);
                close();
                return;
            }
            setQuote(response.data.quote);
        })();
        return () => { cancelled = true; };
    }, [quoteIdForEdit, app]);

    useEffect(() => {
        if (!quote) return;
        form.setFieldsValue({
            supplier_id: quote.supplier_id,
            condominium_id: quote.condominium_id,
            title: quote.title ?? '',
            description: quote.description ?? '',
            amount: amountFromApi(quote.amount),
            quote_category_id: quote.quote_category_id,
            quote_status_id: quote.quote_status_id,
        });
    }, [quote, form]);

    const onFinish = async (values: EditQuoteValues) => {
        if (!quote) return;
        if (
            values.supplier_id == null ||
            values.condominium_id == null ||
            values.quote_category_id == null ||
            values.quote_status_id == null ||
            !values.amount
        ) return;
        setIsSending(true);
        const amountMasked = amountForApi(values.amount);
        const response = await updateQuote(quote.id, {
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
        fetchQuotes(filter);
    };

    if (quoteIdForEdit == null) return null;

    return (
        <Modal
            open
            title="Editar orçamento"
            confirmLoading={isSending}
            maskClosable={!!quote}
            okButtonProps={{ disabled: !quote }}
            onOk={() => form.submit()}
            okText="Salvar"
            onCancel={close}
            cancelText="Cancelar"
            width={520}
        >
            <Divider />
            {!quote ? (
                <div style={{ padding: 24, textAlign: 'center' }}>
                    <Spin tip="Carregando orçamento..." />
                </div>
            ) : (
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item<EditQuoteValues>
                    name="title"
                    label="Título"
                    rules={[{ required: true, message: 'Informe o título.' }]}
                >
                    <Input placeholder="Título do orçamento" />
                </Form.Item>
                <Form.Item<EditQuoteValues>
                    name="description"
                    label="Descrição do serviço"
                    rules={[{ required: true, message: 'Informe a descrição do serviço.' }]}
                >
                    <Input.TextArea rows={3} placeholder="Descrição do serviço" />
                </Form.Item>
                <Form.Item<EditQuoteValues>
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
                <Form.Item<EditQuoteValues>
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
                <Form.Item<EditQuoteValues>
                    name="amount"
                    label="Valor"
                    rules={[{ required: true, message: 'Informe o valor.' }]}
                >
                    <CurrencyInput />
                </Form.Item>
                <Form.Item<EditQuoteValues>
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
                <Form.Item<EditQuoteValues>
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
            )}
        </Modal>
    );
}

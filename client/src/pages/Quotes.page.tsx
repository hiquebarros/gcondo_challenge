import { Fragment } from 'react';

import { Button, Row, type TableColumnsType, Typography } from 'antd';

import { CreateQuoteModal } from '@components/Quotes/CreateQuoteModal';
import { Table } from '@components/Table';
import { QuotesContextProvider, useQuotesContext } from '@contexts/Quotes.context';
import type { Quote } from '@internal-types/Quote.type';
import { Show } from '@lib/Show';

function formatAmount(value: string | null | undefined): string {
    if (value == null || value === '') return '—';
    const n = Number(value);
    if (Number.isNaN(n)) return String(value);
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
}

const COLUMNS: TableColumnsType<Quote.Model> = [
    {
        title: 'ID',
        dataIndex: 'id',
        render: (v: number) => `#${v}`,
    },
    {
        title: 'Título',
        dataIndex: 'title',
    },
    {
        title: 'Condomínio',
        dataIndex: ['condominium', 'name'],
        render: (_: unknown, record: Quote.Model) => record.condominium?.name ?? '—',
    },
    {
        title: 'Tipo',
        dataIndex: ['quote_category', 'name'],
        render: (_: unknown, record: Quote.Model) => record.quote_category?.name ?? '—',
    },
    {
        title: 'Fornecedor',
        dataIndex: ['supplier', 'legal_name'],
        render: (_: unknown, record: Quote.Model) => record.supplier?.legal_name ?? '—',
    },
    {
        title: 'Valor',
        dataIndex: 'amount',
        render: (v: string | null) => formatAmount(v),
    },
    {
        title: 'Status',
        dataIndex: ['quote_status', 'name'],
        render: (_: unknown, record: Quote.Model) => record.quote_status?.name ?? '—',
    },
];

function QuotesContent() {
    const { isLoading, quotes, setIsCreateModalVisible, isCreateModalVisible } = useQuotesContext();

    return (
        <Fragment>
            <main>
                <Row justify="space-between" align="middle">
                    <Typography.Title level={3}>Orçamentos</Typography.Title>
                    <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                        Cadastrar
                    </Button>
                </Row>
                <Table columns={COLUMNS} dataSource={quotes} loading={isLoading} />
            </main>
            <Show when={isCreateModalVisible}>
                <CreateQuoteModal />
            </Show>
        </Fragment>
    );
}

export function Quotes() {
    return (
        <QuotesContextProvider>
            <QuotesContent />
        </QuotesContextProvider>
    );
}

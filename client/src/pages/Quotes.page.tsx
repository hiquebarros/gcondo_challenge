import { Fragment } from 'react';

import { Button, Col, Row, Select, type TableColumnsType, Typography } from 'antd';

import { SearchOutlined } from '@ant-design/icons';
import { CreateQuoteModal } from '@components/Quotes/CreateQuoteModal';
import { EditQuoteModal } from '@components/Quotes/EditQuoteModal';
import { QuoteActionsCell } from '@components/Quotes/QuoteActionsCell';
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
    {
        title: 'Ações',
        key: 'actions',
        width: 120,
        render: (_: unknown, record: Quote.Model) => <QuoteActionsCell quote={record} />,
    },
];

function QuotesContent() {
    const {
        isLoading,
        quotes,
        filter,
        setFilter,
        applyFilter,
        condominiums,
        quoteCategories,
        quoteStatuses,
        suppliers,
        setIsCreateModalVisible,
        isCreateModalVisible,
        quoteIdForEdit,
    } = useQuotesContext();

    return (
        <Fragment>
            <main>
                <Row justify="space-between" align="middle">
                    <Typography.Title level={3}>Orçamentos</Typography.Title>
                    <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                        Cadastrar
                    </Button>
                </Row>

                <Row gutter={[16, 16]} style={{ marginBottom: 16 }} align="bottom">
                    <Col xs={24} sm={6}>
                        <Select
                            placeholder="Categoria"
                            allowClear
                            style={{ width: '100%' }}
                            value={filter.quote_category_id || undefined}
                            onChange={v => setFilter(f => ({ ...f, quote_category_id: v ? String(v) : '' }))}
                            options={quoteCategories.map(c => ({ value: String(c.id), label: c.name }))}
                        />
                    </Col>
                    <Col xs={24} sm={6}>
                        <Select
                            placeholder="Status"
                            allowClear
                            style={{ width: '100%' }}
                            value={filter.quote_status_id || undefined}
                            onChange={v => setFilter(f => ({ ...f, quote_status_id: v ? String(v) : '' }))}
                            options={quoteStatuses.map(s => ({ value: String(s.id), label: s.name }))}
                        />
                    </Col>
                    <Col xs={24} sm={6}>
                        <Select
                            placeholder="Condomínio"
                            allowClear
                            style={{ width: '100%' }}
                            value={filter.condominium_id || undefined}
                            onChange={v => setFilter(f => ({ ...f, condominium_id: v ? String(v) : '' }))}
                            options={condominiums.map(c => ({ value: String(c.id), label: c.name }))}
                        />
                    </Col>
                    <Col xs={24} sm={4}>
                        <Select
                            placeholder="Fornecedor"
                            allowClear
                            style={{ width: '100%' }}
                            value={filter.supplier_id || undefined}
                            onChange={v => setFilter(f => ({ ...f, supplier_id: v ? String(v) : '' }))}
                            options={suppliers.map(s => ({ value: String(s.id), label: s.legal_name }))}
                        />
                    </Col>
                    <Col xs={24} sm={2}>
                        <Button type="primary" icon={<SearchOutlined />} onClick={applyFilter}>
                            Buscar
                        </Button>
                    </Col>
                </Row>

                <Table columns={COLUMNS} dataSource={quotes} loading={isLoading} />
            </main>
            <Show when={isCreateModalVisible}>
                <CreateQuoteModal />
            </Show>
            <Show when={quoteIdForEdit != null}>
                <EditQuoteModal />
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

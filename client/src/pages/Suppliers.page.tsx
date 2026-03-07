import { Fragment } from 'react';

import { Button, Col, Input, Row, Select, type TableColumnsType, Typography } from 'antd';

import { SearchOutlined } from '@ant-design/icons';

import { CreateSupplierModal } from '@components/Suppliers/CreateSupplierModal';
import { Table } from '@components/Table';
import { SuppliersContextProvider } from '@contexts/Suppliers.context';
import type { Supplier } from '@internal-types/Supplier.type';
import { Show } from '@lib/Show';

function formatCnpj(value: string | undefined): string {
    if (!value) return '—';
    const digits = value.replace(/\D/g, '').slice(0, 14);
    if (digits.length < 14) return value;
    return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

const COLUMNS: TableColumnsType<Supplier.Model> = [
    {
        title: 'ID',
        dataIndex: 'id',
        render: (value: number) => `#${value}`,
    },
    {
        title: 'Razão social',
        dataIndex: 'legal_name',
    },
    {
        title: 'Nome fantasia',
        dataIndex: 'trade_name',
        render: (v: string | null) => v ?? '—',
    },
    {
        title: 'CNPJ',
        dataIndex: 'cnpj',
        render: (value: string) => formatCnpj(value),
    },
    {
        title: 'E-mail',
        dataIndex: 'email',
    },
    {
        title: 'Categoria',
        dataIndex: ['category', 'name'],
        render: (_: unknown, record: Supplier.Model) => record.category?.name ?? '—',
    },
];

export function Suppliers() {
    return (
        <SuppliersContextProvider>
            {({
                isLoading,
                suppliers,
                supplierCategories,
                filter,
                setFilter,
                applyFilter,
                setIsCreateModalVisible,
                isCreateModalVisible,
            }) => (
                <Fragment>
                    <main>
                        <Row justify="space-between" align="middle">
                            <Typography.Title level={3}>
                                Fornecedores
                            </Typography.Title>

                            <Button
                                type="primary"
                                onClick={() => setIsCreateModalVisible(true)}
                            >
                                Cadastrar
                            </Button>
                        </Row>

                        <Row gutter={[16, 16]} style={{ marginBottom: 16 }} align="bottom">
                            <Col xs={24} sm={6}>
                                <Input
                                    placeholder="Razão social"
                                    value={filter.legal_name}
                                    onChange={e => setFilter(f => ({ ...f, legal_name: e.target.value }))}
                                    onPressEnter={applyFilter}
                                    allowClear
                                />
                            </Col>
                            <Col xs={24} sm={5}>
                                <Input
                                    placeholder="CNPJ"
                                    value={filter.cnpj}
                                    onChange={e => setFilter(f => ({ ...f, cnpj: e.target.value }))}
                                    onPressEnter={applyFilter}
                                    allowClear
                                />
                            </Col>
                            <Col xs={24} sm={5}>
                                <Input
                                    placeholder="E-mail"
                                    value={filter.email}
                                    onChange={e => setFilter(f => ({ ...f, email: e.target.value }))}
                                    onPressEnter={applyFilter}
                                    allowClear
                                />
                            </Col>
                            <Col xs={24} sm={4}>
                                <Select
                                    placeholder="Categoria"
                                    allowClear
                                    style={{ width: '100%' }}
                                    value={filter.supplier_category_id || undefined}
                                    onChange={v => setFilter(f => ({ ...f, supplier_category_id: v ? String(v) : '' }))}
                                    options={supplierCategories.map(c => ({ value: String(c.id), label: c.name }))}
                                />
                            </Col>
                            <Col xs={24} sm={4}>
                                <Button
                                    type="primary"
                                    icon={<SearchOutlined />}
                                    onClick={applyFilter}
                                >
                                    Buscar
                                </Button>
                            </Col>
                        </Row>

                        <Table
                            columns={COLUMNS}
                            dataSource={suppliers}
                            loading={isLoading}
                        />
                    </main>

                    <Show when={isCreateModalVisible}>
                        <CreateSupplierModal />
                    </Show>
                </Fragment>
            )}
        </SuppliersContextProvider>
    );
}

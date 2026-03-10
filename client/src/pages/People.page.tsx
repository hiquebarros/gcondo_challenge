import { Fragment } from 'react';

import { Alert, Button, Col, Input, Row, type TableColumnsType, Typography } from 'antd';

import { SearchOutlined } from '@ant-design/icons';

import { PeopleActionsCell } from '@components/People/PeopleActionsCell';
import { CreatePersonModal } from '@components/People/CreatePersonModal';
import { EditPersonModal } from '@components/People/EditPersonModal';
import { Table } from '@components/Table';
import { useAuth } from '@contexts/Auth.context';
import { PeopleContextProvider } from '@contexts/People.context';
import type { Person } from '@internal-types/Person.type';
import { Show } from '@lib/Show';

function formatCpf(value: string | undefined): string {
    if (!value) return '—';
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length < 11) return value;
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatBirthDate(value: string | undefined): string {
    if (!value) return '—';
    try {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    } catch {
        return value;
    }
}

const DECLARATION_EDIT_INTERNAL =
    'A edição de registros existentes é feita apenas pela equipe interna da Gcondo.';

function usePeopleColumns(): TableColumnsType<Person.Model> {
    const { user } = useAuth();
    const isEquipeInterna = user?.role === 'equipe_interna';

    return [
    {
        title: 'ID',
        dataIndex: 'id',
        render: (value: number) => `#${value}`,
    },
    {
        title: 'Nome',
        dataIndex: 'full_name',
    },
    {
        title: 'CPF',
        dataIndex: 'cpf',
        render: (value: string) => formatCpf(value),
    },
    {
        title: 'E-mail',
        dataIndex: 'email',
    },
    {
        title: 'Data de nascimento',
        dataIndex: 'birth_date',
        render: (value: string) => formatBirthDate(value),
    },
    {
        render: (_: unknown, record: Person.Model) =>
            isEquipeInterna ? <PeopleActionsCell person={record} /> : null,
    },
];
}

export function People() {
    const { user } = useAuth();
    const showEditNotice = user != null && user.role !== 'equipe_interna';
    const columns = usePeopleColumns();

    return (
        <PeopleContextProvider>
            {({
                isLoading,
                people,
                filter,
                setFilter,
                applyFilter,
                setIsCreateModalVisible,
                isCreateModalVisible,
                isEditModalVisible,
            }) => (
                <Fragment>
                    <main>
                        <Row justify="space-between" align="middle">
                            <Typography.Title level={3}>
                                Pessoas
                            </Typography.Title>

                            <Button
                                type="primary"
                                onClick={() => setIsCreateModalVisible(true)}
                            >
                                Cadastrar
                            </Button>
                        </Row>

                        {showEditNotice && (
                            <Alert
                                type="info"
                                message={DECLARATION_EDIT_INTERNAL}
                                showIcon
                                style={{ marginBottom: 16 }}
                            />
                        )}

                        <Row gutter={[16, 16]} style={{ marginBottom: 16 }} align="bottom">
                            <Col xs={24} sm={6}>
                                <Input
                                    placeholder="Filtrar por nome"
                                    value={filter.full_name}
                                    onChange={e => setFilter(f => ({ ...f, full_name: e.target.value }))}
                                    onPressEnter={applyFilter}
                                    allowClear
                                />
                            </Col>
                            <Col xs={24} sm={6}>
                                <Input
                                    placeholder="Filtrar por CPF"
                                    value={filter.cpf}
                                    onChange={e => setFilter(f => ({ ...f, cpf: e.target.value }))}
                                    onPressEnter={applyFilter}
                                    allowClear
                                />
                            </Col>
                            <Col xs={24} sm={6}>
                                <Input
                                    placeholder="Filtrar por e-mail"
                                    value={filter.email}
                                    onChange={e => setFilter(f => ({ ...f, email: e.target.value }))}
                                    onPressEnter={applyFilter}
                                    allowClear
                                />
                            </Col>
                            <Col xs={24} sm={6}>
                                <Button
                                    icon={<SearchOutlined />}
                                    onClick={applyFilter}
                                >
                                    Buscar
                                </Button>
                            </Col>
                        </Row>

                        <Table
                            columns={columns}
                            dataSource={people}
                            loading={isLoading}
                        />
                    </main>

                    <Show when={isCreateModalVisible}>
                        <CreatePersonModal />
                    </Show>

                    <Show when={isEditModalVisible}>
                        <EditPersonModal />
                    </Show>
                </Fragment>
            )}
        </PeopleContextProvider>
    );
}

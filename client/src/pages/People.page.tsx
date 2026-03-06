import { Fragment } from 'react';

import { Button, Row, type TableColumnsType, Typography } from 'antd';

import { PeopleActionsCell } from '@components/People/PeopleActionsCell';
import { CreatePersonModal } from '@components/People/CreatePersonModal';
import { EditPersonModal } from '@components/People/EditPersonModal';
import { Table } from '@components/Table';
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

// Imitando comportamento por "role" do usuário
const isAdmin = false;

const COLUMNS: TableColumnsType<Person.Model> = [
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
        // Imitando comportamento por "role" do usuário
        render: (_: unknown, record: Person.Model) => isAdmin ? <PeopleActionsCell person={record} /> : null,
    },
];

export function People() {
    return (
        <PeopleContextProvider>
            {({
                isLoading,
                people,
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

                        <Table
                            columns={COLUMNS}
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

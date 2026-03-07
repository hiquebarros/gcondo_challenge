import { useState } from 'react';

import { App, Divider, Form, Input, Modal, Select } from 'antd';

import { useSuppliersContext } from '@contexts/Suppliers.context';
import { handleServiceError, hasServiceError } from '@helpers/Service.helper';
import { sleep } from '@lib/Sleep';
import { createSupplier } from '@services/Supplier.service';

export type CreateSupplierValues = {
    legal_name: string;
    trade_name?: string;
    cnpj: string;
    email: string;
    supplier_category_id: number | null;
    person_ids: number[];
};

export function CreateSupplierModal() {
    const [isSending, setIsSending] = useState(false);

    const { setIsCreateModalVisible, fetchSuppliers, supplierCategories, people } = useSuppliersContext();

    const [form] = Form.useForm<CreateSupplierValues>();

    const app = App.useApp();

    const close = () => setIsCreateModalVisible(false);

    const onFinish = async (values: CreateSupplierValues) => {
        setIsSending(true);

        const response = await createSupplier({
            legal_name: values.legal_name,
            trade_name: values.trade_name || undefined,
            cnpj: values.cnpj,
            email: values.email,
            supplier_category_id: values.supplier_category_id ?? undefined,
            person_ids: values.person_ids ?? [],
        });

        await sleep(1000);

        setIsSending(false);

        if (hasServiceError(response))
            return handleServiceError(app, response);

        close();
        fetchSuppliers();
    };

    return (
        <Modal
            open
            title="Cadastrar fornecedor"
            confirmLoading={isSending}
            onOk={form.submit}
            okText="Cadastrar"
            onCancel={close}
            cancelText="Cancelar"
            width={560}
        >
            <Divider />

            <Form
                form={form}
                onFinish={onFinish}
                name="createSupplier"
                layout="vertical"
                autoComplete="off"
                initialValues={{ person_ids: [], supplier_category_id: null }}
            >
                <Form.Item<CreateSupplierValues>
                    name="legal_name"
                    label="Razão social"
                    rules={[{ required: true, message: 'Informe a razão social.' }]}
                >
                    <Input placeholder="Razão social" />
                </Form.Item>

                <Form.Item<CreateSupplierValues> name="trade_name" label="Nome fantasia">
                    <Input placeholder="Nome fantasia" />
                </Form.Item>

                <Form.Item<CreateSupplierValues>
                    name="cnpj"
                    label="CNPJ"
                    rules={[{ required: true, message: 'Informe o CNPJ.' }]}
                >
                    <Input placeholder="00.000.000/0000-00" />
                </Form.Item>

                <Form.Item<CreateSupplierValues>
                    name="email"
                    label="E-mail"
                    rules={[
                        { required: true, message: 'Informe o e-mail.' },
                        { type: 'email', message: 'E-mail inválido.' },
                    ]}
                >
                    <Input type="email" placeholder="E-mail" />
                </Form.Item>

                <Form.Item<CreateSupplierValues>
                    name="supplier_category_id"
                    label="Categoria do fornecedor"
                >
                    <Select
                        placeholder="Selecione a categoria"
                        allowClear
                        options={supplierCategories.map(c => ({ value: c.id, label: c.name }))}
                    />
                </Form.Item>

                <Form.Item<CreateSupplierValues>
                    name="person_ids"
                    label="Pessoas associadas"
                >
                    <Select
                        mode="multiple"
                        placeholder="Selecione as pessoas"
                        allowClear
                        options={people.map(p => ({ value: p.id, label: `${p.full_name} (${p.email})` }))}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}

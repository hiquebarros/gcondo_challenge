import { useRef, useState } from 'react';

import { App, Col, Divider, Form, Input, Modal, Row, Select } from 'antd';

import { CnpjInput } from '@components/Suppliers/CnpjInput';
import { useSuppliersContext } from '@contexts/Suppliers.context';
import { handleServiceError, hasServiceError } from '@helpers/Service.helper';
import { sleep } from '@lib/Sleep';
import { createSupplier } from '@services/Supplier.service';
import type { SupplierAddressBody } from '@services/contracts/Supplier.contract';
import { fetchCompanyByCnpj, formatCep } from '@services/Receitaws.service';

export type CreateSupplierValues = {
    legal_name: string;
    trade_name?: string;
    cnpj: string;
    email: string;
    supplier_category_id: number | null;
    person_ids: number[];
    address: SupplierAddressBody;
};

export function CreateSupplierModal() {
    const [isSending, setIsSending] = useState(false);
    const [cnpjLoading, setCnpjLoading] = useState(false);
    const lastFetchedCnpjRef = useRef<string | null>(null);

    const { setIsCreateModalVisible, fetchSuppliers, supplierCategories, people } = useSuppliersContext();

    const [form] = Form.useForm<CreateSupplierValues>();

    const app = App.useApp();

    const close = () => {
        lastFetchedCnpjRef.current = null;
        setIsCreateModalVisible(false);
    };

    const handleCnpjComplete = async (cnpjDigits: string) => {
        if (lastFetchedCnpjRef.current === cnpjDigits) return;
        lastFetchedCnpjRef.current = cnpjDigits;
        setCnpjLoading(true);
        const result = await fetchCompanyByCnpj(cnpjDigits);
        setCnpjLoading(false);
        if (result.status === 'error') {
            app.message.warning(result.message);
            return;
        }
        const { data } = result;
        form.setFieldsValue({
            legal_name: data.razao_social || undefined,
            trade_name: data.nome_fantasia || undefined,
            email: data.email || undefined,
            address: {
                street: data.logradouro || undefined,
                number: data.numero || undefined,
                complement: data.complemento || undefined,
                neighborhood: data.bairro || undefined,
                city: data.municipio || undefined,
                state: data.uf || undefined,
                postal_code: data.cep ? formatCep(data.cep) : undefined,
            },
        });
        app.message.success('Dados do CNPJ preenchidos.');
    };

    const onFinish = async (values: CreateSupplierValues) => {
        setIsSending(true);

        const response = await createSupplier({
            legal_name: values.legal_name,
            trade_name: values.trade_name || undefined,
            cnpj: values.cnpj.replace(/\D/g, ''),
            email: values.email,
            supplier_category_id: values.supplier_category_id ?? undefined,
            person_ids: values.person_ids ?? [],
            address: {
                street: values.address.street,
                number: values.address.number || undefined,
                complement: values.address.complement || undefined,
                neighborhood: values.address.neighborhood || undefined,
                city: values.address.city,
                state: values.address.state || undefined,
                postal_code: values.address.postal_code.replace(/\D/g, ''),
            },
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
            width={720}
        >
            <Form
                form={form}
                onFinish={onFinish}
                name="createSupplier"
                layout="vertical"
                autoComplete="off"
                initialValues={{
                    person_ids: [],
                    supplier_category_id: null,
                    address: {},
                }}
            >
                <Divider orientation="left" orientationMargin={0}>
                    Dados da empresa
                </Divider>
                <Row gutter={24}>
                    <Col xs={24} md={12}>
                        <Form.Item<CreateSupplierValues>
                            name="cnpj"
                            label="CNPJ"
                            rules={[{ required: true, message: 'Informe o CNPJ.' }]}
                        >
                            <CnpjInput
                                onComplete={handleCnpjComplete}
                                disabled={cnpjLoading}
                            />
                        </Form.Item>

                        <Form.Item<CreateSupplierValues>
                            name="legal_name"
                            label="Razão social"
                            rules={[{ required: true, message: 'Informe a razão social.' }]}
                        >
                            <Input placeholder="Razão social" />
                        </Form.Item>

                        <Form.Item<CreateSupplierValues>
                            name="trade_name"
                            label="Nome fantasia"
                            rules={[{ required: true, message: 'Informe o nome fantasia.' }]}>
                            <Input placeholder="Nome fantasia" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
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
                            rules={[{ required: true, message: 'Informe a categoria do fornecedor.' }]}
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
                    </Col>
                </Row>

                <Divider orientation="left" orientationMargin={0}>
                    Endereço
                </Divider>
                <Row gutter={24}>
                    <Col xs={24} md={12}>
                        <Form.Item<CreateSupplierValues>
                            name={['address', 'postal_code']}
                            label="CEP"
                            rules={[{ required: true, message: 'Informe o CEP.' }]}
                        >
                            <Input placeholder="00000-000" maxLength={9} />
                        </Form.Item>

                        <Form.Item<CreateSupplierValues>
                            name={['address', 'street']}
                            label="Logradouro"
                            rules={[{ required: true, message: 'Informe o logradouro.' }]}
                        >
                            <Input placeholder="Rua, avenida, etc." />
                        </Form.Item>

                        <Form.Item<CreateSupplierValues>
                            name={['address', 'number']}
                            label="Número"
                        >
                            <Input placeholder="Número" />
                        </Form.Item>

                        <Form.Item<CreateSupplierValues>
                            name={['address', 'complement']}
                            label="Complemento"
                        >
                            <Input placeholder="Apto, bloco, etc." />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item<CreateSupplierValues>
                            name={['address', 'neighborhood']}
                            label="Bairro"
                        >
                            <Input placeholder="Bairro" />
                        </Form.Item>

                        <Form.Item<CreateSupplierValues>
                            name={['address', 'city']}
                            label="Cidade"
                            rules={[{ required: true, message: 'Informe a cidade.' }]}
                        >
                            <Input placeholder="Cidade" />
                        </Form.Item>

                        <Form.Item<CreateSupplierValues>
                            name={['address', 'state']}
                            label="Estado (UF)"
                        >
                            <Input placeholder="UF" maxLength={2} style={{ width: 64 }} />
                        </Form.Item>

                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}

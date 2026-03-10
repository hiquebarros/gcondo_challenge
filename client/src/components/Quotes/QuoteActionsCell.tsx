import { useState } from 'react';

import { App, Button, Popconfirm, Space } from 'antd';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useQuotesContext } from '@contexts/Quotes.context';
import { handleServiceError, hasServiceError } from '@helpers/Service.helper';
import type { Quote } from '@internal-types/Quote.type';
import { sleep } from '@lib/Sleep';
import { deleteQuote } from '@services/Quote.service';

type Props = { quote: Quote.Model };

export function QuoteActionsCell({ quote }: Props) {
    const [isPopconfirmVisible, setIsPopconfirmVisible] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const { setQuoteIdForEdit, fetchQuotes, filter } = useQuotesContext();
    const app = App.useApp();

    const handleEdit = () => {
        setQuoteIdForEdit(quote.id);
    };

    const handleDelete = async () => {
        setIsSending(true);
        const response = await deleteQuote(quote.id);
        await sleep(500);
        setIsSending(false);
        if (hasServiceError(response)) return handleServiceError(app, response);
        setIsPopconfirmVisible(false);
        fetchQuotes(filter);
    };

    return (
        <Space size="middle">
            <Button
                type="text"
                icon={<EditOutlined />}
                title="Editar"
                onClick={handleEdit}
            />
            <Popconfirm
                title="Excluir orçamento"
                description="Tem certeza que deseja excluir o orçamento?"
                open={isPopconfirmVisible}
                placement="left"
                cancelText="Não"
                okText="Sim"
                okType="danger"
                okButtonProps={{ loading: isSending }}
                onConfirm={handleDelete}
                onCancel={() => setIsPopconfirmVisible(false)}
            >
                <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    title="Excluir"
                    onClick={() => setIsPopconfirmVisible(true)}
                />
            </Popconfirm>
        </Space>
    );
}

import { Empty,Table as AntdTable, type TableProps as AntdTableProps } from 'antd';

type Props<RecordType> = Omit<AntdTableProps<RecordType>, 'rowKey' | 'rootClassName' | 'pagination'>;

export function Table<RecordType extends { id: number }>(props: Props<RecordType>) {
    const { loading, ...rest } = props;
    const emptyText = (
        <Empty
            image={loading ? undefined : Empty.PRESENTED_IMAGE_SIMPLE}
            description={loading ? 'Carregando...' : 'Não há dados'}
        />
    );

    return (
        <AntdTable<RecordType>
            {...rest}
            loading={loading}
            rowKey={row => row.id}
            rootClassName="table-horizontal-scroll"
            pagination={{ defaultPageSize: 5, hideOnSinglePage: true }}
            /** @see https://github.com/ant-design/ant-design/issues/7690#issuecomment-558846552 */
            locale={{ emptyText }}
        />
    );
}

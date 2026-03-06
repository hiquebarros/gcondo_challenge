import { useLocation, useNavigate, useNavigation } from 'react-router';

import { type GetProp, type MenuProps, Spin } from 'antd';

import { BuildOutlined, HomeOutlined } from '@ant-design/icons';
import { Layout } from '@components/Layout';

type Item =  NonNullable<MenuProps['items']>[number];

export function MainLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const navigation = useNavigation();
    
    const initialKey = location.pathname.split('/').slice(0, 2).join('/');

    if (navigation.state === 'loading')
        return <Spin fullscreen />;

    const dashboardItem: Item = {
        key: '/',
        icon: <HomeOutlined />,
        label: 'Dashboard',
        onClick: () => navigate('/'),
    };

    const condominiumsItem: Item = {
        key: '/condominiums',
        icon: <BuildOutlined />,
        label: 'Condomínios',
        onClick: () => navigate('/condominiums'),
    };

    const items = [
        dashboardItem,
        condominiumsItem
    ];

    const sider: GetProp<typeof Layout.Root, 'sider'> = props => (
        <Layout.Sider {...props}
            items={items}
            defaultSelectedKeys={[initialKey]}
        />
    );

    return (
        <Layout.Root
            sider={sider}
            content={() => <Layout.Content />}
        />
    );
}

import { useLocation, useNavigate, useNavigation } from 'react-router';

import { type GetProp, type MenuProps, Spin } from 'antd';

import { BuildOutlined, HomeOutlined, LogoutOutlined, ShopOutlined, UserOutlined } from '@ant-design/icons';
import { Layout } from '@components/Layout';
import { useAuth } from '@contexts/Auth.context';

type Item =  NonNullable<MenuProps['items']>[number];

export function MainLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const navigation = useNavigation();
    const { logout } = useAuth();

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

    const peopleItem: Item = {
        key: '/people',
        icon: <UserOutlined />,
        label: 'Pessoas',
        onClick: () => navigate('/people'),
    };

    const suppliersItem: Item = {
        key: '/suppliers',
        icon: <ShopOutlined />,
        label: 'Fornecedores',
        onClick: () => navigate('/suppliers'),
    };

    const logoutItem: Item = {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Sair',
        onClick: () => logout(),
    };

    const items = [
        dashboardItem,
        condominiumsItem,
        peopleItem,
        suppliersItem,
        logoutItem,
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

import { RouterProvider } from 'react-router';

import { App as AntdAppProvider, ConfigProvider } from 'antd';

import { AuthProvider } from '@contexts/Auth.context';
import { router } from './router';

const theme = {
    token: {
        colorPrimary: '#36bc49',
    },
};

/** @see https://ant.design/components/overview/ */
export function App() {
    return (
        <ConfigProvider theme={theme}>
            <AntdAppProvider>
                <AuthProvider>
                    <RouterProvider router={router} />
                </AuthProvider>
            </AntdAppProvider>
        </ConfigProvider>
    );
}

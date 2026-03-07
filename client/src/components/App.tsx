import { RouterProvider } from 'react-router';

import { App as AntdAppProvider } from 'antd';

import { AuthProvider } from '@contexts/Auth.context';
import { router } from './router';

/** @see https://ant.design/components/overview/ */
export function App() {
    return (
        <AntdAppProvider>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </AntdAppProvider>
    );
}

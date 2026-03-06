import { createBrowserRouter } from 'react-router';

import { Condominiums } from '@pages/Condominiums.page';
import { Dashboard } from '@pages/Dashboard.page';

import { MainLayout } from './MainLayout';

/** @see https://reactrouter.com/start/data/routing */
export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            
            {
                path: '/condominiums',
                element: <Condominiums />,
            },
        ]
    },
]);
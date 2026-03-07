import { createBrowserRouter } from 'react-router';

import { Condominiums } from '@pages/Condominiums.page';
import { Dashboard } from '@pages/Dashboard.page';
import { Login } from '@pages/Login.page';
import { People } from '@pages/People.page';
import { Suppliers } from '@pages/Suppliers.page';

import { MainLayout } from './MainLayout';
import { ProtectedRoute } from './ProtectedRoute';

/** @see https://reactrouter.com/start/data/routing */
export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            
            {
                path: '/condominiums',
                element: <Condominiums />,
            },
            {
                path: '/people',
                element: <People />,
            },
            {
                path: '/suppliers',
                element: <Suppliers />,
            },
        ]
    },
]);
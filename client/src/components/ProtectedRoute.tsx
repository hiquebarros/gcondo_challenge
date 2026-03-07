import { type ReactNode } from 'react';

import { Navigate, useLocation } from 'react-router';

import { Spin } from 'antd';

import { useAuth } from '@contexts/Auth.context';

type Props = { children: ReactNode };

export function ProtectedRoute({ children }: Props) {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <Spin fullscreen />;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}

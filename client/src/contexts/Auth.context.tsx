import {
    createContext,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

import { App } from 'antd';

import { UnknownContextError } from '@errors/UnknownContextError';
import { handleServiceError, hasServiceError } from '@helpers/Service.helper';
import type { User } from '@internal-types/User.type';
import { getAuthToken, setAuthToken } from '@lib/authToken';
import { login as loginApi, me as meApi, logout as logoutApi } from '@services/Auth.service';

type Value = {
    user: User.Model | null;
    setUser: Dispatch<SetStateAction<User.Model | null>>;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    loadMe: () => Promise<void>;
};

type Props = { children: ReactNode };

export const AuthContext = createContext<Value | null>(null);

export function AuthProvider({ children }: Props) {
    const [user, setUser] = useState<User.Model | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const app = App.useApp();

    const loadMe = useCallback(async () => {
        const response = await meApi();
        if (hasServiceError(response)) {
            setUser(null);
            setAuthToken(null);
            return;
        }
        setUser(response.data.user);
    }, []);

    useEffect(() => {
        if (!getAuthToken()) {
            setIsLoading(false);
            return;
        }
        loadMe().finally(() => setIsLoading(false));
    }, [loadMe]);

    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        const response = await loginApi({ email, password });
        if (hasServiceError(response)) {
            handleServiceError(app, response);
            return false;
        }
        setAuthToken(response.data.token);
        setUser(response.data.user);
        return true;
    }, [app]);

    const logout = useCallback(async () => {
        await logoutApi();
        setAuthToken(null);
        setUser(null);
    }, []);

    const value: Value = {
        user,
        setUser,
        isLoading,
        login,
        logout,
        loadMe,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new UnknownContextError();
    return context;
}

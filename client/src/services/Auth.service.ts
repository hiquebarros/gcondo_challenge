import type { User } from '@internal-types/User.type';
import type { Service } from '@internal-types/Service.type';
import { Request } from './Request';

export namespace Login {
    export type Body = { email: string; password: string };

    type Data = { user: User.Model; token: string; expires_at: string };

    export type Response =
        | Service.DefaultResponse<Data>
        | Service.ExceptionResponse;
}

export namespace Logout {
    type Data = { message: string };

    export type Response =
        | Service.DefaultResponse<Data>
        | Service.ExceptionResponse;
}

export namespace Me {
    type Data = { user: User.Model };

    export type Response =
        | Service.DefaultResponse<Data>
        | Service.ExceptionResponse;
}

export const login = (body: Login.Body): Promise<Login.Response> =>
    Request.post('/login', body);

export const logout = (): Promise<Logout.Response> =>
    Request.post('/logout', null);

export const me = (): Promise<Me.Response> =>
    Request.get('/auth/me');

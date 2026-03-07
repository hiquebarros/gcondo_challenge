type Route = `/${string}`;
type Method = 'get' | 'post' | 'patch' | 'put' | 'delete';

export const BASE_URL = import.meta.env.VITE_API_URL;

const DEFAULT_HEADERS = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
};

function buildUrl(route: Route, params?: Record<string, string>): string {
    const base = BASE_URL + route;
    if (!params || Object.keys(params).length === 0)
        return base;
    const search = new URLSearchParams();
    for (const [k, v] of Object.entries(params))
        if (v != null && String(v).trim() !== '')
            search.set(k, String(v).trim());
    const query = search.toString();
    return query ? `${base}?${query}` : base;
}

async function call(route: Route, method: Method, data: unknown, params?: Record<string, string>) {
    const input: RequestInfo = buildUrl(route, params);

    const body: RequestInit['body'] = data !== null
        ? JSON.stringify(data)
        : null;

    const init: RequestInit = {
        body,
        headers: DEFAULT_HEADERS,
        method,
    };

    try {
        const response = await fetch(input, init);

        const data = await response.json();

        return data;
    } catch (error) {
        return error;
    }
}

export const Request = {
    post: (route: Route, data: unknown) => call(route, 'post', data),
    put: (route: Route, data: unknown) => call(route, 'put', data),
    get: (route: Route, params?: Record<string, string>) => call(route, 'get', null, params),
    delete: (route: Route) => call(route, 'delete', null),
};
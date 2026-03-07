const STORAGE_KEY = 'auth_token';

export function getAuthToken(): string | null {
    return localStorage.getItem(STORAGE_KEY);
}

export function setAuthToken(token: string | null): void {
    if (token === null) {
        localStorage.removeItem(STORAGE_KEY);
    } else {
        localStorage.setItem(STORAGE_KEY, token);
    }
}

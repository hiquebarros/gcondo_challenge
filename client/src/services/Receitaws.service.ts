/**
 * Response shape from https://receitaws.com.br/v1/cnpj/{cnpj}
 */
export type ReceitawsCompany = {
    razao_social: string;
    nome_fantasia: string;
    email: string | null;
    cidade: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    municipio: string;
    uf: string;
    cep: string;
};

export type ReceitawsResponse =
    | { status: 'ok'; data: ReceitawsCompany }
    | { status: 'error'; message: string };

const BASE_URL = 'https://brasilapi.com.br/api/cnpj/v1';
//const BASE_URL = 'https://receitaws.com.br/v1/cnpj';

/**
 * Fetches company data by CNPJ (14 digits). May fail due to CORS if the API
 * does not allow browser requests; in that case use a backend proxy.
 */
export async function fetchCompanyByCnpj(cnpjDigitsOnly: string): Promise<ReceitawsResponse> {
    const cnpj = cnpjDigitsOnly.replace(/\D/g, '').slice(0, 14);
    if (cnpj.length !== 14) {
        return { status: 'error', message: 'CNPJ deve ter 14 dígitos' };
    }

    try {
        const res = await fetch(`${BASE_URL}/${cnpj}`, { method: 'GET' });
        const data = await res.json();

        if (!res.ok) {
            return { status: 'error', message: data.message ?? 'Falha ao consultar CNPJ' };
        }

        if (data.status === 'ERROR' || data.error) {
            return { status: 'error', message: data.message ?? data.error ?? 'CNPJ não encontrado' };
        }

        return {
            status: 'ok',
            data: {
                razao_social: data.razao_social ?? '',
                nome_fantasia: data.nome_fantasia ?? '',
                email: data.email ?? null,
                numero: data.numero ?? '',
                complemento: data.complemento ?? '',
                bairro: data.bairro ?? '',
                cidade: data.municipio ?? '',
                logradouro: data.logradouro ?? '',
                municipio: data.municipio ?? '',
                uf: data.uf ?? '',
                cep: (data.cep ?? '').replace(/\D/g, ''),
            },
        };
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Erro ao consultar CNPJ';
        return { status: 'error', message };
    }
}

/**
 * Formats CEP to 00000-000 for display.
 */
export function formatCep(cepDigits: string): string {
    const d = cepDigits.replace(/\D/g, '').slice(0, 8);
    if (d.length <= 5) return d;
    return `${d.slice(0, 5)}-${d.slice(5)}`;
}

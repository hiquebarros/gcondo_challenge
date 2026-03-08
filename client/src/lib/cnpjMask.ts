const CNPJ_LENGTH = 14;

/**
 * Returns only digits from a string, limited to CNPJ length.
 */
export function cnpjDigits(value: string): string {
    return value.replace(/\D/g, '').slice(0, CNPJ_LENGTH);
}

/**
 * Formats a string as CNPJ mask: 00.000.000/0000-00
 */
export function formatCnpj(value: string): string {
    const digits = cnpjDigits(value);
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

export function isCnpjComplete(value: string): boolean {
    return cnpjDigits(value).length === CNPJ_LENGTH;
}

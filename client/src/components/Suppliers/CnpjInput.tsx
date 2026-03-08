import { Input } from 'antd';

import { formatCnpj, isCnpjComplete, cnpjDigits } from '@lib/cnpjMask';

type Props = {
    value?: string;
    onChange?: (value: string) => void;
    onComplete?: (cnpjDigits: string) => void;
    placeholder?: string;
    disabled?: boolean;
};

export function CnpjInput({ value, onChange, onComplete, placeholder = '00.000.000/0000-00', disabled }: Props) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const digits = cnpjDigits(raw);
        const masked = formatCnpj(raw);
        onChange?.(masked);
        if (isCnpjComplete(masked) && onComplete) {
            onComplete(digits);
        }
    };

    return (
        <Input
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            inputMode="numeric"
            maxLength={18}
        />
    );
}

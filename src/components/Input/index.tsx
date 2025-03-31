import { theme } from '@/styles/theme'
import * as S from './styles'
import { SM } from '@/styles/typographStyles'

interface Option {
    label: string
    value: string
}

interface InputProps {
    type: 'text' | 'password' | 'select'
    label?: string
    placeholder?: string
    value?: string
    onChange?: (value: string) => void 
    options?: Option[]
}

export function Input({ type, label, placeholder, value, onChange, options }: InputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <S.Container>
            <S.Label>
                <SM family={theme.fonts.inter}>{label}</SM>
            </S.Label>

            {type === 'select' ? (
                <select value={value} onChange={handleChange}>
                    <option value="">{placeholder}</option>
                    {options?.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <S.Input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                />
            )}
        </S.Container>
    )
}
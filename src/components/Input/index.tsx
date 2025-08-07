import * as S from './styles'
import { theme } from '@/styles/theme'
import { SM } from '@/styles/typographStyles'

interface Option {
    label: string
    value: string
}

interface InputProps {
    id?: string
    type: 'text' | 'password' | 'select' | 'date' 
    label?: string
    placeholder?: string
    value?: string
    onChange?: (value: string) => void 
    hasError?: boolean
    hasValue?: boolean
    options?: Option[]
}

export function Input({ 
    id,
    type, 
    label, 
    placeholder, 
    value, 
    onChange, 
    hasError = false, 
    hasValue = false,
    options 
}: InputProps) {
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
                <S.Select 
                    id={id}
                    value={value} 
                    onChange={handleChange}
                    hasValue={value ? true : false}
                    $hasError={hasError}
                >
                    <option value="">{placeholder}</option>

                    {options?.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </S.Select>
            ) : (
                <S.Input
                    id={id}
                    type={type === 'date' ? 'date' : type} 
                    placeholder={placeholder}
                    value={value ? value : ''}
                    onChange={handleChange}
                    hasValue={value ? true : false}
                    $hasError={hasError}
                    max={type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
                />
            )}
        </S.Container>
    )
}
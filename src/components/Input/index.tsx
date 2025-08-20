import { useState } from 'react'

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
    disabled?: boolean
    onChange?: (value: string) => void 
    hasError?: boolean
    hasvalue?: string
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
    hasvalue,
    disabled = false,
    options 
}: InputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
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
                    hasvalue={value ? 'true' : 'false'}
                    disabled={disabled}
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
                <S.InputWrapper>
                    <S.Input
                        id={id}
                        type={type === 'password' ? (showPassword ? 'text' : 'password') : (type === 'date' ? 'date' : type)}
                        placeholder={placeholder}
                        value={value ? value : ''}
                        onChange={handleChange}
                        hasvalue={value ? 'true' : 'false'}
                        $hasError={hasError}
                        disabled={disabled}
                        max={type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
                    />
                    {type === 'password' && (
                        <S.EyeButton type="button" onClick={handleTogglePassword} tabIndex={-1}>
                            <img 
                                src={showPassword ? "/images/png/icon-eye.png" : "/images/png/icon-eye-close.png"} 
                                alt={showPassword ? 'Mostrar senha' : 'Ocultar senha'} 
                                style={{marginBottom: showPassword ? '2px' : '0'}}
                                />
                        </S.EyeButton>
                    )}
                </S.InputWrapper>
            )}
        </S.Container>
    )
}
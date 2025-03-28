import { theme } from '@/styles/theme'
import * as S from './styles'
import { SM } from '@/styles/typographStyles'

interface InputProps {
    type: 'text' | 'password'
    label?: string
    placeholder?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function Input ({type, label, placeholder, value, onChange}: InputProps) {
    return (
        <S.Container>
            <S.Label>
                <SM family={theme.fonts.inter}>{label}</SM>
            </S.Label>

            <S.Input 
                type={type}
                placeholder={placeholder} 
                value={value} 
                onChange={onChange} 
                />
        </S.Container>
    )
}
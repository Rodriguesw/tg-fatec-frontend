import { theme } from '@/styles/theme'
import * as S from './styles'
import { SM } from '@/styles/typographStyles'

interface InputProps {
    label?: string
    placeholder?: string
}

export function Input ({label, placeholder}: InputProps) {
    return (
        <S.Container>
            <S.Label>
                <SM family={theme.fonts.inter}>{label}</SM>
            </S.Label>

            <S.Input placeholder={placeholder}></S.Input>
        </S.Container>
    )
}
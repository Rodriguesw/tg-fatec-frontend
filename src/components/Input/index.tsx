import * as S from './styles'

interface InputProps {
    label?: string
    placeholder?: string
}

export function Input ({label, placeholder}: InputProps) {
    return (
        <S.Container>
            <label>{label}</label>

            <S.Input placeholder={placeholder}></S.Input>
        </S.Container>
    )
}
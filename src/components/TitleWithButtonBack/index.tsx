import { H3 } from '@/styles/typographStyles';
import * as S from './styles'
import { theme } from '@/styles/theme';

interface TitleWithButtonBackProps {
    title: string;
}

const ButtonBack = () => {
    window.history.back();
}

export function TitleWithButtonBack({ title }: TitleWithButtonBackProps) {
    return (
        <S.Container>
            <S.ButtonBack onClick={ButtonBack}>
                <img src="/images/svg/icon-arrow-left.svg" alt="Voltar" />
            </S.ButtonBack>

            <H3 color={theme.colors.laranja}>{title}</H3>  
        </S.Container>
    )
}
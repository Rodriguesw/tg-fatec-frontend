import { H3 } from '@/styles/typographStyles';
import * as S from './styles'
import { theme } from '@/styles/theme';

interface TitleWithButtonsProps {
    title: string;
    buttonBack?: boolean
    buttonAdd? : boolean
    onClick?: () => void;  // Tornando onClick opcional com '?'
}

const ButtonBack = () => {
    window.history.back();
}

export function TitleWithButtons({ title, buttonBack, buttonAdd, onClick }: TitleWithButtonsProps) {
    return (
        <S.Container hasButtonAdd={buttonAdd}>
            {buttonBack && 
                <S.ButtonBack onClick={onClick || ButtonBack}>
                    <img src="/images/svg/icon-arrow-left.svg" alt="Voltar" />
                </S.ButtonBack>
            }
            
            <H3 color={theme.colors.laranja}>{title}</H3>  

            {buttonAdd && 
                <S.ButtonAdd onClick={onClick}>
                    <img src="/images/svg/icon-plus.svg" alt="Adicionar" />
                </S.ButtonAdd>
            }
        </S.Container>
    )
}
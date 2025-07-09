import * as S from './styles'
import { theme } from '@/styles/theme'
import { LG, SM } from '@/styles/typographStyles'

interface CardReservedProps {
    onClickEdit?: (id: number) => void;
    onClickCancel?: (id: number) => void;
}

interface SportsCourt {
    id: number;
    name: string;
    address: string; 
    booking_day_time: string;
  }

export function CardReserved({onClickEdit, onClickCancel}: CardReservedProps) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')

    return (
        <S.Container>
           {currentUser.sports_courts?.map((item: SportsCourt) => (
                <S.Card key={item.id}>
                    <LG 
                    color={theme.colors.branco.principal} 
                    family={theme.fonts.inter}>
                        {item.name}
                    </LG>

                    <SM 
                    color={theme.colors.branco.secundario}
                    family={theme.fonts.inter}>
                        {item.address}
                    </SM>     

                    <SM 
                    color={theme.colors.branco.secundario}
                    family={theme.fonts.inter}>
                        {item.booking_day_time}
                    </SM>      

                    <S.ContainerButton>
                        <S.ButtonEdit onClick={() => onClickEdit && onClickEdit(item.id)}>
                            <SM 
                            family={theme.fonts.inter} 
                            color={theme.colors.azul.segundario}>
                                Alterar
                            </SM> 
                        </S.ButtonEdit>

                        <S.ButtonCancel onClick={() => onClickCancel && onClickCancel(item.id)}>
                            <SM 
                            family={theme.fonts.inter} 
                            color={theme.colors.vermelho}>
                                Cancelar
                            </SM>
                        </S.ButtonCancel>
                    </S.ContainerButton>     
                </S.Card>
            ))}
        </S.Container>
    )
}
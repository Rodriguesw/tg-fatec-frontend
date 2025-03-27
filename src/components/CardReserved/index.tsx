
import { CardData } from './cardData'

import * as S from './styles'
import { theme } from '@/styles/theme'
import { LG, SM } from '@/styles/typographStyles'

export function CardReserved() {
    return (
        <S.Container>
           {CardData.map((item) => (
                <S.Card key={item.id}>
                    <LG 
                        color={theme.colors.branco.principal} 
                        family={theme.fonts.inter}>
                            {item.name}
                    </LG>

                    <SM 
                        color={theme.colors.branco.secundario}
                        family={theme.fonts.inter}>
                            {item.addres}
                    </SM>     

                    <SM 
                        color={theme.colors.branco.secundario}
                        family={theme.fonts.inter}>
                            {item.date}
                    </SM>           
                </S.Card>
            ))}
        </S.Container>
    )
}
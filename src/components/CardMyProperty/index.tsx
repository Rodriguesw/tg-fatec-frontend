import * as S from './styles'
import { theme } from '@/styles/theme'
import { LG, SM } from '@/styles/typographStyles'

export function CardMyProperty() {
  return (
      <S.Card>
        <S.CardContent>
          <LG color={theme.colors.branco.principal} family={theme.fonts.inter}>
            Nome da Quadra
          </LG>

          <SM color={theme.colors.branco.secundario} family={theme.fonts.inter}>
            Rua Nome da Rua, 0000 - Cidade, UF
          </SM>

          <SM color={theme.colors.branco.secundario} family={theme.fonts.inter}>
            SEG, TER, QUA, QUi - 00:00 ás 00:00
          </SM>
        </S.CardContent>

          <S.ButtonEdit onClick={() => console.log("clicou")}>
            <img src="/images/svg/icon-pen.svg" alt="Editar"/>
          </S.ButtonEdit>    
      </S.Card>
  )
}
import { H3, SM } from '@/styles/typographStyles'
import * as S from './styles'
import { theme } from '@/styles/theme'

export function FooterButtons() {
    const currentPath = window.location.pathname

    return (
         <S.Container>
            <S.Wrapper>
                <S.Button>
                    <SM>RESERVAS</SM>
                </S.Button>

                <S.Button>
                    <SM>BUSCAR</SM>
                </S.Button>

                <S.Button>
                    <SM>PERFIL</SM>
                </S.Button>
            </S.Wrapper>
        </S.Container>
    )
}
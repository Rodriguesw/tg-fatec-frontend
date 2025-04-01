import { H3 } from '@/styles/typographStyles'
import * as S from './styles'
import { theme } from '@/styles/theme'

export function Header() {
    const currentPath = window.location.pathname

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

    const HeaderWithText = () => {
        if (currentPath === '/jogador/cadastro' || currentPath === '/proprietario/cadastro') {
            return(
                <>
                    <img src="/images/logo/logo-playfut-white-fina.svg"/>
                </>
            )
        } else {
            return(
                <>
                    <img src="/images/logo/logo-playfut-white-fina.svg"/>
        
                    <H3 color={theme.colors.branco.secundario}>Olá, {currentUser.name}!</H3>
                </>
            )
        }
    }
    
    return (
         <S.Container>
            <S.Wrapper>
               {HeaderWithText()}
            </S.Wrapper>
        </S.Container>
    )
}
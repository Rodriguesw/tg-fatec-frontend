import * as S from './styles'
import { theme } from '@/styles/theme'
import { LG } from '@/styles/typographStyles'

export function Header() {
    const currentPath = window.location.pathname

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

    const getFirstName = (fullName: string) => {
        return fullName.split(' ')[0];
    }

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
        
                    <LG color={theme.colors.branco.secundario}>Olá, {getFirstName(currentUser.name)}!</LG>
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
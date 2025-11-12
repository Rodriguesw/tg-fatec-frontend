import * as S from './styles'
import { theme } from '@/styles/theme'
import { LG } from '@/styles/typographStyles'

interface User {
  id: number;
  name: string;
}

export function Header(props: { id?: string }) {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const currentUser: User = JSON.parse(
      localStorage.getItem("currentUser") ||
      "{}"
    );
    
    const currentUserProprietario: User = JSON.parse(
      localStorage.getItem("currentUserProprietario") || 
      "{}"
    );

    const getFirstName = (fullName: string) => {
        return fullName.split(' ')[0];
    }

    const isSignupPage = currentPath === '/jogador/cadastro' || currentPath === '/proprietario/cadastro';
    
    return (
         <S.Container id={props.id}>
            <S.Wrapper>
               <img src="/images/logo/logo-playfut-white-fina.svg"/>
               
               {!isSignupPage && (
                 <LG color={theme.colors.branco.secundario}>
                   Olá, {currentUser?.name ? getFirstName(currentUser.name) :  currentUserProprietario?.name ? getFirstName(currentUserProprietario.name) : 'Visitante'}!
                 </LG>
               )}
            </S.Wrapper>
        </S.Container>
    )
}
import { H3, SM } from '@/styles/typographStyles'
import * as S from './styles'
import { theme } from '@/styles/theme'
import { useRouter } from 'next/navigation';

export function Navbar() {
    const router = useRouter();
    const currentPath = window.location.pathname

    const navigation = () => {
        if (currentPath.includes('/jogador')) {
            return (
                <>
                    <S.Button active={currentPath === '/jogador/reservas'} onClick={() => router.push('/jogador/reservas')}>
                        <img src="/images/svg/icon-map.svg" alt='' />

                        <SM family={theme.fonts.inter}>RESERVAS</SM>
                    </S.Button>

                    <S.Button active={currentPath === '/jogador/home'} onClick={() => router.push('/jogador/home')}>
                        <img src="/images/svg/icon-search.svg" alt=''/>

                        <SM family={theme.fonts.inter}>BUSCAR</SM>
                    </S.Button>

                    <S.Button active={currentPath === '/jogador/perfil'} onClick={() => router.push('/jogador/perfil')}>
                        <img src="/images/svg/icon-user.svg" alt=''/>

                        <SM family={theme.fonts.inter}>PERFIL</SM>
                    </S.Button>
                </>
            )
        } else if (currentPath.includes('/proprietario')) {
            return (
                <>
                     <S.Button active={currentPath === '/proprietario/home'} onClick={() => router.push('/proprietario/home')}>
                        <img src="/images/svg/icon-home.svg" alt='' />

                        <SM family={theme.fonts.inter}>HOME</SM>
                    </S.Button>

                    <S.Button active={currentPath === '/proprietario/pedidos'} onClick={() => router.push('/proprietario/pedidos')}>
                        <img src="/images/svg/icon-calendar.svg" alt=''/>

                        <SM family={theme.fonts.inter}>PEDIDOS</SM>
                    </S.Button>

                    <S.Button active={currentPath === '/proprietario/reserva'} onClick={() => router.push('/proprietario/reserva')}>
                        <img src="/images/svg/icon-book-open.svg" alt=''/>

                        <SM family={theme.fonts.inter} weight={700}>RESERVA</SM>
                    </S.Button>

                    <S.Button active={currentPath === '/proprietario/perfil'} onClick={() => router.push('/proprietario/perfil')}>
                        <img src="/images/svg/icon-user.svg" alt=''/>

                        <SM family={theme.fonts.inter} weight={700}>PERFIL</SM>
                    </S.Button>
                </>
            )
        }
    }

    return (
         <S.Container>
            <S.Wrapper>
               {navigation()}
            </S.Wrapper>
        </S.Container>
    )
}
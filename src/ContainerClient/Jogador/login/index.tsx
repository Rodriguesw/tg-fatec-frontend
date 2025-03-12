"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { LoginWithBannerAndModal } from '@/components/LoginWithBannerAndModal';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { H3, LG, MD, SM } from '@/styles/typographStyles';
import { TitleWithButtonBack } from '@/components/TitleWithButtonBack';
import { Input } from '@/components/Input';

export default function JogadorLogin() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/home');
  }
  return (
    <S.Container>
      <S.Wrapper>
        <LoginWithBannerAndModal minHeight="560px" backgroundImage='/images/jpg/bk-login-jogador.jpg'>
         <S.Content>
            <S.ContentHeader>
              <TitleWithButtonBack title='Jogador' onClick={handleClick}/>

              <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                Login:
              </MD>
            </S.ContentHeader>

            <S.ContentForm>
              <Input placeholder='E-mail' label='E-mail' />

              <Input placeholder='******' label='Senha' />
            </S.ContentForm>

            <S.Button>
                <LG 
                  weight={700} 
                  color={theme.colors.branco.principal} 
                  family={theme.fonts.inter}>
                    Entrar
                </LG>
            </S.Button>

            <S.ContentFooter>
              <Link href="/jogador/recuperar-senha">
                <SM color={theme.colors.branco.principal} family={theme.fonts.inter}>
                  Esqueceu sua senha?
                </SM>
              </Link>

              <Link href="/jogador/cadastro">
                <SM color={theme.colors.branco.principal} family={theme.fonts.inter}>
                  Cadastre-se
                </SM>
              </Link>
            </S.ContentFooter>
          </S.Content>
        </LoginWithBannerAndModal>
      </S.Wrapper>
    </S.Container>
  );
}
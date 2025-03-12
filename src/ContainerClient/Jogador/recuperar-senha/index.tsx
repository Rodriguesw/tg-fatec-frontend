"use client";

import Link from 'next/link';

import { LoginWithBannerAndModal } from '@/components/LoginWithBannerAndModal';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { H3, LG, MD, SM } from '@/styles/typographStyles';
import { TitleWithButtonBack } from '@/components/TitleWithButtonBack';
import { Input } from '@/components/Input';

export default function JogadorRecuperarSenha() {
  return (
    <S.Container>
      <S.Wrapper>
        <LoginWithBannerAndModal minHeight="560px" backgroundImage='/images/jpg/bk-login-jogador.jpg'>
         <S.Content>
            <S.ContentHeader>
              <TitleWithButtonBack title='Recuperar senha' />

              <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                Login:
              </MD>
            </S.ContentHeader>

            <S.ContentForm>
              <Input placeholder='E-mail' label='E-mail' />
            </S.ContentForm>

            <S.Button>
                <LG color={theme.colors.branco.principal} family={theme.fonts.inter}>Enviar</LG>
            </S.Button>

            <S.ContentFooter>
              <Link href="/jogador/login">
                <SM color={theme.colors.branco.principal} family={theme.fonts.inter}>
                  Login
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
"use client"

import Link from 'next/link';

import { Input } from '@/components/Input';
import { TitleWithButtonBack } from '@/components/TitleWithButtonBack';
import { LoginWithBannerAndModal } from '@/components/LoginWithBannerAndModal';


import * as S from './styles';
import { theme } from '@/styles/theme';
import { H3, LG, MD, SM } from '@/styles/typographStyles';
import { useEffect, useState } from 'react';

export default function ProprietarioRecuperarSenha() {
  const [isMounted, setIsMounted] = useState(false);
        
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = () => {
    window.history.back();
  }

  if (!isMounted) return null;
  return (
    <S.Container>
      <S.Wrapper>
        <LoginWithBannerAndModal minHeight="560px" backgroundImage='/images/jpg/bk-login-proprietario.jpg'>
          <S.Content>
            <S.ContentHeader>
              <TitleWithButtonBack title='Recuperar senha' buttonBack={true} onClick={handleClick}/>

              <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
              Recuperar senha
              </MD>
            </S.ContentHeader>

            <S.ContentForm>
              <Input placeholder='E-mail' label='E-mail' />
            </S.ContentForm>

            <S.Button>
                <LG 
                  weight={700} 
                  color={theme.colors.branco.principal} 
                  family={theme.fonts.inter}>
                    Enviar
                </LG>
            </S.Button>

            <S.ContentFooter>
              <Link href="/proprietario/login">
                <SM color={theme.colors.branco.principal} family={theme.fonts.inter}>
                  Login
                </SM>
              </Link>

              <Link href="/proprietario/cadastro">
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

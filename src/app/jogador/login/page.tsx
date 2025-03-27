"use client";

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/Input';
import { TitleWithButtonBack } from '@/components/TitleWithButtonBack';
import { LoginWithBannerAndModal } from '@/components/LoginWithBannerAndModal';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { MD, LG, SM } from '@/styles/typographStyles';

export default function JogadorLogin() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = () => {
    router.push('/');
  };

  const teste = async () => {
    const response = await fetch('https://tg-fatec-backend.vercel.app/example');
    console.log(response);
  };

  useEffect(() => {
    teste()
  }, []);

  if (!isMounted) return null; 

  return (
    <S.Container>
      <S.Wrapper>
        <LoginWithBannerAndModal minHeight="560px" backgroundImage="/images/jpg/bk-login-jogador.jpg">
          <S.Content>
            <S.ContentHeader>
              <TitleWithButtonBack title="Jogador" buttonBack={true} onClick={handleClick} />

              <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                Login:
              </MD>
            </S.ContentHeader>

            <S.ContentForm>
              <Input placeholder="E-mail" label="E-mail" />
              <Input placeholder="******" label="Senha" />
            </S.ContentForm>

            <S.Button onClick={() => router.push('/jogador/home')}>
              <LG weight={700} color={theme.colors.branco.principal} family={theme.fonts.inter}>
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

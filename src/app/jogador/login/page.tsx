"use client";

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Spinner } from "@chakra-ui/react"

import { Input } from '@/components/Input';
import { TitleWithButtonBack } from '@/components/TitleWithButtonBack';
import { LoginWithBannerAndModal } from '@/components/LoginWithBannerAndModal';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { MD, LG, SM } from '@/styles/typographStyles';

import { showToast } from '@/components/ToastAlert';

export default function JogadorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = () => {
    router.push('/');
  };

  const handleLogin = async () => {
    setIsLoading(true);
    
    try {
      if (!email.trim() || !password.trim()) {
        await new Promise(resolve => setTimeout(resolve, 500)); 

        showToast({
          type: 'error',
          message: 'Preencha todos os campos'
        });
        return;
      }
  
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      
      if (email.toLowerCase() === 'admin@admin.com' && password === 'admin') {
        router.push('/jogador/home');
      } else {
        showToast({
          type: 'error',
          message: 'Email ou senha inválidos'
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Ocorreu um erro durante o login'
      });
    } finally {
      setIsLoading(false); 
    }
  };

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

            <S.ContentForm as="form">
              <Input type="text" placeholder="E-mail" label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
              
              <Input type="password" placeholder="******" label="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
            </S.ContentForm>

            <S.Button type="submit" onClick={handleLogin}>
              <LG weight={700} color={theme.colors.branco.principal} family={theme.fonts.inter}>
                {isLoading ? <Spinner /> : 'Entrar'}
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

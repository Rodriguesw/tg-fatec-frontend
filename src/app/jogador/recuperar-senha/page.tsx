"use client"

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Spinner } from "@chakra-ui/react"

import { Input } from '@/components/Input';
import { showToast } from '@/components/ToastAlert';
import { TitleWithButtonBack } from '@/components/TitleWithButtonBack';
import { LoginWithBannerAndModal } from '@/components/LoginWithBannerAndModal';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { LG, MD, SM } from '@/styles/typographStyles';

export default function JogadorRecuperarSenha() {
  const [emailRecover, setEmailRecover] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); 
  }, []);

  const handleClick = () => {
    window.history.back();
  };

  const handleRecover = async () => {
    setIsLoading(true);
    
    try {
      if (!emailRecover.trim()) {
        await new Promise(resolve => setTimeout(resolve, 500));

        showToast({
          type: 'error',
          message: 'Preencha o campo de e-mail'
        });
        return;
      }
      
      const payload = {
        email_recover: emailRecover.trim() 
      };

      await new Promise(resolve => setTimeout(resolve, 1000)); 
      
      if (emailRecover.toLowerCase() === 'admin@admin.com') {
        console.log("Payload:", payload); 

        showToast({
          type: 'success',
          message: 'E-mail de recuperação enviado com sucesso!'
        });

        setEmailRecover('');
      } else {
        showToast({
          type: 'error',
          message: 'Email de recuperação inválido'
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Ocorreu um erro ao enviar o e-mail de recuperação'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;
  
  return (
    <S.Container>
        <S.Wrapper>
          <LoginWithBannerAndModal minHeight="560px" backgroundImage='/images/jpg/bk-login-jogador.jpg'>
            <S.Content>
              <S.ContentHeader>
                <TitleWithButtonBack title='Recuperar senha' buttonBack={true} onClick={handleClick}  />
  
                <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                  Recuperar senha
                </MD>
              </S.ContentHeader>
  
              <S.ContentForm>
                <Input 
                  type="text" 
                  placeholder='E-mail' 
                  label='E-mail' 
                  value={emailRecover} 
                  onChange={setEmailRecover}
                />
              </S.ContentForm>
  
              <S.Button onClick={handleRecover}>
                  <LG 
                    weight={700} 
                    color={theme.colors.branco.principal} 
                    family={theme.fonts.inter}>
                      {isLoading ? <Spinner /> : 'Enviar'}
                  </LG>
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

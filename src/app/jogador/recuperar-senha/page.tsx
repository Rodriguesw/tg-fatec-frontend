"use client"

import Link from 'next/link';
import { useEffect, useState } from 'react';

import emailjs from '@emailjs/browser';

import { Spinner } from "@chakra-ui/react"

import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { showToast } from '@/components/ToastAlert';
import { TitleWithButtonBack } from '@/components/TitleWithButtonBack';
import { LoginWithBannerAndModal } from '@/components/LoginWithBannerAndModal';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { LG, MD, SM } from '@/styles/typographStyles';

export default function JogadorRecuperarSenha() {
  const [emailRecover, setEmailRecover] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(true);

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
  
      const templateParams = {
        title: "Códido de redefinição de senha",
        message: "Oi!",       
        email_to: emailRecover.trim() 
      };
  
      await emailjs.send(
        'service_yi6goia',   
        'template_r40brri',      
        templateParams,
        'Ur1rsXibVG5IklzEx'   
      );

      console.log("payload", templateParams)

      setIsOpenModal(true);

      showToast({
        type: 'success',
        message: 'Código de redefinição enviado com sucesso!'
      });
  
      setEmailRecover('');
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Erro ao enviar o código de redefinição'
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

        {isOpenModal && <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} />}
    </S.Container>
  );
}

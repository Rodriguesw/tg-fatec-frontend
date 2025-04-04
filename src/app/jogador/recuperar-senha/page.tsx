"use client"

import Link from 'next/link';
import { useEffect, useState } from 'react';

import emailjs from '@emailjs/browser';

import { Dialog,Button, PinInput, Spinner } from "@chakra-ui/react"


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
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  const [userCodeInput, setUserCodeInput] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState<string | null>(null); 

  const generateCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

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
  
      const code = generateCode(); // Gerar código aleatório
      setVerificationCode(code); // Armazenar o código no estado
  
      const templateParams = {
        title: "Código de redefinição de senha",
        code,  // Enviando o código gerado para o usuário
        email_to: emailRecover.trim()
      };
  
      await emailjs.send(
        'service_yi6goia',   
        'template_r40brri',      
        templateParams,
        'Ur1rsXibVG5IklzEx'   
      );
  
      console.log("Código gerado:", code); // Para debug
  
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

  const handleVerifyCode = (userInputArray: string[]) => {
    const userInput = userInputArray.join("");

    console.log("Valor inserido nos pins:", userInput);

    if (userInput === verificationCode) {
      showToast({
        type: 'success',
        message: 'Código válido! Você pode redefinir sua senha.'
      });
    } else {
      showToast({
        type: 'error',
        message: 'Código incorreto! Tente novamente.'
      });
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

        {isOpenModal && <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
            <Dialog.Header>
                <Dialog.Title textAlign="center">Digite seu código de recuperação</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
                <PinInput.Root 
                 value={userCodeInput}
                 onValueChange={(value) => setUserCodeInput(value.value)}
                >
                    <PinInput.HiddenInput />

                    <PinInput.Control display="flex" gap="8px" justifyContent="center">
                    <PinInput.Input index={0} />

                    <PinInput.Input index={1} />

                    <PinInput.Input index={2} />

                    <PinInput.Input index={3} />
                    </PinInput.Control>
                </PinInput.Root>
            </Dialog.Body>

            <Dialog.Footer justifyContent="center">
                <Dialog.ActionTrigger asChild>
                    <Button variant="outline" onClick={() => setIsOpenModal(false)} padding="16px">Cancelar</Button>
                </Dialog.ActionTrigger>

                <Button padding="16px" onClick={() => handleVerifyCode(userCodeInput)}>Enviar</Button>
            </Dialog.Footer>
        </Modal>}
    </S.Container>
  );
}

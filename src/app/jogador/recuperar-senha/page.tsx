"use client"

import Link from 'next/link';
import { useEffect, useState } from 'react';

import emailjs from '@emailjs/browser';

import { Dialog,Button, PinInput, Spinner } from "@chakra-ui/react"


import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { showToast } from '@/components/ToastAlert';
import { TitleWithButtons } from '@/components/TitleWithButtons';
import { LoginWithBannerAndModal } from '@/components/LoginWithBannerAndModal';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { LG, MD, SM } from '@/styles/typographStyles';

export default function JogadorRecuperarSenha() {
  const [emailRecover, setEmailRecover] = useState('');
  const [emailToRecover, setEmailToRecover] = useState('');
  const [errors, setErrors] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModalCode, setIsOpenModalCode] = useState(false);
  const [isLoadingVerifyCode, setIsLoadingVerifyCode] = useState(false);
  const [isOpenModalNewPassword, setIsOpenModalNewPassword] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

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
  
        setErrors(true);

        showToast({
          type: 'error',
          message: 'Preencha o campo de e-mail'
        });
        return;
      }

      const infoUser = localStorage.getItem("infoUser");
      const users = infoUser ? JSON.parse(infoUser) : [];
      
      const userExists = Object.values(users).some((user: any) => 
        user.email === emailRecover.trim()
      );

      if (!userExists) {
        setErrors(true);

        showToast({
          type: 'error',
          message: 'Esse e-mail não tem cadastro'
        });
        setIsLoading(false);
        return;
      }

      setEmailToRecover(emailRecover.trim());
  
      const code = generateCode();
      setVerificationCode(code);
  
      const templateParams = {
        title: "Código de redefinição de senha",
        code, 
        email_to: emailRecover.trim()
      };
  
      await emailjs.send(
        'service_yi6goia',   
        'template_r40brri',      
        templateParams,
        'Ur1rsXibVG5IklzEx'   
      );
  
      console.log("Código gerado:", code);
  
      setIsOpenModalCode(true);
  
      showToast({
        type: 'success',
        message: 'Código de redefinição enviado com sucesso!',
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

  const handleVerifyCode = async (userInputArray: string[]) => {
    setIsLoadingVerifyCode(true);

    const userInput = userInputArray.join("");

    console.log("Valor inserido nos pins:", userInput);

    if (userInput === verificationCode) {
      showToast({
        type: 'success',
        message: 'Código válido! Você pode redefinir sua senha.'
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));

      setIsLoadingVerifyCode(false);
      setIsOpenModalCode(false);
      setIsOpenModalNewPassword(true);

      setUserCodeInput([]);
    } else {
      showToast({
        type: 'error',
        message: 'Código incorreto! Tente novamente.'
      });

      setIsLoadingVerifyCode(false);
    }
  };

  const handleNewPassword = async () => {
    setIsLoading(true);

    try {
      if (!newPassword.trim()) {
        showToast({
          type: 'error',
          message: 'Preencha o campo de nova senha'
        });
        return;
      }

      if (newPassword !== confirmNewPassword) {
        showToast({
          type: 'error',
          message: 'As senhas não coincidem'
        }); 
        return;
      }

      const infoUser = localStorage.getItem("infoUser");
      const users = infoUser ? JSON.parse(infoUser) : [];

      const updatedUsers = Object.entries(users).reduce((acc: any, [key, user]: [string, any]) => {
        if (user.email === emailToRecover) {
          acc[key] = {
            ...user,
            password: newPassword
          };
        } else {
          acc[key] = user;
        }
        return acc;
      }, {});

      localStorage.setItem("infoUser", JSON.stringify(updatedUsers));
   
      showToast({
        type: 'success',
        message: 'Senha redefinida com sucesso'
      });

      setIsOpenModalNewPassword(false);

      window.location.href = '/jogador/login';
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Erro ao redefinir a senha'
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!isMounted) return null;
  
  return (
    <S.Container>
        <S.Wrapper>
          <LoginWithBannerAndModal minHeight="560px" backgroundImage='/images/jpg/bk-login-jogador.jpg'>
            <S.Content>
              <S.ContentHeader>
                <TitleWithButtons title='Recuperar senha' buttonBack={true} onClick={handleClick}  />
  
                <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                  Recuperar senha
                </MD>
              </S.ContentHeader>
  
              <S.ContentForm>
                <Input 
                  id="email"
                  type="text" 
                  placeholder='E-mail' 
                  label='E-mail' 
                  value={emailRecover} 
                  onChange={(value) => {
                    setEmailRecover(value);
                    setErrors(false);
                  }}
                  hasError={errors}
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

        {isOpenModalCode && 
          <Modal isOpen={isOpenModalCode} onClose={() => setIsOpenModalCode(false)}>
            <S.ContainerModalCode>
              <Dialog.Header>
                  <Dialog.Title textAlign="center">
                    <LG 
                    color={theme.colors.branco.principal} 
                    family={theme.fonts.inter}>
                      Digite seu código de recuperação
                    </LG>
                  </Dialog.Title>
              </Dialog.Header>

              <Dialog.Body>
                  <PinInput.Root 
                  value={userCodeInput}
                  onValueChange={(value) => setUserCodeInput(value.value)}
                  >
                      <PinInput.HiddenInput />

                      <PinInput.Control display="flex" gap="8px" justifyContent="center">
                        <PinInput.Input index={0} color={theme.colors.branco.principal}/>

                        <PinInput.Input index={1} color={theme.colors.branco.principal}/>

                        <PinInput.Input index={2} color={theme.colors.branco.principal}/>

                        <PinInput.Input index={3} color={theme.colors.branco.principal}/>
                      </PinInput.Control>
                  </PinInput.Root>
              </Dialog.Body>

              <Dialog.Footer justifyContent="center">
              <S.ContainerButtonModalCode>
                    <S.Button 
                    onClick={() => setIsOpenModalCode(false)} 
                    >
                      <MD 
                      color={theme.colors.branco.principal} 
                      family={theme.fonts.inter}>
                        Cancelar
                      </MD>
                    </S.Button> 

                    <S.Button onClick={() => handleVerifyCode(userCodeInput)}>
                      <MD 
                      color={theme.colors.branco.principal} 
                      family={theme.fonts.inter}>
                        {isLoadingVerifyCode ? <Spinner /> : 'Salvar'}
                    </MD>
                  </S.Button>
                </S.ContainerButtonModalCode>
              </Dialog.Footer>
          </S.ContainerModalCode>
          </Modal>}

        {isOpenModalNewPassword && 
          <Modal isOpen={isOpenModalNewPassword} onClose={() => setIsOpenModalNewPassword(false)}>
            <S.ContainerModalNewPassword>
              <Dialog.Header>
                  <Dialog.Title textAlign="center">
                    <LG 
                    color={theme.colors.branco.principal} 
                    family={theme.fonts.inter}>
                      Redefina sua senha
                      </LG>
                  </Dialog.Title>
              </Dialog.Header>
              
              <Dialog.Body 
                gap="16px"
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                flexDirection="column">
                  <Input 
                    id="password"
                    type="password" 
                    placeholder='Nova senha' 
                    label='Nova senha' 
                    value={newPassword} 
                    onChange={setNewPassword}
                  />

                  <Input 
                    id="confirmPassword"
                    type="password" 
                    placeholder='Confirmar senha' 
                    label='Confirmar senha' 
                    value={confirmNewPassword} 
                    onChange={setConfirmNewPassword}
                  />

                  <S.ContainerButtonModalNewPassword>
                    <S.Button 
                    onClick={() => setIsOpenModalNewPassword(false)} 
                    >
                      <MD 
                      color={theme.colors.branco.principal} 
                      family={theme.fonts.inter}>
                        Cancelar
                      </MD>
                    </S.Button> 

                    <S.Button onClick={handleNewPassword}>
                      <MD 
                      color={theme.colors.branco.principal} 
                      family={theme.fonts.inter}>
                        {isLoading ? <Spinner /> : 'Salvar'}
                    </MD>
                  </S.Button>
                </S.ContainerButtonModalNewPassword>
              </Dialog.Body>
            </S.ContainerModalNewPassword>
          </Modal>}
    </S.Container>
  );
}

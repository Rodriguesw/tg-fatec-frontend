"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Header } from '@/components/Header';
import { Navbar } from '@/components/Navbar';
import { Modal } from '@/components/Modal';

import { Dialog } from "@chakra-ui/react"

import * as S from './styles';
import { theme } from '@/styles/theme';
import { LG, MD, SM } from '@/styles/typographStyles';

export default function JogadorPerfil() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const [openSettings, setOpenSettings] = useState(false);

  useEffect(() => {
    setIsMounted(true); 
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    
    router.push('/jogador/login');
  }

  // const handleDeleteAccount = () => {
  //   const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  //   const userIdToDelete = currentUser.id;

  //   const infoUserRaw = localStorage.getItem('infoUser');

  //   console.log("infoUserRaw", infoUserRaw);

  //   // if (!infoUserRaw) return;

  //   // try {
  //   //   const infoUserParsed = JSON.parse(infoUserRaw);

  //   //   // Verifica se é um único objeto e se é o mesmo usuário
  //   //   if (infoUserParsed.id === userIdToDelete) {
  //   //     localStorage.removeItem('infoUser');
  //   //     localStorage.removeItem('currentUser');
  //   //     router.push('/jogador/login');
  //   //   } else {
  //   //     console.warn('O usuário logado não corresponde ao infoUser.');
  //   //   }
  //   // } catch (error) {
  //   //   console.error('Erro ao fazer parse de infoUser:', error);
  //   // }

  //   setOpenSettings(false);
  // };

  if (!isMounted) return null; 

  return (
    <S.Container>
      <S.Wrapper>
          <Header />

          <S.Content>
              <S.ContainerPhoto>
                <img src="/images/png/user-photo.png" alt="Foto do usuário"/>
              </S.ContainerPhoto>

              <S.ContainerButtons>
                <S.Button>
                  <LG  
                    color={theme.colors.branco.secundario} 
                    family={theme.fonts.inter}>
                    Meu cadastro
                  </LG>
                </S.Button>

                <S.Button onClick={() => setOpenSettings(true)}>
                  <LG  
                    color={theme.colors.branco.secundario} 
                    family={theme.fonts.inter}>
                    Segurança
                  </LG>
                </S.Button>
          
                <S.Button onClick={handleLogout}>
                  <LG  
                    color={theme.colors.branco.secundario} 
                    family={theme.fonts.inter}>
                    Sair
                  </LG>
                </S.Button>
              </S.ContainerButtons>
            </S.Content>          
            
          <Navbar />
      </S.Wrapper>

      {/* {openSettings && 
        <Modal isOpen={openSettings} onClose={() => setOpenSettings(false)}>
          <S.ContainerModalEdit>
            <Dialog.Header>
              <Dialog.Title textAlign="center">
                <LG color={theme.colors.branco.principal} family={theme.fonts.inter}>
                  Segurança
                </LG>
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body
              gap="16px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <SM
                family={theme.fonts.inter}
                color={theme.colors.branco.secundario}>
                Tem certeza de que deseja excluir sua conta?
              </SM>

              <S.ContainerButtonModalEdit>
                <S.ModalButton onClick={() => setOpenSettings(false)}>
                  <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                    Cancelar
                  </MD>
                </S.ModalButton>

                <S.ModalButton onClick={handleDeleteAccount}>
                  <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                    Confirmar
                  </MD>
                </S.ModalButton>
              </S.ContainerButtonModalEdit>
            </Dialog.Body>
          </S.ContainerModalEdit>
        </Modal>
      } */}
    </S.Container>
  );
}

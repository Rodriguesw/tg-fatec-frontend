"use client";

import { useEffect, useState } from 'react';

import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Navbar } from '@/components/Navbar';
import { TitleWithButtonBack } from '@/components/TitleWithButtonBack';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { MD, LG, SM } from '@/styles/typographStyles';
import { CardReserved } from '@/components/CardReserved';
import { Modal } from '@/components/Modal';

import { Dialog } from "@chakra-ui/react"

export default function JogadorReservas() {
  const [birthDate, setBirthDate] = useState('');
  const [errors, setErrors] = useState({ birthDate: false });
  const [selectedCourtId, setSelectedCourtId] = useState<number | null>(null);

  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  const [isOpenModalCancel, setIsOpenModalCancel] = useState(false);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Erro ao fazer parse do currentUser:', error);
        }
      }
    }
  }, []);

  if (!isMounted || !currentUser) return null;

  const hasEvents = currentUser.sports_courts?.length > 0;
  const selectedCourt = currentUser.sports_courts?.find(
    (court: any) => court.id === selectedCourtId
  );

  // const handleBirthDateChange = (value: string) => {
  //   setBirthDate(value);
  //   setErrors(prev => ({ ...prev, birthDate: false }));
  // };

  return (
    <S.Container>
      <S.Wrapper>
          <Header />

          <S.Content>
            <TitleWithButtonBack title='Minhas reservas' />

            {hasEvents ? (
              <CardReserved 
                onClickEdit={
                  (id) => {
                    setSelectedCourtId(id); 
                    setIsOpenModalEdit(true)
                  }} 
                onClickCancel={
                  (id) => {
                    setSelectedCourtId(id);
                    setIsOpenModalCancel(true)
                  }}/>
            ):(
              <S.NotFoundEvent>
                <img src="/images/svg/icon-not-found.svg" alt="Nenhuma reserva encontrada"/>

                <LG 
                  family={theme.fonts.inter}
                  color={theme.colors.branco.secundario}>
                  Você ainda não tem nenhuma reserva feita!
                </LG>
              </S.NotFoundEvent>
            )}
          </S.Content>          
            
          <Navbar />
      </S.Wrapper>

      {isOpenModalEdit && 
        <Modal isOpen={isOpenModalEdit} onClose={() => setIsOpenModalEdit(false)}>
          <S.ContainerModalEdit>
            <Dialog.Header>
              <Dialog.Title textAlign="center">
                <LG color={theme.colors.branco.principal} family={theme.fonts.inter}>
                  Editar
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
                Deseja solicitar a alteração da data da reserva da quadra {selectedCourt?.name}?
              </SM>

              <Input 
                id="birthDate"
                type='date' 
                placeholder='00/00/0000' 
                label='Data' 
                // onChange={handleBirthDateChange}
              />

              <S.ContainerButtonModalEdit>
                <S.Button onClick={() => setIsOpenModalEdit(false)}>
                  <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                    Cancelar
                  </MD>
                </S.Button>

                <S.Button>
                  <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                    Confirmar
                  </MD>
                </S.Button>
              </S.ContainerButtonModalEdit>
            </Dialog.Body>
          </S.ContainerModalEdit>
        </Modal>
      }

      {isOpenModalCancel && 
        <Modal isOpen={isOpenModalCancel} onClose={() => setIsOpenModalCancel(false)}>
          <S.ContainerModalEdit>
            <Dialog.Header>
                <Dialog.Title textAlign="center">
                  <LG 
                  color={theme.colors.branco.principal} 
                  family={theme.fonts.inter}>
                    Cancelar 
                    </LG>
                </Dialog.Title>
            </Dialog.Header>
            
            <Dialog.Body 
              gap="16px"
              display="flex" 
              justifyContent="center" 
              alignItems="center" 
              flexDirection="column">
                <S.ContainerButtonModalCancel>
                  <S.Button 
                    onClick={() => setIsOpenModalCancel(false)} 
                  >
                    <MD 
                    color={theme.colors.branco.principal} 
                    family={theme.fonts.inter}>
                      Cancelar
                    </MD>
                  </S.Button> 

                  <S.Button>
                    <MD 
                    color={theme.colors.branco.principal} 
                    family={theme.fonts.inter}>
                      Confirmar
                  </MD>
                </S.Button>
              </S.ContainerButtonModalCancel>
            </Dialog.Body>
          </S.ContainerModalEdit>
        </Modal>
      }
    </S.Container>
  );
}

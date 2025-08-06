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
import { it } from 'node:test';

interface ReservedSportLocation {
  id: number;
  name: string;
  address: {
    id: number;
    cep: string;
    number: string;
    city: string;
    neighborhood: string;
    state: string;
    street: string;
  };
  start_time: string;
  end_time: string;
  price: string;
  payment_method: string;
  reserved_date: string;
}

export default function JogadorReservas() {
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

  const hasEvents = currentUser.reserved_sports_location?.length > 0;
  const selectedCourt = currentUser.reserved_sports_location?.find(
    (court: any) => court.id === selectedCourtId
  );

  console.log("currentUser",currentUser)

  return (
    <S.Container>
      <S.Wrapper>
          <Header />

          <S.Content>
            <TitleWithButtonBack title='Minhas reservas' />

            <S.ContainerCard>
              {hasEvents ? (
                currentUser?.reserved_sports_location?.map((item: ReservedSportLocation) => (
                  <CardReserved
                    key={item.id}
                    id={item.id} 
                    name={item.name}
                    address={item.address}
                    start_time={item.start_time}
                    end_time={item.end_time}
                    price={item.price}
                    reserved_date={item.reserved_date}
                    payment_method={item.payment_method}
                    onClickEdit={(id) => {
                      setSelectedCourtId(id); 
                      setIsOpenModalEdit(true);
                    }}
                    onClickCancel={(id) => {
                      setSelectedCourtId(id);
                      setIsOpenModalCancel(true);
                    }}
                  />
                ))
                
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
              </S.ContainerCard>
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
                Deseja solicitar a alteração da data da reserva {selectedCourt?.name}?
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
              flexDirection="column"
              >
                <SM
                  family={theme.fonts.inter}
                  color={theme.colors.branco.secundario}>
                  Deseja realmente cancelar a reserva {selectedCourt?.name}?
                </SM>

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
                    family={theme.fonts.inter}
                    onClick={() => {
                      if (selectedCourtId !== null) {
                        const updatedReservations = currentUser.reserved_sports_location.filter(
                          (item: ReservedSportLocation) => item.id !== selectedCourtId
                        );

                        const updatedUser = {
                          ...currentUser,
                          reserved_sports_location: updatedReservations,
                        };

                        setCurrentUser(updatedUser);
                        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                      }

                      setIsOpenModalCancel(false);
                    }}
                    >
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

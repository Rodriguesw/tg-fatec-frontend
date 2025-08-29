"use client";

import { useEffect, useState } from 'react';

import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Navbar } from '@/components/Navbar';
import { TitleWithButtons } from '@/components/TitleWithButtons';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { MD, LG, SM } from '@/styles/typographStyles';
import { CardReserved } from '@/components/CardReserved';
import { Modal } from '@/components/Modal';

import { Dialog, Button } from "@chakra-ui/react"
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
  time_start: string;
  time_end: string;
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
  const [isModalCancelamentoProprietario, setIsModalCancelamentoProprietario] = useState(false);
  const [reservaCancelada, setReservaCancelada] = useState<any>(null);

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

  // Função para verificar se alguma reserva foi cancelada pelo proprietário
  const verificarCancelamentoProprietario = () => {
    if (!currentUser || !currentUser.id) return;
    
    try {
      // Buscar as informações do usuário no localStorage infoUser
      const infoUserRaw = localStorage.getItem('infoUser');
      if (!infoUserRaw) return;
      
      const infoUser = JSON.parse(infoUserRaw);
      const userId = currentUser.id;
      
      // Verificar se o usuário existe no infoUser
      if (!infoUser[userId]) return;
      
      // Comparar as reservas do infoUser com as reservas do currentUser
      const reservasInfoUser = infoUser[userId].reserved_sports_location || [];
      const reservasCurrentUser = currentUser.reserved_sports_location || [];
      
      // Se o usuário tem menos reservas no currentUser do que no infoUser,
      // significa que alguma reserva foi cancelada pelo proprietário
      if (reservasCurrentUser.length < reservasInfoUser.length) {
        // Encontrar qual reserva foi cancelada
        const reservasCanceladas = reservasInfoUser.filter(reservaInfo => 
          !reservasCurrentUser.some((reservaCurrent: any) => reservaCurrent.id === reservaInfo.id)
        );
        
        if (reservasCanceladas.length > 0) {
          // Pegar a primeira reserva cancelada encontrada
          const reservaCancelada = reservasCanceladas[0];
          
          // Atualizar o estado para mostrar o modal
          setReservaCancelada(reservaCancelada);
          setIsModalCancelamentoProprietario(true);
          
          // Atualizar o infoUser para remover a reserva cancelada
          infoUser[userId].reserved_sports_location = reservasCurrentUser;
          localStorage.setItem('infoUser', JSON.stringify(infoUser));
        }
      }
    } catch (error) {
      console.error('Erro ao verificar cancelamento pelo proprietário:', error);
    }
  };
  
  // Verificar cancelamentos quando o componente montar e o currentUser estiver disponível
  useEffect(() => {
    if (currentUser) {
      verificarCancelamentoProprietario();
    }
  }, [currentUser]);

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
            <TitleWithButtons title='Minhas reservas' />

            <S.ContainerCard>
              {hasEvents ? (
                currentUser?.reserved_sports_location?.map((item: ReservedSportLocation) => (
                  <CardReserved
                    key={item.id}
                    id={item.id} 
                    name={item.name}
                    address={item.address}
                    time_start={item.time_start}
                    time_end={item.time_end}
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

      {/* {isOpenModalEdit && 
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
      } */}

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
                        // Atualizar o currentUser removendo a reserva
                        const updatedReservations = currentUser.reserved_sports_location.filter(
                          (item: ReservedSportLocation) => item.id !== selectedCourtId
                        );

                        const updatedUser = {
                          ...currentUser,
                          reserved_sports_location: updatedReservations,
                        };

                        setCurrentUser(updatedUser);
                        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                        
                        // Remover a reserva do localStorage "infoUserProprietario"
                        try {
                          const infoUserProprietarioRaw = localStorage.getItem('infoUserProprietario');
                          if (infoUserProprietarioRaw) {
                            const infoUserProprietario = JSON.parse(infoUserProprietarioRaw);
                            
                            // Encontrar o proprietário que possui a quadra com o ID selecionado
                            const selectedCourt = currentUser.reserved_sports_location.find(
                              (court: any) => court.id === selectedCourtId
                            );
                            
                            if (selectedCourt && infoUserProprietario) {
                              // infoUserProprietario é um objeto com chaves que são IDs de proprietários
                              Object.keys(infoUserProprietario).forEach(proprietarioId => {
                                const proprietario = infoUserProprietario[proprietarioId];
                                
                                // Verificar se o proprietário tem a quadra com o mesmo nome e endereço
                                if (proprietario.my_sports_location) {
                                  const hasMatchingLocation = proprietario.my_sports_location.some((location: any) => 
                                    location.name === selectedCourt.name && 
                                    location.address?.cep === selectedCourt.address.cep && 
                                    location.address?.number === selectedCourt.address.number
                                  );
                                  
                                  // Se encontrou a quadra correspondente, remover a reserva
                                  if (hasMatchingLocation && proprietario.reservations) {
                                    proprietario.reservations = proprietario.reservations.filter(
                                      (reservation: any) => reservation.id !== selectedCourtId
                                    );
                                  }
                                }
                              });
                              
                              // Salvar as alterações de volta no localStorage
                              localStorage.setItem('infoUserProprietario', JSON.stringify(infoUserProprietario));
                            }
                          }
                        } catch (error) {
                          console.error('Erro ao atualizar infoUserProprietario:', error);
                        }
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

      {/* Modal de alerta de cancelamento pelo proprietário */}
      {isModalCancelamentoProprietario && reservaCancelada && (
        <Modal isOpen={isModalCancelamentoProprietario} onClose={() => setIsModalCancelamentoProprietario(false)}>
          <S.ContainerModalEdit>
            <Dialog.Header>
              <Dialog.Title textAlign="center">
                <LG color={theme.colors.branco.principal} family={theme.fonts.inter}>
                  Reserva Cancelada
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
                color={theme.colors.branco.secundario}
              >
                O proprietário cancelou a sua reserva {reservaCancelada.name} do dia {reservaCancelada.reserved_date} e horário {reservaCancelada.time_start} às {reservaCancelada.time_end}.
              </SM>

              <S.ContainerButtonModalCancel>
                <S.Button
                  onClick={() => setIsModalCancelamentoProprietario(false)}
                >
                  <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                    Entendi
                  </MD>
                </S.Button>
              </S.ContainerButtonModalCancel>
            </Dialog.Body>
          </S.ContainerModalEdit>
        </Modal>
      )}
    </S.Container>
  );
}

"use client";

import { useEffect, useState } from 'react';

import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Navbar } from '@/components/Navbar';
import { PageModal } from '@/components/PageModal';
import { Modal } from '@/components/Modal';
import { CardReserved, isPastReservation } from '@/components/CardReserved';
import { TitleWithButtons } from '@/components/TitleWithButtons';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { MD, LG, SM, H3 } from '@/styles/typographStyles';

import { Dialog, Button, Spinner } from "@chakra-ui/react"

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

  interface CurrentUser {
    id: string;
    reserved_sports_location?: (ReservedSportLocation & { status?: string; view?: boolean })[];
    [key: string]: any;
  }

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isModalCancelamentoProprietario, setIsModalCancelamentoProprietario] = useState(false);
  const [reservaCancelada, setReservaCancelada] = useState<ReservedSportLocation & { status?: string; view?: boolean } | null>(null);

  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  // Reinicia o loading da página e recarrega as reservas do localStorage
  const refreshReservationsWithLoading = () => {
    setIsLoadingContent(true);
    setTimeout(() => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Erro ao recarregar currentUser:', error);
      } finally {
        setIsLoadingContent(false);
      }
    }, 1000);
  };

  // Cancela a reserva selecionada e sincroniza o estado/localStorage
  const handleCancelReservation = async () => {
    setIsLoadingDelete(true);

    await new Promise(resolve => setTimeout(resolve, 1250));
    // Garantir que exista usuário atual e um ID de quadra selecionado
    if (selectedCourtId === null || !currentUser) {
      setIsOpenModalCancel(false);
      return;
    }

    // Atualizar o currentUser marcando o status da reserva como "cancelado-jogador"
    const updatedReservations = currentUser.reserved_sports_location?.map(
      (item: ReservedSportLocation & { status?: string }) =>
        item.id === selectedCourtId ? { ...item, status: 'cancelado-jogador' } : item
    ) || [];

    // Atualiza estado de forma type-safe sem invalidar a propriedade obrigatória `id`
    setCurrentUser(prev => prev ? ({
      ...prev,
      reserved_sports_location: updatedReservations,
    }) : prev);

    // Persiste no localStorage com objeto concreto do usuário (com status atualizado)
    const newUser = {
      ...currentUser,
      reserved_sports_location: updatedReservations,
    } as CurrentUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    // Atualizar também o localStorage "infoUser" do respectivo usuário
    try {
      const infoUserRaw = localStorage.getItem('infoUser');
      if (infoUserRaw && currentUser?.id) {
        const infoUser = JSON.parse(infoUserRaw);
        const existingUser = infoUser[currentUser.id];

        if (existingUser) {
          const updatedInfoUserReservas = (existingUser.reserved_sports_location || []).map(
            (reserva: ReservedSportLocation & { status?: string; view?: boolean }) =>
              reserva.id === selectedCourtId ? { ...reserva, status: 'cancelado-jogador' } : reserva
          );

          infoUser[currentUser.id] = {
            ...existingUser,
            reserved_sports_location: updatedInfoUserReservas,
          };

          localStorage.setItem('infoUser', JSON.stringify(infoUser));
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar infoUser:', error);
    }

      // Remover a reserva do localStorage "infoUserProprietario"
      try {
        const infoUserProprietarioRaw = localStorage.getItem('infoUserProprietario');
        if (infoUserProprietarioRaw) {
          const infoUserProprietario = JSON.parse(infoUserProprietarioRaw);

          // Encontrar o proprietário que possui a quadra com o ID selecionado
          const selectedCourt = currentUser?.reserved_sports_location?.find(
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
                  proprietario.reservations = proprietario.reservations.map(
                    (reservation: any) =>
                      reservation.id === selectedCourtId
                        ? { ...reservation, status: 'cancelado-jogador' }
                        : reservation
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
      } finally {
        setIsOpenModalCancel(false);
        setIsLoadingDelete(false);
        // Simula um GET e reinicia o loading da tela de reservas
        refreshReservationsWithLoading();
      }
    }


  useEffect(() => {
    setIsMounted(true);

    if (typeof window !== 'undefined') {
      setIsLoadingContent(true);
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Erro ao fazer parse do currentUser:', error);
        }
      }
    }

    setTimeout(() => {
      setIsLoadingContent(false);
    }, 1000);
  }, []);

  // Função para verificar se alguma reserva foi cancelada pelo proprietário
  const verificarCancelamentoProprietario = () => {
    if (!currentUser || !currentUser.id) return;
    
    try {
      // Verificar diretamente no currentUser se há reservas canceladas sem a propriedade view
      const reservasCurrentUser = currentUser.reserved_sports_location || [];
      
      // Encontrar reservas com status "cancelado" ou "excluido" e sem a propriedade "view"
      const reservasCanceladas = reservasCurrentUser.filter((reserva: ReservedSportLocation & { status?: string; view?: boolean }) => 
        (reserva.status === "cancelado" || reserva.status === "excluido") && reserva.view !== true
      );
      
      if (reservasCanceladas.length > 0) {
        // Pegar a primeira reserva cancelada encontrada
        const reservaCancelada = reservasCanceladas[0];
        
        // Atualizar o estado para mostrar o modal
        setReservaCancelada(reservaCancelada);
        setIsModalCancelamentoProprietario(true);
      }
    } catch (error) {
      console.error('Erro ao verificar cancelamento pelo proprietário:', error);
    }
  };
  
  // Verificar cancelamentos quando o componente montar e quando currentUser mudar
  useEffect(() => {
    let isMounted = true;
    
    if (currentUser && isMounted) {
      verificarCancelamentoProprietario();
    }
    
    return () => {
      isMounted = false;
    };
  }, [currentUser]);  // Adicionada a dependência de currentUser para verificar cancelamentos quando o usuário mudar

  if (!isMounted || !currentUser) return null;

  // Verificar se há eventos com status "ativo"
  const hasEvents = (currentUser?.reserved_sports_location?.filter((item: ReservedSportLocation & { status?: string; view?: boolean }) => 
    item.status === "ativo"
  ) || [])?.length > 0;
  
  const selectedCourt = currentUser?.reserved_sports_location?.find(
    (court: ReservedSportLocation & { status?: string; view?: boolean }) => court.id === selectedCourtId && 
    court.status === "ativo"
  );

  // Função para verificar se uma reserva já passou com base na hora atual
  const isReservationPassed = (reservedDate: string, timeEnd: string): boolean => {
    const now = new Date();
    const [day, month, year] = reservedDate.split('/').map(Number);
    const [hours, minutes] = timeEnd.split(':').map(Number);
    
    const reservationEndTime = new Date(year, month - 1, day, hours, minutes);
    
    return now > reservationEndTime;
  };

  // Adicionar propriedade rating para reservas passadas
  const reservationsWithRating = [...(currentUser?.reserved_sports_location || [])].map(item => {
    if (isPastReservation(item.reserved_date) && item.status !== "cancelado" && item.status !== "excluido") {
      return { ...item, rating: "em-avaliacao" };
    }
    return item;
  });

  // Ordenar as reservas do mais próximo para o mais distante
  // Se o dia for igual, ordenar pelo horário de início
  const sortedReservations = [...reservationsWithRating]
    .filter((item: ReservedSportLocation & { status?: string; view?: boolean; rating?: string }) => 
      item.status === "ativo" &&
      // Não exibir reservas que já passaram no dia atual
      !isReservationPassed(item.reserved_date, item.time_end)
    )
    .sort((a, b) => {
      // Converter as datas para objetos Date para comparação
      const dateA = new Date(a.reserved_date.split('/').reverse().join('-'));
      const dateB = new Date(b.reserved_date.split('/').reverse().join('-'));
      
      // Comparar as datas
      const dateComparison = dateA.getTime() - dateB.getTime();
      
      // Se as datas forem iguais, comparar os horários de início
      if (dateComparison === 0) {
        // Converter os horários para minutos para facilitar a comparação
        const [hoursA, minutesA] = a.time_start.split(':').map(Number);
        const [hoursB, minutesB] = b.time_start.split(':').map(Number);
        
        const timeA = hoursA * 60 + minutesA;
        const timeB = hoursB * 60 + minutesB;
        
        return timeA - timeB;
      }

      return dateComparison;
    });

  //consoles para ver as reservas com a propriedade rating
  console.log("sortedReservations", sortedReservations);

  console.log("hasEvents", hasEvents);

  return (
    <S.Container>
      <S.Wrapper>
          <Header />

          <S.Content>
            <TitleWithButtons title='Minhas reservas' />

            <S.ContainerCard>
              {isLoadingContent ? (
              <S.LoadingContainer>
                <Spinner 
                  size="xl" 
                  color={theme.colors.branco.principal}
                />
              </S.LoadingContainer>
              ) : hasEvents && sortedReservations.length !== 0 ? (
                sortedReservations.map((item: ReservedSportLocation & { status?: string; view?: boolean }) => (
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
                <H3 color={theme.colors.laranja}>
                  Cancelar 
                </H3>
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
                    onClick={handleCancelReservation}
                    >
                      {isLoadingDelete ? (
                        <Spinner 
                          size="md" 
                          color={theme.colors.branco.principal}
                        />
                      ) : (
                        "Confirmar"
                      )}
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
                <H3 color={theme.colors.laranja}>
                  {reservaCancelada.status === "excluido" ? "Local Excluído" : "Reserva Cancelada"}
                </H3>
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
                {reservaCancelada.status === "excluido" 
                  ? `O proprietário deletou o cadastro do local ${reservaCancelada.name}, sua reserva do dia ${reservaCancelada.reserved_date} e horário ${reservaCancelada.time_start} às ${reservaCancelada.time_end} foi cancelada.`
                  : `O proprietário cancelou a sua reserva ${reservaCancelada.name} do dia ${reservaCancelada.reserved_date} e horário ${reservaCancelada.time_start} às ${reservaCancelada.time_end}.`
                }
              </SM>

              <S.ContainerButtonModalCancel>
                <S.Button
                  onClick={() => {
                    // Marcar a reserva como visualizada
                    try {
                      if (currentUser && reservaCancelada) {
                        // Atualizar a propriedade view da reserva cancelada no currentUser
                        const updatedReservas = currentUser.reserved_sports_location?.map((reserva: ReservedSportLocation & { status?: string; view?: boolean }) => {
                          if (reserva.id === reservaCancelada.id) {
                            return { ...reserva, view: true };
                          }
                          return reserva;
                        }) || [];
                        
                        const updatedCurrentUser = {
                          ...currentUser,
                          reserved_sports_location: updatedReservas
                        };
                        
                        // Atualizar o localStorage currentUser
                        localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
                        
                        // Atualizar também no localStorage infoUser
                        try {
                          const infoUserRaw = localStorage.getItem('infoUser');
                          if (infoUserRaw) {
                            const infoUser = JSON.parse(infoUserRaw);
                            
                            // Verificar se o usuário existe no infoUser
                            if (infoUser[currentUser.id]) {
                              // Atualizar a propriedade view da reserva cancelada no infoUser
                              const updatedInfoUserReservas = infoUser[currentUser.id].reserved_sports_location?.map(
                                (reserva: ReservedSportLocation & { status?: string; view?: boolean }) => {
                                  if (reserva.id === reservaCancelada.id) {
                                    return { ...reserva, view: true };
                                  }
                                  return reserva;
                                }
                              ) || [];
                              
                              // Atualizar o objeto infoUser
                              infoUser[currentUser.id] = {
                                ...infoUser[currentUser.id],
                                reserved_sports_location: updatedInfoUserReservas
                              };
                              
                              // Salvar de volta no localStorage
                              localStorage.setItem('infoUser', JSON.stringify(infoUser));
                            }
                          }
                        } catch (infoUserError) {
                          console.error('Erro ao atualizar infoUser:', infoUserError);
                        }
                        
                        // Usar setTimeout para adiar a atualização do estado
                        // Isso quebra o ciclo de renderização atual
                        setTimeout(() => {
                          setCurrentUser(updatedCurrentUser);
                        }, 0);
                      }
                    } catch (error) {
                      console.error('Erro ao atualizar propriedade view da reserva:', error);
                    }
                    
                    setIsModalCancelamentoProprietario(false);
                  }}
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

      <PageModal openDelay={50} visibleDuration={100}/>
    </S.Container>
  );
}

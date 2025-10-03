"use client";

import { useEffect, useState } from 'react';

import { Header } from '@/components/Header';
import { Navbar } from '@/components/Navbar';
import { Modal } from '@/components/Modal';
import { Dialog, Spinner } from '@chakra-ui/react';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { H3, LG, MD, SM } from '@/styles/typographStyles';
import { TitleWithButtons } from '@/components/TitleWithButtons';
import { CardReservedProperty } from '@/components/CardReservedProperty';
import { showToast } from '@/components/ToastAlert';

export default function ProprietarioReservados() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentUserProprietario, setCurrentUserProprietario] = useState<any>(null);

  const [openSettings, setOpenSettings] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<number | null>(null);

  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  useEffect(() => {
    setIsMounted(true); 
  }, []);

  useEffect(() => {
    setIsLoadingContent(true);
    const storedSport = localStorage.getItem('currentUserProprietario');

    if (storedSport) {
      const parsedUser = JSON.parse(storedSport);
      setCurrentUserProprietario(parsedUser);
    } 
    
    // Simula um tempo de carregamento para melhor experiência do usuário
    setTimeout(() => {
      setIsLoadingContent(false);
    }, 1000);
  }, []);

  const handleCancelReservation = async () => {
    setIsLoadingDelete(true);
    if (reservationToDelete === null || !currentUserProprietario) return;

    // Encontrar a reserva que será cancelada para obter o user_id
    const reservationToCancel = currentUserProprietario.reservations?.find(
      (res: any) => res.id === reservationToDelete
    );

    if (!reservationToCancel) return;

    await new Promise(resolve => setTimeout(resolve, 1750));
    // === 1. Atualizar currentUserProprietario ===
    // Atualizar o status da reserva para cancelado em vez de removê-la
    const updatedReservations = (currentUserProprietario.reservations ?? []).map(
      (res: any) => res.id === reservationToDelete ? { ...res, status: "cancelado" } : res
    );

    const updatedCurrentUser = {
      ...currentUserProprietario,
      reservations: updatedReservations,
    };

    // salva no localStorage
    localStorage.setItem("currentUserProprietario", JSON.stringify(updatedCurrentUser));
    setCurrentUserProprietario(updatedCurrentUser);

    // === 2. Atualizar infoUserProprietario ===
    const infoUserProprietario = JSON.parse(localStorage.getItem("infoUserProprietario") || "{}");

    if (infoUserProprietario[currentUserProprietario.id]) {
      // Atualizar o status da reserva para cancelado em vez de removê-la
      const updatedReservationsInfo = (infoUserProprietario[currentUserProprietario.id].reservations ?? []).map(
        (res: any) => res.id === reservationToDelete ? { ...res, status: "cancelado" } : res
      );

      const updatedInfoUser = {
        ...infoUserProprietario,
        [currentUserProprietario.id]: {
          ...infoUserProprietario[currentUserProprietario.id],
          reservations: updatedReservationsInfo,
        },
      };

      localStorage.setItem("infoUserProprietario", JSON.stringify(updatedInfoUser));
    }

    // === 3. Atualizar infoUser (atualizar o status da reserva do jogador) ===
    if (reservationToCancel.user_id) {
      const infoUser = JSON.parse(localStorage.getItem("infoUser") || "{}");
      const userId = reservationToCancel.user_id;
      
      if (infoUser[userId]) {
        // Atualizar o status da reserva para cancelado em vez de removê-la
        const updatedUserReservations = (infoUser[userId].reserved_sports_location ?? []).map(
          (loc: any) => loc.id === reservationToDelete ? { ...loc, status: "cancelado" } : loc
        );

        const updatedInfoUser = {
          ...infoUser,
          [userId]: {
            ...infoUser[userId],
            reserved_sports_location: updatedUserReservations
          }
        };

        // Remover o flag de modal já mostrado para que o modal seja exibido novamente
        localStorage.removeItem("modalCancelamentoMostrado");
        localStorage.setItem("infoUser", JSON.stringify(updatedInfoUser));
      }
    }

    showToast({
      type: 'success',
      message: 'Reserva cancelada com sucesso'
    });

    // === 4. Simular uma chamada GET para atualizar a lista ===
    setIsLoadingContent(true); // Ativa o loading da lista
    
    // Simula o tempo de uma requisição
    setTimeout(() => {
      // Aqui seria o lugar para fazer uma chamada GET real para atualizar os dados
      // Como estamos usando localStorage, os dados já foram atualizados acima
      
      // Desativa o loading após "receber" os dados
      setIsLoadingContent(false);
    }, 1000);

    // === 5. Resetar estados ===
    setIsLoadingDelete(false);
    setOpenSettings(false);
    setReservationToDelete(null);
  };

  if (!isMounted) return null; 

  return (
    <S.Container>
      <S.Wrapper>
        <Header />

        <S.Content>
          <TitleWithButtons title='Reservados'/>


          <S.ContainerCards>
            {isLoadingContent ? (
              <S.LoadingContainer>
                <Spinner 
                  size="xl" 
                  color={theme.colors.branco.principal}
                />
              </S.LoadingContainer>
            ) : currentUserProprietario?.reservations?.filter((order: any) => order.status === "ativo")?.length > 0 ? (
              currentUserProprietario.reservations
                .filter((order: any) => order.status === "ativo")
                .sort((a: any, b: any) => {
                  // Converter datas para formato comparável (assumindo formato DD/MM/YYYY)
                  const dateA = a.reserved_date.split('/').reverse().join('-');
                  const dateB = b.reserved_date.split('/').reverse().join('-');
                  
                  // Comparar datas
                  if (dateA !== dateB) {
                    return new Date(dateA).getTime() - new Date(dateB).getTime();
                  }
                  
                  // Se as datas forem iguais, comparar horários de início
                  return a.time_start.localeCompare(b.time_start);
                })
                .map((order: any) => (
                  <CardReservedProperty 
                    key={order.id} 
                    order={order}
                    onDelete={(id) => {
                      setReservationToDelete(id);
                      setOpenSettings(true);
                    }}
                  />
              ))
            ) : (
              <S.NotFoundEvent>
                <img src="/images/svg/icon-calendar-event.svg" alt="Nenhuma reserva encontrada"/>

                <LG 
                  family={theme.fonts.inter}
                  color={theme.colors.branco.secundario}>
                  Você não tem reservas para os próximos dias.
                </LG>
              </S.NotFoundEvent>
            )}
          </S.ContainerCards>
        </S.Content>           

        <Navbar />
      </S.Wrapper>

      {openSettings && (
        <Modal isOpen={openSettings} onClose={() => setOpenSettings(false)}>
          <S.ContainerModalEdit>
            <Dialog.Header>
                <H3 color={theme.colors.laranja}>
                  Excluir reserva
                </H3>
            </Dialog.Header>

            <Dialog.Body
              gap="16px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <SM color={theme.colors.branco.secundario} family={theme.fonts.inter}>
                Tem certeza de que deseja excluir esta reserva?
              </SM>

              <S.ContainerButtonModalSettings>
                <S.ModalButton onClick={() => setOpenSettings(false)}>
                  <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                    Cancelar
                  </MD>
                </S.ModalButton>

                <S.ModalButton onClick={handleCancelReservation}>
                  {isLoadingDelete ? (
                    <Spinner />
                  ) : (
                    <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                      Confirmar
                    </MD>
                  )}
                </S.ModalButton>
              </S.ContainerButtonModalSettings>
            </Dialog.Body>
          </S.ContainerModalEdit>
        </Modal>
      )}
    </S.Container>
  );
}

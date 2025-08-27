"use client";

import { useEffect, useState } from 'react';

import { Header } from '@/components/Header';
import { Navbar } from '@/components/Navbar';
import { Modal } from '@/components/Modal';
import { Dialog } from '@chakra-ui/react';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { LG, MD } from '@/styles/typographStyles';
import { TitleWithButtons } from '@/components/TitleWithButtons';
import { CardReservedProperty } from '@/components/CardReservedProperty';

export default function ProprietarioReservados() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentUserProprietario, setCurrentUserProprietario] = useState<any>(null);

  const [openSettings, setOpenSettings] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true); 
  }, []);

  useEffect(() => {
    const storedSport = localStorage.getItem('currentUserProprietario');

    if (storedSport) {
      const parsedUser = JSON.parse(storedSport);
      setCurrentUserProprietario(parsedUser);
    } 
  }, []);

  const handleCancelReservation = () => {
    if (reservationToDelete === null || !currentUserProprietario) return;

    // Encontrar a reserva que será cancelada para obter o user_id
    const reservationToCancel = currentUserProprietario.reservations?.find(
      (res: any) => res.id === reservationToDelete
    );

    if (!reservationToCancel) return;

    // === 1. Atualizar currentUserProprietario ===
    const updatedReservations = (currentUserProprietario.reservations ?? []).filter(
      (res: any) => res.id !== reservationToDelete
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
      const updatedInfoUser = {
        ...infoUserProprietario,
        [currentUserProprietario.id]: {
          ...infoUserProprietario[currentUserProprietario.id],
          reservations: (infoUserProprietario[currentUserProprietario.id].reservations ?? []).filter(
            (res: any) => res.id !== reservationToDelete
          ),
        },
      };

      localStorage.setItem("infoUserProprietario", JSON.stringify(updatedInfoUser));
    }

    // === 3. Atualizar infoUser (remover a reserva do jogador) ===
    if (reservationToCancel.user_id) {
      const infoUser = JSON.parse(localStorage.getItem("infoUser") || "{}");
      const userId = reservationToCancel.user_id;
      
      if (infoUser[userId]) {
        // Remover a reserva do array reserved_sports_location do jogador
        const updatedUserReservations = (infoUser[userId].reserved_sports_location ?? []).filter(
          (loc: any) => loc.id !== reservationToDelete
        );

        const updatedInfoUser = {
          ...infoUser,
          [userId]: {
            ...infoUser[userId],
            reserved_sports_location: updatedUserReservations
          }
        };

        localStorage.setItem("infoUser", JSON.stringify(updatedInfoUser));
      }
    }

    // === 4. Resetar estados ===
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
            {currentUserProprietario?.reservations?.length > 0 ? (
              currentUserProprietario.reservations.map((order: any) => (
                  <CardReservedProperty 
                    key={order.id} 
                    order={order}
                    onDelete={(id) => {
                      setReservationToDelete(id);
                      setOpenSettings(true);
                    }}
                  />
              ))
            ) :(
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
              <Dialog.Title textAlign="center">
                <LG color={theme.colors.branco.principal} family={theme.fonts.inter}>
                  Excluir reserva
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
              <LG family={theme.fonts.inter} color={theme.colors.branco.secundario}>
                Tem certeza de que deseja excluir esta reserva?
              </LG>

              <S.ContainerButtonModalSettings>
                <S.ModalButton onClick={() => setOpenSettings(false)}>
                  <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                    Cancelar
                  </MD>
                </S.ModalButton>

                <S.ModalButton onClick={handleCancelReservation}>
                  <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                    Confirmar
                  </MD>
                </S.ModalButton>
              </S.ContainerButtonModalSettings>
            </Dialog.Body>
          </S.ContainerModalEdit>
        </Modal>
      )}
    </S.Container>
  );
}

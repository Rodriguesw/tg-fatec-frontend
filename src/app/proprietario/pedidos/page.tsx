"use client";

import { useEffect, useState } from 'react';

import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Navbar } from '@/components/Navbar';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { MD, LG, SM } from '@/styles/typographStyles';
import { TitleWithButtons } from '@/components/TitleWithButtons';
import { CardMyOrders } from '@/components/CardMyOrders';
import { PageModal } from '@/components/PageModal';

export default function ProprietarioPedidos() {
  const [isMounted, setIsMounted] = useState(false);

  const [currentUserProprietario, setCurrentUserProprietario] = useState<any>(null);

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

  if (!isMounted) return null; 

  return (
    <S.Container>
      <S.Wrapper>
          <Header />

          <S.Content>
              <TitleWithButtons title='Pedidos recebidos'/>

              {currentUserProprietario?.orders?.length > 0 ? (
                <CardMyOrders />
              ):(
                <S.NotFoundEvent>
                  <img src="/images/svg/icon-not-found.svg" alt="Nenhuma reserva encontrada"/>

                  <LG 
                    family={theme.fonts.inter}
                    color={theme.colors.branco.secundario}>
                    Você ainda não tem nenhum pedido pendente.
                  </LG>
                </S.NotFoundEvent>
              )}
          </S.Content>   

          <Navbar />
      </S.Wrapper>

      <PageModal openDelay={50} visibleDuration={100}/>
    </S.Container>
  );
}

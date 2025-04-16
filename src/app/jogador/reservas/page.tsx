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
import { CardData } from '@/components/CardReserved/cardData';

export default function JogadorReservas() {
  const hasEvents = CardData.length > 0;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); 
  }, []);

  if (!isMounted) return null; 

  return (
    <S.Container>
      <S.Wrapper>
          <Header />

          <S.Content>
            <TitleWithButtonBack title='Minhas reservas' />

            {hasEvents ? (
              <CardReserved />
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
    </S.Container>
  );
}

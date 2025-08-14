"use client";

import { useEffect, useState } from 'react';

import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Navbar } from '@/components/Navbar';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { MD, LG, SM } from '@/styles/typographStyles';
import { TitleWithButtons } from '@/components/TitleWithButtons';

export default function ProprietarioReservados() {
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
            <TitleWithButtons title='Reservados'/>
          </S.Content>           

          <Navbar />
      </S.Wrapper>
    </S.Container>
  );
}

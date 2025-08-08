"use client";

import { useEffect, useState } from 'react';

import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Navbar } from '@/components/Navbar';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { MD, LG, SM } from '@/styles/typographStyles';
import { TitleWithButtons } from '@/components/TitleWithButtons';
import { CardMyProperty } from '@/components/CardMyProperty';

export default function ProprietarioHome() {
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
            <TitleWithButtons buttonAdd={true} title='Minhas quadras' />
              
            <CardMyProperty />
          </S.Content>          
          <Navbar />
      </S.Wrapper>
    </S.Container>
  );
}

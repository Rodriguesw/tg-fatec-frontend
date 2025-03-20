"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Navbar } from '@/components/Navbar';
import { TitleWithButtonBack } from '@/components/TitleWithButtonBack';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { MD, LG, SM } from '@/styles/typographStyles';

export default function ProprietarioPerfil() {
  const router = useRouter();
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
              <S.ContainerInput>
                <Input placeholder='Buscar' />
              </S.ContainerInput>
            
              <S.Button onClick={() => router.push('/')}>
                <LG weight={700} color={theme.colors.branco.principal} family={theme.fonts.inter}>
                  Sair
                </LG>
              </S.Button>
            </S.Content>          
            
          <Navbar />
      </S.Wrapper>
    </S.Container>
  );
}

"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Atualize para next/navigation

import { Input } from '@/components/Input';
import { LoginWithBannerAndModal } from '@/components/LoginWithBannerAndModal';

import * as S from './styles'
import { H3, LG, MD } from '@/styles/typographStyles';
import { theme } from '@/styles/theme';
import Link from 'next/link';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
        
  useEffect(() => {
    setIsMounted(true); // Garante que o componente seja montado no cliente
  }, []);
  
  if (!isMounted) return null;

  return (
      <S.Container>
        <S.Wrapper>
          <LoginWithBannerAndModal  minHeight="560px">
            <S.Content>
              <S.ContentHeader>
                <H3 color={theme.colors.laranja}>Como você deseja usar o PlayFUT?</H3>
  
                <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>Escolha a forma que deseja entrar:</MD>
              </S.ContentHeader>
  
              <S.ContentButtons>
                <Link href="/jogador/login">
                  <LG 
                    weight={700}
                    color={theme.colors.branco.principal} 
                    family={theme.fonts.inter}>Sou jogador</LG>
                </Link>
  
                <Link href="/proprietario/login">
                  <LG 
                    weight={700}
                    color={theme.colors.branco.principal} 
                    family={theme.fonts.inter}>Sou proprietário</LG>
                </Link>
              </S.ContentButtons>
            </S.Content>
          </LoginWithBannerAndModal>
  
        </S.Wrapper>
      </S.Container>
  );
}
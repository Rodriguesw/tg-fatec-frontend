"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { defaultExtraMarkers } from '@/utils/MapConfig';

import { LoginWithBannerAndModal } from '@/components/LoginWithBannerAndModal';

import * as S from './styles'
import { theme } from '@/styles/theme';
import { H3, LG, MD } from '@/styles/typographStyles';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
        
  useEffect(() => {
    setIsMounted(true); 
  }, []);

  useEffect(() => {
    const storedMarkers = localStorage.getItem('mapMarkers');

    if (storedMarkers) {
      //Não seta os markers se já houver marcadores no localStorage
    } else {
      localStorage.setItem('mapMarkers', JSON.stringify(defaultExtraMarkers));
    }
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
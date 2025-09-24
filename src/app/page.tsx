"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { Spinner } from '@chakra-ui/react';

import { defaultExtraMarkers } from '@/utils/MapConfig';

import { LoginWithBannerAndModal } from '@/components/LoginWithBannerAndModal';

import * as S from './styles'
import { theme } from '@/styles/theme';
import { H3, LG, MD } from '@/styles/typographStyles';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  const [loagingRedirectJogador, setLoagingRedirectJogador] = useState(false);
  const [loagingRedirectProprietario, setLoagingRedirectProprietario] = useState(false);
        
  useEffect(() => {
    setIsMounted(true); 
  }, []);

  const handleRedirectJogador = async () => {
    setLoagingRedirectJogador(true);
    
    try {
      window.location.href = '/jogador/login';
    } catch (error) {
      console.error('Erro ao redirecionar para o jogador:', error);
    }
  }

  const handleRedirectProprietario = async () => {
    setLoagingRedirectProprietario(true);
    
    try {
      window.location.href = '/proprietario/login';
    } catch (error) {
      console.error('Erro ao redirecionar para o proprietário:', error);
    }
  }

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
                <S.Button onClick={handleRedirectJogador}>
                  {loagingRedirectJogador ? 
                    (
                      <div style={{height: '27px', display: 'flex', alignItems: 'center'}}>
                        <Spinner />
                      </div>
                    )
                  : (
                    <LG 
                    weight={700}
                    color={theme.colors.branco.principal} 
                    family={theme.fonts.inter}>
                      Sou jogador
                    </LG>
                  )}
                </S.Button>
  
                <S.Button onClick={handleRedirectProprietario}>
                  {loagingRedirectProprietario ? (
                    <div style={{height: '27px', display: 'flex', alignItems: 'center'}}>
                      <Spinner />
                    </div>
                    ) : (
                    <LG 
                    weight={700}
                    color={theme.colors.branco.principal} 
                    family={theme.fonts.inter}>
                      Sou proprietário
                    </LG>
                  )}
                </S.Button>
              </S.ContentButtons>
            </S.Content>
          </LoginWithBannerAndModal>
  
        </S.Wrapper>
      </S.Container>
  );
}
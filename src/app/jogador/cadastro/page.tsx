"use client"

import { useEffect, useState } from 'react';

import { Input } from '@/components/Input';
import { Header } from '@/components/Header';
import { TitleWithButtonBack } from '@/components/TitleWithButtonBack';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { LG, } from '@/styles/typographStyles';

export default function JogadorCadastro() {
  const [isMounted, setIsMounted] = useState(false);
    
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const handleClick = () => {
    window.history.back();
  }

  if (!isMounted) return null;

return (
    <S.Container>
        <S.Wrapper>
          <Header></Header>
  
          <S.Content>
            <S.ContentHeader>
              <TitleWithButtonBack title='Dados cadastrais' buttonBack={true} onClick={handleClick} />
            </S.ContentHeader>
  
            <S.ContentForm>
              <Input placeholder='Email Jogador' label='Email Jogador' />
  
              <Input placeholder='Email Jogador' label='Email Jogador' />
  
              <Input placeholder='Email Jogador' label='Email Jogador' />
  
              <Input placeholder='Email Jogador' label='Email Jogador' />
  
              <Input placeholder='Email Jogador' label='Email Jogador' />
            </S.ContentForm>
          </S.Content>
  
          <S.Button>
              <LG 
                weight={700}  
                color={theme.colors.branco.principal} 
                family={theme.fonts.inter}>
                  Cadastrar
              </LG>
          </S.Button>
        </S.Wrapper>
    </S.Container>
  );
}

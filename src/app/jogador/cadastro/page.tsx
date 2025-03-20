"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/Input';
import { TitleWithButtonBack } from '@/components/TitleWithButtonBack';
import { LoginWithBannerAndModal } from '@/components/LoginWithBannerAndModal';


import * as S from './styles';
import { theme } from '@/styles/theme';
import { H3, LG, MD, SM } from '@/styles/typographStyles';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';

export default function JogadorCadastro() {
   const [isMounted, setIsMounted] = useState(false);
    
  useEffect(() => {
    setIsMounted(true); // Garante que o componente seja montado no cliente
  }, []);

  const router = useRouter();
  
  const handleClick = () => {
    window.history.back();
  }

  if (!isMounted) return null;
  return (
    <>
      {/* <JogadorCadastroClient /> */}

       <S.Container>
            <S.Wrapper>
              <Header></Header>
      
              <S.Content>
                <S.ContentHeader>
                  <TitleWithButtonBack title='Dados cadastrais' onClick={handleClick} />
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
    </>
  );
}

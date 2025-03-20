"use client";

import { useEffect, useState } from 'react';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { MD, LG, SM } from '@/styles/typographStyles';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { FooterButtons } from '@/components/FooterButtons';

export default function JogadorHome() {
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
            
              <S.ContainerMap>
                <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7312.476746004791!2d-48.052434666515325!3d-23.595782540096398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-PT!2sbr!4v1742487428017!5m2!1spt-PT!2sbr" width="100%" height="500px" />
              </S.ContainerMap>
            </S.Content>          

          <FooterButtons />
      </S.Wrapper>
    </S.Container>
  );
}

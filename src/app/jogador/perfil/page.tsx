"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Header } from '@/components/Header';
import { Navbar } from '@/components/Navbar';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { LG } from '@/styles/typographStyles';

export default function JogadorPerfil() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); 
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    
    router.push('/jogador/login');
  }

  if (!isMounted) return null; 

  return (
    <S.Container>
      <S.Wrapper>
          <Header />

          <S.Content>
              <S.ContainerPhoto>
                <img src="/images/png/user-photo.png" alt="Foto do usuário"/>
              </S.ContainerPhoto>

              <S.ContainerButtons>
                <S.Button>
                  <LG  
                    color={theme.colors.branco.secundario} 
                    family={theme.fonts.inter}>
                    Meu cadastro
                  </LG>
                </S.Button>

                <S.Button >
                  <LG  
                    color={theme.colors.branco.secundario} 
                    family={theme.fonts.inter}>
                    Segurança
                  </LG>
                </S.Button>
          
                <S.Button onClick={handleLogout}>
                  <LG  
                    color={theme.colors.branco.secundario} 
                    family={theme.fonts.inter}>
                    Sair
                  </LG>
                </S.Button>
              </S.ContainerButtons>
            </S.Content>          
            
          <Navbar />
      </S.Wrapper>
    </S.Container>
  );
}

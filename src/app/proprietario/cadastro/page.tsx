"use client"

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/Input';
import { TitleWithButtons } from '@/components/TitleWithButtons';
import { LoginWithBannerAndModal } from '@/components/LoginWithBannerAndModal';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { H3, LG, MD, SM } from '@/styles/typographStyles';

export default function ProprietarioCadastroClient() {
  const [isMounted, setIsMounted] = useState(false);
        
  useEffect(() => {
    setIsMounted(true);
  }, []);
      
  const router = useRouter();
  
  const handleClick = () => {
    window.history.back();
  }

  if (!isMounted) return null;

  return (
    <S.Container>
        <S.Wrapper>
          <S.ContainerLogo>
            <img src="/images/logo/logo-playfut-white-fina.svg"/>
          </S.ContainerLogo>
  
          <S.Content>
            <S.ContentHeader>
              <TitleWithButtons title='Dados cadastrais' buttonBack={true} onClick={handleClick} />
            </S.ContentHeader>
  
            <S.ContentForm>
              <Input type='text' placeholder='E-mail Proprietario' label='E-mail Proprietario' />
  
              <Input type='text' placeholder='E-mail Proprietario' label='E-mail Proprietario' />
  
              <Input type='text' placeholder='E-mail Proprietario' label='E-mail Proprietario' />
  
              <Input type='text' placeholder='E-mail Proprietario' label='E-mail Proprietario' />
  
              <Input type='text' placeholder='E-mail Proprietario' label='E-mail Proprietario' />
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

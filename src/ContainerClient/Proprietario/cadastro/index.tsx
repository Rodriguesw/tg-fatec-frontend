"use client";

import Link from 'next/link';

import { LoginWithBannerAndModal } from '@/components/LoginWithBannerAndModal';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { H3, LG, MD, SM } from '@/styles/typographStyles';
import { TitleWithButtonBack } from '@/components/TitleWithButtonBack';
import { Input } from '@/components/Input';

export default function ProprietarioCadastro() {
  return (
    <S.Container>
      <S.Wrapper>
        <S.ContainerLogo>
          <img src="/images/logo/logo-playfut-white-fina.svg"/>
        </S.ContainerLogo>

        <S.Content>
          <S.ContentHeader>
            <TitleWithButtonBack title='Dados cadastrais' />
          </S.ContentHeader>

          <S.ContentForm>
            <Input placeholder='E-mail Proprietario' label='E-mail Proprietario' />

            <Input placeholder='E-mail Proprietario' label='E-mail Proprietario' />

            <Input placeholder='E-mail Proprietario' label='E-mail Proprietario' />

            <Input placeholder='E-mail Proprietario' label='E-mail Proprietario' />

            <Input placeholder='E-mail Proprietario' label='E-mail Proprietario' />
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
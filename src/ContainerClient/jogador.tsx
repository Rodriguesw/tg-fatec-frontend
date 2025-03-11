"use client";

import Link from 'next/link';

import { LoginWithBannerAndModal } from '@/components/LoginWithBannerAndModal';

import * as S from './HomeStyles';
import { theme } from '@/styles/theme';
import { H3, LG, MD } from '@/styles/typographStyles';
import { TitleWithButtonBack } from '@/components/TitleWithButtonBack';

export default function Jogador() {
  return (
    <S.Container>
      <S.Wrapper>
        <LoginWithBannerAndModal minHeight="560px" backgroundImage='/images/jpg/bk-login-jogador.jpg'>
         <S.Content>
            <S.ContentHeader>
              <TitleWithButtonBack title='Jogador' />
            </S.ContentHeader>
          </S.Content>
        </LoginWithBannerAndModal>
      </S.Wrapper>
    </S.Container>
  );
}
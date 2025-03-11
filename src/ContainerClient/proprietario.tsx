"use client";

import Link from 'next/link';
import * as S from './proprietarioStyles';

import { Input } from '@/components/Input';
import { LoginWithBannerAndModal } from '@/components/LoginWithBannerAndModal';
import { TitleWithButtonBack } from '@/components/TitleWithButtonBack';

export default function Proprietario() {
  return (
    <S.Container>
      <S.Wrapper>
         <LoginWithBannerAndModal minHeight="560px" backgroundImage='/images/jpg/bk-login-proprietario.jpg'>
            <S.Content>
              <S.ContentHeader>
                <TitleWithButtonBack title='Proprietário'  />
              </S.ContentHeader>
            </S.Content>
         </LoginWithBannerAndModal>
      </S.Wrapper>
    </S.Container>
  );
}
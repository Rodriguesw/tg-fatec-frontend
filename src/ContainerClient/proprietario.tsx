"use client";

import Link from 'next/link';
import * as S from './proprietarioStyles';

import { Input } from '@/components/Input';
import { LoginWithBannerAndModal } from '@/components/LoginWithBannerAndModal';

export default function Proprietario() {
  return (
    <S.Container>
      <S.Wrapper>
         <LoginWithBannerAndModal backgroundImage='/images/jpg/bk-login-proprietario.jpg'/>

          <Link href="/">VOLTAR</Link>

          <button>ENTRAR</button>
      </S.Wrapper>
    </S.Container>
  );
}
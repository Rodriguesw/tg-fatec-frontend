"use client";

import Link from 'next/link';
import * as S from './jogadorStyles';

import { Input } from '@/components/Input';
import { LoginWithBannerAndModal } from '@/components/LoginWithBannerAndModal';

export default function Jogador() {
  return (
    <S.Container>
      <S.Wrapper>
        <LoginWithBannerAndModal backgroundImage='/images/jpg/bk-login-jogador.jpg'/>

        <Link href="/">VOLTAR</Link>

        <button>ENTRAR</button>
      </S.Wrapper>
    </S.Container>
  );
}
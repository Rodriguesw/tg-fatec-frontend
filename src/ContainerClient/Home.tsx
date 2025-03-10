"use client";

import Link from 'next/link';
import * as S from './HomeStyles';
import { Input } from '@/components/Input';
import { LoginWithBannerAndModal } from '@/components/LoginWithBannerAndModal';

export default function Home() {
  return (
    <S.Container>
      <S.Wrapper>

        <LoginWithBannerAndModal />

        <Link href="/login/jogador">Eu sou jogador(a)</Link>

        <Link href="/login/proprietario">Eu sou Proprietário</Link>

      </S.Wrapper>
    </S.Container>
  );
}
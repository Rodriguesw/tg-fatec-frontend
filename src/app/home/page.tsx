"use client"

import Link from 'next/link';
import * as S from './styles'

import HomeClient from '@/ContainerClient/Home';

import { Input } from '@/components/Input';

export default function Home() {
  return (
    <>
      <HomeClient />
    </>
    // <S.Container>
    //   <S.Wrapper>
    //     <h1>Olá, seja bem-vindo(a)!</h1>

    //     <Input label='Teste'/>

    //     <Link href="/login/jogador">Eu sou jogador(a)</Link>

    //     <Link href="/login/proprietario">Eu sou Proprietário</Link>

    //   </S.Wrapper>
    // </S.Container>
  );
}
"use client";

import Link from 'next/link';
import * as S from './Teste1Styles';

import { Input } from '@/components/Input';

export default function Teste2() {
  return (
    <S.Container>
      <S.Wrapper>
         <h1>Olá, seja bem-vindo(a)!</h1>
 
         <Input label='Teste'/>
 
         <Input label='Teste'/>

          <Link href="/">VOLTAR</Link>

          <button>ENTRAR</button>
      </S.Wrapper>
    </S.Container>
  );
}
import { Metadata } from 'next';

import Teste2Client from '@/ContainerClient/Teste2';

export const metadata: Metadata = {};

export default function Teste2() {
  return (
    <>
      <Teste2Client />
    </>
  );
}

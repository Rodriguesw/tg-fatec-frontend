import { Metadata } from 'next';

import Teste2Client from '@/ContainerClient/proprietario';

export const metadata: Metadata = {};

export default function Teste2() {
  return (
    <>
      <Teste2Client />
    </>
  );
}

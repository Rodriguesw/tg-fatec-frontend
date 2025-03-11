import { Metadata } from 'next';

import LoginProprietarioClient from '@/ContainerClient/Proprietario/login';

export const metadata: Metadata = {};

export default function LoginProprietario() {
  return (
    <>
      <LoginProprietarioClient />
    </>
  );
}

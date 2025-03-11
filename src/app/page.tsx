"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Atualize para next/navigation
import HomeClient from '@/ContainerClient/Home/Home';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (router) {
      router.push('/home');
    }
  }, [router]);

  return (
    <>
      <HomeClient />
    </>
  );
}
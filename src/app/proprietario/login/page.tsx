"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/Input';
import { LoginWithBannerAndModal } from '@/components/LoginWithBannerAndModal';
import { TitleWithButtonBack } from '@/components/TitleWithButtonBack';


import * as S from './styles';
import { SM } from '@/styles/typographStyles';
import { LG } from '@/styles/typographStyles';
import { MD } from '@/styles/typographStyles';
import { theme } from '@/styles/theme';
import { useEffect, useState } from 'react';

export default function LoginProprietario() {
  const [isMounted, setIsMounted] = useState(false);
    
  useEffect(() => {
    setIsMounted(true); 
  }, []);
    
  const router = useRouter();
  
  const handleClick = () => {
    router.push('/');
  }

  if (!isMounted) return null;
  return (
    <>
      {/* <LoginProprietarioClient /> */}

       <S.Container>
            <S.Wrapper>
               <LoginWithBannerAndModal minHeight="560px" backgroundImage='/images/jpg/bk-login-proprietario.jpg'>
                  <S.Content>
                    <S.ContentHeader>
                      <TitleWithButtonBack title='Proprietário'  onClick={handleClick}/>
                        <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                        Login:
                      </MD>
                    </S.ContentHeader>
      
                    <S.ContentForm>
                      <Input placeholder='E-mail' label='E-mail' />
      
                      <Input placeholder='******' label='Senha' />
                    </S.ContentForm>
      
                    <S.Button>
                        <LG 
                          weight={700} 
                          color={theme.colors.branco.principal} 
                          family={theme.fonts.inter}>
                            Entrar
                        </LG>
                    </S.Button>
      
                    <S.ContentFooter>
                      <Link href="/proprietario/recuperar-senha">   
                        <SM color={theme.colors.branco.principal} family={theme.fonts.inter}>
                          Esqueceu sua senha?
                        </SM> 
                      </Link>
      
                      <Link href="/proprietario/cadastro">
                        <SM color={theme.colors.branco.principal} family={theme.fonts.inter}>
                          Cadastre-se
                        </SM>
                      </Link>
                    </S.ContentFooter>
                  </S.Content>
               </LoginWithBannerAndModal>
            </S.Wrapper>
          </S.Container>
    </>
  );
}

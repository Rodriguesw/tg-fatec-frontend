"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Spinner } from "@chakra-ui/react"

import { Input } from '@/components/Input';
import { TitleWithButtonBack } from '@/components/TitleWithButtonBack';
import { LoginWithBannerAndModal } from '@/components/LoginWithBannerAndModal';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { MD, LG, SM } from '@/styles/typographStyles';

import { showToast } from '@/components/ToastAlert';

interface User {
  id: number;
  name: string;
  birth_date: string;
  gender: string;
  team: string;
  email: string;
  password: string;
}

interface LoginErrors {
  email: boolean;
  password: boolean;
  form: boolean;
  emailFormat: boolean;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  const commonDomains = [
    '.com', '.com.br', '.org', '.net', '.edu', '.gov', '.mil',
    '.int', '.io', '.co', '.me', '.app', '.dev', '.cloud'
  ];

  if (!email || email.length < 5 || email.length > 254) {
    return false;
  }

  if (email.includes(' ')) {
    return false;
  }

  if (!emailRegex.test(email)) {
    return false;
  }

  const domain = email.split('@')[1];
  
  const hasValidDomain = commonDomains.some(ext => domain.endsWith(ext));
  
  return hasValidDomain;
};

export default function JogadorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<LoginErrors>({
    email: false,
    password: false,
    form: false,
    emailFormat: false
  });

  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const getUsersFromStorage = (): Record<number, User> => {
      try {
        const data = localStorage.getItem("infoUser");

        return data ? JSON.parse(data) : {};
      } catch {
        return {};
      }
    };

    const users = getUsersFromStorage();
    if (Object.keys(users).length === 0) {
      const dataUserTest: User = {
        id: 1,
        name: "Matheus JGDR",
        birth_date: "2025-03-31",
        gender: "male",
        team: "sao_paulo",
        email: "teste@teste.com",
        password: "teste",
      };

      localStorage.setItem("infoUser", JSON.stringify({1: dataUserTest}));
    }
  }, []);

  const validateFields = (): boolean => {
    const newErrors = {
      email: !email.trim(),
      password: !password.trim(),
      form: false,
      emailFormat: !validateEmail(email)
    };
    
    setErrors(newErrors);

    return !newErrors.email && !newErrors.password && !newErrors.emailFormat;
  };

  const handleLogin = async () => {
    if (!validateFields()) {
      if (errors.emailFormat) {
        showToast({
          type: 'error',
          message: 'Por favor, insira um email válido'
        });
      } else {
        showToast({
          type: 'error',
          message: 'Preencha todos os campos'
        });
      }
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users: Record<number, User> = JSON.parse(localStorage.getItem("infoUser") || "{}");
      const user = Object.values<User>(users).find((u: User) => u.email === email);
      
      if (user && user.password === password) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        router.push('/jogador/home');
      } else if (email.toLowerCase() === 'admin@admin.com' && password === 'admin') {
        router.push('/jogador/home');
      } else {
        setErrors(prev => ({ ...prev, form: true }));
        
        showToast({
          type: 'error',
          message: 'Email ou senha inválidos'
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Ocorreu um erro durante o login'
      });
    } finally {
      setIsLoading(false); 
    }
  };

  const handleClick = () => {
    router.push('/');
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    
    setErrors(prev => ({ 
      ...prev, 
      email: false, 
      form: false,
      emailFormat: !validateEmail(value)
    }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setErrors(prev => ({ ...prev, password: false, form: false }));
  };

  if (!isMounted) return null; 

  return (
    <S.Container>
      <S.Wrapper>
        <LoginWithBannerAndModal minHeight="560px" backgroundImage="/images/jpg/bk-login-jogador.jpg">
          <S.Content>
            <S.ContentHeader>
              <TitleWithButtonBack title="Jogador" buttonBack={true} onClick={handleClick} />

              <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                Login:
              </MD>
            </S.ContentHeader>

            <S.ContentForm as="form">
              <Input 
                type="text" 
                placeholder="E-mail" 
                label="E-mail" 
                value={email} 
                onChange={handleEmailChange}
                hasError={errors.email || errors.form || errors.emailFormat}
              />
              
              <Input 
                type="password" 
                placeholder="******" 
                label="Senha" 
                value={password} 
                onChange={handlePasswordChange}
                hasError={errors.password || errors.form}
              />
            </S.ContentForm>

            <S.Button type="submit" onClick={handleLogin}>
              <LG weight={700} color={theme.colors.branco.principal} family={theme.fonts.inter}>
                {isLoading ? <Spinner /> : 'Entrar'}
              </LG>
            </S.Button>

            <S.ContentFooter>
              <Link href="/jogador/recuperar-senha">
                <SM color={theme.colors.branco.principal} family={theme.fonts.inter}>
                  Esqueceu sua senha?
                </SM>
              </Link>

              <Link href="/jogador/cadastro">
                <SM color={theme.colors.branco.principal} family={theme.fonts.inter}>
                  Cadastre-se
                </SM>
              </Link>
            </S.ContentFooter>
          </S.Content>
        </LoginWithBannerAndModal>
      </S.Wrapper>
    </S.Container>
  );
}
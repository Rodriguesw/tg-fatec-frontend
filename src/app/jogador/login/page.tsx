"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Spinner } from "@chakra-ui/react"

import { Input } from '@/components/Input';
import { TitleWithButtons } from '@/components/TitleWithButtons';
import { LoginWithBannerAndModal } from '@/components/LoginWithBannerAndModal';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { MD, LG, SM } from '@/styles/typographStyles';

import { showToast } from '@/components/ToastAlert';

interface UserJogador {
  id: number;
  name: string;
  birth_date: string;
  gender: string;
  team: string;
  email: string;
  password: string;
  reserved_sports_location: {
    id?: number;
    name?: string;
    address?: {
      id?: number;
      cep?: string;
      number?: string;
      city?: string;
      neighborhood?: string;
      state?: string;
      street?: string;
    };
    time_start?: string;
    time_end?: string;
    price?: string;
    payment_method?: string;
    reserved_date?: string;
  }[];
}

interface LoginErrors {
  email: boolean;
  password: boolean;
  form: boolean;
  emailFormat: boolean;
}

const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*$/;
  
  if (!email || email.length < 5 || email.length > 254) {
    return false;
  }

  if (email.includes(' ')) {
    return false;
  }

  return regex.test(email);
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

    const getUsersFromStorage = (): Record<number, UserJogador> => {
      try {
        const data = localStorage.getItem("infoUser");

        return data ? JSON.parse(data) : {};
      } catch {
        return {};
      }
    };

    const users = getUsersFromStorage();
    if (Object.keys(users).length === 0) {
      const dataUserTest: UserJogador = {
        id: 1,
        name: "Matheus Henrique",
        birth_date: "2004-02-04",
        gender: "male",
        team: "sao_paulo",
        email: "matheushr39@gmail.com",
        password: "teste",
        reserved_sports_location: [{
          id: 1782,
          name: "Arena KS Society",
          address: {
            id: 12,
            cep: "18213110",
            number: "305",
            street: "Rua Alceu Correa de Moraes",
            city: "Itapetininga",
            neighborhood: "Vila Macia",
            state: "SP"
          },
          time_start: "20:00",
          time_end: "23:00",
          price: "R$ 300,00",
          payment_method: "Dinheiro",
          reserved_date: "29/03/2025",
        }]
      };

      localStorage.setItem("infoUser", JSON.stringify({1: dataUserTest}));
    }
  }, []);

  const validateFields = (): boolean => {
    const newErrors = {
      email: !email.trim(),
      password: !password.trim(),
      form: false,
      emailFormat: false
    };

    if (email.trim()) {
      newErrors.emailFormat = !validateEmail(email);
    }
    
    setErrors(newErrors);

    return !newErrors.email && !newErrors.password && !newErrors.emailFormat;
  };

  const handleLogin = async () => {

    if (!validateFields()) {
      if(email === "" && password === "") {
        showToast({
          type: 'error',
          message: 'Preencha todos os campos'
        });
      }else if (email !== null || errors.emailFormat) {
        showToast({
          type: 'error',
          message: 'Insira um email válido'
        });
      } else if (errors.password) {
        showToast({
          type: 'error',
          message: 'E-mail ou senha inválidos'
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
      
      const users: Record<number, UserJogador> = JSON.parse(localStorage.getItem("infoUser") || "{}");
      const user = Object.values<UserJogador>(users).find((u: UserJogador) => u.email === email);
      
      if (user && user.password === password) {
        localStorage.setItem("currentUser", JSON.stringify(user));
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
      emailFormat: false
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
        <LoginWithBannerAndModal minHeight="560px" backgroundImage="/images/jpg/bk-login-jogador-2.jpg">
          <S.Content>
            <S.ContentHeader>
              <TitleWithButtons title="Jogador" buttonBack={true} onClick={handleClick} />

              <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                Login:
              </MD>
            </S.ContentHeader>

            <S.ContentForm as="form">
              <Input 
                id="email"
                type="text" 
                placeholder="E-mail" 
                label="E-mail" 
                value={email} 
                onChange={handleEmailChange}
                hasError={errors.email || errors.form || errors.emailFormat}
              />
              
              <Input 
                id="password"
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
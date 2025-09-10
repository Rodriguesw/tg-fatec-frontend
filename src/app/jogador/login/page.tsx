"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { encryptPassword, verifyPassword } from '@/utils/crypto';

import { Spinner } from "@chakra-ui/react"

import { Input } from '@/components/Input';
import { TitleWithButtons } from '@/components/TitleWithButtons';
import { LoginWithBannerAndModal } from '@/components/LoginWithBannerAndModal';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { MD, LG, SM } from '@/styles/typographStyles';

import { showToast } from '@/components/ToastAlert';

interface UserProprietario {
  id: number;
  name: string;
  email: string;
  password: string;
  cnpj: string;
  razaoSocial: string;
  phone: string;
  my_sports_location?: {
    id?: number;
    name?: string;
    type?: string;
    address?: {
      cep?: string;
      number?: string;
      city?: string;
      neighborhood?: string;
      state?: string;
      street?: string;
    };
    days?: string[];
    time_start?: string;
    time_end?: string;
    price?: string;
    payment_method?: string;
    reserved_date?: string;
  }[];
  reservations?: {
    id?: number;
    user_id?: number;
    my_sports_location_id?: number;
    reserved_date?: string;
    time_start?: string;
    time_end?: string;
    price?: string;
    payment_method?: string;
  }[];
  orders?: {
    id?: number;
    user_id?: number;
    my_sports_location_id?: number;
    reserved_date?: string;
    time_start?: string;
    time_end?: string;
    price?: string;
    payment_method?: string;
  }[];
}

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

    // Verifica se o localStorage "infoUser" já existe
    const infoUserExists = localStorage.getItem("infoUser") !== null;
    
    // Só cria o usuário de teste se o localStorage "infoUser" não existir
    if (!infoUserExists) {
      // Função para criar usuário de teste com senha criptografada
      const createTestUser = async () => {
        const hashedPassword = await encryptPassword("teste");
        const hashedPasswordTwo = await encryptPassword("t");
        
        const dataUserTest: UserJogador = {
          id: 1,
          name: "Matheus Henrique",
          birth_date: "2004-02-04",
          gender: "male",
          team: "sao_paulo",
          email: "matheushr39@gmail.com",
          password: hashedPassword, // Senha criptografada
          reserved_sports_location: []
        };

        const dataUserTestTwo: UserProprietario = {
          id: 2,
          name: "Thiago",
          email: "teste@teste.com",
          password: hashedPasswordTwo, // Senha criptografada
          cnpj: "11.080.217/0001-75",
          phone: "15 99160-1215",
          razaoSocial: "Thiago Society LTDA",
        };

        const existingUsers = JSON.parse(localStorage.getItem("infoUser") || "{}");

        existingUsers[dataUserTest.id] = dataUserTest;
        existingUsers[dataUserTestTwo.id] = dataUserTestTwo;

        localStorage.setItem("infoUser", JSON.stringify(existingUsers));
      };
      
      createTestUser();
    }

    // Verifica se o localStorage "infoUserProprietario" já existe
    const infoUserProprietarioExists = localStorage.getItem("infoUserProprietario") !== null;
    
    // Só cria os usuários proprietários de teste se o localStorage "infoUserProprietario" não existir
    if (!infoUserProprietarioExists) {
      // Função para criar usuários proprietários de teste com senhas criptografadas
      const createProprietarioTestUsers = async () => {
        const adminPassword = await encryptPassword("admin");
        const testePassword = await encryptPassword("teste");
        
        const dataUserProprietarioTest: UserProprietario = {
          id: 1,
          name: "Matheus",
          email: "matheushr39@gmail.com",
          password: adminPassword, // Senha criptografada
          cnpj: "11.080.217/0001-75",
          razaoSocial: "Matheus Society LTDA",
          phone: "15 99160-1215",
          my_sports_location: [],
          reservations: [],
          orders: []
        };

        const dataUserProprietarioTestTwo: UserProprietario = {
          id: 2,
          name: "Thiago",
          email: "teste@teste.com",
          password: testePassword, // Senha criptografada
          cnpj: "11.080.217/0001-75",
          phone: "15 99160-1215",
          razaoSocial: "Thiago Society LTDA",
        };

        const existingUsers = JSON.parse(localStorage.getItem("infoUserProprietario") || "{}");

        existingUsers[dataUserProprietarioTest.id] = dataUserProprietarioTest;
        existingUsers[dataUserProprietarioTestTwo.id] = dataUserProprietarioTestTwo;

        localStorage.setItem("infoUserProprietario", JSON.stringify(existingUsers));
      };
      
      createProprietarioTestUsers();
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
      
      // Verifica se o usuário existe e se a senha está correta
      if (user && await verifyPassword(password, user.password)) {
        // Não envia a senha criptografada para o currentUser
        const userToStore = {
          ...user,
          password: await encryptPassword(password) // Mantém a senha criptografada
        };
        localStorage.setItem("currentUser", JSON.stringify(userToStore));
        router.push('/jogador/home');
      } else {
        setErrors(prev => ({ ...prev, form: true }));

        setIsLoading(false); 
        
        showToast({
          type: 'error',
          message: 'Email ou senha inválidos'
        });
      }
    } catch (error) {
      setIsLoading(false); 

      showToast({
        type: 'error',
        message: 'Ocorreu um erro durante o login'
      });
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
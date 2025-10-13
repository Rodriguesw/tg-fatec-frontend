"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { encryptPassword, verifyPassword } from '@/utils/crypto';

import { Spinner } from "@chakra-ui/react";

import { Input } from "@/components/Input";
import { showToast } from "@/components/ToastAlert";
import { TitleWithButtons } from "@/components/TitleWithButtons";
import { LoginWithBannerAndModal } from "@/components/LoginWithBannerAndModal";

import * as S from "./styles";
import { theme } from "@/styles/theme";
import { LG, MD, SM } from "@/styles/typographStyles";

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

export default function LoginProprietario() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [errors, setErrors] = useState<LoginErrors>({
    email: false,
    password: false,
    form: false,
    emailFormat: false
  });

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);

    const getUsersFromStorage = (): Record<number, UserProprietario> => {
      try {
        const data = localStorage.getItem("infoUserProprietario");
        return data ? JSON.parse(data) : {};
      } catch {
        return {};
      }
    };

    const users = getUsersFromStorage();
    if (Object.keys(users).length === 0) {
      // Função para criar usuários de teste com senhas criptografadas
      const createTestUsers = async () => {
        const adminPassword = await encryptPassword("admin");
        const testePassword = await encryptPassword("teste");
        
        const dataUserTest: UserProprietario = {
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

        const dataUserTestTwo: UserProprietario = {
          id: 2,
          name: "Thiago",
          email: "teste@teste.com",
          password: testePassword, // Senha criptografada
          cnpj: "11.080.217/0001-75",
          phone: "15 99160-1215",
          razaoSocial: "Thiago Society LTDA",
        };

        // Só cria o infoUser se ele não existir no localStorage
        const existingInfoUser = localStorage.getItem("infoUser");
        if (!existingInfoUser) {
          // O usuário jogador já está sendo criado com senha criptografada na página de login do jogador
        }

        const existingUsers = JSON.parse(localStorage.getItem("infoUserProprietario") || "{}");

        existingUsers[dataUserTest.id] = dataUserTest;
        existingUsers[dataUserTestTwo.id] = dataUserTestTwo;

        localStorage.setItem("infoUserProprietario", JSON.stringify(existingUsers));
      };
      
      createTestUsers();
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

  const handleClick = () => {
    router.push("/");
  };

  const handleLogin = async () => {
    if (!validateFields()) {
      if(email === "" && password === "") {
        showToast({
          type: "error",
          message: "Preencha todos os campos",
        });
      } else if (email !== null || errors.emailFormat) {
        showToast({
          type: "error",
          message: "Insira um email válido",
        });
      } else if (errors.password) {
        showToast({
          type: "error",
          message: "E-mail ou senha inválidos",
        });
      } else {
        showToast({
          type: "error",
          message: "Preencha todos os campos",
        });
      }
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const users: Record<number, UserProprietario> = JSON.parse(
        localStorage.getItem("infoUserProprietario") || "{}"
      );
      const user = Object.values<UserProprietario>(users).find((u: UserProprietario) => u.email === email);

      // Verifica se o usuário existe e se a senha está correta
      if (user && await verifyPassword(password, user.password)) {
        // Não envia a senha em texto plano para o currentUser
        const userToStore = {
          ...user,
          password: await encryptPassword(password) // Mantém a senha criptografada
        };
        localStorage.setItem("currentUserProprietario", JSON.stringify(userToStore));
        router.push("/proprietario/home");
      } else {
        setErrors((prev) => ({ ...prev, form: true }));

        setIsLoading(false);

        showToast({
          type: "error",
          message: "Email ou senha inválidos",
        });
      }
    } catch (error) {
      setIsLoading(false);

      showToast({
        type: "error",
        message: "Ocorreu um erro durante o login",
      });
    }
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
        <LoginWithBannerAndModal
          minHeight="560px"
          backgroundImage="/images/jpg/bk-login-proprietario.jpg"
        >
          <S.Content>
            <S.ContentHeader>
              <TitleWithButtons
                title="Proprietário"
                buttonBack={true}
                onClick={handleClick}
              />
              <MD
                color={theme.colors.branco.principal}
                family={theme.fonts.inter}
              >
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

            <S.Button onClick={handleLogin}>
              <LG
                weight={700}
                color={theme.colors.branco.principal}
                family={theme.fonts.inter}
              >
                {isLoading ? <Spinner /> : "Entrar"}
              </LG>
            </S.Button>

            <S.ContentFooter>
              <Link href="/proprietario/recuperar-senha">
                <SM
                  color={theme.colors.branco.principal}
                  family={theme.fonts.inter}
                >
                  Esqueceu sua senha?
                </SM>
              </Link>

              <S.ButtonLink onClick={() => window.location.href = '/proprietario/cadastro'}>
                <SM
                  color={theme.colors.branco.principal}
                  family={theme.fonts.inter}
                >
                  Cadastre-se
                </SM>
              </S.ButtonLink>
            </S.ContentFooter>
          </S.Content>
        </LoginWithBannerAndModal>
      </S.Wrapper>
    </S.Container>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  phone: string;
  my_sports_location?: {
    id?: number;
    name?: string;
    address?: {
      cep?: string;
      number?: string;
      city?: string;
      neighborhood?: string;
      state?: string;
      street?: string;
    };
    days?: string[];
    start_time?: string;
    end_time?: string;
    price?: string;
    payment_method?: string;
    reserved_date?: string;
  }[];
  reservations?: {
    id?: number;
    user_id?: number;
    my_sports_location_id?: number;
    reserved_date?: string;
    start_time?: string;
    end_time?: string;
    price?: string;
    payment_method?: string;
  }[];
  orders?: {
    id?: number;
    user_id?: number;
    my_sports_location_id?: number;
    reserved_date?: string;
    start_time?: string;
    end_time?: string;
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
    start_time?: string;
    end_time?: string;
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
  const regex = /^[^\s@]+@[^\s@]+\.(com|com\.br|net|yahoo|org|org\.br)$/;
  
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
      const dataUserTest: UserProprietario = {
        id: 1,
        name: "Matheus",
        email: "matheushr39@gmail.com",
        password: "admin",
        cnpj: "11.080.217/0001-75",
        phone: "15 99160-1215",
        my_sports_location: [{
          id: 1782,
          name: "Arena KS Society",
          address: {
            cep: "18213-110",
            number: "305",
            street: "Rua Alceu Correa de Moraes",
            city: "Itapetininga",
            neighborhood: "Vila Macia",
            state: "SP"
          },
          days: ["Seg", "Qua", "Qui", "SÁB"],
          start_time: "06:00",
          end_time: "23:00",
          price: "R$ 100,00",
          payment_method: "Dinheiro",
          }],
        reservations: [{
          id: 1,
          user_id: 1,
          my_sports_location_id: 1782,
          reserved_date: "2025-10-01",
          start_time: "08:00",
          end_time: "10:00",
          price: "R$ 100,00",
          payment_method: "Dinheiro"
        }],
        orders: [{
          id: 1,
          user_id: 1,
          my_sports_location_id: 1782,
          reserved_date: "2025-10-01",
          start_time: "08:00",
          end_time: "10:00",
          price: "R$ 100,00",
          payment_method: "Dinheiro"
        }]
      };

      const dataUserTestTwo: UserProprietario = {
        id: 2,
        name: "Thiago",
        email: "matheushr@gmail.com",
        password: "admin",
        cnpj: "11.080.217/0001-75",
        phone: "15 99160-1215",
      };

      const dataUserJogadorTest: UserJogador = {
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
          start_time: "20:00",
          end_time: "23:00",
          price: "R$ 300,00",
          payment_method: "Dinheiro",
          reserved_date: "29/03/2025",
        }]
      };

      localStorage.setItem("infoUser", JSON.stringify({1: dataUserJogadorTest}));

      const existingUsers = JSON.parse(localStorage.getItem("infoUserProprietario") || "{}");

      existingUsers[dataUserTest.id] = dataUserTest;
      existingUsers[dataUserTestTwo.id] = dataUserTestTwo;

      localStorage.setItem("infoUserProprietario", JSON.stringify(existingUsers));
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

      if (user && user.password === password) {
        localStorage.setItem("currentUserProprietario", JSON.stringify(user));
        router.push("/proprietario/home");
      } else {
        setErrors((prev) => ({ ...prev, form: true }));

        showToast({
          type: "error",
          message: "Email ou senha inválidos",
        });
      }
    } catch (error) {
      showToast({
        type: "error",
        message: "Ocorreu um erro durante o login",
      });
    } finally {
      setIsLoading(false);
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

              <Link href="/proprietario/cadastro">
                <SM
                  color={theme.colors.branco.principal}
                  family={theme.fonts.inter}
                >
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

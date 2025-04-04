"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Spinner } from "@chakra-ui/react";

import { Input } from "@/components/Input";
import { showToast } from "@/components/ToastAlert";
import { TitleWithButtonBack } from "@/components/TitleWithButtonBack";
import { LoginWithBannerAndModal } from "@/components/LoginWithBannerAndModal";

import * as S from "./styles";
import { theme } from "@/styles/theme";
import { LG, MD, SM } from "@/styles/typographStyles";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  cnpj: string;
  phone: string;
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

    const getUsersFromStorage = (): Record<number, User> => {
      try {
        const data = localStorage.getItem("infoUserProprietario");
        return data ? JSON.parse(data) : {};
      } catch {
        return {};
      }
    };

    const users = getUsersFromStorage();
    if (Object.keys(users).length === 0) {
      const dataUserTest: User = {
        id: 1,
        name: "Admin",
        email: "matheushr39@gmail.com",
        password: "admin",
        cnpj: "12345678901234",
        phone: "11999999999"
      };

      localStorage.setItem("infoUserProprietario", JSON.stringify({1: dataUserTest}));
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

      const users: Record<number, User> = JSON.parse(
        localStorage.getItem("infoUserProprietario") || "{}"
      );
      const user = Object.values<User>(users).find((u: User) => u.email === email);

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
              <TitleWithButtonBack
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

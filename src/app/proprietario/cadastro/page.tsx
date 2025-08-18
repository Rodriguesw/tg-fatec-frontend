"use client"

import { Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/Input';
import { TitleWithButtons } from '@/components/TitleWithButtons';
import { showToast } from '@/components/ToastAlert';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { LG } from '@/styles/typographStyles';

interface Owner {
  id: number;
  razaoSocial: string;
  cnpj: string;
  telefone: string;
  responsavel: string;
  email: string;
  password: string;
}

interface FormErrors {
  razaoSocial: boolean;
  cnpj: boolean;
  telefone: boolean;
  responsavel: boolean;
  email: boolean;
  password: boolean;
  passwordConfirmation: boolean;
}

export default function ProprietarioCadastroClient() {
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({
    razaoSocial: false,
    cnpj: false,
    telefone: false,
    responsavel: false,
    email: false,
    password: false,
    passwordConfirmation: false,
  });

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = () => {
    window.history.back();
  }

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.(com|com\.br|org|org\.br|yahoo|net)$/;
    return regex.test(email);
  };

  const validateCNPJ = (cnpj: string): boolean => {
    const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/;
    return regex.test(cnpj);
  };

  const validatePhone = (phone: string): boolean => {
    const regex = /^\(\d{2}\) \d{4,5}\-\d{4}$/;
    return regex.test(phone);
  };

  const validateFields = (): boolean => {
    const newErrors: FormErrors = {
      razaoSocial: !razaoSocial.trim(),
      cnpj: !cnpj.trim() || !validateCNPJ(cnpj),
      telefone: !telefone.trim() || !validatePhone(telefone),
      responsavel: !responsavel.trim(),
      email: !email.trim() || !validateEmail(email),
      password: !password.trim(),
      passwordConfirmation: !passwordConfirmation.trim(),
    };
    
    const hasEmptyFields = Object.values(newErrors).some(error => error);
    const hasPasswordError = password !== passwordConfirmation && password.trim() && passwordConfirmation.trim();

    if (hasPasswordError) {
      newErrors.password = true;
      newErrors.passwordConfirmation = true;
    }
    
    setErrors(newErrors);

    if (hasEmptyFields) {
      showToast({
        type: 'error',
        message: 'Preencha todos os campos corretamente'
      });
      return false;
    }

    if (hasPasswordError) {
      showToast({
        type: 'error',
        message: 'As senhas não coincidem'
      });
      return false;
    }

    return true;
  };

  const handleCreateOwner = async () => {
    if (!validateFields()) {
      return;
    }
  
    try {
      setIsLoading(true);
  
      const existingOwners: Record<number, Owner> = JSON.parse(localStorage.getItem("infoOwner") || "{}");
      const emailExists = Object.values<Owner>(existingOwners).some(owner => owner.email === email);
      
      if (emailExists) {
        setErrors(prev => ({
          ...prev,
          email: true
        }));
        
        showToast({
          type: 'error',
          message: 'Este e-mail já está cadastrado'
        });
        return;
      }

      const ids = Object.keys(existingOwners).map(Number);
      const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
  
      const payload: Owner = {
        id: newId,
        razaoSocial,
        cnpj,
        telefone,
        responsavel,
        email,
        password,
      };
  
      await new Promise(resolve => setTimeout(resolve, 500));
  
      existingOwners[newId] = payload;
      localStorage.setItem("infoOwner", JSON.stringify(existingOwners));
  
      showToast({
        type: 'success',
        message: 'Cadastro realizado com sucesso!'
      });
  
      router.push('/proprietario/login');
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Ocorreu um erro ao realizar o cadastro. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRazaoSocialChange = (value: string) => {
    setRazaoSocial(value);
    setErrors(prev => ({ ...prev, razaoSocial: false }));
  };

  const formatCNPJ = (value: string): string => {
    const digits = value.replace(/\D/g, '').substring(0, 14);
    
    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  };

  const handleCnpjChange = (value: string) => {
    const formattedValue = formatCNPJ(value);
    setCnpj(formattedValue);
    setErrors(prev => ({ ...prev, cnpj: false }));
  };

  const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    
    const limitedDigits = digits.slice(0, 11);

    if (limitedDigits.length <= 2) {
      return limitedDigits;
    }
    
    if (limitedDigits.length <= 6) {
      return `(${limitedDigits.slice(0, 2)}) ${limitedDigits.slice(2, 6)}`;
    }
    if (limitedDigits.length <= 10) {
      return `(${limitedDigits.slice(0, 2)}) ${limitedDigits.slice(2, 6)}-${limitedDigits.slice(6, 10)}`;
    }
    
    return `(${limitedDigits.slice(0, 2)}) ${limitedDigits.slice(2, 7)}-${limitedDigits.slice(7, 11)}`;
  };

  const handleTelefoneChange = (value: string) => {
    const formattedValue = formatPhone(value);
    setTelefone(formattedValue);
    setErrors(prev => ({ ...prev, telefone: false }));
  };


  const handleResponsavelChange = (value: string) => {
    setResponsavel(value);
    setErrors(prev => ({ ...prev, responsavel: false }));
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setErrors(prev => ({ ...prev, email: false }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setErrors(prev => ({ ...prev, password: false }));
  };

  const handlePasswordConfirmationChange = (value: string) => {
    setPasswordConfirmation(value);
    setErrors(prev => ({ ...prev, passwordConfirmation: false }));
  };

  if (!isMounted) return null;

  return (
    <S.Container>
        <S.Wrapper>
          <S.ContainerLogo>
            <img src="/images/logo/logo-playfut-white-fina.svg" alt="Logo PlayFut"/>
          </S.ContainerLogo>
  
          <S.Content>
            <S.ContentHeader>
              <TitleWithButtons title='Dados cadastrais' buttonBack={true} onClick={handleClick} />
            </S.ContentHeader>
  
            <S.ContentForm>
              <Input 
                id="razaoSocial"
                type='text' 
                placeholder='Razão Social' 
                label='Razão Social *' 
                onChange={handleRazaoSocialChange}
                hasError={errors.razaoSocial}
                value={razaoSocial}
              />
  
              <Input 
                id="cnpj"
                type='text' 
                placeholder='00.000.000/0000-00' 
                label='CNPJ *' 
                onChange={handleCnpjChange}
                hasError={errors.cnpj}
                value={cnpj}
              />
  
              <Input 
                id="telefone"
                type='text' 
                placeholder='(00) 00000-0000' 
                label='Telefone *' 
                onChange={handleTelefoneChange}
                hasError={errors.telefone}
                value={telefone}
              />
  
              <Input 
                id="responsavel"
                type='text' 
                placeholder='Nome do Responsável' 
                label='Nome do Responsável *' 
                onChange={handleResponsavelChange}
                hasError={errors.responsavel}
                value={responsavel}
              />
  
              <Input 
                id="email"
                type='text' 
                placeholder='email@exemplo.com' 
                label='E-mail *' 
                onChange={handleEmailChange}
                hasError={errors.email}
                value={email}
              />

              <Input 
                id="password"
                type='password' 
                placeholder='********' 
                label='Senha *' 
                onChange={handlePasswordChange}
                hasError={errors.password}
                value={password}
              />

              <Input 
                id="passwordConfirmation"
                type='password' 
                placeholder='********' 
                label='Confirmar Senha *' 
                onChange={handlePasswordConfirmationChange}
                hasError={errors.passwordConfirmation}
                value={passwordConfirmation}
              />
            </S.ContentForm>
          </S.Content>
  
          <S.Button onClick={handleCreateOwner}>
            <LG 
              weight={700}  
              color={theme.colors.branco.principal} 
              family={theme.fonts.inter}>
                {isLoading ? <Spinner /> : 'Cadastrar'}
            </LG>
          </S.Button>
        </S.Wrapper>
    </S.Container>
  );
}

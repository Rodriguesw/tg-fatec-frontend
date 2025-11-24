"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { encryptPassword } from '@/utils/crypto';

import { Spinner } from '@chakra-ui/react';

import { Input } from '@/components/Input';
import { Header } from '@/components/Header';
import { showToast } from '@/components/ToastAlert';
import { TitleWithButtons } from '@/components/TitleWithButtons';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { LG, } from '@/styles/typographStyles';

interface User {
  id: number;
  name: string;
  birth_date: string;
  gender: string;
  team: string;
  email: string;
  password: string;
}

interface FormErrors {
  name: boolean;
  birthDate: boolean;
  gender: boolean;
  team: boolean;
  email: boolean;
  password: boolean;
  passwordConfirmation: boolean;
}

export default function JogadorCadastro() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [team, setTeam] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({
    name: false,
    birthDate: false,
    gender: false,
    team: false,
    email: false,
    password: false,
    passwordConfirmation: false,
  });

  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*$/;
    return regex.test(email);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = () => {
    window.history.back();
  }

  const genderOptions = [
    { label: 'Masculino', value: 'male' },
    { label: 'Feminino', value: 'female' },
  ];

  const teamOptions = [
    { label: 'Corinthians', value: 'corinthians' },
    { label: 'Palmeiras', value: 'palmeiras' },
    { label: 'São Paulo', value: 'sao_paulo' },
    { label: 'Santos', value: 'santos' },
    { label: 'Outro', value: 'other' }
  ];

  const handleNameChange = (value: string) => {
    setName(value);
    setErrors(prev => ({ ...prev, name: false }));
  };

  const handleBirthDateChange = (value: string) => {
    setBirthDate(value);
    setErrors(prev => ({ ...prev, birthDate: false }));
  };

  const handleGenderChange = (value: string) => {
    setGender(value);
    setErrors(prev => ({ ...prev, gender: false }));
  };

  const handleTeamChange = (value: string) => {
    setTeam(value);
    setErrors(prev => ({ ...prev, team: false }));
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

  const validateFields = (): boolean => {
    const newErrors: FormErrors = {
      name: !name.trim(),
      birthDate: !birthDate.trim(),
      gender: !gender.trim(),
      team: !team.trim(),
      email: !email.trim() || !validateEmail(email),
      password: !password.trim(),
      passwordConfirmation: !passwordConfirmation.trim(),
    };
    
    const hasEmptyFields = Object.values(newErrors).some(error => error);
    
    const hasInvalidEmail = !validateEmail(email) && email.trim();
    
    const hasPasswordError = password !== passwordConfirmation && password.trim() && passwordConfirmation.trim();

    if (hasPasswordError) {
      newErrors.password = true;
      newErrors.passwordConfirmation = true;
    }
    
    setErrors(newErrors);

    if (hasEmptyFields) {
      showToast({
        type: 'error',
        message: 'Preencha todos os campos'
      });
      return false;
    }

    if (hasInvalidEmail) {
      showToast({
        type: 'error',
        message: 'Insira um e-mail válido'
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

  const validatePasswordMatch = (): boolean => {
    return password === passwordConfirmation;
  };

  const handleCreateUser = async () => {
    if (!validateFields()) {
      return;
    }
  
    try {
      setIsLoading(true);

      await new Promise(resolve => setTimeout(resolve, 1600));
  
      const existingUsers: Record<number, User> = JSON.parse(localStorage.getItem("infoUser") || "{}");
      const emailExists = Object.values<User>(existingUsers).some(user => user.email === email);
      
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

      const ids = Object.keys(existingUsers).map(Number);
      const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
      
      // Criptografa a senha antes de salvar
      const hashedPassword = await encryptPassword(password);
  
      const payload: User = {
        id: newId,
        name,
        birth_date: birthDate,
        gender,
        team,
        email,
        password: hashedPassword, // Senha criptografada
      };
  
      await new Promise(resolve => setTimeout(resolve, 750));
  
      existingUsers[newId] = payload;
      localStorage.setItem("infoUser", JSON.stringify(existingUsers));
  
      showToast({
        type: 'success',
        message: 'Cadastro feito com sucesso!'
      });
  
      router.push('/jogador/login');
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Ocorreu um erro ao realizar o cadastro. Tente novamente.'
      });
    } finally {
      setIsLoading(false); 
    }
  };

  if (!isMounted) return null;

  return (
    <S.Container>
        <S.Wrapper>
          <Header/>
  
          <S.Content>
            <S.ContentHeader>
              <TitleWithButtons title='Dados cadastrais' buttonBack={true} onClick={handleClick} />
            </S.ContentHeader>
  
            <S.ContentForm>
              <Input 
                id="name"
                type='text' 
                placeholder='Nome completo' 
                label='Nome completo *' 
                onChange={handleNameChange}
                value={name}
                hasError ={errors.name}
              />

              <Input 
                id="birthDate"
                type='date' 
                placeholder='00/00/0000' 
                label='Data de nascimento *' 
                onChange={handleBirthDateChange}
                value={birthDate}
                hasError ={errors.birthDate}
              />

              <Input 
                id="gender"
                type='select' 
                placeholder='Selecionar' 
                label='Gênero' 
                onChange={handleGenderChange}
                options={genderOptions}
                value={gender}
                hasError ={errors.gender}
              />

              <Input 
                id="team"
                type='select' 
                placeholder='Selecionar' 
                label='Time do coração' 
                onChange={handleTeamChange}
                options={teamOptions}
                value={team}
                hasError ={errors.team}
              />

              <Input 
                id="email"
                type='text' 
                placeholder='email@mail.com' 
                label='E-mail *' 
                onChange={handleEmailChange}
                value={email}
                hasError ={errors.email}
              />

              <Input 
                id="password"
                type='password' 
                placeholder='********' 
                label='Senha *' 
                onChange={handlePasswordChange}
                value={password}
                hasError ={errors.password}
              />

              <Input 
                id="passwordConfirmation"
                type='password' 
                placeholder='********' 
                label='Confirmar senha *' 
                onChange={handlePasswordConfirmationChange}
                value={passwordConfirmation}
                hasError ={errors.passwordConfirmation}
              />
            </S.ContentForm>
          </S.Content>
  
          <S.ContainerButton>
            <S.Button onClick={handleCreateUser}>
                <LG 
                  weight={700}  
                  color={theme.colors.branco.principal} 
                  family={theme.fonts.inter}>
                    {isLoading ? <Spinner /> : 'Cadastrar'}
                </LG>
            </S.Button>
          </S.ContainerButton>
        </S.Wrapper>
    </S.Container>
  );
}

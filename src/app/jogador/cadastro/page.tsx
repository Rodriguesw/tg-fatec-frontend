"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Spinner } from '@chakra-ui/react';

import { Input } from '@/components/Input';
import { Header } from '@/components/Header';
import { showToast } from '@/components/ToastAlert';
import { TitleWithButtonBack } from '@/components/TitleWithButtonBack';

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
      email: !email.trim(),
      password: !password.trim(),
      passwordConfirmation: !passwordConfirmation.trim(),
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const validatePasswordMatch = (): boolean => {
    const match = password === passwordConfirmation;

    if (!match) {
      showToast({
        type: 'error',
        message: 'As senhas não coincidem'
      });
    }
    return match;
  };

  const handleCreateUser = async () => {
    if (!validateFields() || !validatePasswordMatch()) {
      showToast({
        type: 'error',
        message: 'Preencha todos os campos'
      });
      return;
    }
  
    try {
      setIsLoading(true);
  
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
  
      const payload: User = {
        id: newId,
        name,
        birth_date: birthDate,
        gender,
        team,
        email,
        password,
      };
  
      await new Promise(resolve => setTimeout(resolve, 500));
  
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
              <TitleWithButtonBack title='Dados cadastrais' buttonBack={true} onClick={handleClick} />
            </S.ContentHeader>
  
            <S.ContentForm>
              <Input 
                type='text' 
                placeholder='Nome completo' 
                label='Nome completo *' 
                onChange={handleNameChange}
                hasError ={errors.name}
              />

              <Input 
                type='date' 
                placeholder='00/00/0000' 
                label='Data de nascimento *' 
                onChange={handleBirthDateChange}
                hasError ={errors.birthDate}
              />

              <Input 
                type='select' 
                placeholder='Selecionar' 
                label='Sexo' 
                onChange={handleGenderChange}
                options={genderOptions}
                value={gender}
                hasError ={errors.gender}
              />

              <Input 
                type='select' 
                placeholder='Selecionar' 
                label='Para que time torce?' 
                onChange={handleTeamChange}
                options={teamOptions}
                value={team}
                hasError ={errors.team}
              />

              <Input 
                type='text' 
                placeholder='email@mail.com' 
                label='E-mail *' 
                onChange={handleEmailChange}
                hasError ={errors.email}
              />

              <Input 
                type='password' 
                placeholder='********' 
                label='Senha *' 
                onChange={handlePasswordChange}
                hasError ={errors.password}
              />

              <Input 
                type='password' 
                placeholder='********' 
                label='Confirmar senha *' 
                onChange={handlePasswordConfirmationChange}
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

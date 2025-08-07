"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Header } from '@/components/Header';
import { Navbar } from '@/components/Navbar';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { showToast } from '@/components/ToastAlert';

import { Dialog, Spinner } from "@chakra-ui/react"

import * as S from './styles';
import { theme } from '@/styles/theme';
import { LG, MD, SM } from '@/styles/typographStyles';

interface FormErrors {
  name: boolean;
  birthDate: boolean;
  gender: boolean;
  team: boolean;
  email: boolean;
}

export default function JogadorPerfil() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [openMyData, setOpenMyData] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [team, setTeam] = useState('');
  const [email, setEmail] = useState('');
  
  const [errors, setErrors] = useState<FormErrors>({
    name: false,
    birthDate: false,
    gender: false,
    team: false,
    email: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);

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
  
  useEffect(() => {
    setIsMounted(true); 
  }, []);


  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);

      setName(parsedUser.name)
      setBirthDate(parsedUser.birth_date)
      setGender(parsedUser.gender)
      setTeam(parsedUser.team)
      setEmail(parsedUser.email)
    } 
  }, []);

  const handleNameChange = (value: string) => {
    setName(value);
    setErrors(prev => ({ ...prev, name: false }));
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setErrors(prev => ({ ...prev, email: false }));
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

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.(com|com\.br|org|org\.br|yahoo|net)$/;

    return regex.test(email);
  };

  const validateFields = (): boolean => {
      const newErrors: FormErrors = {
        name: !name.trim(),
        birthDate: !birthDate.trim(),
        gender: !gender.trim(),
        team: !team.trim(),
        email: !email.trim() || !validateEmail(email),
      };
      
      const hasEmptyFields = Object.values(newErrors).some(error => error);
      
      const hasInvalidEmail = !validateEmail(email) && email.trim();
      
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
  
      return true;
    };

  const handleSavedChanges = () => {
    if (!validateFields()) {
      return;
    }
    
    setIsLoading(true);

    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const infoUserRaw = localStorage.getItem('infoUser');
      const infoUser = infoUserRaw ? JSON.parse(infoUserRaw) : {};

      const updatedUser = {
        ...currentUser,
        name,
        birth_date: birthDate,
        gender,
        team,
        email,
      };

      setTimeout(() => {
        setIsLoading(false); 
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        if (updatedUser.id) {
          infoUser[updatedUser.id] = updatedUser;
          localStorage.setItem('infoUser', JSON.stringify(infoUser));
        }

        showToast({
          type: 'success',
          message: 'Suas alterações foram salvas com sucesso!'
        });

        setOpenMyData(false);
      }, 200); 

    } catch (error) {
      setIsLoading(false); 
    }
  };


  const handleDeleteAccount = () => {
    const userIdToDelete = currentUser.id;
  
    const infoUserRaw = localStorage.getItem('infoUser');
  
    if (!infoUserRaw) return;
  
    try {
      const infoUserParsed = JSON.parse(infoUserRaw);
  
      if (infoUserParsed[userIdToDelete]) {
        delete infoUserParsed[userIdToDelete];
  
        localStorage.setItem('infoUser', JSON.stringify(infoUserParsed));
  
        localStorage.removeItem('currentUser');
  
        router.push('/jogador/login');
      } else {
        console.warn('Usuário não encontrado no infoUser.');
      }
    } catch (error) {
      console.error('Erro ao fazer parse de infoUser:', error);
    }
  
    setOpenSettings(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    
    router.push('/jogador/login');
  }

  if (!isMounted) return null; 

  return (
    <S.Container>
      <S.Wrapper>
          <Header />

          <S.Content>
              <S.ContainerPhoto>
                <img src="/images/png/user-photo.png" alt="Foto do usuário"/>
              </S.ContainerPhoto>

              <S.ContainerButtons>
                <S.Button onClick={() => setOpenMyData(true)}>
                  <LG  
                    color={theme.colors.branco.secundario} 
                    family={theme.fonts.inter}>
                    Meu cadastro
                  </LG>
                </S.Button>

                <S.Button onClick={() => setOpenSettings(true)}>
                  <LG  
                    color={theme.colors.branco.secundario} 
                    family={theme.fonts.inter}>
                    Segurança
                  </LG>
                </S.Button>
          
                <S.Button onClick={handleLogout}>
                  <LG  
                    color={theme.colors.branco.secundario} 
                    family={theme.fonts.inter}>
                    Sair
                  </LG>
                </S.Button>
              </S.ContainerButtons>
            </S.Content>          
            
          <Navbar />
      </S.Wrapper>

      {openMyData && 
        <Modal isOpen={openMyData} onClose={() => setOpenMyData(false)}>
          <S.ContainerModalEdit>
            <Dialog.Header>
              <Dialog.Title textAlign="center">
                <LG color={theme.colors.branco.principal} family={theme.fonts.inter}>
                  Meu cadastro
                </LG>
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body
              gap="16px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <Input 
                id="name"
                type='text' 
                value={name}
                placeholder='Nome completo' 
                label='Nome completo *' 
                onChange={handleNameChange}
                hasError ={errors.name}
              />

              <Input 
                id="email"
                type='text' 
                value={email}
                placeholder='email@mail.com' 
                label='E-mail *' 
                onChange={handleEmailChange}
                hasError ={errors.email}
              />

              <Input 
                id="birthDate"
                type='date' 
                value={birthDate}
                placeholder='00/00/0000' 
                label='Data de nascimento *' 
                onChange={handleBirthDateChange}
                hasError ={errors.birthDate}
              />

              <Input 
                id="gender"
                type='select' 
                placeholder='Selecionar' 
                label='Sexo' 
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

              <S.ContainerButtonModalRegister>
                <S.ModalButton onClick={() => setOpenMyData(false)}>
                  <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                    Cancelar
                  </MD>
                </S.ModalButton>

                <S.ModalButton onClick={handleSavedChanges}>
                  {isLoading ? (<Spinner />) : (
                    <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                      Salvar
                    </MD>
                  )}
                </S.ModalButton>
              </S.ContainerButtonModalRegister>
            </Dialog.Body>
          </S.ContainerModalEdit>
        </Modal>
      }

      {openSettings && 
        <Modal isOpen={openSettings} onClose={() => setOpenSettings(false)}>
          <S.ContainerModalEdit>
            <Dialog.Header>
              <Dialog.Title textAlign="center">
                <LG color={theme.colors.branco.principal} family={theme.fonts.inter}>
                  Segurança
                </LG>
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body
              gap="16px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <SM
                family={theme.fonts.inter}
                color={theme.colors.branco.secundario}>
                Tem certeza de que deseja excluir permanente sua conta?
              </SM>

              <S.ContainerButtonModalSettings>
                <S.ModalButton onClick={() => setOpenSettings(false)}>
                  <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                    Cancelar
                  </MD>
                </S.ModalButton>

                <S.ModalButton onClick={handleDeleteAccount}>
                  <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                    Confirmar
                  </MD>
                </S.ModalButton>
              </S.ContainerButtonModalSettings>
            </Dialog.Body>
          </S.ContainerModalEdit>
        </Modal>
      }
    </S.Container>
  );
}

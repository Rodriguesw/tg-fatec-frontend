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
  cnpj: boolean;
  phone: boolean;
  email: boolean;
  razaoSocial: boolean; // Adicione aqui
}

export default function ProprietarioPerfil() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [openMyData, setOpenMyData] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [errors, setErrors] = useState<FormErrors>({
    name: false,
    cnpj: false,
    phone: false,
    email: false,
    razaoSocial: false, // Adicione aqui
  });
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true); 
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUserProprietario');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);

      setName(parsedUser.name)
      setCnpj(parsedUser.cnpj)
      setRazaoSocial(parsedUser.razaoSocial);
      setPhone(parsedUser.phone)
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

  const formatCNPJ = (value: string): string => {
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, '').substring(0, 14);
    
    // Aplica a máscara
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

  // Atualize seu handler:
  const handlePhoneChange = (value: string) => {
    const formattedValue = formatPhone(value);
    setPhone(formattedValue);
    setErrors(prev => ({ ...prev, phone: false }));
  };

  const handleRazaoSocialChange = (value: string) => {
    setRazaoSocial(value);
    setErrors(prev => ({ ...prev, razaoSocial: false }));
  };

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*$/;

    return regex.test(email);
  };

  const validateFields = (): boolean => {
    const newErrors: FormErrors = {
      name: !name.trim(),
      cnpj: !cnpj.trim(),
      phone: !phone.trim(),
      email: !email.trim() || !validateEmail(email),
      razaoSocial: !razaoSocial.trim(), // Adicione aqui
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
      const currentUser = JSON.parse(localStorage.getItem('currentUserProprietario') || '{}');
      const infoUserProprietarioRaw = localStorage.getItem('infoUserProprietario');
      const infoUserProprietario = infoUserProprietarioRaw ? JSON.parse(infoUserProprietarioRaw) : {};

      const updatedUser = {
        ...currentUser,
        name,
        cnpj: cnpj,
        phone,
        email,
        razaoSocial,
      };

      setTimeout(() => {
        setIsLoading(false); 
        localStorage.setItem('currentUserProprietario', JSON.stringify(updatedUser));

        if (updatedUser.id) {
          infoUserProprietario[updatedUser.id] = updatedUser;
          localStorage.setItem('infoUserProprietario', JSON.stringify(infoUserProprietario));
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
  
    const infoUserProprietarioRaw = localStorage.getItem('infoUserProprietario');
  
    if (!infoUserProprietarioRaw) return;
  
    try {
      const infoUserParsed = JSON.parse(infoUserProprietarioRaw);
  
      if (infoUserParsed[userIdToDelete]) {
        delete infoUserParsed[userIdToDelete];
  
        localStorage.setItem('infoUserProprietario', JSON.stringify(infoUserParsed));
  
        localStorage.removeItem('currentUserProprietario');
  
        router.push('/proprietario/login');
      } else {
        console.warn('Usuário não encontrado no infoUserProprietario.');
      }
    } catch (error) {
      console.error('Erro ao fazer parse de infoUserProprietario:', error);
    }
  
    setOpenSettings(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUserProprietario");

    router.push("/proprietario/login");
  }

  const closeModal = () => {
    setOpenMyData(false);

    setErrors({
      name: false,
      cnpj: false,
      phone: false,
      email: false,
      razaoSocial: false, // Adicione aqui
    });

    setName(currentUser?.name || '');
    setCnpj(currentUser?.cnpj || '');
    setPhone(currentUser?.phone || '');
    setEmail(currentUser?.email || '');
    setRazaoSocial(currentUser?.razaoSocial || ''); // Adicione aqui
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
                label='Nome completo' 
                onChange={handleNameChange}
                hasError ={errors.name}
              />

              <Input 
                id="email"
                type='text' 
                value={email}
                disabled={true}
                placeholder='email@mail.com' 
                label='E-mail' 
                onChange={handleEmailChange}
                hasError ={errors.email}
              />

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
                value={cnpj}
                placeholder='12.345.678/0001-91' 
                label='CNPJ' 
                onChange={handleCnpjChange}
                hasError ={errors.cnpj}
              />

              <Input 
                id="phone"
                type='text' 
                placeholder='15 99999-9999' 
                label='Telefone' 
                onChange={handlePhoneChange}
                value={phone}
                hasError ={errors.phone}
              />

              <S.ContainerButtonModalRegister>
                <S.ModalButton onClick={() => closeModal()}>
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

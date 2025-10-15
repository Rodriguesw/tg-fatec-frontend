"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AvatarEditor from 'react-avatar-editor';

import { Header } from '@/components/Header';
import { Navbar } from '@/components/Navbar';
import { Modal } from '@/components/Modal';
import { PageModal } from '@/components/PageModal';
import { Input } from '@/components/Input';
import { showToast } from '@/components/ToastAlert';

import { Dialog, Spinner, Button as ChakraButton } from "@chakra-ui/react"
import { H3, LG, MD, SM } from "@/styles/typographStyles";

import * as S from './styles';
import { theme } from '@/styles/theme';

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
  const [openPhotoEditor, setOpenPhotoEditor] = useState(false);
  
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [team, setTeam] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  
  // Estados para o editor de imagem
  const [image, setImage] = useState<File | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const editorRef = useRef<AvatarEditor | null>(null);
  
  const [errors, setErrors] = useState<FormErrors>({
    name: false,
    birthDate: false,
    gender: false,
    team: false,
    email: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDeleteAccount, setLoadingDeleteAccount] = useState(false);

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

  const [loadingPhoto, setLoadingPhoto] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
  }, [isMounted]);


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
      
      // Carregar a foto do usuário, se existir
      if (parsedUser.photo) {
        setPhoto(parsedUser.photo);
      }
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
    const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*$/;

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

  // Função para lidar com o upload de imagem
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setOpenPhotoEditor(true);
    }
  };

  // Função para salvar a imagem editada
  const handleSaveImage = async () => {
    setLoadingPhoto(true);

    await new Promise(resolve => setTimeout(resolve, 1350));

    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const dataURL = canvas.toDataURL('image/png');
      setPhoto(dataURL);
      
      // Atualizar o usuário com a nova foto
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const infoUserRaw = localStorage.getItem('infoUser');
        const infoUser = infoUserRaw ? JSON.parse(infoUserRaw) : {};

        const updatedUser = {
          ...currentUser,
          photo: dataURL
        };

        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        if (updatedUser.id) {
          infoUser[updatedUser.id] = {
            ...infoUser[updatedUser.id],
            photo: dataURL
          };
          localStorage.setItem('infoUser', JSON.stringify(infoUser));
        }

        showToast({
          type: 'success',
          message: 'Foto atualizada com sucesso!'
        });

        setOpenPhotoEditor(false);
      } catch (error) {
        console.error('Erro ao salvar a imagem:', error);
        showToast({
          type: 'error',
          message: 'Erro ao salvar a imagem'
        });
      } finally {
        setLoadingPhoto(false);
      }
    }
  };

  const handleSavedChanges = async () => {
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
        photo: photo || currentUser.photo // Manter a foto atual ou usar a nova
      };

      await new Promise(resolve => setTimeout(resolve, 1000));

      setTimeout(() => {
        setIsLoading(false); 
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        if (updatedUser.id) {
          infoUser[updatedUser.id] = {
            ...infoUser[updatedUser.id],
            ...updatedUser
          };
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

  const handleCloseModalUserEdit = () => {
    setOpenMyData(false);

    setName(currentUser.name);
    setBirthDate(currentUser.birth_date);
    setGender(currentUser.gender);
    setTeam(currentUser.team);
    setEmail(currentUser.email);

    setErrors({
      name: false,
      birthDate: false,
      gender: false,
      team: false,
      email: false,
    });
  }

  const handleDeleteAccount = async () => {
    setLoadingDeleteAccount(true);

    const userIdToDelete = currentUser.id;
  
    const infoUserRaw = localStorage.getItem('infoUser');
  
    if (!infoUserRaw) return;
  
    try {
      const infoUserParsed = JSON.parse(infoUserRaw);
  
      if (infoUserParsed[userIdToDelete]) {
        await new Promise(resolve => setTimeout(resolve, 1200));

        delete infoUserParsed[userIdToDelete];
  
        localStorage.setItem('infoUser', JSON.stringify(infoUserParsed));
  
        localStorage.removeItem('currentUser');

        showToast({
          type: 'success',
          message: 'Conta excluída com sucesso!'
        });
  
        router.push('/jogador/login');
      } else {
        console.warn('Usuário não encontrado no infoUser.');
      }
    } catch (error) {
      console.error('Erro ao fazer parse de infoUser:', error);
    } finally {
      setLoadingDeleteAccount(false);
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
              <S.ContainerPhoto hasPhoto={!!photo}>
                <img 
                  src={photo || "/images/svg/icon-user.svg"} 
                  alt="Foto do usuário"
                />
                <S.PhotoButtonsContainer>
                  <S.PhotoButton as="label" htmlFor="photo-upload">
                    <img src="/images/svg/camera.svg" alt="Câmera" />
                    <input 
                      type="file" 
                      id="photo-upload" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={handleImageUpload} 
                    />
                  </S.PhotoButton>
                  <S.PhotoButton 
                    onClick={() => {
                      setPhoto(null);
                      
                      // Atualizar o localStorage
                      try {
                        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                        const infoUserRaw = localStorage.getItem('infoUser');
                        const infoUser = infoUserRaw ? JSON.parse(infoUserRaw) : {};

                        const updatedUser = {
                          ...currentUser,
                          photo: null
                        };

                        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

                        if (updatedUser.id && infoUser[updatedUser.id]) {
                          infoUser[updatedUser.id] = {
                            ...infoUser[updatedUser.id],
                            photo: null
                          };
                          localStorage.setItem('infoUser', JSON.stringify(infoUser));
                        }

                        showToast({
                          type: 'success',
                          message: 'Foto removida com sucesso!'
                        });
                      } catch (error) {
                        console.error('Erro ao remover a foto:', error);
                      }
                    }}
                  >
                    <img src="/images/svg/trash.svg" alt="Lixeira" />
                  </S.PhotoButton>
                </S.PhotoButtonsContainer>
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

      {openPhotoEditor && (
        <Modal isOpen={openPhotoEditor} onClose={() => setOpenPhotoEditor(false)}>
          <S.ContainerModalEdit>
            <Dialog.Header>
                <H3 color={theme.colors.laranja}>
                  Editar foto
                </H3>
              </Dialog.Header>

            <Dialog.Body
              gap="16px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              {image && (
                <>
                  <AvatarEditor
                    ref={editorRef}
                    image={image}
                    width={250}
                    height={250}
                    border={50}
                    borderRadius={125}
                    color={[0, 0, 0, 0.6]}
                    scale={scale}
                    rotate={rotation}
                  />
                  
                  <S.EditorControls>
                    <S.ControlGroup>
                      <S.ControlLabel>Zoom</S.ControlLabel>
                      <S.RangeInput 
                        type="range" 
                        min="1" 
                        max="3" 
                        step="0.01" 
                        value={scale} 
                        onChange={(e) => setScale(parseFloat(e.target.value))} 
                      />
                    </S.ControlGroup>
                    
                    <S.ControlGroup>
                      <S.ControlLabel>Rotação</S.ControlLabel>
                      <S.RangeInput 
                        type="range" 
                        min="0" 
                        max="360" 
                        step="1" 
                        value={rotation} 
                        onChange={(e) => setRotation(parseInt(e.target.value))} 
                      />
                    </S.ControlGroup>
                  </S.EditorControls>
                  
                  <S.ContainerButtonModalRegister>
                    <S.ModalButton onClick={() => setOpenPhotoEditor(false)}>
                      <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                        Cancelar
                      </MD>
                    </S.ModalButton>
                    
                    <S.ModalButton onClick={handleSaveImage}>
                      {loadingPhoto ?  <Spinner /> : <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                        Salvar
                      </MD>}
                    </S.ModalButton>
                  </S.ContainerButtonModalRegister>
                </>
              )}
            </Dialog.Body>
          </S.ContainerModalEdit>
        </Modal>
      )}

      {openMyData && 
        <Modal isOpen={openMyData} onClose={() => setOpenMyData(false)}>
          <S.ContainerModalEdit>
            <Dialog.Header>
              <H3 color={theme.colors.laranja}>
                  Meu cadastro
              </H3>
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
                id="birthDate"
                type='date' 
                value={birthDate}
                placeholder='00/00/0000' 
                label='Data de nascimento' 
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
                <S.ModalButton onClick={handleCloseModalUserEdit}>
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

      {openSettings ? (
        <Modal isOpen={openSettings} onClose={() => setOpenSettings(false)}>
          <S.ContainerModalEdit>
            <Dialog.Header>
              <H3 color={theme.colors.laranja}>Segurança Teste 16</H3>
            </Dialog.Header>

            <Dialog.Body
              gap="16px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <MD family={theme.fonts.inter} color={theme.colors.branco.secundario}>
                Tem certeza de que deseja excluir permanente sua conta?
              </MD>

              <S.ContainerButtonModalSettings>
                <S.ModalButton onClick={() => setOpenSettings(false)}>
                  <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                    Cancelar
                  </MD>
                </S.ModalButton>

                <S.ModalButton onClick={handleDeleteAccount}>
                  {loadingDeleteAccount ? (
                    <Spinner />
                  ) : (
                    <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                      Confirmar
                    </MD>
                  )}
                </S.ModalButton>
              </S.ContainerButtonModalSettings>
            </Dialog.Body>
          </S.ContainerModalEdit>
        </Modal>
      ) : null}

      <PageModal openDelay={100} visibleDuration={200}>A</PageModal>
    </S.Container>
  );
}

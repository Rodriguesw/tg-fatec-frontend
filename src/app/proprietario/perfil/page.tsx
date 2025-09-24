"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { Header } from '@/components/Header';
import { Navbar } from '@/components/Navbar';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { showToast } from '@/components/ToastAlert';

import { Dialog, Spinner } from "@chakra-ui/react"
import AvatarEditor from 'react-avatar-editor';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { H3, LG, MD, SM } from '@/styles/typographStyles';

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
  const [openPhotoEditor, setOpenPhotoEditor] = useState(false);
  
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  
  // Estados para o editor de imagem
  const [image, setImage] = useState<File | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const editorRef = useRef<AvatarEditor | null>(null);
  const [errors, setErrors] = useState<FormErrors>({
    name: false,
    cnpj: false,
    phone: false,
    email: false,
    razaoSocial: false, // Adicione aqui
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);

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
        const currentUser = JSON.parse(localStorage.getItem('currentUserProprietario') || '{}');
        const infoUserProprietarioRaw = localStorage.getItem('infoUserProprietario');
        const infoUserProprietario = infoUserProprietarioRaw ? JSON.parse(infoUserProprietarioRaw) : {};

        const updatedUser = {
          ...currentUser,
          photo: dataURL
        };

        localStorage.setItem('currentUserProprietario', JSON.stringify(updatedUser));

        if (updatedUser.id) {
          infoUserProprietario[updatedUser.id] = {
            ...infoUserProprietario[updatedUser.id],
            photo: dataURL
          };
          localStorage.setItem('infoUserProprietario', JSON.stringify(infoUserProprietario));
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

    await new Promise(resolve => setTimeout(resolve, 2300));

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
        photo: photo || currentUser.photo // Manter a foto atual ou usar a nova
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
  
  const handleDeleteAccount = async () => {
    setLoadingDelete(true);

    const userIdToDelete = currentUser.id;
  
    const infoUserProprietarioRaw = localStorage.getItem('infoUserProprietario');
  
    if (!infoUserProprietarioRaw) return;

    await new Promise(resolve => setTimeout(resolve, 1800));
  
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
    } finally {
      setLoadingDelete(false);
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
                      const currentUser = JSON.parse(localStorage.getItem('currentUserProprietario') || '{}');
                      const infoUserProprietarioRaw = localStorage.getItem('infoUserProprietario');
                      const infoUserProprietario = infoUserProprietarioRaw ? JSON.parse(infoUserProprietarioRaw) : {};

                      const updatedUser = {
                        ...currentUser,
                        photo: null
                      };

                      localStorage.setItem('currentUserProprietario', JSON.stringify(updatedUser));

                      if (updatedUser.id && infoUserProprietario[updatedUser.id]) {
                        infoUserProprietario[updatedUser.id] = {
                          ...infoUserProprietario[updatedUser.id],
                          photo: null
                        };
                        localStorage.setItem('infoUserProprietario', JSON.stringify(infoUserProprietario));
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
                      {loadingPhoto ? (
                        <Spinner />
                      ) : (
                        <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                          Salvar
                        </MD>
                      )}
                    </S.ModalButton>
                  </S.ContainerButtonModalRegister>
                </>
              )}
            </Dialog.Body>
          </S.ContainerModalEdit>
        </Modal>
      )}

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
                  {loadingDelete ? (
                    <Spinner/>
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
      }
    </S.Container>
  );
}

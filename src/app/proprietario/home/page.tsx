"use client";

import { useEffect, useState } from 'react';

import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Navbar } from '@/components/Navbar';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { MD, LG, SM, H3 } from '@/styles/typographStyles';

import { Modal } from '@/components/Modal';
import { TitleWithButtons } from '@/components/TitleWithButtons';
import { CardMyProperty } from '@/components/CardMyProperty';

import { Dialog, Spinner } from "@chakra-ui/react"
import { fetchCEP } from '@/services/BuscaCep';
import  { WeekdayMultiSelect } from '@/components/Multiple';
import { InputHours } from '@/components/inputHours';
import { showToast } from '@/components/ToastAlert';

interface CEPData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface FormErrors {
  nameLocalSport?: boolean;
  typeLocalSport?: boolean;
  cep?: boolean;
  number?: boolean;
  adressLocalSport?: boolean;
  selectedDays?: boolean;
  valueInputStartHours?: boolean;
  valueInputEndHours?: boolean;
  valuePerHour?: boolean;
  method?: boolean;
  timeConflict?: boolean;
}

export default function ProprietarioHome() {
  const [isMounted, setIsMounted] = useState(false);

  const [currentUserProprietario, setCurrentUserProprietario] = useState<any>(null);
  //Modal de Reserva
  const [newModalLocalSport, setNewModalLocalSport] = useState(false);

  const [nameLocalSport, setNameLocalSport] = useState('');
  const [typeLocalSport, setTypeLocalSport] = useState('');
  const [cep, setCep] = useState('');
  const [dataCep, setDataCep] = useState<CEPData | null>(null);
  const [number, setNumber] = useState('');
  const [adressLocalSport, setAdressLocalSport] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [valueInputStartHours, setValueInputStartHours] = useState("");
  const [valueInputEndHours, setValueInputEndHours] = useState("");
  const [valuePerHour, setValuePerHour] = useState('');

  const [method, setMethod] = useState('Dinheiro');
  const methodOptions = [
    { label: 'Dinheiro', value: 'Dinheiro' },
  ];
  
  const typeOptions = [
    { label: 'Futsal', value: 'Futsal' },
    { label: 'Society', value: 'Society' },
    { label: 'Futebol', value: 'Futebol' },
  ];

  const [errors, setErrors] = useState<FormErrors>({});

  const [editItem, setEditItem] = useState<any | null>(null);

  //Modal de confirmação de exclusão
  const [openDeleteLocal, setOpenDeleteLocal] = useState(false);

  useEffect(() => {
    setIsMounted(true); 
  }, []);

   useEffect(() => {
       const storedSport = localStorage.getItem('currentUserProprietario');
  
      if (storedSport) {
        const parsedUser = JSON.parse(storedSport);
        setCurrentUserProprietario(parsedUser);
      } 
    }, []);

  const handleNameChange = (value: string) => {
    setNameLocalSport(value);
    setErrors(prev => ({ ...prev, nameLocalSport: false }));
  };
  
  const handleTypeChange = (value: string) => {
    setTypeLocalSport(value);
    setErrors(prev => ({ ...prev, typeLocalSport: false }));
  };

  const handleCepChange = async (value: string) => {
    let newValue = value.replace(/\D/g, '');
    let valueWithOutMask = "";

    setErrors(prev => ({ ...prev, cep: false }));

    if (newValue.length === 8) {
      valueWithOutMask = newValue
    }

    if (newValue.length > 5) {
      newValue = newValue.substring(0, 5) + '-' + newValue.substring(5, 8);
    }
    setCep(newValue);

    if (valueWithOutMask.length === 8) {
      const data = await fetchCEP(valueWithOutMask);

      setDataCep(data)
      setAdressLocalSport(data.logradouro);
      setErrors(prev => ({ ...prev, adressLocalSport: false }));
    }
  };

  const handleNumberChange = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, ""); 

    setNumber(onlyNumbers);
    setErrors(prev => ({ ...prev, number: false }));
  };

  const handleAddressLocalSportChange = (value: string) => {
    setAdressLocalSport(value);
    setErrors(prev => ({ ...prev, adressLocalSport: false }));
  };

  const handleHoursStartChange = (value: string) => {
    setValueInputStartHours(value)
    setErrors(prev => ({ ...prev, valueInputStartHours: false }));
  }

  const handleHoursEndChange = (value: string) => {
    setValueInputEndHours(value)
    setErrors(prev => ({ ...prev, valueInputEndHours: false }));
  }

  // Converte o valor do horário para número (ex: "13:00" => 13)
  const getHourAsNumber = (time: string) => {
    const [hourStr] = time.split(':')
    return parseInt(hourStr, 10)
  }

  const minEndHour = getHourAsNumber(valueInputStartHours) + 1

  const handleValuePerHourChange = (value: string) => {
    setErrors(prev => ({ ...prev, valuePerHour: false }));

    const digitsOnly = value.replace(/\D/g, '');
    
    const number = Number(digitsOnly) / 100;
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(number);
    
    setValuePerHour(formatted);
  };

  const handleMethodChange = (value: string) => {
    setMethod(value);
  };

  const validateCEP = (cep: string): boolean => {
    const cleanedCEP = cep.replace(/\D/g, '');
    return cleanedCEP.length === 8;
  };

  const validateNumber = (number: string): boolean => {
    return /^\d+$/.test(number) && number.length > 0;
  };

  const validateCurrency = (value: string): boolean => {
    return /^R\$\s\d+,\d{2}$/.test(value);
  };

  // Função para geocodificar endereço e obter coordenadas
  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyAPxmDGktAh6A-WF8xcIkjz4568vuBa0n0`
      );
      const data = await response.json();
  
      if (data.status === "OK") {
        const location = data.results[0].geometry.location;
        
        return {
          lat: location.lat,
          lng: location.lng,
        };
      } else {
        console.error("Geocoding error:", data.status);
        return null;
      }
    } catch (error) {
      console.error("Erro ao geocodificar endereço:", error);
      return null;
    }
  };

  // Função para determinar o ícone com base no tipo de propriedade
  const getIconByType = (type: string) => {
    switch(type.toLowerCase()) {
      case 'futsal':
        return { url: '/images/svg/icon-marker-map-blue.svg' };
      case 'society':
        return { url: '/images/svg/icon-marker-map-orange.svg' };
      case 'futebol':
        return { url: '/images/svg/icon-marker-map-green.svg' };
      default:
        return { url: '/images/svg/icon-marker-map-blue.svg' };
    }
  };

  const handleCreateLocalSport = async () => {
    if (
      !nameLocalSport ||
      !typeLocalSport ||
      !cep ||
      !number ||
      !adressLocalSport ||
      !selectedDays ||
      !valueInputStartHours ||
      !valueInputEndHours ||
      !valuePerHour ||
      !method
    ) {
      const newErrors: FormErrors = {
        nameLocalSport: !nameLocalSport,
        typeLocalSport: !typeLocalSport,
        cep: !validateCEP(cep),
        number: !validateNumber(number),
        adressLocalSport: !adressLocalSport,
        selectedDays: selectedDays.length === 0,
        valueInputStartHours: !valueInputStartHours,
        valueInputEndHours: !valueInputEndHours,
        valuePerHour: !validateCurrency(valuePerHour),
        method: !method,
      };
      
      setErrors(newErrors);
      
      const hasErrors = Object.values(newErrors).some(error => error);

      if (hasErrors) {
        showToast({
          type: "error",
          message: "Verifique todos os campos em vermelho.",
        });
        return;
      }
    }

    // Cria o objeto do novo local esportivo
    const newSportsLocation = {
      id: Date.now(),
      name: nameLocalSport,
      type: typeLocalSport,
      address: {
        id: Date.now() + 1, 
        cep,
        number,
        street: adressLocalSport,
        city: dataCep?.localidade, 
        state: dataCep?.uf,
      },
      days: selectedDays,
      time_start: valueInputStartHours,
      time_end: valueInputEndHours,
      price: valuePerHour,
      payment_method: method
    };


    try {
      // Atualiza o usuário atual
      const currentUser = JSON.parse(localStorage.getItem('currentUserProprietario') || '{}');
      if (!currentUser.my_sports_location) {
        currentUser.my_sports_location = [];
      }
      currentUser.my_sports_location.push(newSportsLocation);
      localStorage.setItem('currentUserProprietario', JSON.stringify(currentUser));
      setCurrentUserProprietario(currentUser);

      const infoUsersObj = JSON.parse(localStorage.getItem('infoUserProprietario') || '{}');
      
      // Atualiza o usuário no objeto infoUserProprietario
      if (infoUsersObj[currentUser.id]) {
        if (!infoUsersObj[currentUser.id].my_sports_location) {
          infoUsersObj[currentUser.id].my_sports_location = [];
        }
        infoUsersObj[currentUser.id].my_sports_location.push(newSportsLocation);
      } else {
        // Se o usuário não existir no infoUserProprietario, adiciona-o
        infoUsersObj[currentUser.id] = currentUser;
      }

      localStorage.setItem('infoUserProprietario', JSON.stringify(infoUsersObj));

      // Adicionar a propriedade ao mapMarkers
      const fullAddress = `${adressLocalSport}, ${number}, ${dataCep?.localidade || ''}, ${dataCep?.uf || ''}`;
      const coordinates = await geocodeAddress(fullAddress);
      
      if (coordinates) {
        // Obter os marcadores existentes
        const storedMarkers = JSON.parse(localStorage.getItem('mapMarkers') || '[]');
        
        // Gerar um novo ID para o marcador (maior ID existente + 1)
        const maxId = storedMarkers.reduce((max: number, marker: any) => 
          marker.id > max ? marker.id : max, 0);
        
        // Criar o novo marcador
        const newMarker = {
          id: maxId + 1,
          lat: coordinates.lat,
          lng: coordinates.lng,
          title: nameLocalSport,
          icon: getIconByType(typeLocalSport),
          address: {
            cep,
            number
          },
          rating: 0, // Rating inicial como 0
          price: valuePerHour, // Valor por hora
          time_start: valueInputStartHours, // Hora de início
          time_end: valueInputEndHours, // Hora de término
          days: selectedDays // Dias da semana disponíveis
        };
        
        // Adicionar o novo marcador à lista e salvar no localStorage
        storedMarkers.push(newMarker);
        localStorage.setItem('mapMarkers', JSON.stringify(storedMarkers));
      }

      showToast({
        type: "success",
        message: "Propriedade criada com sucesso!",
      });

      setNewModalLocalSport(false);

      // Limpando inputs
      setNameLocalSport('');
      setTypeLocalSport('');
      setCep('');
      setNumber('');
      setAdressLocalSport('');
      setSelectedDays([]);
      setValueInputStartHours('');
      setValueInputEndHours('');
      setValuePerHour('');
    } catch (error) {
      console.error("Erro ao salvar quadra", error);
    }
  };

  const closeModal = () => {
    setNewModalLocalSport(false);

    //Limpando inputs
    setNameLocalSport('')
    setTypeLocalSport('')
    setCep('')
    setNumber('')
    setAdressLocalSport('')
    setSelectedDays([])
    setValueInputStartHours('')
    setValueInputEndHours('')
    setValuePerHour('')

    //LImpando erros
     setErrors({
      nameLocalSport: false,
      typeLocalSport: false,
      cep: false,
      number: false,
      adressLocalSport: false,
      selectedDays: false,
      valueInputStartHours: false,
      valueInputEndHours: false,
      valuePerHour: false,
    });
  };

  const handleEdit = (item: any) => {
    setEditItem(item);

    setNameLocalSport(item.name);
    setTypeLocalSport(item.type || '');
    setCep(item.address.cep);
    setNumber(item.address.number);
    setAdressLocalSport(item.address.street);
    setSelectedDays(item.days);
    setValueInputStartHours(item.time_start);
    setValueInputEndHours(item.time_end);
    setValuePerHour(item.price);
    setMethod(item.payment_method);

    setNewModalLocalSport(true);
  };

  const handleSavedSportLocation = async () => {
    if (!editItem) return;

    const storedData = JSON.parse(localStorage.getItem("currentUserProprietario") || "{}");

    const updatedLocations = storedData.my_sports_location.map((location: any) => {
      if (location.id === editItem.id) {
        return {
          ...location,
          name: nameLocalSport,
          type: typeLocalSport,
          address: {
            ...location.address,
            cep,
            number,
            street: adressLocalSport,
          },
          days: selectedDays,
          time_start: valueInputStartHours,
          time_end: valueInputEndHours,
          price: valuePerHour,
          payment_method: method
        };
      }
      return location;
    });

    const updatedData = {
      ...storedData,
      my_sports_location: updatedLocations
    };
    
    localStorage.setItem("currentUserProprietario", JSON.stringify(updatedData));
    setCurrentUserProprietario(updatedData);
    
    // Atualiza também o infoUserProprietario
    const storedAllUsersObj = JSON.parse(localStorage.getItem("infoUserProprietario") || "{}");
    
    // Atualiza o usuário no objeto infoUserProprietario
    if (storedAllUsersObj[updatedData.id]) {
      storedAllUsersObj[updatedData.id] = {
        ...storedAllUsersObj[updatedData.id],
        my_sports_location: updatedData.my_sports_location
      };
    }
    
    localStorage.setItem("infoUserProprietario", JSON.stringify(storedAllUsersObj));
    
    // Atualiza o mapMarkers se a propriedade já existir lá
    const storedMarkers = JSON.parse(localStorage.getItem('mapMarkers') || '[]');
    const markerIndex = storedMarkers.findIndex((marker: any) => 
      marker.title === editItem.name && 
      marker.address?.cep === editItem.address?.cep && 
      marker.address?.number === editItem.address?.number
    );
    
    if (markerIndex !== -1) {
      // Se o endereço mudou, precisamos obter novas coordenadas
      if (cep !== editItem.address?.cep || number !== editItem.address?.number || adressLocalSport !== editItem.address?.street) {
        const fullAddress = `${adressLocalSport}, ${number}, ${dataCep?.localidade || ''}, ${dataCep?.uf || ''}`;
        const coordinates = await geocodeAddress(fullAddress);
        
        if (coordinates) {
          storedMarkers[markerIndex] = {
            ...storedMarkers[markerIndex],
            lat: coordinates.lat,
            lng: coordinates.lng,
            title: nameLocalSport,
            icon: getIconByType(typeLocalSport),
            address: {
              cep,
              number,
              street: adressLocalSport,
              city: dataCep?.localidade,
              state: dataCep?.uf
            },
            price: valuePerHour,
            time_start: valueInputStartHours,
            time_end: valueInputEndHours,
            days: selectedDays
          };
        }
      } else {
        // Se apenas o nome ou tipo mudou (ou outros dados não relacionados ao endereço)
        storedMarkers[markerIndex] = {
          ...storedMarkers[markerIndex],
          title: nameLocalSport,
          icon: getIconByType(typeLocalSport),
          address: {
            ...storedMarkers[markerIndex].address,
            cep,
            number,
            street: adressLocalSport
          },
          price: valuePerHour,
          time_start: valueInputStartHours,
          time_end: valueInputEndHours,
          days: selectedDays
        };
      }
      
      localStorage.setItem('mapMarkers', JSON.stringify(storedMarkers));
    } else {
      // Se o marcador não foi encontrado no mapMarkers, mas deveria existir, vamos criar um novo
      const fullAddress = `${adressLocalSport}, ${number}, ${dataCep?.localidade || ''}, ${dataCep?.uf || ''}`;
      const coordinates = await geocodeAddress(fullAddress);
      
      if (coordinates) {
        // Obter os marcadores existentes
        const maxId = storedMarkers.reduce((max: number, marker: any) => 
          marker.id > max ? marker.id : max, 0);
        
        // Criar o novo marcador
        const newMarker = {
          id: maxId + 1,
          lat: coordinates.lat,
          lng: coordinates.lng,
          title: nameLocalSport,
          icon: getIconByType(typeLocalSport),
          address: {
            cep,
            number,
            street: adressLocalSport,
            city: dataCep?.localidade,
            state: dataCep?.uf
          },
          rating: 0, // Rating inicial como 0
          price: valuePerHour, // Valor por hora
          time_start: valueInputStartHours, // Hora de início
          time_end: valueInputEndHours, // Hora de término
          days: selectedDays // Dias da semana disponíveis
        };
        
        // Adicionar o novo marcador à lista e salvar no localStorage
        storedMarkers.push(newMarker);
        localStorage.setItem('mapMarkers', JSON.stringify(storedMarkers));
      }
    }

    showToast({
      type: "success",
      message: "Propriedade atualizada com sucesso!",
    });

    // Fecha modal e limpa estados
    setEditItem(null);
    setNewModalLocalSport(false);

    //Limpando inputs
    setNameLocalSport('')
    setTypeLocalSport('')
    setCep('')
    setNumber('')
    setAdressLocalSport('')
    setSelectedDays([])
    setValueInputStartHours('')
    setValueInputEndHours('')
    setValuePerHour('')

    //LImpando erros
    setErrors({
      nameLocalSport: false,
      typeLocalSport: false,
      cep: false,
      number: false,
      adressLocalSport: false,
      selectedDays: false,
      valueInputStartHours: false,
      valueInputEndHours: false,
      valuePerHour: false,
    });
  };

  const handleDeletedSportLocation = () => {
    if (!editItem) return;

    const storedCurrentUser = JSON.parse(localStorage.getItem("currentUserProprietario") || "{}");
    const updatedLocations = storedCurrentUser.my_sports_location.filter(
      (location: any) => location.id !== editItem.id
    );
    const updatedCurrentUser = {
      ...storedCurrentUser,
      my_sports_location: updatedLocations
    };
    localStorage.setItem("currentUserProprietario", JSON.stringify(updatedCurrentUser));
    setCurrentUserProprietario(updatedCurrentUser);
 // Atualiza o infoUserProprietario
    const storedAllUsersObj = JSON.parse(localStorage.getItem("infoUserProprietario") || "{}");
    
    if (storedAllUsersObj[updatedCurrentUser.id]) {
      storedAllUsersObj[updatedCurrentUser.id] = {
        ...storedAllUsersObj[updatedCurrentUser.id],
        my_sports_location: updatedCurrentUser.my_sports_location
      };
      
      localStorage.setItem("infoUserProprietario", JSON.stringify(storedAllUsersObj));
    }

    // Remove a propriedade do mapMarkers
     const storedMarkers = JSON.parse(localStorage.getItem('mapMarkers') || '[]');
     const updatedMarkers = storedMarkers.filter((marker: any) => 
       !(marker.title === editItem.name && 
         marker.address?.cep === editItem.address?.cep && 
         marker.address?.number === editItem.address?.number)
     );
     
     localStorage.setItem('mapMarkers', JSON.stringify(updatedMarkers));

    showToast({
      type: "success",
      message: "Propriedade excluída com sucesso!",
    });

    setEditItem(null);
    setNewModalLocalSport(false);
    setNameLocalSport('');
    setTypeLocalSport('');
    setCep('');
    setNumber('');
    setAdressLocalSport('');
    setSelectedDays([]);
    setValueInputStartHours('');
    setValueInputEndHours('');
    setValuePerHour('');

    setErrors({
      nameLocalSport: false,
      typeLocalSport: false,
      cep: false,
      number: false,
      adressLocalSport: false,
      selectedDays: false,
      valueInputStartHours: false,
      valueInputEndHours: false,
      valuePerHour: false,
    });
  };

  if (!isMounted) return null; 

  return (
    <S.Container>
      <S.Wrapper>
          <Header />

          <S.Content>
            <TitleWithButtons buttonAdd={true} title='Minhas propriedades' onClick={() => {setNewModalLocalSport(true), setEditItem(null)}}/>
              
            {currentUserProprietario?.my_sports_location?.length > 0 ? (
              <CardMyProperty onEdit={handleEdit} />
            ):(
            <S.ContainerNotFoundLocal>
              <img src="/images/png/image-futebol-local.png" alt="Imagem campo de futebol"/>

              <LG 
              family={theme.fonts.inter} 
              color={theme.colors.branco.secundario}>
                Você não tem propriedades <br/>cadastradas.
              </LG>

              <SM
                family={theme.fonts.inter}
                color={theme.colors.branco.secundario}>
                Para começar clique no + acima e <br/>adicione uma propriedade.
              </SM>
            </S.ContainerNotFoundLocal>)}
            
          </S.Content>          
          <Navbar />
      </S.Wrapper>

      {newModalLocalSport  && (
        <Modal isOpen={true} onClose={closeModal} width="350px" >
          <S.ContainerModalLocalSport>
            <Dialog.Header width="100%" display="flex" flexDirection="row" justifyContent="space-between">
                <H3 color={theme.colors.laranja}>
                    {editItem ? 'Editar quadra' : "Nova quadra"}
                </H3>

                <button onClick={() => {closeModal()}}>
                  <img src="/images/svg/icon-close-white.svg" alt="Fechar"/>
                </button> 
            </Dialog.Header>
          
            <Dialog.Body gap="24px" display="flex" flexDirection="column" alignItems="center">
              <S.ContainerContentModalLocalSport>
                <Input 
                  id="name"
                  type='text' 
                  placeholder='Nome' 
                  label='Nome da propriedade' 
                  value={nameLocalSport}
                  onChange={handleNameChange}
                  hasError ={errors.nameLocalSport}
                />
                
                <Input 
                  id="type"
                  type='select' 
                  placeholder='Selecionar' 
                  label='Tipo de propriedade' 
                  onChange={handleTypeChange}
                  options={typeOptions}
                  value={typeLocalSport}
                  hasError ={errors.typeLocalSport}
                />

                <S.ContainerWithTwoInputs>
                  <Input 
                    id="name"
                    type='text' 
                    placeholder='00000-000' 
                    label='CEP' 
                    value={cep}
                    onChange={handleCepChange}
                    hasError ={errors.cep}
                  />

                  <Input 
                    id="name"
                    type='text' 
                    placeholder='0000' 
                    label='Número' 
                    value={number}
                    onChange={handleNumberChange}
                    hasError ={errors.number}
                  />
                </S.ContainerWithTwoInputs>

                <Input 
                  id="name"
                  type='text' 
                  placeholder='Rua' 
                  label='Endereço' 
                  value={adressLocalSport}
                  onChange={handleAddressLocalSportChange}
                  hasError ={errors.adressLocalSport}
                />

                <WeekdayMultiSelect value={selectedDays} onChange={(values) => {setSelectedDays(values), setErrors(prev => ({ ...prev, selectedDays: false }));}} hasError={errors.selectedDays}/>

                <S.ContainerWithTwoInputs>
                  <InputHours 
                    label="Horário"
                    disabled={false}
                    value={valueInputStartHours} 
                    onChange={handleHoursStartChange}  
                    minHour={6}
                    maxHour={22}
                    hasError={errors.valueInputStartHours}
                    width='100%'
                  />

                  <MD family={theme.fonts.inter} color={theme.colors.branco.principal}>
                    às
                  </MD>

                  <InputHours 
                    disabled={valueInputStartHours !== '' ? false : true}
                    value={valueInputEndHours} 
                    onChange={handleHoursEndChange}
                    minHour={minEndHour}
                    maxHour={23}
                    hasError={errors.valueInputEndHours}
                    width='100%'
                    />
                </S.ContainerWithTwoInputs>

                <Input 
                  id="name"
                  type='text' 
                  placeholder='R$ 100,00' 
                  label='Valor por Hora' 
                  value={valuePerHour}
                  onChange={handleValuePerHourChange}
                  hasError ={errors.valuePerHour}
                />

                <Input 
                  id="gender"
                  type='select' 
                  placeholder='Selecionar' 
                  label='Método de pagamento' 
                  onChange={handleMethodChange}
                  options={methodOptions}
                  value={method}
                  disabled={true}
                  // hasError ={errors.method}
                />

                 {editItem ? (
                    <S.ContainerButtonModalEdit>
                      <S.Button 
                        onClick={() => setOpenDeleteLocal(true)} 
                      >
                        <MD 
                        color={theme.colors.branco.principal} 
                        family={theme.fonts.inter}>
                          Excluir
                        </MD>
                      </S.Button> 
    
                      <S.Button onClick={handleSavedSportLocation}>
                        <MD 
                        color={theme.colors.branco.principal} 
                        family={theme.fonts.inter}>
                          Salvar
                      </MD>
                    </S.Button>
                  </S.ContainerButtonModalEdit>
                 ) : (
                    <S.Button onClick={handleCreateLocalSport}>
                      <LG 
                        weight={700} 
                        color={theme.colors.branco.principal} 
                        family={theme.fonts.inter}
                        >
                          Criar quadra
                      </LG>
                    </S.Button>
                 )}
              </S.ContainerContentModalLocalSport>
            </Dialog.Body>
          </S.ContainerModalLocalSport>
        </Modal>
      )}

       {openDeleteLocal && 
          <Modal isOpen={openDeleteLocal} onClose={() => setOpenDeleteLocal(false)}>
            <S.ContainerModalDelete>
              <Dialog.Header>
                <Dialog.Title textAlign="center">
                  <LG color={theme.colors.branco.principal} family={theme.fonts.inter}>
                    Deletar propriedade
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
                  Tem certeza de que deseja excluir permanente sua propriedade?
                </SM>
  
                <S.ContainerButtonModalEdit>
                  <S.Button onClick={() => setOpenDeleteLocal(false)}>
                    <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                      Cancelar
                    </MD>
                  </S.Button>
  
                  <S.Button onClick={handleDeletedSportLocation}>
                    <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                      Confirmar
                    </MD>
                  </S.Button>
                </S.ContainerButtonModalEdit>
              </Dialog.Body>
            </S.ContainerModalDelete>
          </Modal>
        }
    </S.Container>
  );
}

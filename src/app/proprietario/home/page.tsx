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

  const [errors, setErrors] = useState<FormErrors>({});

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
    setNumber(value);
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

  const handleCreateLocalSport = () => {
    if (
      !nameLocalSport ||
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
      address: {
        id: Date.now() + 1, 
        cep,
        number,
        street: adressLocalSport,
        city: dataCep?.localidade, 
        state: dataCep?.uf,
      },
      days: selectedDays,
      start_time: valueInputStartHours,
      end_time: valueInputEndHours,
      price: valuePerHour,
      payment_method: method
    };


    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUserProprietario') || '{}');
      if (!currentUser.my_sports_location) {
        currentUser.my_sports_location = [];
      }
      currentUser.my_sports_location.push(newSportsLocation);
      localStorage.setItem('currentUserProprietario', JSON.stringify(currentUser));

      const infoUser = JSON.parse(localStorage.getItem('infoUserProprietario') || '{}');
      if (!infoUser.my_sports_location) {
        infoUser.my_sports_location = [];
      }
      
      const existingIndex = infoUser.my_sports_location.findIndex(
        (loc: any) => loc.name === nameLocalSport
      );
      
      if (existingIndex >= 0) {
        infoUser.my_sports_location[existingIndex] = newSportsLocation;
      } else {
        infoUser.my_sports_location.push(newSportsLocation);
      }
      
      localStorage.setItem('infoUserProprietario', JSON.stringify(infoUser));
      
      setNewModalLocalSport(false)

      //Limpando inputs
      setNameLocalSport('')
      setCep('')
      setNumber('')
      setAdressLocalSport('')
      setSelectedDays([])
      setValueInputStartHours('')
      setValueInputEndHours('')
      setValuePerHour('')
    } catch (error) {}
  };

  const closeModal = () => {
    setNewModalLocalSport(false);

    //Limpando inputs
    setNameLocalSport('')
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
            <TitleWithButtons buttonAdd={true} title='Minhas quadras' onClick={() => setNewModalLocalSport(true)}/>
              
            {currentUserProprietario.my_sports_location.length > 0 ? (
              <CardMyProperty />
            ):(
            <S.ContainerNotFoundLocal>
              <img src="/images/png/image-futebol-local.png" alt="Imagem campo de futebol"/>

              <LG 
              family={theme.fonts.inter} 
              color={theme.colors.branco.secundario}>
                Você não tem quadras <br/>cadastradas.
              </LG>

              <SM
                family={theme.fonts.inter}
                color={theme.colors.branco.secundario}>
                Para começar clique no + acima e <br/>adicione uma quadra .
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
                    Nova quadra
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
                  label='Nome da quadra' 
                  value={nameLocalSport}
                  onChange={handleNameChange}
                  hasError ={errors.nameLocalSport}
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

                <WeekdayMultiSelect onChange={(values) => {setSelectedDays(values), setErrors(prev => ({ ...prev, selectedDays: false }));}} hasError={errors.selectedDays}/>

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

                <S.Button onClick={handleCreateLocalSport}>
                  <LG 
                    weight={700} 
                    color={theme.colors.branco.principal} 
                    family={theme.fonts.inter}
                    >
                      Criar quadra
                  </LG>
                </S.Button>

              </S.ContainerContentModalLocalSport>
            </Dialog.Body>
          </S.ContainerModalLocalSport>
        </Modal>
      )}
    </S.Container>
  );
}

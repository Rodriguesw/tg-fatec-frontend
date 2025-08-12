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

export default function ProprietarioHome() {
  const [isMounted, setIsMounted] = useState(false);

  //Modal de Reserva
  const [newModalLocalSport, setNewModalLocalSport] = useState(false);

  const [nameLocalSport, setNameLocalSport] = useState('');
  const [cep, setCep] = useState('');
  const [number, setNumber] = useState('');
  const [adressLocalSport, setAdressLocalSport] = useState('');
  const [gender, setGender] = useState('');

  const daysOptions = [
    { label: 'Segunda-feira', value: 'Seg' },
    { label: 'Terça-feira', value: 'Ter' },
    { label: 'Quarta-feira', value: 'Qua' },
    { label: 'Quinta-feira', value: 'Qui' },
    { label: 'Sexta-feira', value: 'Sex' },
    { label: 'Sábado', value: 'Sáb' },
    { label: 'Domingo', value: 'Dom' }
]

  

  useEffect(() => {
    setIsMounted(true); 
  }, []);

  const handleNameChange = (value: string) => {
    setNameLocalSport(value);
    // setErrors(prev => ({ ...prev, gender: false }));
  };

  const handleCepChange = async (value: string) => {
    let newValue = value.replace(/\D/g, '');
    let valueWithOutMask = "";

    if (newValue.length === 8) {
      valueWithOutMask = newValue
    }

    if (newValue.length > 5) {
      newValue = newValue.substring(0, 5) + '-' + newValue.substring(5, 8);
    }
    setCep(newValue);

    if (valueWithOutMask.length === 8) {
      const data = await fetchCEP(valueWithOutMask);

      console.log("CEP Data:", data);

      setAdressLocalSport(data.logradouro);
    }
  };

  const handleNumberChange = (value: string) => {
    setNumber(value);
    // setErrors(prev => ({ ...prev, gender: false }));
  };

  const handleAddressLocalSportChange = (value: string) => {
    setAdressLocalSport(value);
    // setErrors(prev => ({ ...prev, gender: false }));
  };

  const handleGenderChange = (value: string) => {
    setGender(value);
    // setErrors(prev => ({ ...prev, gender: false }));
  };

  const handleCreateLocalSport = () => {
    console.log("CRIANDO QUADRA:", {
      nameLocalSport,
      cep,
      number,
      adressLocalSport,
      gender,
    });
  };

  const closeModal = () => {
    setNewModalLocalSport(false);
  };

  if (!isMounted) return null; 

  return (
    <S.Container>
      <S.Wrapper>
          <Header />

          <S.Content>
            <TitleWithButtons buttonAdd={true} title='Minhas quadras' onClick={() => setNewModalLocalSport(true)}/>
              
            <CardMyProperty />
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

                <button onClick={() => {setNewModalLocalSport(false)}}>
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
                  // hasError ={errors.name}
                />

                <S.ContainerWithTwoInputs>
                  <Input 
                    id="name"
                    type='text' 
                    placeholder='00000-000' 
                    label='CEP' 
                    value={cep}
                    onChange={handleCepChange}
                    // hasError ={errors.name}
                  />

                  <Input 
                    id="name"
                    type='text' 
                    placeholder='0000' 
                    label='Número' 
                    value={number}
                    onChange={handleNumberChange}
                    // hasError ={errors.name}
                  />
                </S.ContainerWithTwoInputs>

                <Input 
                  id="name"
                  type='text' 
                  placeholder='Rua' 
                  label='Endereço' 
                  value={adressLocalSport}
                  onChange={handleAddressLocalSportChange}
                  // hasError ={errors.name}
                />

                <WeekdayMultiSelect></WeekdayMultiSelect>

                <Input 
                  id="gender"
                  type='select' 
                  placeholder='Selecionar' 
                  label='Dias da semana' 
                  onChange={handleGenderChange}
                  options={daysOptions}
                  value={gender}
                  // hasError ={errors.gender}
                />

                

                <S.ContainerWithTwoInputs>
                  <Input 
                    id="name"
                    type='text' 
                    placeholder='00:00' 
                    label='Horário' 
                    // onChange={handleNameChange}
                    // hasError ={errors.name}
                  />

                  <MD family={theme.fonts.inter} color={theme.colors.branco.principal}>
                    às
                  </MD>

                  <Input 
                    id="name"
                    type='text' 
                    placeholder='00:00' 
                    label='' 
                    // onChange={handleNameChange}
                    // hasError ={errors.name}
                  />
                </S.ContainerWithTwoInputs>

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

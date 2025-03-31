"use client"

import { useEffect, useState } from 'react';

import { Input } from '@/components/Input';
import { Header } from '@/components/Header';
import { TitleWithButtonBack } from '@/components/TitleWithButtonBack';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { LG, } from '@/styles/typographStyles';

export default function JogadorCadastro() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [team, setTeam] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [isMounted, setIsMounted] = useState(false);
    
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Opções para os selects
  const genderOptions = [
    { label: 'Masculino', value: 'male' },
    { label: 'Feminino', value: 'female' },
    { label: 'Outro', value: 'other' },
    { label: 'Prefiro não dizer', value: 'prefer_not_to_say' }
  ];

  const teamOptions = [
    { label: 'Corinthians', value: 'corinthians' },
    { label: 'Palmeiras', value: 'palmeiras' },
    { label: 'São Paulo', value: 'sao_paulo' },
    { label: 'Santos', value: 'santos' },
    { label: 'Outro', value: 'other' }
  ];

  const handleClick = () => {
    window.history.back();
  }

  const handleCreateUser = async () => {
    const payload = {
      name: name,
      birth_date: birthDate,
      gender: gender,
      team: team,
      email: email,
      password: password,
      password_confirmation: passwordConfirmation,
    }

    console.log("Payload:", payload);
  }

  if (!isMounted) return null;

  return (
    <S.Container>
        <S.Wrapper>
          <Header></Header>
  
          <S.Content>
            <S.ContentHeader>
              <TitleWithButtonBack title='Dados cadastrais' buttonBack={true} onClick={handleClick} />
            </S.ContentHeader>
  
            <S.ContentForm>
              <Input 
                type='text' 
                placeholder='Nome completo' 
                label='Nome completo *' 
                onChange={(value) => setName(value)}
              />
  
              <Input 
                type='text' 
                placeholder='00/00/0000' 
                label='Data de nascimento *' 
                onChange={(value) => setBirthDate(value)}
              />
  
              <Input 
                type='select' 
                placeholder='Selecionar' 
                label='Sexo' 
                onChange={(value) => setGender(value)}
                options={genderOptions}
                value={gender}
              />
  
              <Input 
                type='select' 
                placeholder='Selecionar' 
                label='Para que time torce?' 
                onChange={(value) => setTeam(value)}
                options={teamOptions}
                value={team}
              />
  
              <Input 
                type='text' 
                placeholder='email@mail.com' 
                label='E-mail *' 
                onChange={(value) => setEmail(value)}
              />

              <Input 
                type='password' 
                placeholder='********' 
                label='Senha *' 
                onChange={(value) => setPassword(value)}
              />

              <Input 
                type='password' 
                placeholder='********' 
                label='Confirmar senha *' 
                onChange={(value) => setPasswordConfirmation(value)}
              />
            </S.ContentForm>
          </S.Content>
  
          <S.ContainerButton>
            <S.Button onClick={handleCreateUser}>
                <LG 
                  weight={700}  
                  color={theme.colors.branco.principal} 
                  family={theme.fonts.inter}>
                    Cadastrar
                </LG>
            </S.Button>
          </S.ContainerButton>
        </S.Wrapper>
    </S.Container>
  );
}
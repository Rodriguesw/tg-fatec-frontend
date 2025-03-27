"use client";

import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

import { Input } from '@/components/Input';
import { Header } from '@/components/Header';
import { Navbar } from '@/components/Navbar';

import * as S from './styles';
import { theme } from '@/styles/theme';
import { MD, LG, SM } from '@/styles/typographStyles';

// Configurações do mapa
const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

// Coordenadas do centro do mapa (exemplo: Sorocaba, SP)
const center = {
  lat: -23.5017,
  lng: -47.4581
};

// Coordenadas do marcador
const markerPosition = {
  lat: -23.5017,
  lng: -47.4581
};

export default function JogadorHome() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); 
  }, []);

  if (!isMounted) return null; 

  return (
    <S.Container>
      <S.Wrapper>
          <Header />

          <S.Content>
              <S.ContainerInput>
                <Input placeholder='Buscar' />
              </S.ContainerInput>
            
              <S.ContainerMap>
                <LoadScript
                  googleMapsApiKey="AIzaSyAPxmDGktAh6A-WF8xcIkjz4568vuBa0n0"
                >
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={14}
                  >
                    <Marker 
                      position={markerPosition}
                      title="Localização do marcador"
                    />
                  </GoogleMap>
                </LoadScript>
              </S.ContainerMap>
          </S.Content>          

          <Navbar />
      </S.Wrapper>
    </S.Container>
  );
}
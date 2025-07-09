"use client";

import { useEffect, useState } from 'react';
import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api';

import { Input } from '@/components/Input';
import { Header } from '@/components/Header';
import { Navbar } from '@/components/Navbar';

import * as S from './styles';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions = {
  disableDefaultUI: true,
};

export default function JogadorHome() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<google.maps.LatLngLiteral | null>(null);

  // Obtém a localização atual do usuário
  useEffect(() => {
    setIsMounted(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        // Fallback para uma localização padrão
        setCurrentPosition({
          lat: -23.5017,
          lng: -47.4581,
        });
      }
    );
  }, []);

  if (!isMounted || !currentPosition) return null;

  return (
    <S.Container>
      <S.Wrapper>
        <Header />

        <S.Content>
          <S.ContainerInput>
            <Input type="text" placeholder="Buscar" />
          </S.ContainerInput>

          <S.ContainerMap>
            <LoadScriptNext googleMapsApiKey="AIzaSyAPxmDGktAh6A-WF8xcIkjz4568vuBa0n0">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={currentPosition}
                zoom={14}
                options={mapOptions}
              >
                <Marker position={currentPosition} title="Você está aqui" />
              </GoogleMap>
            </LoadScriptNext>
          </S.ContainerMap>
        </S.Content>

        <Navbar />
      </S.Wrapper>
    </S.Container>
  );
}

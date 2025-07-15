"use client";

import { useEffect, useState } from 'react';
import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api';

import {
  mapContainerStyle,
  mapOptions,
  extraMarkers,
} from '@/utils/MapConfig';

import { Input } from '@/components/Input';
import { Header } from '@/components/Header';
import { Navbar } from '@/components/Navbar';
import { Modal } from '@/components/Modal';

import { Dialog } from "@chakra-ui/react"

import * as S from './styles';
import { LG, MD } from '@/styles/typographStyles';
import { theme } from '@/styles/theme';

export default function JogadorHome() {
  const [isMounted, setIsMounted] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [isModalLocalization, setIsModalLocalization] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "granted" || result.state === "prompt") {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('Coords:', position.coords);
            console.log('Precisão:', position.coords.accuracy, 'metros');
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            alert('Não foi possível obter sua localização.');
            setUserLocation({
              lat: -23.5017,
              lng: -47.4581,
            });
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      }
    });
  }, []);

  const handleMarkerClick = (marker: any) => {
    setSelectedMarker(marker);
    setIsModalLocalization(true);
  };

  const closeModal = () => {
    setIsModalLocalization(false);
    setSelectedMarker(null);
  };

  if (!isMounted || !userLocation) return null;

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
                center={userLocation}
                zoom={14}
                options={mapOptions}
              >
                <Marker 
                  position={userLocation} 
                  title="Você está aqui" 
                  icon={"/images/png/icon-marker-player-white.png"} 
                />

                {extraMarkers.map((marker, index) => (
                  <Marker
                    key={index}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    title={marker.title}
                    icon={marker.icon}
                    onClick={() => handleMarkerClick(marker)}
                  />
                ))}
              </GoogleMap>
            </LoadScriptNext>
          </S.ContainerMap>
        </S.Content>

        <Navbar />

        {/* Modal para exibir informações do marcador */}
        {isModalLocalization && selectedMarker && (
          <Modal isOpen={true} onClose={closeModal}>
             <Dialog.Header>
              <Dialog.Title textAlign="center">
                <LG 
                  weight={700} 
                  color={theme.colors.azul.principal} 
                  family={theme.fonts.inter}>
                    {selectedMarker.title}
                </LG>
              </Dialog.Title>
             </Dialog.Header>
           
             <Dialog.Body>
                <p>Local: {selectedMarker.title}</p>

                <button
                  onClick={() => setIsModalLocalization(false)} 
                >
                  <MD 
                    color={theme.colors.vermelho} 
                    family={theme.fonts.inter}>
                    Cancelar
                  </MD>
                </button> 
             </Dialog.Body>
          </Modal>
        )}
      </S.Wrapper>
    </S.Container>
  );
}
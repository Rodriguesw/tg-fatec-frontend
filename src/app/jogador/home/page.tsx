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
import { H3, LG, MD } from '@/styles/typographStyles';
import { theme } from '@/styles/theme';
import { RatingStars } from '@/components/RatingStars';
import { fetchCEP } from '@/services/BuscaCep';

export default function JogadorHome() {
  const [isMounted, setIsMounted] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [isModalLocalization, setIsModalLocalization] = useState(false);

  const [cepData, setCepData] = useState<any>(null);

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

  const handleMarkerClick = async (marker: any) => {
    setSelectedMarker(marker);
    setIsModalLocalization(true);

    console.log('Marker clicked:', marker);

    if (marker.address?.cep) {
      try {
        const data = await fetchCEP(marker.address.cep);
        setCepData({
        ...data,
        numero: marker.address.number // Adiciona o número aqui
      });
      } catch (error) {
        // setCepError(error instanceof Error ? error.message : 'Erro ao buscar CEP');
        console.error('Erro na busca do CEP:', error);
      } finally {
        // setLoadingCEP(false);
      }
    }
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
              <S.ContainerModalContent>
                <Dialog.Header display="flex" flexDirection="row">
                  <H3
                    color={theme.colors.laranja}>
                      {selectedMarker.title}
                  </H3>

                  <button
                      onClick={() => setIsModalLocalization(false)} 
                    >
                      <img src="/images/svg/icon-close-white.svg" alt="Fechar"/>
                    </button> 
                </Dialog.Header>
              
                <Dialog.Body>
                    <RatingStars 
                      value={1.5}
                      />

                    <MD 
                      family={theme.fonts.inter}
                      color={theme.colors.branco.secundario}
                      >
                        {console.log('CEP Data:', cepData)}
                        {cepData?.logradouro} {cepData?.numero ? `, ${cepData?.numero}` : ''} - {cepData?.localidade}, {cepData?.uf}
                    </MD>

                    
                </Dialog.Body>
              </S.ContainerModalContent>
            </Modal>
        )}
      </S.Wrapper>
    </S.Container>
  );
}
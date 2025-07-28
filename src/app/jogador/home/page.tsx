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

import { Dialog, Spinner } from "@chakra-ui/react"

import * as S from './styles';
import { H3, LG, MD } from '@/styles/typographStyles';
import { theme } from '@/styles/theme';
import { RatingStars } from '@/components/RatingStars';
import { fetchCEP } from '@/services/BuscaCep';

export default function JogadorHome() {
  const [isMounted, setIsMounted] = useState(false);

  const [valueInputSearch, setValueInputSearch] = useState("");

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [isModalLocalization, setIsModalLocalization] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
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

  const handleSearchChange = (value: string) => {
    setValueInputSearch(value);
  };

  const handleMarkerClick = async (marker: any) => {
    setIsLoading(true)
    setSelectedMarker(marker);
    setIsModalLocalization(true);

    console.log('Marker clicked:', marker);

    if (marker.address?.cep) {
      try {
        const data = await fetchCEP(marker.address.cep);
        setCepData({
        ...data,
        numero: marker.address.number 
      });
      } catch (error) {
        // setCepError(error instanceof Error ? error.message : 'Erro ao buscar CEP');
        console.error('Erro na busca do CEP:', error);
      } finally {
        // setLoadingCEP(false);
        setIsLoading(false)
      }
    }
  };

  const closeModal = () => {
    setIsModalLocalization(false);
    setSelectedMarker(null);
  };

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
        // console.error("Geocoding error:", data.status);
        return null;
      }
    } catch (error) {
      // console.error("Erro ao geocodificar endereço:", error);
      return null;
    }
  };

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (valueInputSearch.trim().length > 3) {
        const coords = await geocodeAddress(valueInputSearch);

        if (coords) {
          setSearchLocation(coords);
        }
      } else {
        setSearchLocation(null)
      }
    }, 800);
  
    return () => clearTimeout(timeout);
  }, [valueInputSearch]);

  if (!isMounted || !userLocation) return null;

  return (
    <S.Container>
      <S.Wrapper>
        <Header />

        <S.Content>
          <S.ContainerInput>
            <Input 
              type="text" 
              placeholder="Buscar"
              value={valueInputSearch}
              onChange={handleSearchChange}
              />
          </S.ContainerInput>

          <S.ContainerMap>
            <LoadScriptNext googleMapsApiKey="AIzaSyAPxmDGktAh6A-WF8xcIkjz4568vuBa0n0">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={searchLocation ? searchLocation : userLocation}
                zoom={14}
                options={mapOptions}
              >
                <Marker 
                  position={userLocation} 
                  title="Você está aqui" 
                  icon={"/images/png/icon-marker-player-white.png"} 
                />

                {searchLocation && (
                  <Marker
                    position={searchLocation}
                    title="Endereço buscado"
                    icon={"/images/png/icon-search-localization.png"}
                  />
                )}

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

        {/* Modal para exibir informações do marcador selecionado */}
        {isModalLocalization && selectedMarker && (
            <Modal isOpen={true} onClose={closeModal}>
                <S.ContainerModalContent isLoading={isLoading}>
                  <Dialog.Header width="100%" display="flex" flexDirection="row" justifyContent="space-between">
                    
                  {isLoading ? (
                      <S.ContainerLoading>
                        <Spinner color={theme.colors.branco.principal} />
                      </S.ContainerLoading>
                    ) : (
                      <H3
                        color={theme.colors.laranja}>
                          {selectedMarker.title}
                      </H3>
                    )}

                    <button
                        onClick={() => setIsModalLocalization(false)} 
                      >
                        <img src="/images/svg/icon-close-white.svg" alt="Fechar"/>
                      </button> 
                  </Dialog.Header>
                
                  {isLoading ? (
                      <Spinner color={theme.colors.branco.principal} />
                    ) : (
                        <Dialog.Body gap="24px" display="flex" flexDirection="column" alignItems="center">
                          <S.ContainerModalRatingAndAdress>
                            <RatingStars 
                              value={selectedMarker.rating}
                              />

                            <MD 
                              family={theme.fonts.inter}
                              color={theme.colors.branco.secundario}
                              >
                                {console.log('CEP Data:', cepData)}
                                {cepData?.logradouro} {cepData?.numero ? `, ${cepData?.numero}` : ''} - {cepData?.localidade}, {cepData?.uf}
                            </MD>
                          </S.ContainerModalRatingAndAdress>

                          <S.Button >
                              <LG 
                                weight={700} 
                                color={theme.colors.branco.principal} 
                                family={theme.fonts.inter}>
                                  Solicitar reserva
                              </LG>
                          </S.Button>
                        </Dialog.Body>
                    )}
                </S.ContainerModalContent>
              
            </Modal>
        )}
      </S.Wrapper>
    </S.Container>
  );
}
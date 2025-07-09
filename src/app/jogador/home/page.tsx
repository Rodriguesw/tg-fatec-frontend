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

import * as S from './styles';

export default function JogadorHome() {
  const [isMounted, setIsMounted] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

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
                <Marker position={userLocation} title="Você está aqui" icon={"/images/png/icon-marker-player-white.png"} />

                {extraMarkers.map((marker, index) => (
                  <Marker
                    key={index}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    title={marker.title}

                    icon={marker.icon}
                  />
                ))}
              </GoogleMap>
            </LoadScriptNext>
          </S.ContainerMap>
        </S.Content>

        <Navbar />
      </S.Wrapper>
    </S.Container>
  );
}

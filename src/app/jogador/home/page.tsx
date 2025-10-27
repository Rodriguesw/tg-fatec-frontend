"use client";

import { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api';

import { Tooltip } from 'react-tooltip';
import { QRCodeSVG } from 'qrcode.react';

import { format, parseISO } from 'date-fns';

import {
  mapContainerStyle,
  mapOptions,
  defaultExtraMarkers,
} from '@/utils/MapConfig';

import { fetchCEP } from '@/services/BuscaCep';

import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Header } from '@/components/Header';
import { Navbar } from '@/components/Navbar';
import  InputDays  from '@/components/inputDays';
import { InputHours } from '@/components/inputHours';
import { RatingStars } from '@/components/RatingStars';
import { showToast } from '@/components/ToastAlert';
import { PageModal } from '@/components/PageModal';

import { Box, Dialog, Image, Spinner } from "@chakra-ui/react"

import * as S from './styles';
import { theme } from '@/styles/theme';
import { H3, LG, MD, SM } from '@/styles/typographStyles';

export default function JogadorHome() {
  const [isMounted, setIsMounted] = useState(false);

  const [valueInputSearch, setValueInputSearch] = useState("");

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalLocalization, setIsModalLocalization] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [cepData, setCepData] = useState<any>(null);

  //Modal de Reserva
  const [isModalReserva, setIsModalReserva] = useState(false);
  const [valueInputDate, setValueInputDate] = useState("");
  const [valueInputStartHours, setValueInputStartHours] = useState("");
  const [valueInputEndHours, setValueInputEndHours] = useState("");

  const [methodPayment, setMethodPayment] = useState('Dinheiro');
  const [methodPaymentMoneyError, setMethodPaymentMoneyError] = useState(false);

  const [hasErrorMethodPayment, setHasErrorMethodPayment] = useState(false);
  const [hasErrorDate, setHasErrorDate] = useState(false);
  const [hasErrorStartHours, setHasErrorStartHours] = useState(false);
  const [hasErrorEndHours, setHasErrorEndHours] = useState(false);

  //Loading do submit da reserva
  const [isLoadingSubmitReserva, setIsLoadingSubmitReserva] = useState(false);

  //Modal de Pagamento Pix
  const [isModalPix, setIsModalPix] = useState(false);
  
  //Modal de Avaliação
  const [isModalAvaliacao, setIsModalAvaliacao] = useState(false);
  const [reservaParaAvaliar, setReservaParaAvaliar] = useState<any>(null);
  const [avaliacao, setAvaliacao] = useState(0);

  const initialLocationRef = useRef<{ lat: number; lng: number } | null>(null);
  const bestPositionRef = useRef<GeolocationPosition | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const getDistanceMeters = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) => {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371000; // raio da Terra em metros
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Função para verificar se uma reserva já passou
  const isReservationPassed = (reservedDate: string, timeEnd: string) => {
    const now = new Date();

    // Converte a data da reserva para Date (dia/mês/ano)
    const [day, month, year] = reservedDate.split('/');
    const reservationDateOnly = new Date(Number(year), Number(month) - 1, Number(day));

    // Converte o horário de término para horas/minutos
    const [endHourStr, endMinStr] = timeEnd.split(':');
    const endHour = parseInt(endHourStr, 10) || 0;
    const endMin = parseInt(endMinStr, 10) || 0;

    // Cria um Date completo com data e horário de término
    const reservationEnd = new Date(reservationDateOnly);
    reservationEnd.setHours(endHour, endMin, 0, 0);

    // Logs de debug
    console.log("========================================");
    console.log("now:", now);
    console.log("today:", now.toLocaleDateString('pt-BR'));
    console.log("reservedDate:", reservedDate);
    console.log("reservationEnd:", reservationEnd);
    console.log("hasPassed:", now > reservationEnd);

    // A reserva passou se o momento atual é maior que o término da reserva
    return now > reservationEnd;
  };
  
  // Função para atualizar reservas passadas
  const updatePassedReservations = () => {
    if (typeof window === 'undefined') return;
    
    const currentUserRaw = localStorage.getItem('currentUser');
    if (!currentUserRaw) return;
    
    try {
      const currentUser = JSON.parse(currentUserRaw);
      if (!currentUser?.reserved_sports_location?.length) return;
      
      let updated = false;
      const updatedReservations = currentUser.reserved_sports_location.map((reserva: any) => {
        // Verifica se a reserva já passou e está com status "ativo"
        // console.log("========================================")
        // console.log("reserva:", reserva.reserved_date)
        // console.log("reserva.time_end:", reserva.time_end)
        // console.log("isReservationPassed:", isReservationPassed(reserva.reserved_date, reserva.time_end))
        // console.log("valida:", isReservationPassed(reserva.reserved_date, reserva.time_end) && reserva.status === 'ativo')

        if (isReservationPassed(reserva.reserved_date, reserva.time_end) && reserva.status === 'ativo') {
          updated = true;
          return {
            ...reserva,
            status: 'concluido',
            rating: 'em-avaliacao'
          };
        }
        return reserva;
      });
      
      // Se houve alterações, atualiza o localStorage
      if (updated) {
        const updatedUser = {
          ...currentUser,
          reserved_sports_location: updatedReservations
        };
        
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Atualiza também no infoUser
        const infoUserRaw = localStorage.getItem('infoUser');
        if (infoUserRaw) {
          const infoUser = JSON.parse(infoUserRaw);
          if (infoUser[currentUser.id]) {
            infoUser[currentUser.id] = {
              ...infoUser[currentUser.id],
              reserved_sports_location: updatedReservations
            };
            localStorage.setItem('infoUser', JSON.stringify(infoUser));
          }
        }
        
        // Procura por reservas com rating "em-avaliacao" para mostrar o modal
        const reservaParaAvaliar = updatedReservations.find(
          (reserva: any) => reserva.rating === "em-avaliacao"
        );
        
        if (reservaParaAvaliar) {
          setReservaParaAvaliar(reservaParaAvaliar);
          setIsModalAvaliacao(true);
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar reservas passadas:', error);
    }
  };

  useEffect(() => {
    setIsMounted(true);

    // Verifica e atualiza reservas passadas
    updatePassedReservations();

    // Verificar se há reservas passadas com rating "em-avaliacao"
    if (typeof window !== 'undefined') {
      const currentUserRaw = localStorage.getItem('currentUser');
      if (currentUserRaw) {
        try {
          const currentUser = JSON.parse(currentUserRaw);
          if (currentUser?.reserved_sports_location?.length > 0) {
            // Procurar por reservas com rating "em-avaliacao"
            const reservaParaAvaliar = currentUser.reserved_sports_location.find(
              (reserva: any) => reserva.rating === "em-avaliacao"
            );
            
            if (reservaParaAvaliar) {
              setReservaParaAvaliar(reservaParaAvaliar);
              setIsModalAvaliacao(true);
            }
          }
        } catch (error) {
          console.error('Erro ao verificar reservas para avaliação:', error);
        }
      }
    }

    navigator.permissions.query({ name: "geolocation" as any }).then((result) => {
      if (result.state === "granted" || result.state === "prompt") {
        const stopWatch = () => {
          if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
          }
        };

        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const newCoords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            const accuracy = position.coords.accuracy ?? Infinity;
            console.log('Nova localização (watch):', newCoords);
            console.log('Precisão estimada:', accuracy, 'metros');

            if (!initialLocationRef.current) {
              initialLocationRef.current = newCoords;
            }

            const prev = bestPositionRef.current;
            const prevAcc = prev?.coords.accuracy ?? Infinity;
            const prevCoords = prev
              ? { lat: prev.coords.latitude, lng: prev.coords.longitude }
              : null;
            const distance = prevCoords
              ? getDistanceMeters(prevCoords.lat, prevCoords.lng, newCoords.lat, newCoords.lng)
              : Infinity;

            // Atualiza quando a precisão melhora significativamente ou quando houve movimento relevante
            const isBetter = accuracy < prevAcc - 10 || distance > 25 || !prev;
            if (isBetter) {
              bestPositionRef.current = position;
              setUserLocation(newCoords);
            }

            // Encerra o watch quando atingimos boa precisão
            if (accuracy <= 50) {
              stopWatch();
            }
          },
          (error) => {
            console.warn('Erro ao obter localização (watch):', error.message);
            const fallbackCoords = { lat: -23.600812, lng: -48.051476 };
            initialLocationRef.current = fallbackCoords;
            setUserLocation(fallbackCoords);
          },
          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 5000,
          }
        );

        // Segurança: encerra o watch após 30s para evitar consumo desnecessário
        setTimeout(stopWatch, 30000);
      }
    });
  }, []);


  const [markers, setMarkers] = useState<typeof defaultExtraMarkers>([]);

  useEffect(() => {
    const storedMarkers = localStorage.getItem('mapMarkers');

    if (storedMarkers) {
      try {
        setMarkers(JSON.parse(storedMarkers));
      } catch (err) {
        setMarkers(defaultExtraMarkers);
      }
    } else {
      localStorage.setItem('mapMarkers', JSON.stringify(defaultExtraMarkers));
      setMarkers(defaultExtraMarkers);
    }
  }, []);

  const handleSearchChange = (value: string) => {
    setValueInputSearch(value);
  };

  const handleMarkerClick = async (marker: any) => {
    setIsLoading(true)
    setSelectedMarker(marker);
    setCurrentImageIndex(0); // Reset image index when selecting a new marker
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
    setCurrentImageIndex(0);
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

  // Converte o valor do horário para número (ex: "13:00" => 13)
  const getHourAsNumber = (time: string) => {
    if (!time) return 0;
    const [hourStr] = time.split(':')
    return parseInt(hourStr, 10)
  }

  // Função para obter todas as reservas ativas para uma data específica
  const getReservedHours = (date: string, locationName: string, locationCep: string, locationNumber: string) => {
    const formattedDate = formatToHtmlDate(date);
    if (!formattedDate) return [];
    
    // Busca todas as reservas no localStorage
    const infoUsersRaw = localStorage.getItem("infoUser");
    if (!infoUsersRaw) return [];
    
    const infoUsers = JSON.parse(infoUsersRaw);
    const reservedHours: {start: string, end: string}[] = [];
    
    // Percorre todos os usuários para encontrar reservas para esta localização e data
    Object.values(infoUsers).forEach((user: any) => {
      if (Array.isArray(user.reserved_sports_location)) {
        user.reserved_sports_location.forEach((reservation: any) => {
          // Verifica se a reserva é para a mesma localização, data e está ativa
          if (reservation.name === locationName && 
              reservation.address?.cep === locationCep && 
              reservation.address?.number === locationNumber && 
              reservation.reserved_date === formattedDate && 
              reservation.status === 'ativo') {
            
            reservedHours.push({
              start: reservation.time_start,
              end: reservation.time_end
            });
          }
        });
      }
    });
    
    return reservedHours;
  }
  
  // Verifica se um horário está disponível (não conflita com reservas existentes)
  const isHourAvailable = (hour: string, reservedHours: {start: string, end: string}[]) => {
    const hourNum = getHourAsNumber(hour);
    
    // Verifica se o horário está dentro de alguma reserva existente
    return !reservedHours.some(reservation => {
      const startHour = getHourAsNumber(reservation.start);
      const endHour = getHourAsNumber(reservation.end);
      
      // Se o horário está entre o início e fim de uma reserva, não está disponível
      return hourNum >= startHour && hourNum < endHour;
    });
  }
  
  // Obtém os horários disponíveis para a data selecionada
  const getAvailableHours = () => {
    if (!selectedMarker || !valueInputDate) return [];
    
    const reservedHours = getReservedHours(
      valueInputDate, 
      selectedMarker.title, 
      cepData?.cep, 
      cepData?.numero
    );
    
    // Horário de funcionamento da propriedade
    const startHour = getHourAsNumber(selectedMarker.time_start);
    const endHour = getHourAsNumber(selectedMarker.time_end);
    
    const availableHours: string[] = [];
    
    // Gera todos os horários possíveis dentro do horário de funcionamento
    for (let hour = startHour; hour <= endHour; hour++) {
      const hourStr = `${hour.toString().padStart(2, '0')}:00`;
      console.log("hourStr", hourStr)
      
      // Verifica se o horário está disponível
      if (isHourAvailable(hourStr, reservedHours)) {
        availableHours.push(hourStr);
      }
    }
    
    return availableHours;
  }

  // Obtém os horários de término válidos, garantindo que o intervalo [início, término)
  // não cruze nenhuma reserva existente e respeite o horário de funcionamento.
  const getAvailableEndHoursForStart = (startHourStr: string) => {
    if (!selectedMarker || !valueInputDate || !startHourStr) return [];

    const reservedHours = getReservedHours(
      valueInputDate,
      selectedMarker.title,
      cepData?.cep,
      cepData?.numero
    );

    const startHour = getHourAsNumber(startHourStr);
    // Para término, permitimos até 1h após o fechamento
    const propertyEnd = getHourAsNumber(selectedMarker.time_end) + 1;

    // Constrói um mapa de horas ocupadas (inteiras) baseado nas reservas existentes
    const occupied = new Set<number>();
    reservedHours.forEach(({ start, end }) => {
      const s = getHourAsNumber(start);
      const e = getHourAsNumber(end);
      for (let h = s; h < e; h++) {
        occupied.add(h);
      }
    });

    // Se o horário de início já está dentro de uma reserva, não há término válido
    if (occupied.has(startHour)) {
      return [];
    }

    // Encontra a próxima hora ocupada a partir do início selecionado
    let nextOccupied: number | null = null;
    for (let h = startHour; h < propertyEnd; h++) {
      if (occupied.has(h) && h >= startHour) {
        nextOccupied = h;
        break;
      }
    }

    const maxEnd = nextOccupied ?? propertyEnd; // término máximo permitido

    const endOptions: string[] = [];
    for (let h = startHour + 1; h <= maxEnd; h++) {
      endOptions.push(`${h.toString().padStart(2, '0')}:00`);
    }

    return endOptions;
  }
  
  // Verifica se um dia específico está totalmente ocupado para um local
  const isDayFullyBooked = (date: Date, locationName: string, locationCep: string, locationNumber: string) => {
    // Formata a data para o formato usado no sistema
    console.log("==========================isDayFullyBooked================================")
    const formattedDate = format(date, "dd/MM/yyyy");
    console.log('[isDayFullyBooked] start', { formattedDate, locationName, locationCep, locationNumber });

    // Busca todas as reservas no localStorage
    const infoUsersRaw = localStorage.getItem("infoUser");
    if (!infoUsersRaw) {
      console.log('[isDayFullyBooked] no infoUser in localStorage');
      return false;
    }

    const infoUsers = JSON.parse(infoUsersRaw);
    const reservedHours: {start: string, end: string}[] = [];

    // Percorre todos os usuários para encontrar reservas para esta localização e data
    Object.values(infoUsers).forEach((user: any) => {
      if (Array.isArray(user.reserved_sports_location)) {
        user.reserved_sports_location.forEach((reservation: any) => {
          // Verifica se a reserva é para a mesma localização, data e está ativa
          if (
            reservation.name === locationName &&
            reservation.address?.cep === locationCep &&
            reservation.address?.number === locationNumber &&
            reservation.reserved_date === formattedDate &&
            reservation.status === 'ativo'
          ) {
            reservedHours.push({ start: reservation.time_start, end: reservation.time_end });
          }
        });
      }
    });

    console.log('[isDayFullyBooked] reservedHours', reservedHours.length, reservedHours);

    // Se não há reservas, o dia não está ocupado
    if (reservedHours.length === 0) {
      console.log('[isDayFullyBooked] no reservations for date', formattedDate);
      return false;
    }

    // Busca o local no localStorage para obter o horário de funcionamento
    const markersRaw = localStorage.getItem('mapMarkers');
    if (!markersRaw) {
      console.log('[isDayFullyBooked] no mapMarkers in localStorage');
      return false;
    }

    const markers = JSON.parse(markersRaw);
    const location = markers.find((marker: any) =>
      marker.title === locationName &&
      marker.address?.cep === locationCep &&
      marker.address?.number === locationNumber
    );

    if (!location) {
      console.log('[isDayFullyBooked] location not found', { locationName, locationCep, locationNumber });
      return false;
    }

    // Horário de funcionamento do local
    const startHour = getHourAsNumber(location.time_start);
    const endHour = getHourAsNumber(location.time_end) + 1;
    console.log('[isDayFullyBooked] operatingHours', { startHour, endHour });

    // Verifica se todas as horas do período de funcionamento estão ocupadas
    for (let hour = startHour; hour < endHour; hour++) {
      const hourStr = `${hour.toString().padStart(2, '0')}:00`;
      const available = isHourAvailable(hourStr, reservedHours);
      console.log('[isDayFullyBooked] check hour', { hourStr, available });

      // Se encontrar pelo menos uma hora disponível, o dia não está totalmente ocupado
      if (available) {
        console.log('[isDayFullyBooked] day NOT fully booked due to', hourStr);
        return false;
      }
    }

    // Se chegou até aqui, todas as horas estão ocupadas
    console.log('[isDayFullyBooked] day fully booked', { formattedDate });
    return true;
  }
  
  // Função auxiliar para formatar a data
  const formatDateForReservation = (date: string) => {
    return formatToHtmlDate(date);
  }
  
  // A função isHourAvailable já está definida acima, não é necessário duplicá-la
  
  // A função getAvailableHours já está definida acima, não é necessário duplicá-la

  // Calcula o horário mínimo de término (sempre 1h após o início)
  const minEndHour = getHourAsNumber(valueInputStartHours) + 1

  const formatToHtmlDate = (raw: string) => {
    if (raw.length !== 8) return ''
    const day = raw.slice(0, 2)
    const month = raw.slice(2, 4)
    const year = raw.slice(4)
    return `${day}/${month}/${year}`
  }

  const todayDate = new Date().toLocaleDateString('pt-BR')
  const isToday = formatToHtmlDate(valueInputDate) === todayDate

  const handleCloseModal = () => {
    setIsModalReserva(false)
    clearInputs()
  }

  const clearInputs = () => {
    setValueInputDate('')
    setValueInputStartHours('')
    setValueInputEndHours('')

    setHasErrorMethodPayment(false)
    setHasErrorDate(false)
    setHasErrorStartHours(false)
    setHasErrorEndHours(false)
  }

  const handleSubmitReserva = async () => {
    setIsLoadingSubmitReserva(true);

    const hasMethodPaymentMoneyError = methodPayment !== 'Dinheiro';
    const hasDateError = valueInputDate === '';
    const hasStartHourError = valueInputStartHours === '';
    const hasEndHourError = valueInputEndHours === '';
    const hasIgualHours = valueInputStartHours === valueInputEndHours;
    const hasStarBiggerThanEnd = valueInputStartHours > valueInputEndHours;
    
    // Verificar se o horário de início é o horário de fechamento da propriedade
    const isClosingHour = valueInputStartHours === selectedMarker?.time_end;
    
    // Se for o horário de fechamento, permitimos que o horário de término seja 1h depois
    const willSetEndHourToZero = hasIgualHours && !isClosingHour;
    const hasZeroHours = (hasIgualHours && !isClosingHour) || valueInputEndHours === "00:00";

    if (willSetEndHourToZero) {
      setValueInputEndHours("00:00");
    }

    const hasAnyError =
      hasMethodPaymentMoneyError ||
      hasDateError ||
      hasStartHourError ||
      hasEndHourError ||
      hasZeroHours || 
      hasStarBiggerThanEnd;

    setMethodPaymentMoneyError(hasMethodPaymentMoneyError);
    setHasErrorDate(hasDateError);
    setHasErrorStartHours(hasStartHourError);
    setHasErrorEndHours(hasEndHourError || hasZeroHours || hasStarBiggerThanEnd);

    if (hasAnyError) {
      showToast({
        type: 'error',
        message: 'Verifique todos os campos em vermelho.',
      });
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1300));

    // Cria a nova reserva
    const novaReserva = {
      id: Date.now(), // ID único
      name: selectedMarker.title,
      address: {
        id: Date.now() + 1,
        cep: cepData.cep,
        number: cepData.numero,
        street: cepData.logradouro,
        city: cepData.localidade,
        neighborhood: cepData.bairro,
        state: cepData.uf,
      },
      status: 'ativo',
      time_start: valueInputStartHours,
      time_end: valueInputEndHours,
      price: `R$ ${valorReserva.toFixed(2).replace('.', ',')}`,
      reserved_date: formatToHtmlDate(valueInputDate),
      payment_method: methodPayment
    };

    console.log('Nova reserva:', novaReserva);

    // Recupera o usuário atual
    const currentUserRaw = localStorage.getItem("currentUser");
    if (!currentUserRaw) return;

    const currentUser = JSON.parse(currentUserRaw);

    // Adiciona a reserva ao currentUser
    if (!Array.isArray(currentUser.reserved_sports_location)) {
      currentUser.reserved_sports_location = [];
    }
    currentUser.reserved_sports_location.push(novaReserva);

    // Atualiza o localStorage com o currentUser
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    // Agora atualiza também o infoUser
    const infoUsersRaw = localStorage.getItem("infoUser");
    const infoUsers = infoUsersRaw ? JSON.parse(infoUsersRaw) : {};

    const userId = currentUser.id;

    if (infoUsers[userId]) {
      if (!Array.isArray(infoUsers[userId].reserved_sports_location)) {
        infoUsers[userId].reserved_sports_location = [];
      }

      infoUsers[userId].reserved_sports_location.push(novaReserva);
    } else {
      // Se o usuário não estiver no infoUser ainda, adiciona
      infoUsers[userId] = currentUser;
    }

    // Salva infoUser atualizado
    localStorage.setItem("infoUser", JSON.stringify(infoUsers));

    // Adiciona a reserva ao infoUserProprietario
    const infoUserProprietarioRaw = localStorage.getItem("infoUserProprietario");
    const infoUserProprietario = infoUserProprietarioRaw ? JSON.parse(infoUserProprietarioRaw) : {};
    
    // Encontra o proprietário da quadra nos marcadores
    const proprietarioId = Object.keys(infoUserProprietario).find(id => {
      const proprietario = infoUserProprietario[id];
      return proprietario.my_sports_location?.some((location: any) => 
        location.name === selectedMarker.title && 
        location.address?.cep === cepData.cep && 
        location.address?.number === cepData.numero
      );
    });

    if (proprietarioId) {
      // Inicializa o array de reservas se não existir
      if (!infoUserProprietario[proprietarioId].reservations) {
        infoUserProprietario[proprietarioId].reservations = [];
      }
      
      // Adiciona a reserva ao proprietário
      infoUserProprietario[proprietarioId].reservations.push({
        ...novaReserva,
        user_id: currentUser.id,
      });
      
      // Salva infoUserProprietario atualizado
      localStorage.setItem("infoUserProprietario", JSON.stringify(infoUserProprietario));
    }

    // Feedback e limpeza
    showToast({
      type: 'success',
      message: 'Reserva feita com sucesso!',
    });

    setIsModalReserva(false);
    setIsModalLocalization(false);
    setIsLoadingSubmitReserva(false);
    clearInputs();
  };

  
  const handleDateChange = (value: string) => {
    setValueInputDate(value)
    setHasErrorDate(false) // remove o erro ao escolher uma data válida
  }

  const handleHoursStartChange = (value: string) => {
    setValueInputStartHours(value)
    setHasErrorStartHours(false) // remove o erro ao escolher uma data válida
  }

  const handleHoursEndChange = (value: string) => {
    setValueInputEndHours(value)
    setHasErrorEndHours(false) // remove o erro ao escolher uma data válida
    
    // Se o horário de início for igual ao horário de fechamento da propriedade,
    // e o horário de término for 1 hora depois, consideramos válido
    if (valueInputStartHours === selectedMarker?.time_end && 
        getHourAsNumber(value) === getHourAsNumber(selectedMarker?.time_end) + 1) {
      setHasErrorEndHours(false)
    }
  }

  function formatPriceToNumber(priceString: string) {
      if (!priceString || typeof priceString !== 'string') {
          return 0;
      }
      
      const numericString = priceString.replace(/[^\d,.]/g, '');
      
      if (numericString.includes(',')) {
          return parseFloat(numericString.replace(/\./g, '').replace(',', '.'));
      }
      
      return parseFloat(numericString);
  }

  const valorHora = formatPriceToNumber(selectedMarker?.price); // {selectedMarker.price}

  function calcularHorasReservadas(inicio: string, fim: string): number {
    const [startHour, startMinute] = inicio.split(':').map(Number);
    const [endHour, endMinute] = fim.split(':').map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    const durationInMinutes = endTotalMinutes - startTotalMinutes;
    const durationInHours = durationInMinutes / 60;

    return durationInHours > 0 ? durationInHours : 0;
  }

  const horasReservadas = valueInputStartHours && valueInputEndHours
    ? calcularHorasReservadas(valueInputStartHours, valueInputEndHours)
    : 0;

    const valorReserva = horasReservadas * valorHora;

    function formatarMoedaBrasileira(valor: number) {
      return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
      }).format(valor);
  }

  const getDynamicMinHour = () => {
    console.log('isToday', isToday);
    if (!isToday) return 6;

    const now = new Date();
    const nextHour = now.getHours() + 1;

    console.log('nextHour', nextHour);

    // Limita o horário para no máximo o maxHour
    return nextHour >= 22 ? 22 : nextHour;
  };

  if (!isMounted || !userLocation) return null;

 

  return (
    <S.Container>
      <S.Wrapper>
        <Header />

        <S.Content>
          <S.ContainerInput>
            <Input
              id="Busca"
              type="text" 
              placeholder="Buscar"
              value={valueInputSearch}
              onChange={handleSearchChange}
              icon="/images/svg/icon-lupa.svg"
              />
          </S.ContainerInput>

          <S.ContainerMap>
            {isMapLoading && (
               <S.ContentWithLoading>
                <S.ContainerLoading style={{display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <Spinner size="xl" color={theme.colors.branco.principal} />
                  </div>
                </S.ContainerLoading>
              </S.ContentWithLoading> 
            )}

            <LoadScriptNext googleMapsApiKey="AIzaSyAPxmDGktAh6A-WF8xcIkjz4568vuBa0n0">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={searchLocation ? searchLocation : userLocation}
                zoom={14}
                options={mapOptions}
                onLoad={() => setIsMapLoading(false)}
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

                {markers.filter(marker => marker.status !== 'excluido').map((marker, index) => (
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
                      <S.ContainerLoading/>
                    ) : (
                      <S.ContainerModalTitle>
                        <H3
                          color={theme.colors.laranja}>
                            {selectedMarker.title}
                        </H3>
                      </S.ContainerModalTitle>
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
                          <S.ContainerModalRatingAndAdress>{selectedMarker.images && selectedMarker.images.length > 0 ? (
                              <Box position="relative" width="100%" height="200px" borderRadius="8px" overflow="hidden">
                                <Image 
                                  src={selectedMarker.images[currentImageIndex] || '/images/png/placeholder-image.png'}
                                  alt={`Imagem ${currentImageIndex + 1} de ${selectedMarker.title}`}
                                  objectFit="cover"
                                  width="100%"
                                  height="100%"
                                />
                                {selectedMarker.images.length > 1 && (
                                  <>
                                    <Box 
                                      position="absolute" 
                                      left="8px" 
                                      top="50%" 
                                      transform="translateY(-50%)"
                                      bg="rgba(0,0,0,0.5)"
                                      borderRadius="50%"
                                      p="8px"
                                      cursor="pointer"
                                      onClick={() => setCurrentImageIndex(prev => 
                                        prev === 0 ? selectedMarker.images.length - 1 : prev - 1
                                      )}
                                    >
                                      <img src="/images/svg/icon-arrow-left.svg" alt="Anterior" width="16" height="16" />
                                    </Box>
                                    <Box 
                                      display="flex"
                                      position="absolute" 
                                      width="32px" 
                                      height="32px"
                                      right="8px" 
                                      top="50%" 
                                      transform="translateY(-50%)"
                                      bg="rgba(0,0,0,0.5)"
                                      borderRadius="50%"
                                      p="8px"
                                      cursor="pointer"
                                      onClick={() => setCurrentImageIndex(prev => 
                                        prev === selectedMarker.images.length - 1 ? 0 : prev + 1
                                      )}
                                    >
                                      <Image 
                                      src="/images/svg/icon-arrow-left.svg" 
                                      alt="Próxima" 
                                      width="16px" 
                                      height="16px" 
                                      style={{transform: 'rotate(180deg)', display: 'inline-block'}}/>
                                    </Box>
                                    <Box 
                                      position="absolute" 
                                      bottom="8px" 
                                      left="50%" 
                                      transform="translateX(-50%)"
                                      bg="rgba(0,0,0,0.5)"
                                      borderRadius="4px"
                                      px="8px"
                                      py="4px"
                                    >
                                      <SM color={theme.colors.branco.principal}>
                                        {currentImageIndex + 1}/{selectedMarker.images.length}
                                      </SM>
                                    </Box>
                                  </>
                                )}
                              </Box>
                            ) : null}

                            <div style={{display: 'flex', alignItems: 'flex-end'}}>
                              <RatingStars 
                              value={selectedMarker.rating}
                              />

                              <SM family={theme.fonts.inter} color={theme.colors.branco.secundario}>
                               ({selectedMarker.avaliacoes ? selectedMarker.avaliacoes.length : 0})
                              </SM>
                            </div>
                            

                            <MD family={theme.fonts.inter} color={theme.colors.branco.secundario}>
                              Tipo de propriedade: <br/> {selectedMarker?.type === 'Futsal' ? 'Quadra Futsal' : selectedMarker?.type === 'Society' ? 'Campo Society' : 'Campo Futebol'}
                            </MD>

                            <MD 
                              family={theme.fonts.inter}
                              color={theme.colors.branco.secundario}
                              >
                              Endereço: <br/>
                              {cepData?.logradouro} {cepData?.numero ? `, ${cepData?.numero}` : ''} - {cepData?.localidade}, {cepData?.uf}
                            </MD>

                            <MD family={theme.fonts.inter} color={theme.colors.branco.secundario}>
                              Dias de funcionamento: <br/> {selectedMarker?.days
                                .map((day: string) => {
                                  return { 
                                    original: day, 
                                    order: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].indexOf(day),
                                    full: (() => {
                                      switch(day) {
                                        case 'Seg': return 'Segunda';
                                        case 'Ter': return 'Terça';
                                        case 'Qua': return 'Quarta';
                                        case 'Qui': return 'Quinta';
                                        case 'Sex': return 'Sexta';
                                        case 'Sáb': return 'Sábado';
                                        case 'Dom': return 'Domingo';
                                        default: return day;
                                      }
                                    })()
                                  };
                                })
                                .sort((a: { order: number }, b: { order: number }) => a.order - b.order)
                                .map((day: { full: string }) => day.full)
                                .join(', ')}
                            </MD>

                            <MD family={theme.fonts.inter} color={theme.colors.branco.secundario}>
                              Horário de funcionamento: <br/> {selectedMarker?.time_start} - {selectedMarker?.time_end}
                            </MD>

                            <MD 
                              family={theme.fonts.inter}
                              color={theme.colors.branco.secundario}
                              >
                               Valor por hora: {formatarMoedaBrasileira(valorHora)}
                            </MD>
                          </S.ContainerModalRatingAndAdress>

                          <S.Button onClick={() => setIsModalReserva(true)}>
                              <LG 
                                weight={700} 
                                color={theme.colors.branco.principal} 
                                family={theme.fonts.inter}
                                >
                                  Solicitar reserva
                              </LG>
                          </S.Button>
                        </Dialog.Body>
                    )}
                </S.ContainerModalContent>
              
            </Modal>
        )}

        {isModalReserva  && (
          <Modal isOpen={true} onClose={closeModal} width="350px" >
            <S.ContainerModalReserva>
              <Dialog.Header width="100%" display="flex" flexDirection="row" justifyContent="space-between">
                  <H3 color={theme.colors.laranja}>
                      Data e forma de pagamento
                  </H3>

                  <button onClick={() => {setIsModalReserva(false), handleCloseModal()}}>
                    <img src="/images/svg/icon-close-white.svg" alt="Fechar"/>
                  </button> 
              </Dialog.Header>
            
              <Dialog.Body gap="24px" display="flex" flexDirection="column" alignItems="center">
                <S.ContainerModalFormPayment>
                   <MD 
                      family={theme.fonts.inter}
                      color={theme.colors.branco.secundario}
                      >
                      Selecione o método de pagamento:
                    </MD>

                  <S.ContainerModalPaymentOptions>
                    <S.ContainerDisablePix>
                      <SM
                        family={theme.fonts.inter}
                        color={theme.colors.vermelho}
                        >
                        Indisponivel <br/>no momento
                      </SM>

                      <div style={{width: 'auto', height: 'auto', gap: "8px",display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <S.ContainerPix>
                          <S.ContainerModalPayment 
                            disabled={true}
                            hasError={hasErrorMethodPayment}
                            selected={methodPayment === "pix"}
                            onClick={() => {setMethodPayment("pix"), setHasErrorMethodPayment(false)}}
                            >
                            <MD 
                              family={theme.fonts.inter}
                              color={theme.colors.branco.secundario}
                              >
                              Pix
                            </MD>

                            <img src="/images/svg/icon-pix.svg" alt="Pagamento Pix"/>
                          </S.ContainerModalPayment>
                        </S.ContainerPix>

                        <S.ContainerModalFormTooltip>
                          <img src="/images/png/icon-question-mark-1.png" alt=" Pagamento pix" data-tooltip-id="pix-tooltip"/>

                          <Tooltip 
                            id="pix-tooltip" 
                            place="top"
                            content="Ao selecionar o pix, você receberá o código pix do proprietário. 
                            O pagamento é processado instantaneamente, e a reserva será confirmada após a validação. Para ter direito ao reembolso, 
                            você precisa cancelar com até 24 horas de antecedência da data da reserva."
                            style={{ 
                              backgroundColor: "#0D1321",
                              color: theme.colors.branco.principal,
                              borderRadius: '8px',
                              padding: '8px',
                              fontSize: '14px',
                              maxWidth: '200px'
                            }}
                          />
                        </S.ContainerModalFormTooltip>
                      </div>
                    </S.ContainerDisablePix>

                    
                   <div style={{width: 'auto', height: 'auto', gap: "8px",display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <S.ContainerModalPayment 
                      hasError={methodPaymentMoneyError}
                      selected={methodPayment === "Dinheiro"}
                      onClick={() => {setMethodPayment("Dinheiro"), setMethodPaymentMoneyError(false)}}
                      >
                      <MD 
                        family={theme.fonts.inter}
                        color={theme.colors.branco.secundario}
                        >
                        No local 
                      </MD>

                      <img src="/images/png/icon-payment-method-2.png" alt=" Pagamento em dinheiro"/>
                    </S.ContainerModalPayment>

                    <S.ContainerModalFormTooltip>
                      <img src="/images/png/icon-question-mark-1.png" alt=" Pagamento em dinheiro" data-tooltip-id="dinheiro-tooltip"/>

                      <Tooltip 
                        id="dinheiro-tooltip" 
                        place="top"
                        content="O pagamento deverá ser realizado diretamente com o proprietário do local. Ao selecionar essa opção, o proprietário será notificado sobre o método de pagamento escolhido."
                        style={{ 
                          backgroundColor: "#0D1321",
                          color: theme.colors.branco.principal,
                          borderRadius: '8px',
                          padding: '8px',
                          fontSize: '14px',
                          maxWidth: '200px'
                        }}
                      />
                    </S.ContainerModalFormTooltip>

                    </div>
                  </S.ContainerModalPaymentOptions>

                  {valueInputStartHours && valueInputEndHours && (
                    <MD 
                    family={theme.fonts.inter}
                    color={theme.colors.branco.secundario}
                    >
                      Valor da reserva: {formatarMoedaBrasileira(valorReserva)}
                    </MD>
                  )}
                </S.ContainerModalFormPayment>


                <S.ContainerModalFormReserva>
                  <S.ContainerModalFormInputs>
                    <MD 
                      family={theme.fonts.inter}
                      color={theme.colors.branco.secundario}
                      >
                      Data:
                    </MD>

                    <InputDays 
                      onChange={handleDateChange} 
                      hasError={hasErrorDate}
                      availableDays={selectedMarker?.days} // Passa os dias disponíveis da propriedade
                      filterDate={(date) => !isDayFullyBooked(
                          date,
                          selectedMarker.title,
                        cepData?.cep,
                        cepData?.numero
                      )}
                    />
                  </S.ContainerModalFormInputs>

                  <S.ContainerModalFormInputs>
                    <MD 
                      family={theme.fonts.inter}
                      color={theme.colors.branco.secundario}
                      >
                      Início:
                    </MD>

                    <InputHours 
                      id="start-hours"
                      disabled={valueInputDate !== '' ? false : true}
                      value={valueInputStartHours} 
                      onChange={handleHoursStartChange}  
                      minHour={getDynamicMinHour()}
                      maxHour={22}
                      isToday={isToday}
                      hasError={hasErrorStartHours}
                      propertyTimeStart={selectedMarker?.time_start}
                      propertyTimeEnd={selectedMarker?.time_end}
                      availableHours={valueInputDate ? getAvailableHours() : []}
                    />
                  </S.ContainerModalFormInputs>

                  <S.ContainerModalFormInputs>
                    <MD 
                      family={theme.fonts.inter}
                      color={theme.colors.branco.secundario}
                      >
                      Término:
                    </MD>

                    <InputHours 
                      id="end-hours"
                      disabled={valueInputStartHours !== '' ? false : true}
                      value={valueInputEndHours} 
                      onChange={handleHoursEndChange}
                      minHour={minEndHour}
                      maxHour={23}
                      hasError={hasErrorEndHours}
                      propertyTimeStart={selectedMarker?.time_start}
                      propertyTimeEnd={selectedMarker?.time_end}
                      availableHours={valueInputDate && valueInputStartHours ? getAvailableEndHoursForStart(valueInputStartHours) : []}
                      />
                      
                  </S.ContainerModalFormInputs>

                  
                </S.ContainerModalFormReserva>

                <S.Button onClick={handleSubmitReserva}>
                    <LG 
                      weight={700} 
                      color={theme.colors.branco.principal} 
                      family={theme.fonts.inter}
                      onClick={() => setIsModalReserva(true)}
                      >
                        {isLoadingSubmitReserva ? (<Spinner />) : 'Confirmar reserva'}
                    </LG>
                </S.Button>
              </Dialog.Body>
            </S.ContainerModalReserva>
          </Modal>
        )}

        {isModalPix  && (
          <Modal isOpen={true} onClose={closeModal} width="350px" >
            <S.ContainerModalReserva>
              <Dialog.Header width="100%" display="flex" flexDirection="row" justifyContent="space-between">
                  <H3 color={theme.colors.laranja}>
                      Pagamento Pix
                  </H3>

                  <button onClick={() => setIsModalPix(false)}>
                    <img src="/images/svg/icon-close-white.svg" alt="Fechar"/>
                  </button> 
              </Dialog.Header>
            
              <Dialog.Body gap="24px" display="flex" flexDirection="column" alignItems="center">
                <S.ContainerModalPaymentQrCode>
                  <QRCodeSVG value="TESTE" size={200} />
                </S.ContainerModalPaymentQrCode>
              </Dialog.Body>
            </S.ContainerModalReserva>
          </Modal>
        )}

        {isModalAvaliacao && reservaParaAvaliar && (
          <Modal isOpen={true} onClose={() => {
            // Atualizar o rating para "nao-avaliado" quando o usuário fechar o modal sem avaliar
            const currentUserRaw = localStorage.getItem('currentUser');
            if (currentUserRaw && reservaParaAvaliar) {
              const currentUser = JSON.parse(currentUserRaw);
              
              if (currentUser.reserved_sports_location) {
                const updatedReservations = currentUser.reserved_sports_location.map((reserva: any) => {
                  if (reserva.id === reservaParaAvaliar.id) {
                    return {
                      ...reserva,
                      rating: "nao-avaliado"
                    };
                  }
                  return reserva;
                });
                
                currentUser.reserved_sports_location = updatedReservations;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                // Atualizar também no infoUser
                const infoUserRaw = localStorage.getItem('infoUser');
                if (infoUserRaw) {
                  const infoUser = JSON.parse(infoUserRaw);
                  if (infoUser[currentUser.id]) {
                    infoUser[currentUser.id].reserved_sports_location = updatedReservations;
                    localStorage.setItem('infoUser', JSON.stringify(infoUser));
                  }
                }
              }
            }
            
            setIsModalAvaliacao(false);
          }} width="400px">
            <S.ContainerModalReserva>
              <Dialog.Header width="100%" display="flex" flexDirection="row" justifyContent="space-between">
                  <H3 color={theme.colors.laranja}>
                      Avalie sua experiência
                  </H3>

                  <button onClick={() => {
                    // Atualizar o rating para "nao-avaliado" quando o usuário clicar no botão de fechar
                    const currentUserRaw = localStorage.getItem('currentUser');
                    if (currentUserRaw && reservaParaAvaliar) {
                      const currentUser = JSON.parse(currentUserRaw);
                      
                      if (currentUser.reserved_sports_location) {
                        const updatedReservations = currentUser.reserved_sports_location.map((reserva: any) => {
                          if (reserva.id === reservaParaAvaliar.id) {
                            return {
                              ...reserva,
                              rating: "nao-avaliado"
                            };
                          }
                          return reserva;
                        });
                        
                        currentUser.reserved_sports_location = updatedReservations;
                        localStorage.setItem('currentUser', JSON.stringify(currentUser));
                        
                        // Atualizar também no infoUser
                        const infoUserRaw = localStorage.getItem('infoUser');
                        if (infoUserRaw) {
                          const infoUser = JSON.parse(infoUserRaw);
                          if (infoUser[currentUser.id]) {
                            infoUser[currentUser.id].reserved_sports_location = updatedReservations;
                            localStorage.setItem('infoUser', JSON.stringify(infoUser));
                          }
                        }
                      }
                    }
                    
                    setIsModalAvaliacao(false);
                  }}>
                    <img src="/images/svg/icon-close-white.svg" alt="Fechar"/>
                  </button> 
              </Dialog.Header>
            
              <Dialog.Body gap="24px" display="flex" flexDirection="column" alignItems="center">
                <S.ContainerModalFormPayment>
                  <MD color={theme.colors.branco.principal} family={theme.fonts.inter}>
                    {reservaParaAvaliar.name}
                  </MD>

                  <SM color={theme.colors.branco.secundario} family={theme.fonts.inter}>
                    Data: {reservaParaAvaliar.reserved_date}
                  </SM>

                  <SM color={theme.colors.branco.secundario} family={theme.fonts.inter}>
                    Horário: {reservaParaAvaliar.time_start} às {reservaParaAvaliar.time_end}
                  </SM>
                </S.ContainerModalFormPayment>

                <S.ContainerModalFormReserva>
                  <MD color={theme.colors.branco.secundario} family={theme.fonts.inter}>
                    Sua avaliação:
                  </MD>

                  <RatingStars 
                    value={avaliacao} 
                    onChange={setAvaliacao} 
                    size={30} 
                    interactive={true}
                  />
                </S.ContainerModalFormReserva>

                <S.ContainerButtonsAvaliacao>
                  <S.ButtonSecondary onClick={() => {
                    // Atualizar o rating para "nao-avaliado" quando o usuário clicar em "Não quero avaliar"
                    const currentUserRaw = localStorage.getItem('currentUser');
                    if (currentUserRaw && reservaParaAvaliar) {
                      const currentUser = JSON.parse(currentUserRaw);
                      
                      if (currentUser.reserved_sports_location) {
                        const updatedReservations = currentUser.reserved_sports_location.map((reserva: any) => {
                          if (reserva.id === reservaParaAvaliar.id) {
                            return {
                              ...reserva,
                              rating: "nao-avaliado"
                            };
                          }
                          return reserva;
                        });
                        
                        currentUser.reserved_sports_location = updatedReservations;
                        localStorage.setItem('currentUser', JSON.stringify(currentUser));
                        
                        // Atualizar também no infoUser
                        const infoUserRaw = localStorage.getItem('infoUser');
                        if (infoUserRaw) {
                          const infoUser = JSON.parse(infoUserRaw);
                          if (infoUser[currentUser.id]) {
                            infoUser[currentUser.id].reserved_sports_location = updatedReservations;
                            localStorage.setItem('infoUser', JSON.stringify(infoUser));
                          }
                        }
                      }
                    }
                    
                    showToast({
                      type: 'info',
                      message: `Você optou por não avaliar a reserva ${reservaParaAvaliar.name}.`,
                    });
                    setIsModalAvaliacao(false);
                  }}>
                    <LG 
                      weight={700} 
                      color={theme.colors.branco.principal} 
                      family={theme.fonts.inter}
                    >
                      Ignorar
                    </LG>
                  </S.ButtonSecondary>

                  <S.ButtonConfirm onClick={() => {
                    // Lógica para salvar a avaliação
                    if (avaliacao > 0) {
                      // Atualizar o currentUser no localStorage
                      const currentUserRaw = localStorage.getItem('currentUser');
                      if (currentUserRaw) {
                        const currentUser = JSON.parse(currentUserRaw);
                        
                        // Atualizar a reserva com a avaliação
                        if (currentUser.reserved_sports_location) {
                          const updatedReservations = currentUser.reserved_sports_location.map((reserva: any) => {
                            if (reserva.id === reservaParaAvaliar.id) {
                              return {
                                ...reserva,
                                rating: avaliacao,
                              };
                            }
                            return reserva;
                          });
                          
                          currentUser.reserved_sports_location = updatedReservations;
                          localStorage.setItem('currentUser', JSON.stringify(currentUser));
                          
                          // Atualizar também no infoUser
                          const infoUserRaw = localStorage.getItem('infoUser');
                          if (infoUserRaw) {
                            const infoUser = JSON.parse(infoUserRaw);
                            if (infoUser[currentUser.id]) {
                              infoUser[currentUser.id].reserved_sports_location = updatedReservations;
                              localStorage.setItem('infoUser', JSON.stringify(infoUser));
                            }
                          }
                          
                          // Atualizar a avaliação no mapMarkers
                          const mapMarkersRaw = localStorage.getItem('mapMarkers');
                          if (mapMarkersRaw && reservaParaAvaliar) {
                            const mapMarkers = JSON.parse(mapMarkersRaw);
                            
                            // Converter a avaliação para o formato correto (0.29, 1.44, 2.31, 3.48, 4.52)
                            let ratingValue;
                            switch(Math.round(avaliacao)) {
                              case 1: ratingValue = 0.29; break;
                              case 2: ratingValue = 1.44; break;
                              case 3: ratingValue = 2.31; break;
                              case 4: ratingValue = 3.48; break;
                              case 5: ratingValue = 4.52; break;
                              default: ratingValue = 0; break;
                            }
                            
                            // Encontrar o local correspondente no mapMarkers
                            const updatedMapMarkers = mapMarkers.map((marker: any) => {
                              if (marker.title === reservaParaAvaliar.name && 
                                  marker.address?.cep === reservaParaAvaliar.address?.cep && 
                                  marker.address?.number === reservaParaAvaliar.address?.number) {
                                
                                // Criar ou atualizar o array de avaliações
                                const avaliacoes = marker.avaliacoes || [];
                                
                                // Gerar um ID único para a avaliação
                                const avaliacaoId = `aval_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
                                
                                // Adicionar a nova avaliação ao array
                                avaliacoes.push({
                                  id: avaliacaoId,
                                  userId: currentUser.id,
                                  rating: ratingValue
                                });
                                
                                // Calcular a média das avaliações
                                const somaAvaliacoes = avaliacoes.reduce((soma: number, aval: any) => soma + aval.rating, 0);
                                const mediaAvaliacoes = somaAvaliacoes / avaliacoes.length;
                                
                                return {
                                  ...marker,
                                  rating: mediaAvaliacoes,
                                  avaliacoes: avaliacoes
                                };
                              }
                              return marker;
                            });
                            
                            localStorage.setItem('mapMarkers', JSON.stringify(updatedMapMarkers));
                          }
                        }
                      }
                      
                      showToast({
                        type: 'success',
                        message: 'Avaliação enviada com sucesso!',
                      });
                      
                      //set
                      setAvaliacao(0);
                      setIsModalAvaliacao(false);
                    } else {
                      showToast({
                        type: 'error',
                        message: 'Avalie sua experiência ou ignore a avaliação.',
                      });
                    }
                  }}>
                    <LG 
                      weight={700} 
                      color={theme.colors.branco.principal} 
                      family={theme.fonts.inter}
                    >
                      Avaliar
                    </LG>
                  </S.ButtonConfirm>
                </S.ContainerButtonsAvaliacao>
              </Dialog.Body>
            </S.ContainerModalReserva>
          </Modal>
        )}
      </S.Wrapper>

      <PageModal openDelay={50} visibleDuration={100}/>
    </S.Container>
  );
}
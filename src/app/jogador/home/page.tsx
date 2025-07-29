"use client";

import { useEffect, useState } from 'react';
import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api';

import { Tooltip } from 'react-tooltip';

import {
  mapContainerStyle,
  mapOptions,
  extraMarkers,
} from '@/utils/MapConfig';

import { fetchCEP } from '@/services/BuscaCep';

import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Header } from '@/components/Header';
import { Navbar } from '@/components/Navbar';
import  InputDays  from '@/components/inputDays';
import { InputHours } from '@/components/inputHours';
import { RatingStars } from '@/components/RatingStars';

import { Dialog, Spinner } from "@chakra-ui/react"

import * as S from './styles';
import { theme } from '@/styles/theme';
import { H3, LG, MD } from '@/styles/typographStyles';
import { showToast } from '@/components/ToastAlert';

export default function JogadorHome() {
  const [isMounted, setIsMounted] = useState(false);

  const [valueInputSearch, setValueInputSearch] = useState("");

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [isModalLocalization, setIsModalLocalization] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [cepData, setCepData] = useState<any>(null);

  const [isModalReserva, setIsModalReserva] = useState(false);
  const [valueInputDate, setValueInputDate] = useState("");
  const [valueInputStartHours, setValueInputStartHours] = useState("");
  const [valueInputEndHours, setValueInputEndHours] = useState("");

  const [metodoPagamento, setMetodoPagamento] = useState<string | null>(null);

  const [hasErrorMethodPayment, setHasErrorMethodPayment] = useState(false);
  const [hasErrorDate, setHasErrorDate] = useState(false);
  const [hasErrorStartHours, setHasErrorStartHours] = useState(false);
  const [hasErrorEndHours, setHasErrorEndHours] = useState(false);

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

  // Converte o valor do horário para número (ex: "13:00" => 13)
  const getHourAsNumber = (time: string) => {
    const [hourStr] = time.split(':')
    return parseInt(hourStr, 10)
  }

  const minEndHour = getHourAsNumber(valueInputStartHours) + 1

  const formatToHtmlDate = (raw: string) => {
    if (raw.length !== 8) return ''
    const day = raw.slice(0, 2)
    const month = raw.slice(2, 4)
    const year = raw.slice(4)
    return `${year}-${month}-${day}`
  }

  const todayDate = new Date().toISOString().split('T')[0]
  const isToday = formatToHtmlDate(valueInputDate) === todayDate

  const handleCloseModal = () => {
    setIsModalReserva(false)
    clearInputs()
  }

  const clearInputs = () => {
    setMetodoPagamento(null)
    setValueInputDate('')
    setValueInputStartHours('')
    setValueInputEndHours('')

    setHasErrorMethodPayment(false)
    setHasErrorDate(false)
    setHasErrorStartHours(false)
    setHasErrorEndHours(false)
  }

  const handleSubmitReserva = () => {
    console.log("metodoPagamento", metodoPagamento)
    const hasMethodPaymentError = metodoPagamento === null
    const hasDateError = valueInputDate === ''
    const hasStartHourError = valueInputStartHours === ''
    const hasEndHourError = valueInputEndHours === ''
  
    const hasAnyError = hasMethodPaymentError || hasDateError || hasStartHourError || hasEndHourError
  
    // Aplica os erros para mostrar visualmente nos inputs
    setHasErrorMethodPayment(hasMethodPaymentError)
    setHasErrorDate(hasDateError)
    setHasErrorStartHours(hasStartHourError)
    setHasErrorEndHours(hasEndHourError)
  
    if (hasAnyError) {
      showToast({
        type: 'error',
        message: 'Verifique todos os campos em vermelho.'
      })
      return
    }
  
    // Sucesso
    showToast({
      type: 'success',
      message: 'Reserva feita com sucesso!'
    })

    setIsModalReserva(false)
  
    // Aqui você pode continuar com a lógica da reserva, ex:
    console.log("==============QUADRA==============")
    console.log("nome", selectedMarker.title)
    console.log("cepData", cepData)
    console.log("==============PAGAMENTO==============")
    console.log("metodoPagamento", metodoPagamento)
    console.log("valueInputStartHours", valueInputStartHours)
    console.log("valueInputEndHours", valueInputEndHours)
    console.log("formatToHtmlDate(valueInputDate)", formatToHtmlDate(valueInputDate))
  }
  
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
  }

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
                                {/* {console.log('CEP Data:', cepData)} */}
                                {cepData?.logradouro} {cepData?.numero ? `, ${cepData?.numero}` : ''} - {cepData?.localidade}, {cepData?.uf}
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
                    <S.ContainerModalPayment 
                      hasError={hasErrorMethodPayment}
                      selected={metodoPagamento === "pix"}
                      onClick={() => setMetodoPagamento("pix")}
                      >
                      <MD 
                        family={theme.fonts.inter}
                        color={theme.colors.branco.secundario}
                        >
                        Pix
                      </MD>

                      <img src="/images/svg/icons-pix.svg" alt="Pagamento Pix"/>
                    </S.ContainerModalPayment>

                    <S.ContainerModalFormTooltip>
                      <img src="/images/png/icons-question-mark-1.png" alt=" Pagamento à vista" data-tooltip-id="pix-tooltip"/>

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

                    <S.ContainerModalPayment 
                      hasError={hasErrorMethodPayment}
                      selected={metodoPagamento === "avista"}
                      onClick={() => setMetodoPagamento("avista")}
                      >
                      <MD 
                        family={theme.fonts.inter}
                        color={theme.colors.branco.secundario}
                        >
                        À vista
                      </MD>

                      <img src="/images/png/icons-payment-method-2.png" alt=" Pagamento à vista"/>
                    </S.ContainerModalPayment>

                    <S.ContainerModalFormTooltip>
                      <img src="/images/png/icons-question-mark-1.png" alt=" Pagamento à vista" data-tooltip-id="avista-tooltip"/>

                      <Tooltip 
                        id="avista-tooltip" 
                        place="top"
                        content="O pagamento à vista deverá ser realizado diretamente com o proprietário do local. Ao selecionar essa opção, o proprietário será notificado sobre o método de pagamento escolhido."
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
                  </S.ContainerModalPaymentOptions>
                </S.ContainerModalFormPayment>


                <S.ContainerModalFormReserva>
                  <S.ContainerModalFormInputs>
                    <MD 
                      family={theme.fonts.inter}
                      color={theme.colors.branco.secundario}
                      >
                      Data:
                    </MD>

                    <InputDays onChange={handleDateChange} hasError={hasErrorDate}/>
                  </S.ContainerModalFormInputs>

                  <S.ContainerModalFormInputs>
                    <MD 
                      family={theme.fonts.inter}
                      color={theme.colors.branco.secundario}
                      >
                      Início:
                    </MD>

                    <InputHours 
                      disabled={valueInputDate !== '' ? false : true}
                      value={valueInputStartHours} 
                      onChange={handleHoursStartChange}  
                      minHour={6}
                      maxHour={22}
                      isToday={isToday}
                      hasError={hasErrorStartHours}
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
                      disabled={valueInputStartHours !== '' ? false : true}
                      value={valueInputEndHours} 
                      onChange={handleHoursEndChange}
                      minHour={minEndHour}
                      maxHour={23}
                      hasError={hasErrorEndHours}
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
                        Confirmar reserva
                    </LG>
                </S.Button>
              </Dialog.Body>
            </S.ContainerModalReserva>
          </Modal>
        )}
      </S.Wrapper>
    </S.Container>
  );
}
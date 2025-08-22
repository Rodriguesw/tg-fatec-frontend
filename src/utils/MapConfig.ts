export const mapContainerStyle = {
    width: '100%',
    height: '100%',
  };
  
  export const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#212121" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [{ color: "#757575" }],
    },
    {
      featureType: "administrative.country",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }],
    },
    {
      featureType: "administrative.land_parcel",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#bdbdbd" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#757575" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#181818" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#616161" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#1b1b1b" }],
    },
    {
      featureType: "road",
      elementType: "geometry.fill",
      stylers: [{ color: "#2c2c2c" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#8a8a8a" }],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [{ color: "#373737" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#3c3c3c" }],
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry",
      stylers: [{ color: "#4e4e4e" }],
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [{ color: "#616161" }],
    },
    {
      featureType: "transit",
      elementType: "labels.text.fill",
      stylers: [{ color: "#757575" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#3d3d3d" }],
    },
  ];
  
  export const mapOptions = {
    disableDefaultUI: true,
    styles: darkMapStyle,
    scrollwheel: false,       
    gestureHandling: 'greedy',  
    zoomControl: false,      
    minZoom: 14,
    maxZoom: 14,  
  };
  
  // RATING = 0.29, 1.44, 2.31, 3.48, 4.52
  export const defaultExtraMarkers  = [
    { 
      id_local: 3,
      id_proprietario: 1,
      lat: -23.600375,
      lng: -48.063587,
      title: 'Quadra de Futebol Socyte',
      type: 'Society',
      icon: {
        url: '/images/svg/icon-marker-map-orange.svg',
      },
      address: {
        cep: '18207500',
        number: '403',
      },
      time_end: "23:00",
      time_start: "10:00",
      days: ["Seg", "Sex"],
      price: "R$ 150,50",
      rating: 5
    },
    {
      id_local: 4,
      id_proprietario: 1,
      lat: -23.605519,
      lng: -48.0680583,
      title: 'Quadra do Cambuí',
      type: 'Society',
      icon: {
        url: '/images/svg/icon-marker-map-orange.svg',
      },
      address: {
        cep: '18207601',
        number: '403',
      },
      time_end: "21:00",
      time_start: "16:00",
      days: ["Qui", "Sex"],
      price: "R$ 656,55",
      rating: 4.52
    },
    {
      id_local: 5,
      id_proprietario: 1,
      lat: -23.5761249,
      lng: -48.0290791,
      title: 'Arena KS Society',
      type: 'Society',
      icon: {
        url: '/images/svg/icon-marker-map-orange.svg',
      },
      address: {
        cep: '18213110',
        number: '305',
      },
      time_end: "20:00",
      time_start: "12:00",
      days: ["Ter", "Qui"],
      price: "R$ 90,50",
      rating: 2.31
    },
    {
      id_local: 6,
      id_proprietario: 1,
      lat: -23.577428,
      lng: -48.0289618,
      title: 'Arena KF Futsal',
      type: 'Futsal',
      icon: {
        url: '/images/svg/icon-marker-map-blue.svg',
      },
      address: {
        cep: '18213080',
        number: '85',
      },
      time_end: "20:00",
      time_start: "15:00",
      days: ["Ter", "Qui"],
      price: "R$ 110,50",
      rating: 3.48
    },
  ];
  
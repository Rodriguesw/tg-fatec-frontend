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
      id: 1,
      lat: -23.5889,
      lng: -48.0532,
      title: 'Exemplo campo futebol',
      icon: {
        url: '/images/svg/icon-marker-map-green.svg',
      },
      address: {
        cep: '18207390',
        number: '123',
      },
      rating: 1.44
    },
    {
      id: 2,
      lat: -23.575531,
      lng: -48.027288,
      title: 'Arena Star Soccer',
      icon: {
        url: '/images/svg/icon-marker-map-blue.svg',
      },
      address: {
        cep: '18213110',
        number: '280',
      },
      rating: 3
    },
    { 
      id: 3,
      lat: -23.600375,
      lng: -48.063587,
      title: 'Quadra de Futebol Socyte',
      icon: {
        url: '/images/svg/icon-marker-map-orange.svg',
      },
      address: {
        cep: '18207500',
        number: '403',
      },
      rating: 5
    },
    {
      id: 4,
      lat: -23.605519,
      lng: -48.0680583,
      title: 'Quadra do Cambuí',
      icon: {
        url: '/images/svg/icon-marker-map-orange.svg',
      },
      address: {
        cep: '18207601',
      },
      rating: 4.52
    },
    {
      id: 5,
      lat: -23.5761249,
      lng: -48.0290791,
      title: 'Arena KS Society',
      icon: {
        url: '/images/svg/icon-marker-map-orange.svg',
      },
      address: {
        cep: '18213110',
        number: '305',
      },
      rating: 2.31
    },
    {
      id: 6,
      lat: -23.577428,
      lng: -48.0289618,
      title: 'Arena KF Futsal',
      icon: {
        url: '/images/svg/icon-marker-map-blue.svg',
      },
      address: {
        cep: '18213080',
        number: '85',
      },
      rating: 3.48
    },
  ];
  
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
  };
  
  export const extraMarkers = [
    {
      lat: -23.5889,
      lng: -48.0532,
      title: 'Campo do Bairro',
      icon: {
        url: '/images/png/icon-marker-map.png',
      },
    },
    {
      lat: -23.6042,
      lng: -48.0435,
      title: 'Ginásio Central',
      icon: {
        url: '/images/png/icon-marker-map.png',
      },
    },
    {
      lat: -23.5851,
      lng: -48.0723,
      title: 'Parque da Cidade',
      icon: {
        url: '/images/png/icon-marker-map.png',
      },
    },
    {
      lat: -23.5964,
      lng: -48.0611,
      title: 'Quadra Coberta',
      icon: {
        url: '/images/png/icon-marker-map.png',
      },
    },
    {
      lat: -23.5798,
      lng: -48.0557,
      title: 'Estádio Municipal',
      icon: {
        url: '/images/png/icon-marker-map.png',
      },
    },
  ];
  
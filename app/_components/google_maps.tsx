import React from 'react'
import { GoogleMap, useJsApiLoader, MarkerF, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '50%',
  height: '400px'
};

interface Geom {
  y: number;
  x: number;
}
  
interface GoogleMapComponentProps {
  geom: Geom;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ geom }) => {
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    throw new Error('Missing GOOGLE_MAPS_API_KEY in environment variables');
  }

  const { isLoaded } = useJsApiLoader({
    id: 'Partidinho',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  })

  const options = {
    mapId: process.env.NEXT_PUBLIC_MAP_ID,
    mapTypeControl: false,
    zoomControl: true,
    fullscreenControl: false,
    streetViewControl: false
  }


  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{lat: geom.y, lng: geom.x}}
      zoom={14}
      options={options}
    >
      <Marker position={{lat: geom.y, lng: geom.x}}/>
    </GoogleMap>
  ) : (<>Loading...</>)
}

export default GoogleMapComponent;
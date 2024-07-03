"use client"

import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  APIProvider,
  ControlPosition,
  MapControl,
  AdvancedMarker,
  Map,
  useMap,
  useMapsLibrary,
  useAdvancedMarkerRef,
  AdvancedMarkerRef
} from '@vis.gl/react-google-maps';
import { useMatchForm } from '../(pages)/create/_components/_match_form/matchFormContext';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const GoogleMapTest = () => {
  const { setMatchForm } = useMatchForm();
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [markerRef, marker] = useAdvancedMarkerRef();
  
  useEffect(() => {
    setMatchForm((prevForm) => { 
      return {
        ...prevForm, 
        location: selectedPlace
      }
    })
  }, [selectedPlace])
  

  return (
    <APIProvider
      apiKey={API_KEY || ''}
      solutionChannel='GMP_devsite_samples_v3_rgmautocomplete'
    >
        <Map
            mapId={'a0836553190bc0d0'}
            defaultZoom={9}
            defaultCenter={{ lat: -33.522168037152326, lng: -70.60654541145749 }}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            style={{width: '100%', height: '300px'}}
        >
            <AdvancedMarker ref={markerRef} position={null} />
        </Map>
        <MapControl position={ControlPosition.TOP}>
            <div className="">
                <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
            </div>
        </MapControl>
        <MapHandler place={selectedPlace} marker={marker} />
    </APIProvider>
  );
};

interface MapHandlerProps {
  place: google.maps.places.PlaceResult | null;
  marker: google.maps.marker.AdvancedMarkerElement | null;
}

const MapHandler = ({ place, marker }: MapHandlerProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place || !marker) return;

    if (place.geometry?.viewport) {
      map.fitBounds(place.geometry?.viewport);
    }
    marker.position = place.geometry?.location;
  }, [map, place, marker]);

  return null;
};

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

const PlaceAutocomplete = ({ onPlaceSelect }: PlaceAutocompleteProps) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'name', 'formatted_address', 'place_id']
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener('place_changed', () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className="">
      <input ref={inputRef} className='w-64 p-2 rounded-md border-2 border-blue-950'/>
    </div>
  );
};

export default GoogleMapTest;
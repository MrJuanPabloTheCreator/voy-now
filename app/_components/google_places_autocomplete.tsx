import React, { useState, useEffect, useRef } from 'react';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Function to dynamically load Google Maps script
const loadScript = (url: string): Promise<void> => {
  const script = document.createElement('script');
  script.src = url;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
  return new Promise((resolve) => {
    script.onload = () => resolve();
  });
};

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  country: string;
}

const PlaceAutocomplete: React.FC<PlaceAutocompleteProps> = ({ onPlaceSelect, country }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initializeAutocomplete = () => {
      if (!inputRef.current) return;

      const options = {
        fields: ['geometry', 'name', 'formatted_address', 'place_id'] as google.maps.places.AutocompleteOptions['fields'],
        componentRestrictions: { country },
      };

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current!, options);

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place) {
          onPlaceSelect(place);
        }
      });

      setPlaceAutocomplete(autocomplete);
    };

    const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
    if (!window.google) {
      loadScript(scriptUrl).then(() => {
        initializeAutocomplete();
      });
    } else {
      initializeAutocomplete();
    }
  }, [onPlaceSelect, country]);

  return (
    <div>
      <input ref={inputRef} className='w-full p-2 rounded-md border-2 outline-none bg-zdark border-white/10 text-white/40'/>
    </div>
  );
};

export default PlaceAutocomplete;

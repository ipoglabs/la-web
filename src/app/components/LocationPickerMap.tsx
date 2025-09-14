'use client';

import {
  GoogleMap,
  Marker,
  useLoadScript,
  Autocomplete,
} from '@react-google-maps/api';
import { useRef, useState } from 'react';

const libraries: ('places')[] = ['places'];

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface LocationPickerMapProps {
  onLocationSelect?: (location: Location) => void;
}

const LocationPickerMap: React.FC<LocationPickerMapProps> = ({ onLocationSelect }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 40.7128,
    lng: -74.006,
  });
  const [marker, setMarker] = useState<{ lat: number; lng: number }>(center);
  const [address, setAddress] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceChanged = () => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const position = { lat, lng };

    const fullAddress = place.formatted_address || '';

    setCenter(position);
    setMarker(position);
    setAddress(fullAddress);
    setSearchInputValue(fullAddress);

    if (onLocationSelect) {
      onLocationSelect({ lat, lng, address: fullAddress });
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();

    const fullAddress = data.results?.[0]?.formatted_address || '';
    setAddress(fullAddress);
    setSearchInputValue(fullAddress);

    if (onLocationSelect) {
      onLocationSelect({ lat, lng, address: fullAddress });
    }
  };

  const handleMarkerDragEnd = async (
    e: google.maps.MapMouseEvent | google.maps.IconMouseEvent
  ) => {
    let lat: number;
    let lng: number;

    if (typeof e.latLng?.lat === 'function') {
      lat = e.latLng.lat();
      lng = e.latLng.lng();
    } else {
      return;
    }

    const pos = { lat, lng };
    setMarker(pos);
    reverseGeocode(lat, lng);
  };

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="w-full h-[400px]">
      <Autocomplete
        onLoad={(autocomplete) => {
          autocompleteRef.current = autocomplete;
        }}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          type="text"
          placeholder="Search location..."
          className="w-full p-2 border mb-2"
          value={searchInputValue}
          onChange={(e) => setSearchInputValue(e.target.value)}
        />
      </Autocomplete>

      <GoogleMap
        center={center}
        zoom={14}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        onClick={(e) => {
          if (!e.latLng) return;
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          setMarker({ lat, lng });
          reverseGeocode(lat, lng);
        }}
      >
        <Marker position={marker} draggable onDragEnd={handleMarkerDragEnd} />
      </GoogleMap>

      {/* Hidden inputs for form submission */}
      <input type="hidden" name="location.lat" value={marker.lat} />
      <input type="hidden" name="location.lng" value={marker.lng} />
      <input type="hidden" name="location.address" value={address} />
    </div>
  );
};

export default LocationPickerMap;

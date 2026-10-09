'use client';

import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useMemo } from 'react';
import { MapPin } from 'lucide-react';

interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
}

function MapInner({ center, zoom, apiKey }: MapProps & { apiKey: string }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });

  const containerStyle = {
    width: '100%',
    height: '100%'
  };

  const options = useMemo(() => ({
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
      { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }]
      }
    ]
  }), []);

  if (!isLoaded) return <div className="w-full h-full bg-slate-50 dark:bg-slate-800 animate-pulse flex items-center justify-center text-slate-500">Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      options={options}
    >
      <Marker position={center} />
    </GoogleMap>
  );
}

export default function Map({ center, zoom = 14 }: MapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    return (
      <div className="w-full h-full min-h-[300px] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 p-6 text-center border border-slate-200 dark:border-slate-700 rounded-xl">
        <div className="flex flex-col items-center gap-2">
          <MapPin className="w-8 h-8 text-slate-500" />
          <p className="font-medium">Map View Unavailable</p>
          <span className="text-xs text-slate-500">Google Maps API key is not configured.</span>
        </div>
      </div>
    );
  }

  return <MapInner center={center} zoom={zoom} apiKey={apiKey} />;
}

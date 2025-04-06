import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface LocationContextType {
  location: { latitude: number; longitude: number } | null;
  error: string | null;
  requestLocationPermission: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  googleMapsApiKey: string;
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children, googleMapsApiKey }) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const sendLocationToBackend = async (latitude: number, longitude: number) => {
    const username = localStorage.getItem('name');
    const email = localStorage.getItem('email');

    if (!username || !email) {
      console.warn("Username or email missing in localStorage, not sending location");
      return;
    }

    try {
      const payload = {
        latitude,
        longitude,
        username,
        email,
      };

      const ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:4000');

      ws.onopen = () => {
        ws.send(JSON.stringify(payload));
        console.log("Location sent via WebSocket:", payload);
        ws.close();
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
      };
    } catch (error) {
      console.error('Error sending location via WebSocket:', error);
    }
  };

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setPermissionGranted(true);
          sendLocationToBackend(latitude, longitude);
        },
        (err:any) => {
          setError('Location access denied or unavailable');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser');
    }
  };

  // Request permission on mount
  useEffect(() => {
    if (!permissionGranted) {
      requestLocationPermission();
    }
  }, [permissionGranted]);

  // Send updated location every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (location) {
        sendLocationToBackend(location.latitude, location.longitude);
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [location]);

  return (
    <LocationContext.Provider value={{ location, error, requestLocationPermission }}>
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        {permissionGranted ? (
          children
        ) : (
          <div>
            <p></p>
            <button onClick={requestLocationPermission}></button>
          </div>
        )}
      </LoadScript>
    </LocationContext.Provider>
  );
};

export const GoogleMapComponent: React.FC = () => {
  const { location, error } = useLocation();

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!location) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '400px' }}
      center={{ lat: location.latitude, lng: location.longitude }}
      zoom={12}
    >
      <Marker position={{ lat: location.latitude, lng: location.longitude }} />
    </GoogleMap>
  );
};
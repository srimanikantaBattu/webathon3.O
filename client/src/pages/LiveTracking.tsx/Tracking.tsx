import React, { useEffect, useRef, useState } from "react";

// Load the Google Maps script dynamically
const loadGoogleMapsScript = (callback: () => void) => {
  const existingScript = document.getElementById("googleMapsScript");
  if (!existingScript) {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCNkYKo3Q7EcMi1rSaQm28KuJczCqI0JcE`; // Replace with your actual API key
    script.id = "googleMapsScript";
    script.async = true;
    script.defer = true;
    script.onload = callback;
    document.body.appendChild(script);
  } else {
    callback();
  }
};

const HostelLocationCheck: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [alertShown, setAlertShown] = useState(false);
  const alertShownRef = useRef(false);
  const hostelLat = 17.53883;
  const hostelLng = 78.39342;
  const allowedRadiusMeters = 500;
  const buffer = 10;

  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371000;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const initMap = (lat: number, lng: number) => {
    if (!mapRef.current) return;

    const userLocation = new google.maps.LatLng(lat, lng);
    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 16,
    });

    markerRef.current = new google.maps.Marker({
      position: userLocation,
      map: mapInstance.current,
      title: "You are here",
    });

    // Circle around hostel
    new google.maps.Circle({
      strokeColor: "#ff0000",
      strokeOpacity: 0.6,
      strokeWeight: 2,
      fillColor: "#ff0000",
      fillOpacity: 0.1,
      map: mapInstance.current,
      center: { lat: hostelLat, lng: hostelLng },
      radius: allowedRadiusMeters,
    });
  };

  const updateMap = (lat: number, lng: number) => {
    const newLocation = new google.maps.LatLng(lat, lng);
    markerRef.current?.setPosition(newLocation);
    mapInstance.current?.setCenter(newLocation);
  };

  useEffect(() => {
    loadGoogleMapsScript(() => {
      if (navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            const distance = getDistance(lat, lng, hostelLat, hostelLng);
            console.log(`🧭 You are ${distance.toFixed(2)} meters from hostel`);
            console.log(`Your location: lat=${lat}, lng=${lng}`);

            if (distance > allowedRadiusMeters + buffer && !alertShownRef.current) {
                alert("⚠️ You are not within 500 meters of the hostel!");
                alertShownRef.current = true;
              } else if (distance <= allowedRadiusMeters + buffer) {
                alertShownRef.current = false;
              }
              

            if (!mapInstance.current) {
              initMap(lat, lng);
            } else {
              updateMap(lat, lng);
            }
          },
          (error) => {
            alert("⚠️ Location access is required! Please enable it in your browser.");
            console.error("Location error:", error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 5000,
          }
        );

        return () => {
          navigator.geolocation.clearWatch(watchId);
        };
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    });
  }, [alertShown]);

  return (
    <div>
      <h2>Hostel Location Check (within 500 meters)</h2>
      <div
        ref={mapRef}
        style={{ height: "500px", width: "100%" }}
        id="map"
      />
    </div>
  );
};

export default HostelLocationCheck;


import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

// Define interfaces
interface MapProps {
  center: [number, number];
  routes?: Array<{
    id: string;
    coordinates: [number, number][];
    transportMode?: string;
  }>;
  startCoords?: [number, number];
  endCoords?: [number, number];
  selectedRouteId?: string;
}

// Map component that avoids React context issues
const Map: React.FC<MapProps> = ({
  center,
  routes = [],
  startCoords,
  endCoords,
  selectedRouteId
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const routeLayersRef = useRef<L.Polyline[]>([]);
  
  // Function to handle map initialization
  const onMapCreated = (map: L.Map) => {
    mapRef.current = map;
  };
  
  // Update map center when center prop changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, mapRef.current.getZoom());
    }
  }, [center]);
  
  // Handle routes rendering
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    
    // Clean up existing route layers
    routeLayersRef.current.forEach(layer => {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });
    
    routeLayersRef.current = [];
    
    if (!routes || routes.length === 0) return;
    
    // Add new route lines
    const allCoordinates: [number, number][] = [];
    
    routes.forEach(route => {
      const isSelected = route.id === selectedRouteId;
      
      const polyline = L.polyline(route.coordinates, {
        color: isSelected ? '#15803d' : '#4ade80',
        weight: isSelected ? 5 : 3,
        opacity: isSelected ? 1 : 0.7,
        dashArray: route.transportMode === 'transit' ? '5, 5' : ''
      });
      
      polyline.on('mouseover', () => {
        if (!isSelected) {
          polyline.setStyle({
            weight: 4,
            opacity: 0.9
          });
        }
      });
      
      polyline.on('mouseout', () => {
        if (!isSelected) {
          polyline.setStyle({
            weight: 3,
            opacity: 0.7
          });
        }
      });
      
      polyline.addTo(map);
      routeLayersRef.current.push(polyline);
      
      if (route.coordinates && route.coordinates.length > 0) {
        allCoordinates.push(...route.coordinates);
      }
    });
    
    // Fit bounds if we have coordinates
    if (allCoordinates.length > 0) {
      const bounds = L.latLngBounds(allCoordinates);
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
    
  }, [routes, selectedRouteId]);
  
  return (
    <div className="h-full w-full">
      <MapContainer 
        center={center} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        ref={onMapCreated}
        whenCreated={onMapCreated}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {startCoords && (
          <Marker position={startCoords}>
            <Popup>Starting Point</Popup>
          </Marker>
        )}
        
        {endCoords && (
          <Marker position={endCoords}>
            <Popup>Destination</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;

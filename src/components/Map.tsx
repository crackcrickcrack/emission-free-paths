
import React from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

// Map view updater component
function MapViewUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  
  React.useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
}

// Component to render route lines
function RouteLines({ routes, selectedRouteId }: { 
  routes: Array<{ 
    id: string; 
    coordinates: [number, number][]; 
    transportMode?: string 
  }>;
  selectedRouteId?: string 
}) {
  const map = useMap();
  
  React.useEffect(() => {
    if (!routes || routes.length === 0) return;

    // Clear previous layers first
    map.eachLayer((layer) => {
      if (layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });
    
    // Add new polylines
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
    });
    
    // Fit bounds
    if (routes && routes.length > 0) {
      const allCoordinates: [number, number][] = [];
      
      routes.forEach(route => {
        if (route.coordinates && route.coordinates.length > 0) {
          allCoordinates.push(...route.coordinates);
        }
      });
      
      if (allCoordinates.length > 0) {
        const bounds = L.latLngBounds(allCoordinates);
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    }
    
    return () => {
      // Cleanup
      map.eachLayer((layer) => {
        if (layer instanceof L.Polyline) {
          map.removeLayer(layer);
        }
      });
    };
  }, [routes, selectedRouteId, map]);
  
  return null;
}

// Component to render markers
function MapMarkers({ 
  startCoords, 
  endCoords 
}: { 
  startCoords?: [number, number]; 
  endCoords?: [number, number]; 
}) {
  return (
    <>
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
    </>
  );
}

// Main Map component
const Map: React.FC<MapProps> = ({
  center,
  routes = [],
  startCoords,
  endCoords,
  selectedRouteId
}) => {
  return (
    <div className="h-full w-full">
      <MapContainer 
        center={center} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapViewUpdater center={center} />
        
        {routes && routes.length > 0 && (
          <RouteLines routes={routes} selectedRouteId={selectedRouteId} />
        )}
        
        <MapMarkers startCoords={startCoords} endCoords={endCoords} />
      </MapContainer>
    </div>
  );
};

export default Map;

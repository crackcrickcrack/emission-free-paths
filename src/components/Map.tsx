
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

// Component to update the map view when center changes
const MapViewUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  
  React.useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
};

// Component to handle route rendering
const RouteLinesLayer = ({ 
  routes, 
  selectedRouteId 
}: { 
  routes: Array<{
    id: string;
    coordinates: [number, number][];
    transportMode?: string;
  }>;
  selectedRouteId?: string;
}) => {
  const map = useMap();
  
  React.useEffect(() => {
    // Clear any existing polylines
    map.eachLayer((layer) => {
      if (layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });
    
    // Draw routes if available
    if (routes && routes.length > 0) {
      const allCoordinates: [number, number][] = [];
      
      routes.forEach((route) => {
        if (route.coordinates && route.coordinates.length > 0) {
          const isSelected = route.id === selectedRouteId;
          
          // Add coordinates to collection for bounds calculation
          allCoordinates.push(...route.coordinates);
          
          // Create polyline for the route
          const routeLine = L.polyline(route.coordinates, {
            color: isSelected ? '#15803d' : '#4ade80',
            weight: isSelected ? 5 : 3,
            opacity: isSelected ? 1 : 0.7,
            dashArray: route.transportMode === 'transit' ? '5, 5' : ''
          });
          
          // Add hover effect
          routeLine.on('mouseover', function() {
            if (!isSelected) {
              routeLine.setStyle({
                weight: 4,
                opacity: 0.9
              });
            }
          });
          
          routeLine.on('mouseout', function() {
            if (!isSelected) {
              routeLine.setStyle({
                weight: 3,
                opacity: 0.7
              });
            }
          });
          
          // Add the polyline to the map
          routeLine.addTo(map);
        }
      });
      
      // Adjust map view to fit all routes
      if (allCoordinates.length > 0) {
        const bounds = L.latLngBounds(allCoordinates);
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    }
    
    // Cleanup function
    return () => {
      map.eachLayer((layer) => {
        if (layer instanceof L.Polyline) {
          map.removeLayer(layer);
        }
      });
    };
  }, [routes, selectedRouteId, map]);

  return null;
};

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
          <RouteLinesLayer routes={routes} selectedRouteId={selectedRouteId} />
        )}
        
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

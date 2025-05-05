
import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

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

// Component to handle map routes
function MapRoutes({ 
  routes = [], 
  selectedRouteId 
}: { 
  routes?: MapProps['routes'],
  selectedRouteId?: string 
}) {
  const map = useMap();
  const routesRef = React.useRef<L.Polyline[]>([]);

  // Cleanup function to remove routes when component unmounts or routes change
  const clearRoutes = () => {
    routesRef.current.forEach(route => {
      if (map && route) {
        map.removeLayer(route);
      }
    });
    routesRef.current = [];
  };

  useEffect(() => {
    // Clear existing routes
    clearRoutes();

    // Skip if no routes
    if (!routes || routes.length === 0) return;

    // Add new routes
    const allCoordinates: [number, number][] = [];

    routes.forEach(route => {
      const isSelected = route.id === selectedRouteId;
      
      if (route.coordinates && route.coordinates.length > 0) {
        // Ensure coordinates are valid
        const validCoordinates = route.coordinates.filter(coord => 
          Array.isArray(coord) && 
          coord.length === 2 && 
          !isNaN(coord[0]) && 
          !isNaN(coord[1])
        );
        
        if (validCoordinates.length < 2) {
          console.warn('Not enough valid coordinates for route:', route.id);
          return;
        }
        
        const polyline = L.polyline(validCoordinates, {
          color: isSelected ? '#15803d' : '#4ade80',
          weight: isSelected ? 5 : 3,
          opacity: isSelected ? 1 : 0.7,
          dashArray: route.transportMode === 'transit' ? '5, 5' : ''
        });
        
        // Add hover effects
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
        
        // Add to map and store reference
        polyline.addTo(map);
        routesRef.current.push(polyline);
        
        // Collect coordinates for bounds calculation
        allCoordinates.push(...validCoordinates);
      }
    });
    
    // Fit bounds if we have coordinates
    if (allCoordinates.length > 0) {
      try {
        const bounds = L.latLngBounds(allCoordinates);
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      } catch (error) {
        console.error('Error setting map bounds:', error);
      }
    }
    
    // Cleanup on unmount or when routes change
    return clearRoutes;
  }, [map, routes, selectedRouteId]);

  return null;
}

// Component to handle map markers
function MapMarkers({ 
  startCoords, 
  endCoords 
}: { 
  startCoords?: [number, number],
  endCoords?: [number, number]
}) {
  return (
    <>
      {startCoords && Array.isArray(startCoords) && startCoords.length === 2 && 
       !isNaN(startCoords[0]) && !isNaN(startCoords[1]) && (
        <Marker position={startCoords}>
          <Popup>Starting Point</Popup>
        </Marker>
      )}
      
      {endCoords && Array.isArray(endCoords) && endCoords.length === 2 &&
       !isNaN(endCoords[0]) && !isNaN(endCoords[1]) && (
        <Marker position={endCoords}>
          <Popup>Destination</Popup>
        </Marker>
      )}
    </>
  );
}

// Component to handle map center updates
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2 && 
        !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  
  return null;
}

// Error display component
const MapError = ({ error }: { error: Error }) => (
  <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
    <Alert variant="destructive" className="max-w-md">
      <AlertDescription>
        Failed to load map: {error.message}
      </AlertDescription>
    </Alert>
  </div>
);

// Loading component
const MapLoading = () => (
  <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
  </div>
);

// Main Map component
const Map: React.FC<MapProps> = ({
  center,
  routes = [],
  startCoords,
  endCoords,
  selectedRouteId
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Simulate loading time to ensure map properly initializes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return <MapError error={error} />;
  }

  if (isLoading) {
    return <MapLoading />;
  }

  return (
    <div className="h-full w-full">
      <MapContainer 
        center={center} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {mapReady && (
          <>
            <MapController center={center} />
            <MapRoutes routes={routes} selectedRouteId={selectedRouteId} />
            <MapMarkers startCoords={startCoords} endCoords={endCoords} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;

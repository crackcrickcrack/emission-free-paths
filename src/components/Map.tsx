import React, { useEffect, useRef, useState, Component, ReactNode } from 'react';
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

interface MapControllerProps {
  center: [number, number];
  routes: MapProps['routes'];
  selectedRouteId?: string;
}

// Error boundary component
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class MapErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <Alert variant="destructive" className="max-w-md">
            <AlertDescription>
              Failed to load map: {this.state.error?.message}
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading component
const MapLoading = () => (
  <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
  </div>
);

// Component to handle map controller functionality
const MapController: React.FC<MapControllerProps> = ({ center, routes, selectedRouteId }) => {
  const map = useMap();
  const routeLayersRef = useRef<L.Polyline[]>([]);
  
  // Update map center when center prop changes
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  // Handle routes rendering
  useEffect(() => {
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
    
    return () => {
      // Clean up when component unmounts
      routeLayersRef.current.forEach(layer => {
        if (map.hasLayer(layer)) {
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Give map time to initialize

    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            Failed to load map: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return <MapLoading />;
  }

  return (
    <MapErrorBoundary>
      <div className="h-full w-full">
        <MapContainer 
          center={center} 
          zoom={12} 
          style={{ height: '100%', width: '100%' }}
          whenReady={() => setIsLoading(false)}
        >
          <MapController center={center} routes={routes} selectedRouteId={selectedRouteId} />
          
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
    </MapErrorBoundary>
  );
};

export default Map;

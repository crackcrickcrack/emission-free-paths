
import React, { useEffect, useRef } from 'react';
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
const ChangeMapView: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
};

// Component to handle routes
const RouteManager: React.FC<{ 
  routes?: MapProps['routes'], 
  selectedRouteId?: string 
}> = ({ routes, selectedRouteId }) => {
  const map = useMap();
  const routeLayersRef = useRef<L.LayerGroup | null>(null);
  
  useEffect(() => {
    // Clear previous routes
    if (routeLayersRef.current) {
      routeLayersRef.current.clearLayers();
    } else {
      routeLayersRef.current = L.layerGroup().addTo(map);
    }
    
    // Draw routes
    if (routes && routes.length > 0) {
      routes.forEach((route) => {
        // Check if route has coordinates
        if (route.coordinates && route.coordinates.length > 0) {
          const isSelected = route.id === selectedRouteId;
          
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
              this.setStyle({
                weight: 4,
                opacity: 0.9
              });
            }
          });
          
          routeLine.on('mouseout', function() {
            if (!isSelected) {
              this.setStyle({
                weight: 3,
                opacity: 0.7
              });
            }
          });
          
          // Add the polyline to the layer
          if (routeLayersRef.current) {
            routeLine.addTo(routeLayersRef.current);
          }
          
          // Set bounds to fit all routes
          if (routes.length === 1) {
            map.fitBounds(routeLine.getBounds(), {
              padding: [50, 50]
            });
          }
        }
      });

      // Set bounds to fit all routes if multiple routes
      if (routes.length > 1) {
        const allCoordinates = routes.flatMap(r => r.coordinates || []);
        if (allCoordinates.length > 0) {
          const bounds = L.latLngBounds(allCoordinates);
          if (bounds.isValid()) {
            map.fitBounds(bounds, {
              padding: [50, 50]
            });
          }
        }
      }
    }

    return () => {
      if (routeLayersRef.current) {
        routeLayersRef.current.clearLayers();
      }
    };
  }, [routes, selectedRouteId, map]);

  return null;
};

// Our main Map component - using functional child components correctly
const Map: React.FC<MapProps> = ({
  center,
  routes = [],
  startCoords,
  endCoords,
  selectedRouteId
}) => {
  // Make sure we're not rendering anything incorrectly
  console.log("Map rendering with center:", center);

  // Define a simple function to call when map is ready
  const handleMapReady = () => {
    console.log("Map ready");
  };

  return (
    <div className="map-container h-full">
      <MapContainer 
        center={center} 
        zoom={12} 
        className="h-full w-full"
        whenCreated={handleMapReady}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Properly encapsulated child components that use React context */}
        <ChangeMapView center={center} />
        <RouteManager routes={routes} selectedRouteId={selectedRouteId} />
        
        {/* Markers for start and end points */}
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

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
const ChangeMapView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
};

// Component to draw the route on the map
const RouteLayer = ({ 
  routes = [], 
  selectedRouteId 
}: { 
  routes: MapProps['routes']; 
  selectedRouteId?: string 
}) => {
  const map = useMap();
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    // Clear previous routes
    if (routeLayerRef.current) {
      routeLayerRef.current.clearLayers();
      map.removeLayer(routeLayerRef.current);
    }

    // Create a new layer group
    const routeLayer = L.layerGroup();

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
          routeLine.addTo(routeLayer);
          
          // Set bounds to fit all routes
          if (routes.length === 1) {
            map.fitBounds(routeLine.getBounds(), {
              padding: [50, 50]
            });
          }
        }
      });

      // Add the layer group to the map
      routeLayer.addTo(map);
      routeLayerRef.current = routeLayer;

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
      if (routeLayerRef.current) {
        routeLayerRef.current.clearLayers();
        map.removeLayer(routeLayerRef.current);
      }
    };
  }, [map, routes, selectedRouteId]);

  return null;
};

// This component renders the internal map contents using the Leaflet context
const MapContents = ({
  center,
  routes = [],
  startCoords,
  endCoords,
  selectedRouteId
}: MapProps) => {
  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ChangeMapView center={center} />
      <RouteLayer routes={routes} selectedRouteId={selectedRouteId} />
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
};

// Main Map component
const Map = ({
  center,
  routes = [],
  startCoords,
  endCoords,
  selectedRouteId
}: MapProps) => {
  return (
    <div className="map-container h-full">
      <MapContainer 
        center={center} 
        zoom={12} 
        className="h-full w-full"
        whenReady={() => {
          // Optional: You can access the map instance here if needed
          console.log("Map ready");
        }}
      >
        <MapContents
          center={center}
          routes={routes}
          startCoords={startCoords}
          endCoords={endCoords}
          selectedRouteId={selectedRouteId}
        />
      </MapContainer>
    </div>
  );
};

export default Map;

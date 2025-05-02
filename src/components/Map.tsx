
import React, { useEffect, useRef, useState } from 'react';
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
  routes: Array<{
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
  routes, 
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
      map.removeLayer(routeLayerRef.current);
    }

    // Draw routes
    if (routes && routes.length > 0) {
      const routeLayer = L.layerGroup();

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
          }).addTo(routeLayer);
          
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
          
          // Set bounds to fit all routes
          if (routes.length === 1) {
            map.fitBounds(routeLine.getBounds(), {
              padding: [50, 50]
            });
          }
        }
      });

      routeLayer.addTo(map);
      routeLayerRef.current = routeLayer;

      // Set bounds to fit all routes if multiple routes
      if (routes.length > 1) {
        const bounds = L.latLngBounds(routes.flatMap(r => r.coordinates || []));
        if (bounds.isValid()) {
          map.fitBounds(bounds, {
            padding: [50, 50]
          });
        }
      }
    }

    return () => {
      if (routeLayerRef.current) {
        map.removeLayer(routeLayerRef.current);
      }
    };
  }, [map, routes, selectedRouteId]);

  return null;
};

const MapContent = ({ 
  center, 
  routes, 
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
      <RouteLayer routes={routes || []} selectedRouteId={selectedRouteId} />
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

const Map: React.FC<MapProps> = (props) => {
  // Separate the map container from the internal components that need context
  return (
    <div className="map-container h-full">
      <MapContainer center={props.center} zoom={12} className="h-full w-full">
        <MapContent {...props} />
      </MapContainer>
    </div>
  );
};

export default Map;

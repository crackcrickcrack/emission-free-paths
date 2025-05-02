
import React from 'react';
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

// Component to update the map view when center changes
const ChangeMapView = ({ center }: { center: [number, number] }) => {
  const map = React.useRef<L.Map | null>(null);
  
  React.useEffect(() => {
    if (map.current) {
      map.current.setView(center, map.current.getZoom());
    }
  }, [center]);
  
  return (
    <div id="map-view-handler" ref={(el) => {
      if (el && !map.current) {
        // Get the map instance from the parent MapContainer
        const mapContainer = el.closest('.leaflet-container');
        if (mapContainer) {
          // @ts-ignore - We know this exists in the Leaflet instance
          map.current = mapContainer._leaflet_id ? L.map(mapContainer) : null;
        }
      }
    }} style={{ display: 'none' }} />
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
  // We'll manage route layers with refs and useEffect instead of custom components
  const mapRef = React.useRef<L.Map | null>(null);
  const routeLayersRef = React.useRef<L.LayerGroup | null>(null);
  
  // Effect for handling routes
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    
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
  }, [routes, selectedRouteId]);

  return (
    <div className="map-container h-full">
      <MapContainer 
        center={center} 
        zoom={12} 
        className="h-full w-full"
        whenReady={(map) => {
          mapRef.current = map.target;
          console.log("Map ready");
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeMapView center={center} />
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

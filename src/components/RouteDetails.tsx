
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Navigation2, MapPin } from 'lucide-react';

interface RouteDetailsProps {
  route: {
    id: string;
    transportMode: string;
    distance: number;
    duration: number;
    emissions: number;
    startLocation: string;
    endLocation: string;
    steps: Array<{
      instruction: string;
      distance: number;
      duration: number;
    }>;
  };
}

const RouteDetails: React.FC<RouteDetailsProps> = ({ route }) => {
  const {
    transportMode,
    distance,
    duration,
    emissions,
    startLocation,
    endLocation,
    steps,
  } = route;

  // Format duration in minutes/hours
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} h ${remainingMinutes > 0 ? remainingMinutes + ' min' : ''}`;
  };

  // Format short distance
  const formatShortDistance = (meters: number) => {
    if (meters < 1000) {
      return `${meters} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  // Get transport mode icon
  const getTransportIcon = () => {
    switch (transportMode) {
      case 'driving':
        return '🚗';
      case 'cycling':
        return '🚲';
      case 'walking':
        return '🚶';
      case 'transit':
        return '🚌';
      default:
        return '🚗';
    }
  };

  // Get transport mode name
  const getTransportName = () => {
    switch (transportMode) {
      case 'driving':
        return 'Car';
      case 'cycling':
        return 'Bike';
      case 'walking':
        return 'Walking';
      case 'transit':
        return 'Public Transit';
      default:
        return 'Car';
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <span className="mr-2 text-xl">{getTransportIcon()}</span>
            Route Details ({getTransportName()})
          </CardTitle>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatDuration(duration)}</span>
            <span className="mx-2">•</span>
            <span>{(distance / 1000).toFixed(1)} km</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="mb-4 text-sm">
          <div className="flex items-start mb-2">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
            <div className="font-medium">{startLocation}</div>
          </div>
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-red-600 flex-shrink-0" />
            <div className="font-medium">{endLocation}</div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <h4 className="font-medium mb-3">Step by Step Directions</h4>
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="flex">
                <div className="mr-3 flex flex-col items-center">
                  <div className="rounded-full bg-green-100 dark:bg-green-900 w-6 h-6 flex items-center justify-center text-green-600 dark:text-green-400 text-xs font-medium">
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 bg-gray-300 dark:bg-gray-700 grow mt-1"></div>
                  )}
                </div>
                <div className="text-sm pb-2">
                  <p className="mb-1">{step.instruction}</p>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatShortDistance(step.distance)} • {formatDuration(step.duration)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm">
          <div>
            <span className="font-medium">CO₂ Emissions:</span>{' '}
            {transportMode === 'cycling' || transportMode === 'walking'
              ? 'Zero emissions'
              : `${emissions.toFixed(2)} kg`}
          </div>
          {(transportMode === 'cycling' || transportMode === 'walking') && (
            <div className="text-green-600 dark:text-green-400 flex items-center">
              <span className="mr-1">🌿</span> Eco-friendly choice!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteDetails;

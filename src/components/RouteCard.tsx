
import React from 'react';
import { Navigation, Clock, Route } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface RouteCardProps {
  route: {
    id: string;
    transportMode: string;
    distance: number;
    duration: number;
    emissions: number;
    isEcoFriendly: boolean;
  };
  isSelected: boolean;
  onClick: () => void;
}

const RouteCard: React.FC<RouteCardProps> = ({ route, isSelected, onClick }) => {
  const { transportMode, distance, duration, emissions, isEcoFriendly } = route;

  // Helper function to format duration in minutes
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} h ${remainingMinutes > 0 ? remainingMinutes + ' min' : ''}`;
  };

  // Helper function to get transport mode icon
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

  // Helper function to get transport mode label
  const getTransportLabel = () => {
    switch (transportMode) {
      case 'driving':
        return 'Driving';
      case 'cycling':
        return 'Cycling';
      case 'walking':
        return 'Walking';
      case 'transit':
        return 'Transit';
      default:
        return 'Driving';
    }
  };

  // Helper function to get emission description
  const getEmissionLabel = () => {
    if (transportMode === 'cycling' || transportMode === 'walking') {
      return 'Zero emissions';
    } else if (transportMode === 'transit') {
      return `${emissions.toFixed(2)} kg CO₂`;
    } else {
      return `${emissions.toFixed(2)} kg CO₂`;
    }
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-200 cursor-pointer hover:shadow-lg",
        isSelected 
          ? "border-2 border-green-500 shadow-md bg-green-50 dark:bg-green-900/20" 
          : "border border-gray-200 hover:border-green-300"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getTransportIcon()}</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{getTransportLabel()}</span>
          </div>
          {isEcoFriendly && (
            <div className="flex items-center bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full px-2 py-1 text-xs">
              <span className="mr-1">🌿</span> Eco-friendly
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="flex flex-col items-center text-center">
            <Clock className="h-4 w-4 text-gray-500 mb-1" />
            <span className="text-sm font-bold">{formatDuration(duration)}</span>
            <span className="text-xs text-gray-500">Duration</span>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <Route className="h-4 w-4 text-gray-500 mb-1" />
            <span className="text-sm font-bold">{(distance / 1000).toFixed(1)} km</span>
            <span className="text-xs text-gray-500">Distance</span>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <Navigation className="h-4 w-4 text-gray-500 mb-1" />
            <span className={cn(
              "text-sm font-bold",
              transportMode === 'cycling' || transportMode === 'walking' ? 'text-green-700' : 
              transportMode === 'transit' ? 'text-amber-600' : 'text-red-600'
            )}>
              {getEmissionLabel()}
            </span>
            <span className="text-xs text-gray-500">CO₂</span>
          </div>
        </div>
        
        {isSelected && (
          <div className="mt-3 text-xs text-center text-green-700 dark:text-green-400">
            ✓ Selected route
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteCard;

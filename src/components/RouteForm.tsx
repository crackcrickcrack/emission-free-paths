import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TransportModeSelector from './TransportModeSelector';
import LocationAutocomplete from './LocationAutocomplete';

interface RouteFormProps {
  onSearch: (start: string, destination: string, mode: string) => void;
  isLoading: boolean;
}

const RouteForm: React.FC<RouteFormProps> = ({ onSearch, isLoading }) => {
  const [startLocation, setStartLocation] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [transportMode, setTransportMode] = useState<string>('driving');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startLocation && destination) {
      onSearch(startLocation, destination, transportMode);
    }
  };

  return (
    <Card className="shadow-md bg-white/90 dark:bg-gray-900/90 backdrop-blur">
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-grow">
              <LocationAutocomplete
                value={startLocation}
                onChange={setStartLocation}
                placeholder="Starting point"
                color="green"
              />
            </div>
            <div className="flex-grow">
              <LocationAutocomplete
                value={destination}
                onChange={setDestination}
                placeholder="Destination"
                color="red"
              />
            </div>
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 text-white" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating...
                </span>
              ) : (
                <span className="flex items-center">
                  <Search className="mr-2 h-4 w-4" />
                  Find Route
                </span>
              )}
            </Button>
          </div>
          
          <TransportModeSelector
            selectedMode={transportMode}
            onChange={setTransportMode}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default RouteForm;

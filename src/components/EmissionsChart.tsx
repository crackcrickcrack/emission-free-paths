
import React from 'react';

interface EmissionsChartProps {
  routes: Array<{
    id: string;
    transportMode: string;
    emissions: number;
  }>;
  selectedRouteId?: string;
}

const EmissionsChart: React.FC<EmissionsChartProps> = ({ routes, selectedRouteId }) => {
  // Find the route with maximum emissions to set as 100% width
  const maxEmissions = Math.max(...routes.map(route => route.emissions), 0.1);
  
  // Sort routes by emissions (lowest first)
  const sortedRoutes = [...routes].sort((a, b) => a.emissions - b.emissions);
  
  // Helper function to get color based on transport mode
  const getBarColor = (mode: string) => {
    switch (mode) {
      case 'cycling':
      case 'walking':
        return 'bg-green-500';
      case 'transit':
        return 'bg-yellow-500';
      case 'driving':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Helper function to get transport mode emoji
  const getTransportIcon = (mode: string) => {
    switch (mode) {
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">CO₂ Emissions Comparison</h3>
      
      <div className="space-y-3">
        {sortedRoutes.map(route => {
          const percentWidth = (route.emissions / maxEmissions) * 100;
          const isZeroEmission = route.emissions === 0;
          const isSelected = route.id === selectedRouteId;
          
          return (
            <div key={route.id} className="relative">
              <div className="flex items-center mb-1">
                <span className="mr-2">{getTransportIcon(route.transportMode)}</span>
                <span className={`text-sm ${isSelected ? 'font-bold' : 'font-medium'}`}>
                  {route.transportMode.charAt(0).toUpperCase() + route.transportMode.slice(1)}
                  {isSelected && <span className="ml-1 text-green-600">✓</span>}
                </span>
                <span className="ml-auto text-sm font-medium">
                  {isZeroEmission ? 
                    'Zero emissions' : 
                    `${route.emissions.toFixed(2)} kg CO₂`
                  }
                </span>
              </div>
              
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
                <div 
                  className={`h-full ${getBarColor(route.transportMode)} ${isSelected ? 'opacity-100' : 'opacity-80'} rounded-full`}
                  style={{ 
                    width: `${isZeroEmission ? 3 : percentWidth}%`,
                    transition: 'width 1s ease-in-out'
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>Choosing eco-friendly routes helps reduce your carbon footprint. Walking and cycling produce zero direct emissions!</p>
        </div>
      </div>
    </div>
  );
};

export default EmissionsChart;

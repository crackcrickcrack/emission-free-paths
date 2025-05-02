
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RouteForm from '@/components/RouteForm';
import Map from '@/components/Map';
import RouteCard from '@/components/RouteCard';
import EmissionsChart from '@/components/EmissionsChart';
import RouteDetails from '@/components/RouteDetails';
import { getRoutes } from '@/services/routeService';
import { toast } from '@/components/ui/sonner';

const Index = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [routes, setRoutes] = useState<any[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | undefined>(undefined);
  const [center, setCenter] = useState<[number, number]>([51.505, -0.09]);
  const [startCoords, setStartCoords] = useState<[number, number] | undefined>(undefined);
  const [endCoords, setEndCoords] = useState<[number, number] | undefined>(undefined);

  const selectedRoute = routes.find(route => route.id === selectedRouteId);

  const handleSearch = async (start: string, destination: string, mode: string) => {
    setIsLoading(true);
    try {
      const routeData = await getRoutes(start, destination, mode);
      setRoutes(routeData);
      
      // Select the first route by default
      if (routeData.length > 0) {
        setSelectedRouteId(routeData[0].id);
        
        // Set map center
        if (routeData[0].coordinates && routeData[0].coordinates.length > 0) {
          const midPoint = Math.floor(routeData[0].coordinates.length / 2);
          setCenter(routeData[0].coordinates[midPoint]);
        }
        
        // Set start and end coordinates
        if (routeData[0].startCoords) {
          setStartCoords(routeData[0].startCoords);
        }
        if (routeData[0].endCoords) {
          setEndCoords(routeData[0].endCoords);
        }
        
        toast.success('Routes calculated successfully', {
          description: 'Choose the most eco-friendly option to reduce your carbon footprint.'
        });
      }
    } catch (error) {
      console.error('Error calculating routes:', error);
      toast.error('Error calculating routes', {
        description: 'Please try again or check your input.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <section className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-green-800 dark:text-green-400 mb-2">
              GreenRoute
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in">
              Find eco-friendly routes and reduce your carbon footprint with every journey
            </p>
          </section>
          
          <div className="mb-8">
            <RouteForm onSearch={handleSearch} isLoading={isLoading} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-[400px] md:h-[500px]">
                <Map 
                  center={center}
                  routes={routes}
                  startCoords={startCoords}
                  endCoords={endCoords}
                  selectedRouteId={selectedRouteId}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              {routes.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-3">
                    {routes.map((route) => (
                      <RouteCard
                        key={route.id}
                        route={route}
                        isSelected={route.id === selectedRouteId}
                        onClick={() => setSelectedRouteId(route.id)}
                      />
                    ))}
                  </div>
                  
                  <EmissionsChart
                    routes={routes}
                    selectedRouteId={selectedRouteId}
                  />
                </>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center h-full flex flex-col items-center justify-center">
                  <div className="mb-4 text-green-600 text-6xl">🌱</div>
                  <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
                    Plan Your Green Journey
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Enter your starting point and destination to find eco-friendly routes.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {selectedRoute && (
            <div className="mt-8">
              <RouteDetails route={selectedRoute} />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

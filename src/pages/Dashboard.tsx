
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

// Mock data for dashboard
const tripData = [
  { date: '2023-05-01', distance: 12.5, emissions: 2.3, transportMode: 'driving' },
  { date: '2023-05-03', distance: 8.2, emissions: 0, transportMode: 'cycling' },
  { date: '2023-05-05', distance: 15.7, emissions: 1.2, transportMode: 'transit' },
  { date: '2023-05-07', distance: 5.3, emissions: 0, transportMode: 'walking' },
  { date: '2023-05-10', distance: 10.1, emissions: 1.8, transportMode: 'driving' },
  { date: '2023-05-12', distance: 9.4, emissions: 0, transportMode: 'cycling' },
  { date: '2023-05-15', distance: 7.6, emissions: 0.6, transportMode: 'transit' }
];

const Dashboard = () => {
  // Calculate total emissions and saved emissions
  const totalDistance = tripData.reduce((sum, trip) => sum + trip.distance, 0);
  const totalEmissions = tripData.reduce((sum, trip) => sum + trip.emissions, 0);
  
  // Calculate average emissions per km (excluding zero emission trips)
  const emissionTrips = tripData.filter(trip => trip.emissions > 0);
  const avgEmissionsPerKm = emissionTrips.length > 0 ? 
    emissionTrips.reduce((sum, trip) => sum + (trip.emissions / trip.distance), 0) / emissionTrips.length : 0;
  
  // Calculate emissions saved (assuming average car emissions of 120g/km = 0.12kg/km)
  const averageCarEmissions = 0.12; // kg/km
  const zeroEmissionTrips = tripData.filter(trip => trip.emissions === 0);
  const zeroEmissionDistance = zeroEmissionTrips.reduce((sum, trip) => sum + trip.distance, 0);
  const emissionsSaved = zeroEmissionDistance * averageCarEmissions;
  
  // Prepare data for transport mode distribution chart
  const transportModes = tripData.reduce((modes, trip) => {
    const mode = modes.find(m => m.name === trip.transportMode);
    if (mode) {
      mode.value += trip.distance;
    } else {
      modes.push({ name: trip.transportMode, value: trip.distance });
    }
    return modes;
  }, []);
  
  // Colors for transport modes
  const COLORS = {
    driving: '#ef4444',
    cycling: '#22c55e',
    walking: '#14b8a6',
    transit: '#f59e0b'
  };

  // Format for tooltip in the bar chart
  const formatTooltipValue = (value: number | string) => {
    // Check if value is a number and can be formatted
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return value;
  };

  // Get transport mode label
  const getTransportModeLabel = (mode: string) => {
    switch (mode) {
      case 'driving': return 'Car';
      case 'cycling': return 'Bike';
      case 'walking': return 'Walking';
      case 'transit': return 'Transit';
      default: return mode;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-400 mb-6">Your Eco Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Distance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDistance.toFixed(1)} km</div>
                <p className="text-xs text-muted-foreground">Across all your trips</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Carbon Emissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEmissions.toFixed(2)} kg</div>
                <p className="text-xs text-muted-foreground">Total CO₂ produced</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Emissions Saved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{emissionsSaved.toFixed(2)} kg</div>
                <p className="text-xs text-muted-foreground">By choosing green transport</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Eco Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">
                  {Math.min(100, Math.round((emissionsSaved / (totalEmissions + emissionsSaved)) * 100))}
                </div>
                <p className="text-xs text-muted-foreground">Your sustainability rating</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Transport Mode Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={transportModes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => 
                        `${getTransportModeLabel(name)}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {transportModes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)} km`, 'Distance']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Emissions by Trip</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={tripData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={formatTooltipValue}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="emissions" name="CO₂ (kg)" fill="#15803d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Trips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Transport</th>
                        <th className="text-left py-3 px-4">Distance (km)</th>
                        <th className="text-left py-3 px-4">Emissions (kg)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tripData.map((trip, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-4">{trip.date}</td>
                          <td className="py-3 px-4 capitalize flex items-center">
                            <span className="mr-2">
                              {trip.transportMode === 'driving' && '🚗'}
                              {trip.transportMode === 'cycling' && '🚲'}
                              {trip.transportMode === 'walking' && '🚶'}
                              {trip.transportMode === 'transit' && '🚌'}
                            </span>
                            {getTransportModeLabel(trip.transportMode)}
                          </td>
                          <td className="py-3 px-4">{trip.distance.toFixed(1)}</td>
                          <td className="py-3 px-4">
                            <span className={trip.emissions === 0 ? 'text-green-600' : ''}>
                              {trip.emissions === 0 ? 'Zero' : trip.emissions.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;

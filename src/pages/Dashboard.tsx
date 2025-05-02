
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  // Mock data for the dashboard
  const routeHistory = [
    { id: 1, date: '2025-05-01', from: 'Home', to: 'Office', mode: 'cycling', distance: 5.2, emissions: 0, saved: 0.624 },
    { id: 2, date: '2025-04-30', from: 'Office', to: 'Gym', mode: 'transit', distance: 3.8, emissions: 0.114, saved: 0.342 },
    { id: 3, date: '2025-04-30', from: 'Gym', to: 'Home', mode: 'walking', distance: 1.5, emissions: 0, saved: 0.18 },
    { id: 4, date: '2025-04-29', from: 'Home', to: 'Store', mode: 'driving', distance: 7.3, emissions: 0.876, saved: 0 },
    { id: 5, date: '2025-04-28', from: 'Home', to: 'Office', mode: 'transit', distance: 5.2, emissions: 0.156, saved: 0.468 },
  ];

  const emissionsByMode = [
    { name: 'Car', value: 0.876, color: '#ef4444' },
    { name: 'Public Transit', value: 0.27, color: '#f59e0b' },
    { name: 'Cycling', value: 0, color: '#10b981' },
    { name: 'Walking', value: 0, color: '#22c55e' },
  ];

  const weeklySavings = [
    { name: 'Mon', saved: 0.468 },
    { name: 'Tue', saved: 0.624 },
    { name: 'Wed', saved: 0.18 },
    { name: 'Thu', saved: 0.342 },
    { name: 'Fri', saved: 0.624 },
    { name: 'Sat', saved: 0.156 },
    { name: 'Sun', saved: 0 },
  ];

  const transportUsage = [
    { name: 'Car', trips: 1, color: '#ef4444' },
    { name: 'Public Transit', trips: 2, color: '#f59e0b' },
    { name: 'Cycling', trips: 1, color: '#10b981' },
    { name: 'Walking', trips: 1, color: '#22c55e' },
  ];

  const totalSaved = routeHistory.reduce((acc, route) => acc + route.saved, 0);
  const totalDistance = routeHistory.reduce((acc, route) => acc + route.distance, 0);
  const totalTrips = routeHistory.length;
  const ecoScore = 85; // Mock eco-score

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">Your Green Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Track your environmental impact and route history</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <span className="text-5xl font-bold text-green-600 dark:text-green-400">{totalSaved.toFixed(2)}</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">kg CO₂ Saved</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <span className="text-5xl font-bold text-green-600 dark:text-green-400">{totalDistance.toFixed(1)}</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">km Traveled</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <span className="text-5xl font-bold text-green-600 dark:text-green-400">{totalTrips}</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Total Trips</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex justify-center items-center">
                    <div className="relative">
                      <svg className="w-24 h-24">
                        <circle
                          className="text-gray-200 dark:text-gray-700"
                          strokeWidth="8"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="48"
                          cy="48"
                        />
                        <circle
                          className="text-green-600 dark:text-green-400"
                          strokeWidth="8"
                          strokeDasharray={251.2}
                          strokeDashoffset={251.2 * (1 - ecoScore / 100)}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="48"
                          cy="48"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                        {ecoScore}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Eco Score</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Weekly CO₂ Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklySavings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis unit="kg" />
                      <Tooltip formatter={(value) => [`${value.toFixed(3)} kg`, 'CO₂ Saved']} />
                      <Bar dataKey="saved" fill="#16a34a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Transport Mode Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={transportUsage}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="trips"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {transportUsage.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} trips`, 'Frequency']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Route History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">From</th>
                      <th className="px-4 py-3 text-left">To</th>
                      <th className="px-4 py-3 text-left">Mode</th>
                      <th className="px-4 py-3 text-right">Distance</th>
                      <th className="px-4 py-3 text-right">CO₂ Emissions</th>
                      <th className="px-4 py-3 text-right">CO₂ Saved</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {routeHistory.map((route) => (
                      <tr key={route.id}>
                        <td className="px-4 py-3">{route.date}</td>
                        <td className="px-4 py-3">{route.from}</td>
                        <td className="px-4 py-3">{route.to}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center">
                            <span className="mr-1">
                              {route.mode === 'driving' ? '🚗' : 
                               route.mode === 'transit' ? '🚌' : 
                               route.mode === 'cycling' ? '🚲' : '🚶'}
                            </span>
                            {route.mode.charAt(0).toUpperCase() + route.mode.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">{route.distance.toFixed(1)} km</td>
                        <td className="px-4 py-3 text-right">
                          {route.emissions === 0 ? (
                            <span className="text-green-600 dark:text-green-400">Zero</span>
                          ) : (
                            `${route.emissions.toFixed(3)} kg`
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {route.saved > 0 ? (
                            <span className="text-green-600 dark:text-green-400">
                              {route.saved.toFixed(3)} kg
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button variant="outline">View All History</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;

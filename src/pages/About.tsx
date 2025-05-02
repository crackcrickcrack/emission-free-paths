
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Route } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-green-800 dark:text-green-400 mb-4">About GreenRoute</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Helping you make environmentally conscious travel decisions
            </p>
          </header>
          
          <section className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  GreenRoute is dedicated to promoting sustainable transportation by helping users find the most 
                  eco-friendly travel routes. Our mission is to reduce carbon emissions from travel by making it 
                  easy for people to choose greener alternatives.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  By providing clear information about CO₂ emissions for different travel methods, we empower 
                  users to make environmentally conscious decisions that collectively can have a significant 
                  impact on reducing our carbon footprint.
                </p>
              </CardContent>
            </Card>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-6">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 mb-3">
                      <span className="text-xl">1</span>
                    </div>
                    <h3 className="font-medium text-lg">Enter Your Route</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Input your starting point and destination to get started.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 mb-3">
                      <span className="text-xl">2</span>
                    </div>
                    <h3 className="font-medium text-lg">Compare Options</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    View different travel methods with their emissions impact.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 mb-3">
                      <span className="text-xl">3</span>
                    </div>
                    <h3 className="font-medium text-lg">Go Green</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Choose the eco-friendly option and track your positive impact.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-6">Environmental Impact</h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center text-green-700 dark:text-green-400">
                    <Route className="h-5 w-5 mr-2" />
                    CO₂ Emissions by Transport Type
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between">
                      <span className="flex items-center">
                        <span className="mr-2">🚗</span>
                        Car (single occupant)
                      </span>
                      <span className="font-medium text-red-600 dark:text-red-400">~120g CO₂/km</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="flex items-center">
                        <span className="mr-2">🚌</span>
                        Bus
                      </span>
                      <span className="font-medium text-yellow-600 dark:text-yellow-400">~80g CO₂/km</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="flex items-center">
                        <span className="mr-2">🚆</span>
                        Train
                      </span>
                      <span className="font-medium text-yellow-600 dark:text-yellow-400">~40g CO₂/km</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="flex items-center">
                        <span className="mr-2">🚲</span>
                        Bicycle
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-400">0g CO₂/km</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="flex items-center">
                        <span className="mr-2">🚶</span>
                        Walking
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-400">0g CO₂/km</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-medium mb-4">Did You Know?</h3>
                  <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <p>
                      <span className="font-medium text-green-600 dark:text-green-400">✓</span> Choosing to walk or cycle for a 5km journey instead of driving saves about 0.6kg of CO₂.
                    </p>
                    <p>
                      <span className="font-medium text-green-600 dark:text-green-400">✓</span> If just 1% of car journeys under 5km were replaced with cycling, we could save millions of tons of CO₂ annually.
                    </p>
                    <p>
                      <span className="font-medium text-green-600 dark:text-green-400">✓</span> Public transportation produces 55% fewer carbon emissions per passenger mile than driving alone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;

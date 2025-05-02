// Mock route service - in production this would connect to a real routing API

// API configuration
const API_KEY = import.meta.env.VITE_OPENROUTE_API_KEY;
const API_BASE_URL = 'https://api.openrouteservice.org/v2';

// Helper function to generate random coordinates around a center point
const generateRandomCoordinates = (
  center: [number, number], 
  count: number, 
  variance: number = 0.01
): [number, number][] => {
  const result: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const lat = center[0] + (Math.random() - 0.5) * variance;
    const lng = center[1] + (Math.random() - 0.5) * variance;
    result.push([lat, lng]);
  }
  return result;
};

// Helper function to create a route path between two points
const createRoutePath = (
  start: [number, number], 
  end: [number, number], 
  pointCount: number
): [number, number][] => {
  const result: [number, number][] = [start];
  
  // Create intermediate points
  for (let i = 1; i < pointCount - 1; i++) {
    const ratio = i / pointCount;
    const lat = start[0] + (end[0] - start[0]) * ratio + (Math.random() - 0.5) * 0.005;
    const lng = start[1] + (end[1] - start[1]) * ratio + (Math.random() - 0.5) * 0.005;
    result.push([lat, lng]);
  }
  
  result.push(end);
  return result;
};

// Helper function to calculate emissions based on transport mode and distance
const calculateEmissions = (transportMode: string, distance: number): number => {
  // Emissions in kg CO2 per km
  const emissionRates: Record<string, number> = {
    driving: 0.12, // kg CO2 per km
    transit: 0.03, // kg CO2 per km
    cycling: 0,    // zero emissions
    walking: 0,    // zero emissions
  };
  
  const rate = emissionRates[transportMode] || emissionRates.driving;
  return rate * distance / 1000; // Convert meters to kilometers
};

// Create route instructions (mock data)
const createRouteInstructions = (transportMode: string, pointCount: number) => {
  const drivingInstructions = [
    "Head west on Main Street",
    "Turn right onto Oak Avenue",
    "Continue onto Maple Boulevard",
    "Turn left onto Cedar Street",
    "Take the 2nd exit at the roundabout",
    "Merge onto Highway 101",
    "Take exit 23B for Pine Road",
    "Turn right onto River Drive",
    "Continue straight onto Mountain View Road",
    "Turn left onto Sunset Boulevard",
    "Your destination will be on the right"
  ];
  
  const cyclingInstructions = [
    "Head west on Main Street bike lane",
    "Turn right onto Oak Avenue",
    "Use the cycling path through Central Park",
    "Cross at the pedestrian crossing",
    "Turn left onto Cedar Street bike lane",
    "Continue onto the riverside cycling path",
    "Exit the cycling path at River Drive",
    "Turn right onto Mountain View Road",
    "Your destination will be on the right"
  ];
  
  const walkingInstructions = [
    "Head west on Main Street sidewalk",
    "Turn right onto Oak Avenue",
    "Walk through Central Park",
    "Cross at the pedestrian crossing",
    "Turn left onto Cedar Street",
    "Take the pedestrian bridge over the river",
    "Continue onto River Walk path",
    "Exit the path at Mountain View Road",
    "Your destination will be on the right"
  ];
  
  const transitInstructions = [
    "Walk to Main Street bus stop",
    "Take bus #42 towards Downtown",
    "Ride for 4 stops",
    "Exit at Central Park station",
    "Walk north on Oak Avenue",
    "Take the subway Line A towards Westside",
    "Exit at River Station",
    "Walk east on River Drive for 400m",
    "Your destination will be on the right"
  ];
  
  let instructions;
  switch (transportMode) {
    case 'cycling':
      instructions = cyclingInstructions;
      break;
    case 'walking':
      instructions = walkingInstructions;
      break;
    case 'transit':
      instructions = transitInstructions;
      break;
    case 'driving':
    default:
      instructions = drivingInstructions;
      break;
  }
  
  // Take a random subset of instructions based on pointCount
  const stepsCount = Math.min(Math.max(3, Math.floor(pointCount / 2)), instructions.length);
  const result = [];
  
  // Always include the first instruction
  result.push({
    instruction: instructions[0],
    distance: Math.floor(Math.random() * 500) + 200, // 200-700m
    duration: Math.floor(Math.random() * 3) + 1 // 1-3 minutes
  });
  
  // Add intermediate instructions
  const indices = new Set<number>();
  while (indices.size < stepsCount - 2) {
    indices.add(Math.floor(Math.random() * (instructions.length - 2)) + 1);
  }
  
  [...indices].sort((a, b) => a - b).forEach(index => {
    result.push({
      instruction: instructions[index],
      distance: Math.floor(Math.random() * 1000) + 300, // 300-1300m
      duration: Math.floor(Math.random() * 5) + 2 // 2-7 minutes
    });
  });
  
  // Always include the last instruction
  result.push({
    instruction: instructions[instructions.length - 1],
    distance: Math.floor(Math.random() * 300) + 100, // 100-400m
    duration: Math.floor(Math.random() * 2) + 1 // 1-3 minutes
  });
  
  return result;
};

// Geocode a location using OpenRouteService Geocoding API
export const geocodeLocation = async (location: string): Promise<[number, number]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/geocode/search?api_key=${API_KEY}&text=${encodeURIComponent(location)}`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding failed');
    }
    
    const data = await response.json();
    if (!data.features || data.features.length === 0) {
      throw new Error('Location not found');
    }
    
    const [lng, lat] = data.features[0].geometry.coordinates;
    return [lat, lng];
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

// Get routes between two points using OpenRouteService
export const getRoutes = async (
  startLocation: string,
  endLocation: string,
  transportMode?: string
): Promise<any[]> => {
  try {
    // Geocode both locations
    const [startCoords, endCoords] = await Promise.all([
      geocodeLocation(startLocation),
      geocodeLocation(endLocation)
    ]);

    // Define available transport modes
    const modes = transportMode ? [transportMode] : ['driving', 'transit', 'cycling', 'walking'];
    
    // Get routes for each transport mode
    const routePromises = modes.map(async (mode) => {
      const profile = {
        driving: 'driving-car',
        transit: 'driving-car', // OpenRouteService doesn't support transit, using driving as fallback
        cycling: 'cycling-regular',
        walking: 'foot-walking'
      }[mode];

      const response = await fetch(
        `${API_BASE_URL}/directions/${profile}?api_key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
          },
          body: JSON.stringify({
            coordinates: [
              [startCoords[1], startCoords[0]], // OpenRouteService expects [lng, lat]
              [endCoords[1], endCoords[0]]
            ],
            format: 'geojson'
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get route for ${mode}`);
      }

      const data = await response.json();
      
      // Extract route information
      const route = data.features[0];
      const distance = route.properties.segments[0].distance;
      const duration = route.properties.segments[0].duration / 60; // Convert to minutes
      const coordinates = route.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]);
      
      // Calculate emissions
      const emissions = calculateEmissions(mode, distance);
      
      return {
        id: `${mode}-${Math.random().toString(36).substring(2, 9)}`,
        transportMode: mode,
        distance,
        duration,
        emissions,
        coordinates,
        startLocation,
        endLocation,
        startCoords,
        endCoords,
        steps: route.properties.segments[0].steps.map((step: any) => ({
          instruction: step.instruction,
          distance: step.distance,
          duration: step.duration / 60 // Convert to minutes
        }))
      };
    });

    return await Promise.all(routePromises);
  } catch (error) {
    console.error('Error getting routes:', error);
    throw error;
  }
};

// Create a single route
const createRoute = (
  startCoords: [number, number],
  endCoords: [number, number],
  startLocation: string,
  endLocation: string,
  transportMode: string
) => {
  // Adjust parameters based on transport mode
  let pointCount: number;
  let durationFactor: number;
  let distanceFactor: number;
  
  switch (transportMode) {
    case 'cycling':
      pointCount = 15;
      durationFactor = 3; // Slower than car
      distanceFactor = 1.1; // Slightly longer routes
      break;
    case 'walking':
      pointCount = 10;
      durationFactor = 10; // Much slower than car
      distanceFactor = 0.9; // Potentially shorter routes (direct paths)
      break;
    case 'transit':
      pointCount = 20;
      durationFactor = 2; // Slower than car but faster than walking
      distanceFactor = 1.2; // Potentially longer routes due to fixed stops
      break;
    case 'driving':
    default:
      pointCount = 25;
      durationFactor = 1; // Base speed
      distanceFactor = 1; // Base distance
      break;
  }
  
  // Calculate base distance in meters (rough approximation)
  const baseDistance = Math.sqrt(
    Math.pow((endCoords[0] - startCoords[0]) * 111000, 2) +
    Math.pow((endCoords[1] - startCoords[1]) * 111000 * Math.cos(startCoords[0] * Math.PI/180), 2)
  );
  
  // Apply transport mode factors
  const distance = baseDistance * distanceFactor * (0.9 + Math.random() * 0.2); // Add some randomness
  const duration = (distance / 1000) * durationFactor * 5 * (0.9 + Math.random() * 0.2); // Roughly 5 min per km for car
  
  // Create route path
  const coordinates = createRoutePath(startCoords, endCoords, pointCount);
  
  // Calculate emissions
  const emissions = calculateEmissions(transportMode, distance);
  
  // Create steps/instructions
  const steps = createRouteInstructions(transportMode, pointCount);
  
  return {
    id: `${transportMode}-${Math.random().toString(36).substring(2, 9)}`,
    transportMode,
    distance,
    duration, // in minutes
    emissions,
    coordinates,
    startLocation,
    endLocation,
    startCoords,
    endCoords,
    steps,
    isEcoFriendly: transportMode === 'cycling' || transportMode === 'walking'
  };
};

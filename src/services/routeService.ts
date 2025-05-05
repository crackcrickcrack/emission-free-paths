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

// Mock geocoding data for common locations
const mockGeocodeData: Record<string, [number, number]> = {
  'london': [51.5074, -0.1278],
  'manchester': [53.4808, -2.2426],
  'birmingham': [52.4862, -1.8904],
  'liverpool': [53.4084, -2.9916],
  'leeds': [53.8008, -1.5491],
  'glasgow': [55.8642, -4.2518],
  'edinburgh': [55.9533, -3.1883],
  'bristol': [51.4545, -2.5879],
  'cardiff': [51.4816, -3.1791],
  'newcastle': [54.9783, -1.6178],
  'sheffield': [53.3811, -1.4701],
  'belfast': [54.5973, -5.9301],
  'new york': [40.7128, -74.0060],
  'paris': [48.8566, 2.3522],
  'berlin': [52.5200, 13.4050],
  'rome': [41.9028, 12.4964],
  'madrid': [40.4168, -3.7038],
  'amsterdam': [52.3676, 4.9041],
  'toronto': [43.6532, -79.3832],
  'sydney': [-33.8688, 151.2093],
  'tokyo': [35.6762, 139.6503],
  'beijing': [39.9042, 116.4074],
  'delhi': [28.7041, 77.1025],
  'moscow': [55.7558, 37.6173],
  'rio de janeiro': [-22.9068, -43.1729]
};

// Default coordinates for fallback
const defaultCoordinates: Record<string, [number, number]> = {
  start: [51.5074, -0.1278], // London
  end: [53.4808, -2.2426]    // Manchester
};

// Geocode a location using OpenRouteService Geocoding API or fallback to mock data
export const geocodeLocation = async (location: string): Promise<[number, number]> => {
  try {
    // Check mock data first (case insensitive)
    const locationLower = location.toLowerCase();
    if (mockGeocodeData[locationLower]) {
      console.log(`Using mock geocode data for ${location}`);
      return mockGeocodeData[locationLower];
    }
    
    // Try the API
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
    
    // Generate fallback coordinates with some randomness
    const randomLat = defaultCoordinates.start[0] + (Math.random() - 0.5) * 10;
    const randomLng = defaultCoordinates.start[1] + (Math.random() - 0.5) * 10;
    console.log(`Using fallback coordinates for ${location}: [${randomLat}, ${randomLng}]`);
    
    return [randomLat, randomLng];
  }
};

// Get routes between two points with fallback to mock data
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
    
    let routes: any[] = [];
    
    try {
      // Try to get routes from the API
      const routePromises = modes.map(async (mode) => {
        try {
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
          
          // Make sure the data structure exists before accessing properties
          if (!data.features || !data.features[0] || !data.features[0].properties || 
              !data.features[0].properties.segments || !data.features[0].properties.segments[0] ||
              !data.features[0].geometry || !data.features[0].geometry.coordinates) {
            throw new Error(`Invalid response data for ${mode}`);
          }
          
          // Extract route information
          const route = data.features[0];
          const distance = route.properties.segments[0].distance;
          const duration = route.properties.segments[0].duration / 60; // Convert to minutes
          
          // Convert coordinates from [lng, lat] to [lat, lng] for Leaflet
          const coordinates = route.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]);
          
          // Calculate emissions
          const emissions = calculateEmissions(mode, distance);
          
          // Process steps if they exist
          let steps = [];
          if (route.properties.segments[0].steps) {
            steps = route.properties.segments[0].steps.map((step: any) => ({
              instruction: step.instruction || "Continue on this path",
              distance: step.distance || 0,
              duration: (step.duration || 0) / 60 // Convert to minutes
            }));
          } else {
            // Create mock steps if none exist in the response
            steps = createRouteInstructions(mode, coordinates.length);
          }
          
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
            steps,
            isEcoFriendly: mode === 'cycling' || mode === 'walking'
          };
        } catch (error) {
          console.error(`Error fetching ${mode} route:`, error);
          // If individual mode fails, return null to be filtered out later
          return null;
        }
      });

      // Wait for all promises to resolve
      const apiResults = await Promise.all(routePromises);
      // Filter out null results from failed API calls
      routes = apiResults.filter(route => route !== null);
    } catch (error) {
      console.error('Error getting API routes:', error);
      // Will continue to fallback below
    }
    
    // If no routes from API, use mock data
    if (routes.length === 0) {
      console.log('Using mock routes as fallback');
      routes = modes.map(mode => createRoute(
        startCoords,
        endCoords,
        startLocation,
        endLocation,
        mode
      ));
    }

    return routes;
  } catch (error) {
    console.error('Error getting routes:', error);
    
    // Use fallback mock data for both locations
    const startCoords = await geocodeLocation(startLocation);
    const endCoords = await geocodeLocation(endLocation);
    
    const modes = transportMode ? [transportMode] : ['driving', 'transit', 'cycling', 'walking'];
    return modes.map(mode => createRoute(
      startCoords,
      endCoords,
      startLocation,
      endLocation,
      mode
    ));
  }
};

// Create a single route with mock data
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

// utils/distanceCalculator.js
import * as Location from 'expo-location';

// Haversine formula to calculate distance between two coordinates
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

// Get user's current location
export const getUserLocation = async () => {
  try {
    // Request permission to access location
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return null;
    }

    // Get current position
    let location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};

// Geocode an address to get coordinates
export const geocodeAddress = async (address) => {
  try {
    const geocoded = await Location.geocodeAsync(address);
    if (geocoded && geocoded.length > 0) {
      return {
        latitude: geocoded[0].latitude,
        longitude: geocoded[0].longitude,
      };
    }
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

// Calculate distance between user and shop
export const calculateShopDistance = async (userLocation, shopAddress) => {
  try {
    // If no user location, return null
    if (!userLocation) {
      return null;
    }

    // Get shop coordinates
    const shopCoords = await geocodeAddress(shopAddress);
    if (!shopCoords) {
      return null;
    }

    // Calculate distance
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      shopCoords.latitude,
      shopCoords.longitude
    );

    // Round to 1 decimal place
    return Math.round(distance * 10) / 10;
  } catch (error) {
    console.error('Error calculating shop distance:', error);
    return null;
  }
};

// Format distance for display
export const formatDistance = (distance) => {
  if (distance === null || distance === undefined) {
    return 'N/A';
  }
  
  if (distance < 1) {
    // Convert to meters if less than 1km
    const meters = Math.round(distance * 1000);
    return `${meters}m`;
  } else if (distance < 10) {
    // Show 1 decimal place for distances less than 10km
    return `${distance.toFixed(1)}km`;
  } else {
    // Show whole numbers for distances 10km and above
    return `${Math.round(distance)}km`;
  }
};

// Batch calculate distances for multiple posts
export const calculateDistancesForPosts = async (userLocation, posts) => {
  if (!userLocation || !posts || posts.length === 0) {
    return posts;
  }

  const updatedPosts = await Promise.all(
    posts.map(async (post) => {
      try {
        const distance = await calculateShopDistance(userLocation, post.location);
        return {
          ...post,
          calculatedDistance: distance,
          shopkm: formatDistance(distance),
        };
      } catch (error) {
        console.error(`Error calculating distance for post ${post.id}:`, error);
        return {
          ...post,
          calculatedDistance: null,
          shopkm: 'N/A',
        };
      }
    })
  );

  return updatedPosts;
};

// Hook for managing user location and distances
export const useLocationDistance = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);

  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    try {
      const location = await getUserLocation();
      setUserLocation(location);
      setLocationPermission(location ? 'granted' : 'denied');
    } catch (error) {
      console.error('Error initializing location:', error);
      setLocationPermission('denied');
    }
  };

  const refreshLocation = async () => {
    const location = await getUserLocation();
    setUserLocation(location);
    return location;
  };

  const calculatePostDistances = async (posts) => {
    return await calculateDistancesForPosts(userLocation, posts);
  };

  return {
    userLocation,
    locationPermission,
    refreshLocation,
    calculatePostDistances,
  };
};
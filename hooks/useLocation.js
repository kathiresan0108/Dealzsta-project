// hooks/useLocation.js
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { 
  locationService, 
  handleLocationError, 
  formatDistance 
} from '@/utils/locationUtils';

export const useLocation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isLocationPermissionGranted, setIsLocationPermissionGranted] = useState(false);

  // Initialize location service
  const initializeLocation = useCallback(async (showAlert = true) => {
    setIsLocationLoading(true);
    setLocationError(null);
    
    try {
      const location = await locationService.getUserLocation(true);
      setUserLocation(location);
      setIsLocationPermissionGranted(true);
      return location;
    } catch (error) {
      console.log('Location initialization error:', error);
      setLocationError(error.message);
      setIsLocationPermissionGranted(false);
      
      if (showAlert) {
        Alert.alert(
          'Location Access',
          handleLocationError(error),
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Retry', onPress: () => initializeLocation(false) }
          ]
        );
      }
      
      return null;
    } finally {
      setIsLocationLoading(false);
    }
  }, []);

  // Calculate distance to a specific shop
  const calculateShopDistance = useCallback(async (shopLocation, shopId = null) => {
    try {
      const distance = await locationService.calculateDistanceToShop(shopLocation, shopId);
      return distance;
    } catch (error) {
      console.log('Shop distance calculation error:', error);
      return null;
    }
  }, []);

  // Update multiple posts with distance
  const updatePostsWithDistance = useCallback(async (posts) => {
    try {
      return await locationService.updatePostsWithDistance(posts);
    } catch (error) {
      console.log('Posts distance update error:', error);
      return posts;
    }
  }, []);

  // Format distance for display
  const getFormattedDistance = useCallback((distance) => {
    return distance ? formatDistance(distance) : 'N/A';
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeLocation(false);
  }, [initializeLocation]);

  return {
    userLocation,
    isLocationLoading,
    locationError,
    isLocationPermissionGranted,
    initializeLocation,
    calculateShopDistance,
    updatePostsWithDistance,
    getFormattedDistance
  };
};

// Hook specifically for post distance calculation
export const usePostDistance = (post) => {
  const [distance, setDistance] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { calculateShopDistance } = useLocation();

  const updateDistance = useCallback(async () => {
    if (!post || !post.location) return;
    
    setIsCalculating(true);
    
    try {
      const calculatedDistance = await calculateShopDistance(post.location, post.id);
      setDistance(calculatedDistance);
    } catch (error) {
      console.log('Post distance calculation error:', error);
      setDistance(null);
    } finally {
      setIsCalculating(false);
    }
  }, [post, calculateShopDistance]);

  useEffect(() => {
    updateDistance();
  }, [updateDistance]);

  return {
    distance,
    isCalculating,
    formattedDistance: distance ? formatDistance(distance) : 'N/A',
    refreshDistance: updateDistance
  };
};
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export const location = async() => {
    try {
        // Request permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Permission to access location was denied');
        }
    
        // Get current position
        const coordinate = await Location.getCurrentPositionAsync({ accuracy: 3 });
        const { latitude, longitude } = coordinate.coords;
    
        // Reverse geocode to get address
        const addressData = await Location.reverseGeocodeAsync({ latitude, longitude });
        const address = addressData.length > 0 ? addressData[0] : null;
    
        return {
          coordinate: `${latitude}, ${longitude}`,
          address: address ? address.formattedAddress : 'Unknown',
        };
      } catch (err) {
        throw err;
      }
}
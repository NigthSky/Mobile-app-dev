import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useEffect } from 'react';
import { View, Text, Button, Dimensions } from 'react-native';

export default function screenOrientation() {
    useEffect(() => {
        const handleOrientationChange = async () => {
          const { width, height } = Dimensions.get('window');
          if (width > height) {
            // Landscape orientation
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
          } else {
            // Portrait orientation
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
          }
        };
    
        // Lock the initial orientation based on the current screen size
        handleOrientationChange();
    
        // Set up a listener for dimension changes
        const subscription = Dimensions.addEventListener('change', handleOrientationChange);
    
        return () => {
          subscription?.remove(); // Clean up the event listener
          ScreenOrientation.unlockAsync(); // Optional: unlock when the component unmounts
        };
      }, []);
    
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Dynamic Screen Orientation Example</Text>
        </View>
      );
};

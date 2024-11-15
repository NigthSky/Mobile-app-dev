import { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, Button, Alert } from 'react-native';

import * as Location from 'expo-location';

export default function location() {
  const [location, setLocation] = useState<any| null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let coordinate = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      setLocation(coordinate.coords);
      console.log("location:",coordinate);
    })();
  }, []);
  
  const getAddress = async() => {
    if(!location) {
      Alert.alert('ERORR','No Coordinates');
      return;
    }
    try{
      const fetchadd = await Location.reverseGeocodeAsync({
        latitude: location.latitude,
        longitude: location.longitude
      })
      if(fetchadd) {
        console.log(fetchadd[0].formattedAddress);
        setAddress(fetchadd[0].formattedAddress);
      }
    }
    catch {

    }
  }

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      {address ? <Text style={styles.paragraph}>{address}</Text> : <></>}
      <Text style={styles.paragraph}>{text}</Text>
      <Button title='Get Address' onPress={getAddress}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
});
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView from '@teovilla/react-native-web-maps';  // Updated import statement

const MapScreen = ({ route, navigation }) => {
  // Assuming location is passed in route params for focusing map
  // const { location } = route.params;
  const location = {
    latitude: 37.78825,
    longitude: -122.4324
  };
  return (
    <View style={styles.container}>
      <MapView
        provider="google" // Specify Google as the map provider
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;

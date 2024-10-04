import React, { useCallback } from 'react';
import { Modal, View, Button, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const PingMapModal = ({ visible, onClose, onSelectLocation }) => {
  const [selectedLocation, setSelectedLocation] = React.useState(null);

  const handleMapPress = useCallback((event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation.longitude, selectedLocation.latitude);
    }
  }, [selectedLocation, onSelectLocation]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -1.286389,
          longitude: 36.817223,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} />
        )}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Confirm Location" onPress={handleConfirm} />
        <Button title="Close" onPress={onClose} />
      </View>
    </Modal>
  );
};

// Styles
const styles = StyleSheet.create({
  map: { flex: 1 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 10 },
});

export default PingMapModal;

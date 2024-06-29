// Preloader.js

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Preloader = () => (
  <View style={styles.overlay}>
    <ActivityIndicator size="large" color="#3498db" />
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Preloader;

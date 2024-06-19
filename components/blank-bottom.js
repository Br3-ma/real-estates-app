import React from 'react';
import { View, StyleSheet } from 'react-native';

const BlankView = () => {
  return (
    <View style={styles.blankView} />
  );
};

const styles = StyleSheet.create({
  blankView: {
    height: 50, // Adjust height as per your requirement
    backgroundColor: '#f1f1f1',
    marginBottom: 10,
  },
});

export default BlankView;

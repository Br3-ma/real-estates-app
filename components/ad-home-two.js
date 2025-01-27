
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const LongHomeRectangleTopAd = () => {
  
  return (
    <View style={styles.container}>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width - 10, // Full width minus padding
    height: 90,
    marginVertical: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

export default LongHomeRectangleTopAd;




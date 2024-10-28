import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const LongHomeRectangleAd = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://i.ytimg.com/vi/tcvU8-Hjkz4/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-CYAC0AWKAgwIABABGBggPCh_MA8=&rs=AOn4CLCjjFL3Fx-JGaUQVxW466cQn59bUw' }}
        style={styles.image}
        resizeMode="cover"
      />
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
    border: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default LongHomeRectangleAd;
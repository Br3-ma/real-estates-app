import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const LongRectangleAd = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://media.licdn.com/dms/image/C4D12AQF_ViF_C6bd6A/article-cover_image-shrink_600_2000/0/1631273050709?e=2147483647&v=beta&t=A-jB8y8DvH13Qyar_MsMQv7-dwdkGeH1PxwU4xf8Fyw' }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width - 32, // Full width minus padding
    height: 90,
    marginVertical: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
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

export default LongRectangleAd;
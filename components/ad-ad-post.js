import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';

const AdAdPost = () => {
  return (
    <View style={styles.yellowCard}>
      <ImageBackground
        source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjPUkntSCOuziYZb32nFs9mJif-9-ko2YizQ&s' }} // Replace with your image URL
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <Text style={styles.cardTitle}>Looking to sell or rent out your property?</Text>
        {/* Add more content as needed */}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  yellowCard: {
    marginHorizontal: 10,
    borderTopLeftRadius: 10,
    marginTop: 20,
    marginBottom: 80,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
  },
  imageBackground: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    resizeMode: 'cover',
    opacity: 0.8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    bottom: 0,
  },
});

export default AdAdPost;

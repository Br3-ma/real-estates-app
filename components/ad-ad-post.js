import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const AdAdPost = ({ navigation }) => { // Destructure navigation correctly
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.card}
        activeOpacity={0.97}
      >
        <ImageBackground
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjPUkntSCOuziYZb32nFs9mJif-9-ko2YizQ&s' }}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
        >
          {/* Dark overlay for better text readability */}
          <View style={styles.overlay}>
            {/* Premium Tag */}
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>PREMIUM</Text>
            </View>

            {/* Main Content */}
            <View style={styles.contentContainer}>
              <Text style={styles.mainTitle}>
                Looking to sell or rent out your property?
              </Text>
              
              <Text style={styles.subTitle}>
                Get the best value for your property today
              </Text>

              {/* Quick Info Points */}
              <View style={styles.infoContainer}>
                {['Verified Buyers', 'Professional Photos', '24/7 Support'].map((info) => (
                  <View key={info} style={styles.infoItem}>
                    <Text style={styles.infoIcon}>✓</Text>
                    <Text style={styles.infoText}>{info}</Text>
                  </View>
                ))}
              </View>

              {/* CTA Button */}
              <TouchableOpacity style={styles.button} 
                onPress={() => navigation.navigate('My Property')} >
                <Text style={styles.buttonText}>List Your Property</Text>
                <Text style={styles.buttonIcon}>→</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageBackground: {
    width: width - 32, // Full width minus padding
    height: 420,
  },
  imageStyle: {
    borderRadius: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  tagContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    lineHeight: 34,
  },
  subTitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 24,
  },
  infoContainer: {
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    color: '#4CAF50',
    fontSize: 16,
    marginRight: 8,
    fontWeight: 'bold',
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  buttonIcon: {
    fontSize: 20,
    color: '#1a1a1a',
  }
};

export default AdAdPost;

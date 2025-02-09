import React from 'react';
import { View, Image, Text, Dimensions, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const EmptyStateView = ({ onRefresh }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#ad82dc', '#eef7f7']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Discover Your Dream Home</Text>
            <Text style={styles.subtitle}>Find the perfect property for you</Text>
          </View>

          {/* <View style={styles.imageContainer}>
            <Image
              source={require('../assets/gifs/empty.gif')} 
              style={styles.image}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.3)']}
              style={styles.imageOverlay}
            />
          </View> */}

          <View style={styles.content}>
            <Text style={styles.paragraph}>
              Ready to start your journey? Explore our curated listings.
            </Text>

            <TouchableOpacity 
              style={styles.button} 
              onPress={onRefresh}
              activeOpacity={0.8}
            >
              <Icon name="home-search" size={20} color="#8E2DE2" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Begin Search</Text>
            </TouchableOpacity>

            <View style={styles.tipSection}>
              <Icon name="lightbulb-outline" size={20} color="#FFF" style={styles.tipIcon} />
              <Text style={styles.tipText}>
                Pro Tip: Save searches for new property notifications!
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
    width: width,
    height: width * 0.6,
    marginVertical: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  paragraph: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#8E2DE2',
    fontSize: 16,
    fontWeight: '600',
  },
  tipSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 12,
    borderRadius: 12,
  },
  tipIcon: {
    marginRight: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 18,
  },
};

export default EmptyStateView;
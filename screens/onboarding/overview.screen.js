

import React, { useState, useRef, useEffect  } from 'react';
import { View, ImageBackground, Text, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, ScrollView, Platform } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const backgroundImage = require('../../assets/img/sif.gif');

const FeatureSection = ({ icon, title, description }) => (
  <TouchableOpacity activeOpacity={0.9} style={styles.featureSection}>
    <LinearGradient
      colors={['#4158D0', '#C850C0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.iconCircle}
    >
      <FontAwesome5 name={icon} size={24} color="#FFF" />
    </LinearGradient>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </TouchableOpacity>
);

const OverviewScreen = ({ navigation }) => {
  useEffect(() => {
     AsyncStorage.setItem('onboardingStatus', 'welcome');
  }, []);

  const handleGetStarted = () => {
    navigation.navigate('KYCScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground 
        source={backgroundImage} 
        style={styles.background}
        blurRadius={Platform.OS === 'ios' ? 10 : 5}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.98)']}
            style={styles.overlay}
          >
            <View style={styles.welcomeSection}>
              <Text style={styles.title}>Welcome to Square</Text>
              <Text style={styles.subtitle}>
                Your journey to finding the perfect property starts here. Let's make your dream home a reality.
              </Text>
            </View>

            <View style={styles.featuresContainer}>
              <Text style={styles.sectionTitle}>Explore the Features</Text>

              <FeatureSection
                icon="search"
                title="Smart Search"
                description="Find properties that match your exact needs with our advanced filters and AI-powered recommendations"
              />
              <FeatureSection
                icon="comments"
                title="Direct Communication"
                description="Chat directly with property owners and agents through our secure messaging system"
              />
              <FeatureSection
                icon="map-marker-alt"
                title="Location Intelligence"
                description="Explore neighborhoods with detailed insights about amenities, safety, and property values"
              />
            </View>

            <TouchableOpacity 
              style={styles.getStartedButton} 
              onPress={handleGetStarted}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#4158D0', '#C850C0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <Text style={styles.getStartedText}>Get Started</Text>
                <FontAwesome5 name="arrow-right" size={18} color="#FFF" style={styles.buttonIcon} />
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  overlay: {
    flex: 1,
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.04,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: height * 0.06,
    marginTop: height * 0.02,
  },
  title: {
    fontSize: width * 0.1,
    fontWeight: Platform.OS === 'ios' ? '800' : 'bold',
    color: '#4158D0',
    marginBottom: height * 0.02,
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(65, 88, 208, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    includeFontPadding: false,
  },
  subtitle: {
    fontSize: width * 0.045,
    color: '#666',
    textAlign: 'center',
    lineHeight: Platform.OS === 'ios' ? width * 0.06 : width * 0.065,
    paddingHorizontal: width * 0.04,
    fontWeight: '400',
  },
  sectionTitle: {
    fontSize: width * 0.06,
    fontWeight: '700',
    color: '#C850C0',
    marginBottom: height * 0.03,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  featuresContainer: {
    marginBottom: height * 0.04,
  },
  featureSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
    padding: width * 0.05,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#4158D0',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(65, 88, 208, 0.1)',
  },
  featureContent: {
    flex: 1,
    marginLeft: width * 0.04,
  },
  iconCircle: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: width * 0.07,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4158D0',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  featureTitle: {
    fontSize: width * 0.045,
    fontWeight: '700',
    color: '#4158D0',
    marginBottom: height * 0.008,
    letterSpacing: 0.2,
  },
  featureDescription: {
    fontSize: width * 0.038,
    color: '#666',
    lineHeight: Platform.OS === 'ios' ? width * 0.05 : width * 0.055,
    flexWrap: 'wrap',
  },
  getStartedButton: {
    width: '100%',
    height: height * 0.07,
    marginVertical: height * 0.02,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradientButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.06,
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: width * 0.05,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: width * 0.03,
  },
});

export default OverviewScreen;
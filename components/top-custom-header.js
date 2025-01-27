import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, SafeAreaView, Text, ImageBackground, Animated, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchUserInfo, updateUserInfo } from '../controllers/auth/userController';
import { API_BASE_URL } from './../confg/config';
import axios from 'axios';

const CustomHeader = () => {
  const navigation = useNavigation();
  const [notificationCount, setNotificationCount] = useState(0);
  const [bellAnimation] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));

  // Enhanced bell animation
  const animateBell = () => {
    Animated.sequence([
      Animated.timing(bellAnimation, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(bellAnimation, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Fade in animation on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchNotificationCount = async () => {
    try {
      const userData = await fetchUserInfo();
      if (userData) {
        const response = await fetch(`${API_BASE_URL}/notify-count/${userData.id}`);
        const count = await response.json();
        if (count > notificationCount) {
          animateBell();
        }
        setNotificationCount(count);
      }
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  const fetchUpdatedUserInfo = async () => {
    try {
      const currentUserInfo = await fetchUserInfo();
      if (currentUserInfo) {
        const response = await axios.get(`${API_BASE_URL}/user-info/${currentUserInfo.id}`);
        const updatedUserData = response.data;
        await updateUserInfo(updatedUserData.user);
      }
    } catch (error) {
      console.error('Error fetching updated user info:', error);
    }
  };

  useEffect(() => {
    fetchUpdatedUserInfo();
    fetchNotificationCount();
    const intervalId = setInterval(fetchNotificationCount, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>

      <ImageBackground 
        source={require('../assets/icon/pattern2.png')} 
        style={styles.headerBackground}
        imageStyle={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.headerOverlay} />
        
        <Animated.View style={[
          styles.contentContainer,
          { opacity: fadeAnim }
        ]}>
          {/* Left side - Logo and Title */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('Home')} 
            style={styles.headerTitleContainer}
            activeOpacity={0.8}
          >
            <View style={styles.logoContainer}>
              <View style={styles.logoInnerShadow}>
                <Image 
                  source={require('../assets/icon/logo.png')} 
                  style={styles.headerImage} 
                />
              </View>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>
                Square
              </Text>
              <View style={styles.subtitleContainer}>
                <MaterialCommunityIcons name="home-search" size={14} color="#FFFFFF" style={styles.subtitleIcon} />
                <Text style={styles.subtitleText}>Find your dream home</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Right side - Notification Bell */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('Notifications')} 
            style={styles.notificationContainer}
            activeOpacity={0.8}
          >
            <Animated.View style={[
              styles.bellContainer,
              { transform: [{ scale: bellAnimation }] }
            ]}>
              <MaterialCommunityIcons 
                name={notificationCount > 0 ? "bell-ring-outline" : "bell-outline"}
                size={24} 
                color="#FFFFFF" 
              />
              {notificationCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </Text>
                </View>
              )}
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
        
        <View style={styles.bottomGradient} />
      </ImageBackground>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    paddingTop: 20,
    backgroundColor: '#8E2DE2',
  },
  header: {
    height: Platform.OS === 'ios' ? 90 : 80, // Reduced height
    backgroundColor: '#8E2DE2',
    position: 'relative',
    overflow: 'hidden',
  },
  headerBackground: {
    height: Platform.OS === 'ios' ? 90 : 80,
    backgroundColor: '#8E2DE2',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(142, 45, 226, 0.95)',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 8 : 12,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    backgroundColor: '#faedff',
    borderRadius: 18,
    padding: 3,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  logoInnerShadow: {
    backgroundColor: '#faedff',
    borderRadius: 15,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 13,
  },
  titleContainer: {
    marginLeft: 14,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  titleHighlight: {
    color: '#FFD700',
    fontWeight: '800',
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  subtitleIcon: {
    marginRight: 4,
    opacity: 0.9,
  },
  subtitleText: {
    color: '#FFFFFF',
    opacity: 0.9,
    fontSize: 12,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  notificationContainer: {
    marginLeft: 16,
    padding: 8,
  },
  bellContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    padding: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#8E2DE2',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});


export default CustomHeader;
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StatusBar, StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const logo = require('../assets/icon/splash.png');

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const loadingDotOpacity1 = useRef(new Animated.Value(0.3)).current;
  const loadingDotOpacity2 = useRef(new Animated.Value(0.3)).current;
  const loadingDotOpacity3 = useRef(new Animated.Value(0.3)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo initial animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.easeOut,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.easeOut,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.easeOut,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating/levitating animation for logo - fixed easing function
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.sin, // Fixed: use Easing.sin instead of Easing.inOut(Easing.sine)
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.sin, // Fixed: use Easing.sin instead of Easing.inOut(Easing.sine)
          useNativeDriver: true,
        })
      ])
    ).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2200,
      easing: Easing.ease, // Fixed: use Easing.ease instead of Easing.inOut(Easing.ease)
      useNativeDriver: false,
    }).start();

    // Loading dots animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(loadingDotOpacity1, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(loadingDotOpacity2, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(loadingDotOpacity3, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(loadingDotOpacity1, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(loadingDotOpacity2, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(loadingDotOpacity3, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // Floating animation interpolation
  const floatTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10], // Adjust this range to control floating height
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#ffffff" translucent />
      
      {/* Background with subtle gradient */}
      <LinearGradient
        colors={['#ffffff', '#ffffff']}
        style={styles.background}
      />
      
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: translateYAnim },
              { translateY: floatTranslateY }, // Apply floating animation
            ],
          },
        ]}
      >
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        
        {/* Add subtle shadow that moves with the logo */}
        <Animated.View 
          style={[
            styles.logoShadow,
            {
              opacity: floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.2, 0.1], // Shadow fades slightly as logo rises
              }),
              transform: [
                { scale: floatAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.05], // Shadow grows slightly as logo rises
                })},
              ],
            }
          ]}
        />
      </Animated.View>
      
      {/* Premium loading indicator */}
      <View style={styles.loadingContainer}>
        <View style={styles.progressBarContainer}>
          <Animated.View 
            style={[
              styles.progressBar,
              { width: progressWidth }
            ]}
          >
            <LinearGradient
              colors={['#4158D0', '#C850C0', '#FFCC70']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressGradient}
            />
          </Animated.View>
        </View>
        
        <View style={styles.loadingTextContainer}>
          <Text style={styles.loadingText}>Loading</Text>
          <View style={styles.dotsContainer}>
            <Animated.Text style={[styles.dot, { opacity: loadingDotOpacity1 }]}>.</Animated.Text>
            <Animated.Text style={[styles.dot, { opacity: loadingDotOpacity2 }]}>.</Animated.Text>
            <Animated.Text style={[styles.dot, { opacity: loadingDotOpacity3 }]}>.</Animated.Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
    position: 'relative',
  },
  logo: {
    width: 120,
    height: 120,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  logoShadow: {
    position: 'absolute',
    width: 80,
    height: 15,
    backgroundColor: '#fff',
    borderRadius: 50,
    bottom: -25,
    opacity: 0.1,
    zIndex: -1,
    transform: [{ scaleX: 1.3 }],
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 255,
    width: '80%',
    alignItems: 'center',
  },
  progressBarContainer: {
    height: 4,
    width: '100%',
    backgroundColor: '#ffff',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  progressGradient: {
    flex: 1,
    borderRadius: 6,
  },
  loadingTextContainer: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#454545',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  dotsContainer: {
    flexDirection: 'row',
    height: 20,
  },
  dot: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C850C0',
    marginLeft: 1,
  },
});

export default SplashScreen; 
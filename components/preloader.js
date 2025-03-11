import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const LoadingOverlay = ({ visible, message = "Loading..." }) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(0)).current;
  const dotValues = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    if (visible) {
      // Spinning animation
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 1200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(pulseValue, {
            toValue: 0,
            duration: 1200,
            easing: Easing.in(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      ).start();

      // Dot animations
      dotValues.forEach((dot, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(index * 300),
            Animated.timing(dot, {
              toValue: 1,
              duration: 600,
              easing: Easing.out(Easing.ease),
              useNativeDriver: false,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 600,
              easing: Easing.in(Easing.ease),
              useNativeDriver: false,
            }),
          ])
        ).start();
      });
    }
  }, [visible]);

  // Interpolate spin animation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Interpolate pulse animation
  const pulseScale = pulseValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <BlurView intensity={15} style={styles.container} tint="dark">
        <View style={styles.preloaderCard}>
          <Animated.View style={[styles.pulseContainer, { transform: [{ scale: pulseScale }] }]}>
            <LinearGradient
              colors={['#4158D0', '#C850C0', '#FFCC70']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBorder}
            />
            
            <View style={styles.spinnerContainer}>
              <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
                <LinearGradient
                  colors={['#4158D0', '#C850C0', '#FFCC70']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.spinnerGradient}
                />
              </Animated.View>
              
              <View style={styles.spinnerCore}>
                <LinearGradient
                  colors={['#4158D0', '#C850C0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.spinnerCoreGradient}
                />
              </View>
            </View>
          </Animated.View>
          
          <Text style={styles.message}>{message}</Text>
          
          <View style={styles.dotsContainer}>
            {dotValues.map((_, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot, 
                  { 
                    opacity: dotValues[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1],
                    }),
                    transform: [{ 
                      scale: dotValues[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.5],
                      }) 
                    }] 
                  }
                ]}
              >
                <LinearGradient
                  colors={['#4158D0', '#C850C0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.dotGradient}
                />
              </Animated.View>
            ))}
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preloaderCard: {
    backgroundColor: 'transparent',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    width: 220,
    shadowColor: '#4158D0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 20,
    backdropFilter: 'blur(12px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  pulseContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  gradientBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 52,
    opacity: 0.4,
  },
  spinnerContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'absolute',
  },
  spinnerGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    opacity: 0.6,
  },
  spinnerCore: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C850C0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  spinnerCoreGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  message: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 16,
    textShadowColor: 'rgba(192, 80, 192, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
    overflow: 'hidden',
  },
  dotGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
});

export default LoadingOverlay;
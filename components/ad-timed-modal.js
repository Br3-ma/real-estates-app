import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image, Animated } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const TimedAdPopup = () => {
  const [visible, setVisible] = useState(false);
  const { width } = Dimensions.get('window');
  const animatedValue = useRef(new Animated.Value(0)).current;
  const doubleTapRef = useRef(false);

  const showAd = () => {
    setVisible(true);
    Animated.spring(animatedValue, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const forceShowAd = () => {
    if (!visible) {
      showAd();
    }
  };

  useEffect(() => {
    showAd();
    const intervalId = setInterval(() => {
      forceShowAd();
    }, 30000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!visible) {
      setTimeout(() => {
        showAd();
      }, 600000);
    }
  }, [visible]);

  const closeAd = () => {
    if (visible) {
      // Use the animation to fade out the ad before setting it to invisible
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false); // Set visibility to false after animation completes
      });
    }
  };

  const handleClosePress = () => {
    if (doubleTapRef.current) {
      closeAd(); // Close the ad on second tap
    } else {
      doubleTapRef.current = true;
      setTimeout(() => {
        doubleTapRef.current = false; // Reset the double tap state after a short delay
      }, 30000); // Duration for double tap detection
    }
  };

  const animatedStyle = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-300, 0],
        }),
      },
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1],
        }),
      },
    ],
    opacity: animatedValue,
  };

  return (
    visible && ( // Only render if visible
      <Animated.View 
        style={[{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          width: width - 32,
          marginHorizontal: 16,
          marginVertical: 8,
          backgroundColor: 'white',
          borderRadius: 10,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          zIndex: 999,
        }, animatedStyle]}
      >
        <TouchableOpacity
          onPress={handleClosePress} // Handle double tap close
          style={{
            position: 'absolute',
            right: 8,
            top: 8,
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 12,
            padding: 4,
          }}
        >
          <MaterialIcons name="close" size={20} color="#666" />
        </TouchableOpacity>

        <View style={{ borderRadius: 10, overflow: 'hidden' }}>
          <View style={{
            height: 180,
            backgroundColor: '#f0f0f0',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Image
              source={{ 
                uri: 'https://ocdn.eu/images/pulscms/OTc7MDA_/57ca6a5294e50c13d980a6ff4243b115.jpeg'
              }}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
              }} 
            />
          </View>

          <View style={{ padding: 12 }}>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: '600',
              color: '#333',
              marginBottom: 4 
            }}>
              Get your ride today
            </Text>
            <Text style={{ 
              fontSize: 14,
              color: '#666',
              marginBottom: 12 
            }}>
              Yango starts a contest to reward a loyal driver with a Renault Stepway. Double Tap to Close this Ad
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#3D6DCC',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 6,
                alignSelf: 'flex-start',
              }}
              onPress={() => {
                console.log('Ad clicked');
              }}
            >
              <Text style={{ color: 'white', fontWeight: '500' }}>
                Learn More
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    )
  );
};

export default TimedAdPopup;

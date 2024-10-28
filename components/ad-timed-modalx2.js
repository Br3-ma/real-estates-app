import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const TimedAdPopup = () => {
  const [visible, setVisible] = useState(false);
  const { width } = Dimensions.get('window');
  const reopenTimerRef = useRef(null);

  useEffect(() => {
    // Initial delay to show the ad after 5 seconds
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 10000);

    return () => {
      // Cleanup all timers when component unmounts
      clearTimeout(initialTimer);
      if (reopenTimerRef.current) {
        clearTimeout(reopenTimerRef.current);
      }
    };
  }, []);

  // Effect to handle auto-reopen when visibility changes
  useEffect(() => {
    if (!visible) {
      reopenTimerRef.current = setTimeout(() => {
        setVisible(true);
      }, 12000);
    }

    return () => {
      if (reopenTimerRef.current) {
        clearTimeout(reopenTimerRef.current);
      }
    };
  }, [visible]);

  const closeAd = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <View 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: width - 32,
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      }}
    >
      <TouchableOpacity
        onPress={closeAd}
        style={{
          position: 'absolute',
          right: 8,
          top: 8,
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
            Yango starts a contest to reward a loyal driver with a Renault Stepway
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
              // Handle ad click action
              console.log('Ad clicked');
            }}
          >
            <Text style={{ color: 'white', fontWeight: '500' }}>
              Learn More
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TimedAdPopup;
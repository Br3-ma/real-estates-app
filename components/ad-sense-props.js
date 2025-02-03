import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated, WebView, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const gAdsense = () => {
  const [visible, setVisible] = useState(false);
  const { width } = Dimensions.get('window');
  const animatedValue = useRef(new Animated.Value(0)).current;
  const doubleTapRef = useRef(false);

  // Google AdSense Ad Unit ID (replace with your own)
  const adUnitId = 'ca-pub-6203298272391383'; // Replace with your AdSense ad unit ID
  const adUrl = `https://square.twalitso.com/ads?adunit=${adUnitId}`; // Replace with your ad server URL

  // Show ad with animation
  const showAd = () => {
    setVisible(true);
    Animated.spring(animatedValue, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Force show ad if not already visible
  const forceShowAd = () => {
    if (!visible) {
      showAd();
    }
  };

  // Show ad every 30 seconds
  useEffect(() => {
    showAd();
    const intervalId = setInterval(() => {
      forceShowAd();
    }, 30000); // 30 seconds
    return () => clearInterval(intervalId);
  }, []);

  // Show ad again after 10 minutes if closed
  useEffect(() => {
    if (!visible) {
      setTimeout(() => {
        showAd();
      }, 600000); // 10 minutes
    }
  }, [visible]);

  // Close ad with animation
  const closeAd = () => {
    if (visible) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
      });
    }
  };

  // Handle double tap to close
  const handleClosePress = () => {
    if (doubleTapRef.current) {
      closeAd();
    } else {
      doubleTapRef.current = true;
      setTimeout(() => {
        doubleTapRef.current = false;
      }, 300); // 300ms for double tap detection
    }
  };

  // Animation styles
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
    visible && (
      <Animated.View
        style={[
          styles.adContainer,
          { width: width - 32 },
          animatedStyle,
        ]}
      >
        {/* Close Button */}
        <TouchableOpacity
          onPress={handleClosePress}
          style={styles.closeButton}
        >
          <MaterialIcons name="close" size={20} color="#666" />
        </TouchableOpacity>

        {/* Ad Content */}
        <View style={styles.adContent}>
          {/* Google AdSense Ad (WebView) */}
          <WebView
            source={{ uri: adUrl }}
            style={styles.webView}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
          />

          {/* Ad Footer */}
          <View style={styles.adFooter}>
            <Text style={styles.adTitle}>Sponsored Ad</Text>
            <Text style={styles.adDescription}>
              Support us by viewing this ad. Double tap to close.
            </Text>
          </View>
        </View>
      </Animated.View>
    )
  );
};

// Styles
const styles = StyleSheet.create({
  adContainer: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    marginVertical: 8,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 999,
  },
  closeButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 4,
  },
  adContent: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  webView: {
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  adFooter: {
    padding: 12,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  adDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
});

export default gAdsense;
import { View, Text } from 'react-native';
import * as Device from 'expo-device';
import React, { useState } from 'react';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const androidAdmobBanner = "ca-app-pub-6203298272391383/6608047080";
const iosAdmobBanner = "";
const productionID = Device.osName === 'Android' ? androidAdmobBanner : iosAdmobBanner;

const InlineAd = () => {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [adFailed, setAdFailed] = useState(false);

  return (
    <View style={{ height: isAdLoaded ? 'auto' : adFailed ? 50 : 0 }}>
      {adFailed ? (
        <Text style={{ textAlign: 'center' }}>No ad available</Text>
      ) : (
        <BannerAd
          unitId={__DEV__ ? TestIds.BANNER : productionID}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
              keywords: ['real estate', 'apartments', 'jobs', 'news', 'kids', 'games'],
            }}
            onAdLoaded={() => {
              console.log('Ad loaded');
              if (__DEV__) {
                // Development mode
                console.log("App is in Development Mode");
              } else {
                // Production mode
                console.log("App is in Production Mode");
              }
              setIsAdLoaded(true);
              setAdFailed(false);
            }}
            onAdFailedToLoad={(error) => {
              console.error('Ad failed to load:', error);
              setIsAdLoaded(false);
              setAdFailed(true);
            }}
        />
      )}
    </View>
  );
};

export default InlineAd;
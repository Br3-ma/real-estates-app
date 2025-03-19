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
        <>
        {/* This will display google test ads */}          
          {/* This should display production ready ads */}
          <BannerAd
            unitId={productionID}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              onAdLoaded={() => {
                console.log('Ad loaded');
                console.log(__DEV__ ? "App is in Development Mode" : "App is in Production Mode");
                setIsAdLoaded(true);
                setAdFailed(false);
              }}
              onAdFailedToLoad={(error) => {
                console.error('Ad failed to load:', error);
                setIsAdLoaded(false);
                setAdFailed(true);
              }}
          />
        </>
      )}
    </View>
  );
};

export default InlineAd;
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Monetag from 'react-native-monetag';
import * as Notix  from 'notix-rn';

const MonetagNotixComponent = () => {
  let interstitialLoader;

  useEffect(() => {
    initializePushNotifications();
    loadInterstitial();
  }, []);

  const initializePushNotifications = () => {
    const notixAppId = 'YOUR_NOTIX_APP_ID'; // Replace with actual Notix App ID
    const notixToken = 'YOUR_NOTIX_TOKEN';  // Replace with actual Notix Token
    Notix.init(notixAppId, notixToken);
  };

  const loadInterstitial = async () => {
    interstitialLoader = await Notix.Interstitial.createLoader('YOUR_INTERSTITIAL_AD_ID'); // Replace with your Interstitial Ad ID
    interstitialLoader.startLoading();

    try {
      const interstitialData = await interstitialLoader.next(5000);
      Notix.Interstitial.show(interstitialData);
    } catch (error) {
      console.error('Interstitial Ad Failed to Load:', error);
    }
  };

  return (
    <View>
      {/* Monetag Banner Ad */}
      <Monetag.Banner
        adUnitId="YOUR_MONETAG_BANNER_ID" // Replace with your Monetag Banner ID
        style={{ width: '100%', height: 50 }}
      />
    </View>
  );
};

export default MonetagNotixComponent;

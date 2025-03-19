import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import * as Device from 'expo-device';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

const androidAdmobInterstitial = "ca-app-pub-6203298272391383/2896750365";
const iosAdmobInterstitial = "";
const productionID = Device.osName === 'Android' ? androidAdmobInterstitial : iosAdmobInterstitial;

const interstitial = InterstitialAd.createForAdRequest(
  __DEV__ ? TestIds.INTERSTITIAL : productionID,
  {
    requestNonPersonalizedAdsOnly: true,
  }
);

const InterstitialAdSQ = () => {
  useEffect(() => {
    const loadAd = () => {
      interstitial.load();
    };

    const showAd = () => {
      if (interstitial.loaded) {
        interstitial.show();
      } else {
        Alert.alert("Ad not ready", "The ad is still loading. Try again later.");
      }
    };

    const eventListener = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      console.log("Interstitial ad loaded");
    });

    interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      console.log("Interstitial ad closed");
      loadAd(); // Preload next ad after closing
    });

    loadAd(); // Load ad on component mount

    return () => {
      eventListener(); // Remove event listener on unmount
    };
  }, []);

  return null; // No UI needed, it runs in the background
};

export default InterstitialAdSQ;

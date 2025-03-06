import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { InterstitialAdLoader, AdRequestConfiguration } from 'yandex-mobile-ads';

const YandexInterstitialAd = () => {
  const [interstitialAd, setInterstitialAd] = useState(null);

  useEffect(() => {
    loadInterstitialAd();
  }, []);

  const loadInterstitialAd = async () => {
    try {
      let loader = await InterstitialAdLoader.create();
      if (!loader) return;

      let adRequestConfig = new AdRequestConfiguration('R-M-14068848-1'); // Test ID

      let ad = await loader.loadAd(adRequestConfig);
      if (ad) {
        setInterstitialAd(ad);
        setupAdCallbacks(ad);
      }
    } catch (error) {
      console.error('Interstitial Ad failed to load:', error);
    }
  };

  const setupAdCallbacks = (ad) => {
    ad.onAdShown = () => console.log('Ad Shown');
    ad.onAdFailedToShow = (error) => console.error('Ad Failed to Show:', error);
    ad.onAdClicked = () => console.log('Ad Clicked');
    ad.onAdDismissed = () => {
      console.log('Ad Dismissed');
      setTimeout(() => loadInterstitialAd(), 15000); // Reload ad after 15 seconds
    };
  };

  useEffect(() => {
    if (interstitialAd) {
      interstitialAd.show();
    }
  }, [interstitialAd]);

  return <View />;
};

export default YandexInterstitialAd;

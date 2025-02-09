import React, { useEffect, useState } from 'react';
import { View, Button } from 'react-native';
import { 
  InterstitialAdLoader, 
  AdRequestConfiguration, 
  Gender, 
  Location 
} from 'yandex-mobile-ads';

const YandexInterstitialAd = () => {
  const [interstitialAd, setInterstitialAd] = useState(null);

  useEffect(() => {
    loadInterstitialAd();
  }, []);

  const loadInterstitialAd = async () => {
    try {
      let loader = await InterstitialAdLoader.create();
      if (!loader) return;

      let adRequestConfig = new AdRequestConfiguration(
        'demo-interstitial-yandex', // Replace with your Yandex Ad Unit ID  
        '20',
        'context-query',
        ['context-tag'],
        Gender.Female,
        new Location(55.734202, 37.588063)
      );

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
      loadInterstitialAd(); // Reload ad after dismissal
    };
    ad.onAdImpression = (impressionData) => console.log('Ad Impression:', impressionData);
  };

  const showAd = () => {
    if (interstitialAd) {
      interstitialAd.show();
    } else {
      console.warn('Ad not loaded yet');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Show Interstitial Ad" onPress={showAd} />
    </View>
  );
};

export default YandexInterstitialAd;

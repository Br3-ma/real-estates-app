import * as Device from 'expo-device';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Button, Text } from 'react-native';
import { AdEventType, InterstitialAd, TestIds } from 'react-native-google-mobile-ads';

const iosAdmobInterstitial = "";
const androidAdmobInterstitial = "ca-app-pub-6203298272391383/6608047080";
const productionID = Device.osName === 'Android' ? androidAdmobInterstitial : iosAdmobInterstitial;
const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : productionID;
// Make sure to always use a test ID when not in production 


const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  keywords: ['real estate', 'education', 'trading'], // Update based on the most relevant keywords for app/users, these are just random examples
  requestNonPersonalizedAdsOnly: true, // Update based on the initial tracking settings from initialization earlier
});


// Destination url and the react component to render in the link
const InterstitialAdLink = ({destination, children}) => {

  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Event listener for when the ad is loaded
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });

    // Event listener for when the ad is closed
    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);

      // Load a new ad when the current ad is closed
      interstitial.load();
    });

    // Start loading the interstitial ad straight away
    interstitial.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);


  return (
    <Link asChild href={`${destination}`}>
      <Button onPress={() => {
        if (loaded) { interstitial.show(); }
      }}>
        <>
          {children}
        </>
      </Button>
    </Link>
  );
};

export default InterstitialAdLink;
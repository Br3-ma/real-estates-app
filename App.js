import React, { useEffect, useState, createContext, useContext } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, LogBox } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { API_BASE_URL } from './confg/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import SplashScreen from './screens/splash.screen';
import Toast from 'react-native-toast-message';
import SignInScreen from './screens/auth/login.screen';
import ForgotPasswordScreen from './screens/auth/forgot.screen';
import OTPVerificationScreen from './screens/auth/otp-verification.screen';
import ChangePasswordScreen from './screens/auth/reset.screen';
import SignupsquareateAgentScreen from './screens/auth/register.screen';
import SearchResultScreen from './screens/search/search-result.screen';
import OverviewScreen from './screens/onboarding/overview.screen';
import KYCScreen from './screens/onboarding/kyc.screen';
import OTPScreen from './screens/onboarding/otp.screen';
import MainScreen from './screens/main.screen';
import { MobileAds } from 'react-native-google-mobile-ads'; // Correct import
// import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency'; // this crushes

const Stack = createStackNavigator();

const LoadingContext = createContext();
export const useLoading = () => useContext(LoadingContext);

const withLoading = (WrappedComponent) => {
  return (props) => {
    const { setIsLoading } = useLoading();

    const wrappedOnPress = async (callback) => {
      setIsLoading(true);
      try {
        await callback();
      } finally {
        setIsLoading(false);
      }
    };

    return <WrappedComponent {...props} wrappedOnPress={wrappedOnPress} />;
  };
};

const App = () => {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Initialize AdMob SDK and tracking permissions
  useEffect(() => {
    const initializeAdMob = async () => {
      try {
        // Request tracking permissions (if needed for iOS ATT)
        const { status: trackingStatus } = await requestTrackingPermissionsAsync();
        if (trackingStatus !== 'granted') {
          console.log('Tracking permission not granted');
          // Handle this case if needed (e.g., disable personalized ads)
        }

        // Initialize AdMob SDK
        const adapterStatuses = await MobileAds().initialize();
        console.log('AdMob SDK initialized successfully:', adapterStatuses);
      } catch (error) {
        console.error('Failed to initialize AdMob SDK or tracking:', error);
      }
    };

    initializeAdMob();
  }, []);

  const checkAuthentication = async () => {
    try {
      console.log('----------OnLoad----------');
      const userInfoString = await AsyncStorage.getItem('userInfo');
      const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

      if (!userInfo) {
        throw new Error('User info not found');
      }

      const phoneNumber = userInfo.phone || userInfo.user?.phone;

      if (!phoneNumber) {
        throw new Error('Phone number not found in user info');
      }
      const url = `${API_BASE_URL}/connectx`;
      const response = await axios.post(url, { phone: phoneNumber });

      console.log(url);
      console.log(response);
      setAuthenticated(response.data.status);
    } catch (error) {
      console.log(error);
    }
    setShowSplashScreen(false);
  };

  if (showSplashScreen) {
    return (
      <View style={styles.centered}>
        <SplashScreen />
      </View>
    );
  }

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <NavigationContainer theme={MyTheme}>
        {authenticated ? (
          <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={withLoading(MainScreen)} />
            <Stack.Screen name="SearchResultScreen" component={withLoading(SearchResultScreen)} />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignIn" component={withLoading(SignInScreen)} />
            <Stack.Screen name="RegisterByOTP" component={withLoading(SignupsquareateAgentScreen)} />
            <Stack.Screen name="ForgotPasswordScreen" component={withLoading(ForgotPasswordScreen)} />
            <Stack.Screen name="OTPVerification" component={withLoading(OTPVerificationScreen)} />
            <Stack.Screen name="ChangePasswordScreen" component={withLoading(ChangePasswordScreen)} />
            <Stack.Screen name="OverviewScreen" component={withLoading(OverviewScreen)} />
            <Stack.Screen name="KYCScreen" component={withLoading(KYCScreen)} />
            <Stack.Screen name="OTPScreen" component={withLoading(OTPScreen)} />
            <Stack.Screen name="Main" component={withLoading(MainScreen)} />
          </Stack.Navigator>
        )}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#415D77" />
          </View>
        )}
      </NavigationContainer>
      <Toast />
    </LoadingContext.Provider>
  );
};

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#415D77',
  },
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});

export default App;
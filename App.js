import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, LogBox } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { API_BASE_URL } from './confg/config';
import { SERVER_BASE_URL } from './confg/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Screens
import SignInScreen from './screens/auth/login.screen';
import ForgotPasswordScreen from './screens/auth/forgot.screen';
import ChangePasswordScreen from './screens/auth/reset.screen';
import OTPVerificationScreen from './screens/auth/otp-verification.screen';

import SignupRealEstateAgentScreen from './screens/auth/register.screen';
import OverviewScreen from './screens/onboarding/overview.screen';
import ContactsPermissions from './screens/onboarding/permissions.screen';
import SplashScreen from './screens/splash.screen';
import MainScreen from './screens/main.screen';
import CartScreen from './screens/cart/my-cart.screen';
// import MapScreen from './screens/maps/find-property.screen';
import SearchResultScreen from './screens/search/search-result.screen';

const Stack = createStackNavigator();

// Disable yellow box warnings
console.disableYellowBox = true;

// Ignore all log notifications
LogBox.ignoreAllLogs(true);

const App = () => {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      // Retrieve the userInfo from AsyncStorage
      const userInfoString = await AsyncStorage.getItem('userInfo');
      const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  
      if (!userInfo) {
        throw new Error('User info not found');
      }
  
      // Determine the correct structure and extract the phone number
      const phoneNumber = userInfo.data?.user?.phone || userInfo.user?.phone;
  
      if (!phoneNumber) {
        throw new Error('Phone number not found in user info');
      }
  
      // Make an API request to check if the user is authenticated
      const response = await axios.post(`${API_BASE_URL}/connectx`, {
        withCredentials: false, // Include credentials (cookies) in the request
        phone: phoneNumber,
      });
  
      // If the request is successful, update the authenticated state based on the response
      setAuthenticated(response.data.status);
    } catch (error) {
      if (!error.response) {
        // Network error or internet disconnection
        console.error('Network error or internet disconnection:', error.message);
      } else {
        // Other types of errors (e.g., server error, authentication error)
        console.error('Authentication check failed:', error);
      }
    }
    setShowSplashScreen(false);
  };
  

  if (showSplashScreen) {
    return (
      <View style={styles.centered}>
        <SplashScreen/>
        {/* <ActivityIndicator size="large" /> */}
      </View>
    );
  }

  return (
    <NavigationContainer theme={MyTheme}>
      {authenticated ? (
        <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
                    

          <Stack.Screen name="SearchResultScreen" component={SearchResultScreen} />
          {/* <Stack.Screen name="ProductDetails" component={ProductDetails} /> */}
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="RegisterByOTP" component={SignupRealEstateAgentScreen} />
          <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
          <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
          <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
          <Stack.Screen name="Overview" component={OverviewScreen} />
          <Stack.Screen name="ContactsPermissions" component={ContactsPermissions} />
          <Stack.Screen name="Main" component={MainScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#415D77', // Change primary color
  },
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default App;

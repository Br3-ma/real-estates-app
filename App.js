import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, LogBox  } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { API_BASE_URL } from './confg/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import SplashScreen from './screens/splash.screen';

// Screens
import SignInScreen from './screens/auth/login.screen';
import ForgotPasswordScreen from './screens/auth/forgot.screen';
import ChangePasswordScreen from './screens/auth/reset.screen';
import OTPVerificationScreen from './screens/auth/otp-verification.screen';
import SignupsquareateAgentScreen from './screens/auth/register.screen';
import OverviewScreen from './screens/onboarding/overview.screen';
import ContactsPermissions from './screens/onboarding/permissions.screen';
import MainScreen from './screens/main.screen';

const Stack = createStackNavigator();
console.disableYellowBox = true;
LogBox.ignoreAllLogs(true);

const App = () => {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  
      if (!userInfo) {
        throw new Error('User info not found');
      }

      const phoneNumber = userInfo.data?.user?.phone || userInfo.user?.phone;
  
      if (!phoneNumber) {
        throw new Error('Phone number not found in user info');
      }
  
      const url = `${API_BASE_URL}/connectx`;
      const response = await axios.post(url, { phone: phoneNumber });
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
      <NavigationContainer theme={MyTheme}>
        {authenticated ? (
          <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={MainScreen} />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="RegisterByOTP" component={SignupsquareateAgentScreen} />
            <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
            <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
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
    primary: '#415D77',
  },
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;

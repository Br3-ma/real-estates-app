import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { API_BASE_URL } from './confg/config';
import { SERVER_BASE_URL } from './confg/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Screens
import SignInScreen from './screens/auth/login.screen';
import SignupRealEstateAgentScreen from './screens/auth/register.screen';
import OverviewScreen from './screens/onboarding/overview.screen';
import ContactsPermissions from './screens/onboarding/permissions.screen';
import SplashScreen from './screens/splash.screen';
import MainScreen from './screens/main.screen';
import CartScreen from './screens/cart/my-cart.screen';
import MapScreen from './screens/maps/find-property.screen';
import SearchResultScreen from './screens/search/search-result.screen';

const Stack = createStackNavigator();

const App = () => {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      // Retrieve the phone number from AsyncStorage
      const userInfoString = await AsyncStorage.getItem('userInfo');
      const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
      const phoneNumber = userInfo ? userInfo.user.phone : '0'; // Use '0' if no user info is found

      // Make an API request to check if the user is authenticated
      // const response = await axios.post('http://localhost/realestserver/est-server/api/connectx', {
      const response = await axios.post(`${API_BASE_URL}/connectx`, {
        withCredentials: false, // Include credentials (cookies) in the request
        phone: phoneNumber,
      });

      // If the request is successful, update the authenticated state based on the response
      // setAuthenticated(true);
      setAuthenticated(response.data.status);
    } catch (error) {
      console.error('Authentication check failed:', error);
      setAuthenticated(false);
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
          
          <Stack.Screen name="MapScreen" component={MapScreen} />
          <Stack.Screen name="SearchResultScreen" component={SearchResultScreen} />
          {/* <Stack.Screen name="ProductDetails" component={ProductDetails} /> */}
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="RegisterByOTP" component={SignupRealEstateAgentScreen} />
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

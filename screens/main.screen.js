import React, { useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './home.screen';
import MyPropertyScreen from './account/food/my-properties.screen';
import NotificationScreen from './account/donation/box.screen';
import MeScreen from './account/profile/me.screen';

const Tab = createBottomTabNavigator();

const TabBarIcon = (props) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
      <MaterialCommunityIcons {...props} />
    </View>
  );
};

const MainScreen = () => {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,  // Hide the header
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'My Property') {
              iconName = focused ? 'home-city' : 'home-city-outline';
            } else if (route.name === 'Notifications') {
              iconName = focused ? 'bell' : 'bell-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'account' : 'account-outline';
            }
            return <TabBarIcon name={iconName} size={focused ? 26 : 22} color={color} />;
          },
          tabBarActiveTintColor: '#FFA500', // Orange color for active tab
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#415D77',
            borderTopColor: '#1040AE',
            height: 60,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.6,
            shadowRadius: 5,
            elevation: 10,
            position: 'absolute',
            left: 8,
            right:8,
            bottom: 8,
            borderWidth: 1,
            borderColor: '#1040AE',
          },
          tabBarLabelStyle: {
            paddingBottom: 5,
            fontSize: 12,
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="My Property" component={MyPropertyScreen} />
        <Tab.Screen name="Notifications" component={NotificationScreen} />
        <Tab.Screen name="Profile" component={MeScreen} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textInput: {
    width: 300,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
  },
});

export default MainScreen;

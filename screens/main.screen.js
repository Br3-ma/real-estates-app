import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './home.screen';
import MyPropertyScreen from './account/food/my-properties.screen';
import NotificationScreen from './account/donation/box.screen';
import MeScreen from './account/profile/me.screen';
import SearchResultScreen from './search/search-result.screen';

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ name, size, color, focused }) => {
  let iconName;

  switch (name) {
    case 'Home':
      iconName = focused ? 'home' : 'home-outline';
      break;
    case 'My Property':
      iconName = focused ? 'home-city' : 'home-city-outline';
      break;
    case 'Notifications':
      iconName = focused ? 'bell' : 'bell-outline';
      break;
    case 'Search':
      iconName = focused ? 'magnify' : 'magnify';
      break;
    case 'Profile':
      iconName = focused ? 'account' : 'account-outline';
      break;
    default:
      iconName = focused ? 'home' : 'home-outline';
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
      <MaterialCommunityIcons name={iconName} size={size} color={color} />
    </View>
  );
};

const MainScreen = () => {
  const [searchParams, setSearchParams] = useState({}); // State to hold search parameters

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,  // Hide the header
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon name={route.name} size={focused ? 26 : 22} color={color} focused={focused} />
          ),
          tabBarActiveTintColor: '#fff', 
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#6750a4',
            borderTopColor: '#6750a4',
            height: 60,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.6,
            shadowRadius: 5,
            elevation: 10,
            position: 'absolute',
            left: 8,
            right: 8,
            bottom: 8,
            borderWidth: 1,
            borderColor: '#644F81',
          },
          tabBarLabelStyle: {
            paddingBottom: 5,
            fontSize: 12,
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="My Property" component={MyPropertyScreen} />
        <Tab.Screen
          name="Search"
          component={SearchResultScreen}
          initialParams={{ results: [], searchKeyword: 'Search For House Properties' }}
        />
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
});

export default MainScreen;

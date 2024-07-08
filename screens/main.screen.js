import React, { useState } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
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
  const [searchParams, setSearchParams] = useState({});

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,
          headerTitle: () => (
            <View style={styles.headerTitleContainer}>
              <Image
                source={{ uri: 'https://t3.ftcdn.net/jpg/03/19/15/80/360_F_319158029_4JKXm8ZJy7BaaciR3SB6ZuGxL1mVGPRA.jpg' }}
                style={styles.headerImage}
              />
              <Text style={styles.headerText}>SQuare</Text>
            </View>
          ),
          // headerRight: () => (
          //   <View style={styles.headerRightContainer}>
          //     <MaterialCommunityIcons name="bell" size={24} color="#6750a4" />
          //   </View>
          // ),
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon name={route.name} size={focused ? 26 : 22} color={color} focused={focused} />
          ),
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: styles.tabBarStyle,
          tabBarLabelStyle: styles.tabBarLabelStyle,
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
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerImage: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 15, 
  },
  headerText: {
    fontSize: 18,
    color: '#6750a4',
    fontWeight: 'bold',
  },
  headerRightContainer: {
    marginRight: 15,
  },
  tabBarStyle: {
    backgroundColor: '#60279C',
    borderTopColor: '#60279C',
    height: 60,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    shadowColor: '#60279C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 10,
    position: '60279C',
    left: 8,
    right: 8,
    bottom: 8,
    borderWidth: 1,
    borderColor: '#60279C',
  },
  tabBarLabelStyle: {
    paddingBottom: 5,
    fontSize: 12,
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

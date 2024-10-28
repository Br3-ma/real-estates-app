import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Platform, SafeAreaView, StatusBar, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_BASE_URL } from '../confg/config';
import { fetchUserInfo } from '../controllers/auth/userController';

import HomeScreen from './home.screen';
import MyPropertyScreen from './account/food/my-properties.screen';
import NotificationScreen from './account/donation/box.screen';
import MeScreen from './account/profile/me.screen';
import SearchResultScreen from './search/search-result.screen';

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ name, size, color, focused }) => {
  const iconMap = {
    Home: ['home', 'home-outline'],
    'My Property': ['home-city', 'home-city-outline'],
    Notifications: ['bell', 'bell-outline'],
    Search: ['magnify', 'magnify'],
    Profile: ['account', 'account-outline'],
  };

  const [focusedIcon, unfocusedIcon] = iconMap[name] || ['home', 'home-outline'];
  const iconName = focused ? focusedIcon : unfocusedIcon;

  return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
};

const CustomHeader = () => {
  const navigation = useNavigation();
  const [notificationCount, setNotificationCount] = useState(0);

  const fetchNotificationCount = async () => {
    try {
      const userData = await fetchUserInfo();
      
      console.log('----------user from notification----------------');
      console.log(userData);
      const response = await fetch(`${API_BASE_URL}/notify-count/${userData.id}`);
      const count = await response.json();
      setNotificationCount(count);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  useEffect(() => {
    fetchNotificationCount();
    const intervalId = setInterval(() => {
      fetchNotificationCount();
    }, 60000); // refresh every 60 seconds

    return () => clearInterval(intervalId);
  }, []);

  const goToHomeAndRefresh = () => {
    try {
      navigation.navigate('Home');
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'Home', params: { refresh: Date.now() } }],
      // });
      // console.log('Navigating to Home and refreshing');
    } catch (error) {
      // console.error('Error resetting navigation:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToHomeAndRefresh} style={styles.headerTitleContainer}>
          <Image source={require('../assets/icon/logo.png')} style={styles.headerImage} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.headerRightButton}>
          <MaterialCommunityIcons name="bell-outline" size={24} color="#FFFFFF" />
          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const MainScreen = () => {
  return (
    <React.Fragment>
      <StatusBar barStyle="light-content" backgroundColor="#8E2DE2" />
      <CustomHeader />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon name={route.name} size={size} color={color} focused={focused} />
          ),
          tabBarActiveTintColor: '#8E2DE2',
          tabBarInactiveTintColor: '#757575',
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
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#8E2DE2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: '#8E2DE2',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerImage: {
    width: 45,
    height: 45,
    marginRight: 12,
    borderRadius: 50,
    backgroundColor: '#faedff',
  },
  headerRightButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabBarStyle: {
    backgroundColor: '#FFFFFF',
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});

export default MainScreen;

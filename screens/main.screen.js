import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Platform, SafeAreaView, StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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

  const goToHomeAndRefresh = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home', params: { refresh: Date.now() } }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToHomeAndRefresh} style={styles.headerTitleContainer}>
          <Image
            source={require('../assets/icon/ddd.png')}
            style={styles.headerImage}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.headerRightButton}>
          <MaterialCommunityIcons name="bell-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const MainScreen = () => {
  return (
    <>
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
    </>
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
    paddingVertical: 12,
    backgroundColor: '#8E2DE2',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerImage: {
    width: 32,
    height: 32,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  headerRightButton: {
    padding: 8,
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

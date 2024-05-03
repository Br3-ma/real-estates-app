import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TextInput, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './home.screen';
import MyFoodScreen from './account/food/my-food.screen';
import BoxScreen from './account/donation/box.screen';
import MeScreen from './account/profile/me.screen';

const Tab = createBottomTabNavigator();

const TabBarIcon = (props) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
      <Ionicons {...props} />
    </View>
  );
};

const MainScreen = () => {
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let label;
            if (route.name === 'Home') {
              iconName = focused ? 'ios-home' : 'ios-home-outline';
              label = 'Home';
            } else if (route.name === 'My Property') {
              iconName = focused ? 'ios-pizza' : 'ios-pizza-outline';
              label = 'My Property';
            } else if (route.name === 'Notifications') {
              iconName = focused ? 'ios-notifications' : 'ios-notifications-outline';
              label = 'Notifications';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'ios-person' : 'ios-person-outline';
              label = 'Profile';
            }
            return <TabBarIcon name={iconName} size={focused ? 26 : 22} color={color} label={label} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopColor: '#E7E7E7',
            height: 60,
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="My Property" component={MyFoodScreen} />
        <Tab.Screen name="Notifications" component={BoxScreen} />
        <Tab.Screen name="Profile" component={MeScreen} />
      </Tab.Navigator>

      <Modal
        animationType="slide"
        transparent={true}
        visible={searchModalVisible}
        onRequestClose={() => setSearchModalVisible(false)}
      >
        <View style={styles.modalView}>
          <TextInput
            mode="outlined"
            label="Search"
            placeholder="Type here..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.textInput}
            right={<TextInput.Icon name="magnify" onPress={() => setSearchModalVisible(false)} />}
          />
          <Button
            mode="contained"
            onPress={() => setSearchModalVisible(false)}
            style={styles.button}
          >
            Close Search
          </Button>
        </View>
      </Modal>
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

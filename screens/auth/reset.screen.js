import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { ToastProvider, useToast } from 'react-native-toast-notifications';
import { API_BASE_URL } from '../../confg/config';
import { updateUserInfo } from '../../controllers/auth/userController';

const ChangePasswordScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const toast = useToast();

  const handleSavePassword = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/reset-password`, { email, password });
      if (response.data.resp) {
        const updatedUserData = response.data;
        console.log((updatedUserData.user));
        await updateUserInfo(updatedUserData.user);
        setUserInfo(updatedUserData.user);
        toast.show(response.data.message, {
          type: 'success',
          placement: 'top',
          duration: 4000,
          animationType: 'slide-in',
        });
        navigation.navigate('Main');
      } else {
        toast.show(response.data.message, {
          type: 'danger',
          placement: 'top',
          duration: 4000,
          animationType: 'slide-in',
        });
      }
    } catch (error) {
      toast.show('Failed to reset password. Please try again.', {
        type: 'danger',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
      console.error('Reset Password Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new password"
        placeholderTextColor="#cccccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm new password"
        placeholderTextColor="#cccccc"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSavePassword} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Change Password</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 20,
    fontSize: 16,
    color: '#000',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  button: {
    backgroundColor: '#7D7399',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const Screen = ({ route, navigation }) => (
  <ToastProvider>
    <ChangePasswordScreen navigation={navigation} route={route} />
  </ToastProvider>
);

export default Screen;

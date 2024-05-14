import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

const MeScreen = ({ route }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileHeader}>
          <Image source={require('../../../assets/profile/avatar.png')} style={styles.profilePicture} />
          <View style={styles.profileText}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileBio}>Public User | Agent</Text>
          </View>
        </View>

        <View style={styles.profileLinks}>
          <TouchableOpacity onPress={() => alert('Change Password')} style={styles.linkItem}>
            <MaterialCommunityIcons name="lock" style={styles.linkIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('Edit Profile')} style={styles.linkItem}>
            <MaterialCommunityIcons name="account-edit-outline" size={24} style={styles.linkIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('Upload Profile')} style={styles.linkItem}>
            <AntDesign name="picture" style={styles.linkIcon} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <Card title="Location" value="New York, USA" />
        <Card title="Email" value="john.doe@example.com" />
        <Card title="Website" value="www.example.com" onPress={() => alert('Visit website')} />
      </View>

      {/* Add more cards as needed */}
    </ScrollView>
  );
};

const Card = ({ title, value, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
  },
  profileContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  profileBio: {
    fontSize: 16,
    color: '#34495e',
  },
  profileLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  linkItem: {
    flex: 1,
    alignItems: 'center',
  },
  linkIcon: {
    fontSize: 24,
    color: '#3498db',
    marginBottom: 5,
  },
  linkText: {
    color: '#3498db',
  },
  detailsContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  cardValue: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
});

export default MeScreen;

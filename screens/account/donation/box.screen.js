import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';

const NotificationScreen = () => {
  const notifications = [
    { id: 1, title: 'Notification 1', date: '2024-05-12', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.', image: require('../../../assets/img/max.jpg') },
    { id: 2, title: 'Notification 2', date: '2024-05-11', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.', image: require('../../../assets/img/jane.jpg') },
    { id: 3, title: 'Notification 3', date: '2024-05-10', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.', image: require('../../../assets/img/avatar.jpg') },
    // Add more notifications as needed
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {notifications.length > 0 ? (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {notifications.map((notification) => (
              <ListItem key={notification.id} bottomDivider>
                <Image source={notification.image} style={styles.image} />
                <ListItem.Content>
                  <ListItem.Title>{notification.title}</ListItem.Title>
                  <ListItem.Subtitle>{notification.date}</ListItem.Subtitle>
                  <ListItem.Subtitle numberOfLines={2} ellipsizeMode="tail" style={styles.messageText}>
                    {notification.message}
                  </ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyContainer}>
            <Image source={require('../../../assets/img/notific.jpg')} style={styles.emptyImage} />
            <Text style={styles.emptyText}>No notifications</Text>
            <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')} style={styles.button}>
              <Text style={styles.buttonText}>Go to HomeScreen</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // Background color of the safe area
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Background color of the screen
  },
  scrollContent: {
    paddingVertical: 20,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  messageText: {
    color: '#777', // Color of the message text
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default NotificationScreen;

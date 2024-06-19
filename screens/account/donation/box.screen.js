import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Image, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { ListItem } from 'react-native-elements';
import { BlurView } from 'expo-blur';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

const NotificationScreen = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setNotifications([
        { id: 1, title: 'Notification 1', date: '2024-05-12', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.', image: require('../../../assets/img/max.jpg') },
        { id: 2, title: 'Notification 2', date: '2024-05-11', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.', image: require('../../../assets/img/jane.jpg') },
        { id: 3, title: 'Notification 3', date: '2024-05-10', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.', image: require('../../../assets/img/avatar.jpg') },
        // Add more notifications as needed
      ]);
      setLoading(false);
    }, 2000); // Simulating a 2-second delay
  }, []);

  const openNotificationPreview = (notification) => {
    setSelectedNotification(notification);
  };

  const closeNotificationPreview = () => {
    setSelectedNotification(null);
  };

  const getHumanReadableDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {loading ? (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {[1, 2, 3].map((index) => (
              <ShimmerPlaceholder key={index} style={styles.shimmerPlaceholder}>
                <ListItem bottomDivider>
                  <Image source={require('../../../assets/img/placeholder.jpg')} style={styles.image} />
                  <ListItem.Content>
                    <ListItem.Title>Loading...</ListItem.Title>
                    <ListItem.Subtitle>Loading...</ListItem.Subtitle>
                    <ListItem.Subtitle numberOfLines={3} ellipsizeMode="tail" style={styles.messageText}>
                      Loading...
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              </ShimmerPlaceholder>
            ))}
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {notifications.map((notification) => (
              <TouchableOpacity key={notification.id} onPress={() => openNotificationPreview(notification)}>
                <ListItem bottomDivider>
                  <Image source={notification.image} style={styles.image} />
                  <ListItem.Content>
                    <ListItem.Title>{notification.title}</ListItem.Title>
                    <ListItem.Subtitle>{getHumanReadableDate(notification.date)}</ListItem.Subtitle>
                    <ListItem.Subtitle numberOfLines={2} ellipsizeMode="tail" style={styles.messageText}>
                      {notification.message}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        {selectedNotification && (
          <Modal visible={true} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <BlurView intensity={80} style={styles.blur}>
                <View style={styles.previewContainer}>
                  <Image source={selectedNotification.image} style={styles.fullScreenImage} />
                  <Text style={styles.previewTitle}>{selectedNotification.title}</Text>
                  <Text style={styles.previewDate}>{getHumanReadableDate(selectedNotification.date)}</Text>
                  <Text style={styles.previewMessage}>{selectedNotification.message}</Text>
                  <TouchableOpacity onPress={closeNotificationPreview} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </BlurView>
            </View>
          </Modal>
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
    width: 80,
    height: 80,
    borderRadius: 40, // Make the image circular
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blur: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    width: Dimensions.get('window').width - 40,
    maxHeight: Dimensions.get('window').height - 40,
  },
  fullScreenImage: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    marginBottom: 10,
  },
  previewTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  previewDate: {
    color: '#777',
    marginBottom: 10,
  },
  previewMessage: {
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  shimmerPlaceholder: {
    marginBottom: 10,
    borderRadius: 10,
  },
});

export default NotificationScreen;

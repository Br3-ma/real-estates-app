import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Image, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { ListItem } from 'react-native-elements';
import { BlurView } from 'expo-blur';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { fetchUserInfo } from '../../../controllers/auth/userController';
import { API_BASE_URL } from '../../../confg/config';

const NotificationScreen = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userId = 1;
        const response = await fetch(`${API_BASE_URL}/notify/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        setNotifications(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    };

    fetchNotifications();
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
              <View key={index} style={styles.shimmerItem}>
                <ShimmerPlaceholder style={styles.shimmerImage} />
                <View style={styles.shimmerContent}>
                  <ShimmerPlaceholder style={styles.shimmerTitle} />
                  <ShimmerPlaceholder style={styles.shimmerSubtitle} />
                  <ShimmerPlaceholder style={styles.shimmerMessage} />
                </View>
              </View>
            ))}
          </ScrollView>
        ) : notifications.length > 0 ? (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {notifications.map((notification) => (
              <TouchableOpacity key={notification.id} onPress={() => openNotificationPreview(notification)}>
                <ListItem bottomDivider>
                  {/* <Image source={{ uri: notification.image }} style={styles.image} /> */}
                  <ListItem.Content>
                    <ListItem.Title>{notification.data['title']}</ListItem.Title>
                    <ListItem.Subtitle>{getHumanReadableDate(notification.created_at)}</ListItem.Subtitle>
                    <ListItem.Subtitle numberOfLines={2} ellipsizeMode="tail" style={styles.messageText}>
                      {notification.data['message']}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyContainer}>
            <Image source={require('../../../assets/icon/notify.png')} style={styles.emptyImage} />
            <Text style={styles.emptyText}>No notifications available</Text>
          </View>
        )}
        {selectedNotification && (
          <Modal visible={true} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <BlurView intensity={80} style={styles.blur}>
                <View style={styles.previewContainer}>
                  <Image source={{ uri: selectedNotification.image }} style={styles.fullScreenImage} />
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
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollContent: {
    paddingVertical: 20,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 10,
  },
  messageText: {
    color: '#777',
  },
  shimmerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  shimmerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 10,
  },
  shimmerContent: {
    flex: 1,
  },
  shimmerTitle: {
    height: 20,
    borderRadius: 5,
    marginBottom: 10,
    width: '60%',
  },
  shimmerSubtitle: {
    height: 15,
    borderRadius: 5,
    marginBottom: 10,
    width: '40%',
  },
  shimmerMessage: {
    height: 40,
    borderRadius: 5,
    width: '80%',
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
    borderRadius:20,
  },
  emptyText: {
    fontSize: 20,
    marginBottom: 20,
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
});

export default NotificationScreen;

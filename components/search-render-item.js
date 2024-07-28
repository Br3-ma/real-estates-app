// src/components/RenderItem.js

import React, { useCallback } from 'react';
import { View, Platform, TouchableOpacity, Linking, StyleSheet,Dimensions, Image } from 'react-native';
import { Card, Button, IconButton, Avatar, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Video } from 'expo-av';
import { SERVER_BASE_URL } from '../confg/config';

const { width, height } = Dimensions.get('window');
const PAGE_SIZE = 10;

const RenderItem = ({
  item,
  index,
  favorites,
  toggleFavorite,
  showImageViewer,
  openShareModal,
  openCommentsModal,
  styles,
}) => (
  <Card style={styles.card} key={`${item.id}-${index}`}>
    <Card.Title
      title={item.title || 'No Title'}
      titleStyle={styles.cardTitle}
      subtitle={`K${item.price.toLocaleString()}`}
      subtitleStyle={styles.cardSubtitle}
      left={(props) => <Avatar.Icon {...props} icon="home-outline" style={styles.avatarIcon} color="#ffffff" />}
      right={(props) => (
        <IconButton
          {...props}
          icon={favorites.some(fav => fav.id === item.id) ? 'heart' : 'heart-outline'}
          color={favorites.some(fav => fav.id === item.id) ? '#e74c3c' : '#7f8c8d'}
          size={24}
          onPress={() => toggleFavorite(item)}
        />
      )}
    />
    <Card.Content>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.location}>📍 {item.location}</Text>
      <View style={styles.bedBathContainer}>
        <View style={styles.bedBathIconContainer}>
          <MaterialCommunityIcons name="bed" size={24} color="#3498db" style={styles.bedBathIcon} />
          <Text style={styles.bedBathText}>{item.bedrooms} Bedrooms</Text>
        </View>
        <View style={styles.bedBathIconContainer}>
          <MaterialCommunityIcons name="bathtub" size={24} color="#3498db" style={styles.bedBathIcon} />
          <Text style={styles.bedBathText}>{item.bathrooms} Bathrooms</Text>
        </View>
      </View>
      {item.images && item.images.length > 0 ? (
        <TouchableOpacity onPress={() => showImageViewer(item.images, item.id, item)}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: `${SERVER_BASE_URL}/storage/app/` + item.images[0].path }} style={styles.image} />
            {item.images.length > 1 && (
              <View style={styles.imageCountContainer}>
                <Text style={styles.imageCount}>{`+${item.images.length - 1}`}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ) : item.videos && item.videos.length > 0 ? (
        <TouchableOpacity onPress={() => showImageViewer(item.images, item.id, item)}>
          <Video
            source={{ uri: `${SERVER_BASE_URL}/storage/app/` + item.videos[0].path }}
            style={styles.video}
            resizeMode="cover"
            isLooping
          />
        </TouchableOpacity>
      ) : (
        <Image source={{ uri: `${SERVER_BASE_URL}/storage/app/images/home.webp` }} style={styles.image} />
      )}
    </Card.Content>
    <Card.Actions style={styles.cardActions}>
      <Button icon="phone" mode="contained" onPress={() => Linking.openURL(`tel:26${item.user.phone}`)} style={styles.actionButton} labelStyle={styles.actionButtonLabel}>Call</Button>
      <Button icon="whatsapp" mode="contained" onPress={() => Linking.openURL(`https://wa.me/26${item.user.phone}`)} style={styles.actionButton} labelStyle={styles.actionButtonLabel}>WhatsApp</Button>
      <Button icon="message" mode="contained" onPress={() => Linking.openURL(`sms:${item.user.phone}`)} style={styles.actionButton} labelStyle={styles.actionButtonLabel}>SMS</Button>
      <IconButton icon="share" size={24} onPress={() => openShareModal(item)} />
      <IconButton icon="comment-outline" size={24} onPress={() => openCommentsModal(item.id)} />
    </Card.Actions>
  </Card>
);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F0F4F8',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 5,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    headerText: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1A202C',
      marginLeft: 10,
      letterSpacing: 0.5,
    },
    carousel: {
      paddingVertical: 16,
      paddingHorizontal: 20,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#E2E8F0',
    },
    categoryButton: {
      marginHorizontal: 8,
      borderRadius: 24,
      padding: 2,
      borderWidth: 2,
      borderColor: '#4299E1',
      backgroundColor: '#EBF8FF',
    },
    selectedCategory: {
      backgroundColor: '#4299E1',
    },
    buttonLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: '#4299E1',
    },
    selectedCategoryLabel: {
      color: '#FFFFFF',
    },
    locationButton: {
      marginHorizontal: 8,
      borderRadius: 24,
      padding: 2,
      borderWidth: 2,
      borderColor: '#48BB78',
      backgroundColor: '#F0FFF4',
    },
    selectedLocation: {
      backgroundColor: '#48BB78',
    },
    selectedLocationLabel: {
      color: '#FFFFFF',
    },
    modal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 28,
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    modalTitle: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#1A202C',
      marginBottom: 20,
      letterSpacing: 0.5,
    },
    formGroup: {
      marginBottom: 24,
      width: '100%',
    },
    input: {
      height: 52,
      borderColor: '#CBD5E0',
      borderWidth: 2,
      borderRadius: 12,
      paddingHorizontal: 18,
      marginVertical: 10,
      backgroundColor: '#FFFFFF',
      fontSize: 16,
      color: '#2D3748',
    },
    checkboxContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      marginTop: 8,
    },
    checkbox: {
      marginHorizontal: 10,
      marginVertical: 6,
    },
    card: {
      marginHorizontal: 2,
      marginVertical: 10,
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#2c3e50',
    },
    cardSubtitle: {
      fontSize: 16,
      color: '#27ae60',
      fontWeight: '600',
    },
    bedBathContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginVertical: 14,
    },
    bedBathIconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
      backgroundColor: '#EDF2F7',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    bedBathIcon: {
      marginRight: 8,
      color: '#4A5568',
    },
    imageContainer: {
      marginTop: 16,
      position: 'relative',
      borderRadius: 12,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: height * 0.25,
      borderRadius: 12,
    },
    video: {
      width: '100%',
      height: height * 0.25,
      borderRadius: 12,
    },
    imageCount: {
      position: 'absolute',
      bottom: 12,
      right: 12,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: '#FFFFFF',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      fontSize: 13,
      fontWeight: 'bold',
      overflow: 'hidden',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
      backgroundColor: '#FFFFFF',
    },
    placeholderImage: {
      width: width * 0.4,
      height: width * 0.4,
      marginBottom: 28,
      opacity: 0.7,
    },
    emptyText: {
      fontSize: 20,
      color: '#4A5568',
      marginBottom: 20,
      textAlign: 'center',
      lineHeight: 28,
    },
    listContainer: {
      paddingBottom: 140,
    },
    closeButton: {
      alignSelf: 'flex-end',
      marginBottom: 10,
    },
    // New styles
    labelText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#4A5568',
      marginBottom: 8,
    },
    priceRangeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    priceText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#4299E1',
    },
    slider: {
      width: '100%',
      height: 40,
    },
    chipButton: {
      backgroundColor: '#EDF2F7',
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginRight: 8,
      marginBottom: 8,
    },
    chipButtonSelected: {
      backgroundColor: '#4299E1',
    },
    chipButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#4A5568',
    },
    chipButtonTextSelected: {
      color: '#FFFFFF',
    },
});

export default RenderItem;

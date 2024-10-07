import React from 'react';
import { View, TouchableOpacity, Linking, StyleSheet, Dimensions, Image } from 'react-native';
import { Card, Button, IconButton, Avatar, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Video } from 'expo-av';
import { SERVER_BASE_URL } from '../confg/config';

const { width, height } = Dimensions.get('window');

const RenderItem = ({
  item,
  index,
  favorites,
  toggleFavorite,
  showImageViewer,
  openShareModal,
  openCommentsModal,
}) => (
  <Card style={styles.card} key={`${item.id}-${index}`}>
    <View style={styles.header}>
      <Avatar.Image size={40} source={{ uri: `${SERVER_BASE_URL}/storage/app/users/${item.user.avatar}` }} />
      <View style={styles.headerText}>
        <Text style={styles.username}>{item.user.name}</Text>
        <Text style={styles.location}>📍 {item.location}</Text>
      </View>
      <IconButton
        icon="dots-vertical"
        size={24}
        onPress={() => {}}
      />
    </View>

    <TouchableOpacity onPress={() => showImageViewer(item.images, item)}>
      <View style={styles.mediaContainer}>
        {item.images && item.images.length > 0 ? (
          <Image source={{ uri: `${SERVER_BASE_URL}/storage/app/` + item.images[0].path }} style={styles.media} />
        ) : item.videos && item.videos.length > 0 ? (
          <Video
            source={{ uri: `${SERVER_BASE_URL}/storage/app/` + item.videos[0].path }}
            style={styles.media}
            resizeMode="cover"
            isLooping
          />
        ) : (
          <Image source={{ uri: `${SERVER_BASE_URL}/storage/app/images/home.webp` }} style={styles.media} />
        )}
        <View style={styles.overlayContainer}>
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>K{item.price.toLocaleString()}</Text>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="bed" size={20} color="#FFFFFF" />
              <Text style={styles.infoText}>{item.bedrooms}</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="bathtub" size={20} color="#FFFFFF" />
              <Text style={styles.infoText}>{item.bathrooms}</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="vector-square" size={20} color="#FFFFFF" />
              <Text style={styles.infoText}>{item.squareFootage} sqft</Text>
            </View>
          </View>
          {(item.images?.length > 1 || item.videos?.length > 0) && (
            <View style={styles.mediaCount}>
              <MaterialCommunityIcons name={item.videos?.length > 0 ? "video" : "image-multiple"} size={20} color="#FFFFFF" />
              <Text style={styles.mediaCountText}>{item.images?.length || item.videos?.length}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>

    <Card.Content style={styles.content}>
      <View style={styles.actionIcons}>
        <View style={styles.leftIcons}>
          <IconButton
            icon={favorites.some(fav => fav.id === item.id) ? 'heart' : 'heart-outline'}
            color={favorites.some(fav => fav.id === item.id) ? '#e74c3c' : '#7f8c8d'}
            size={24}
            onPress={() => toggleFavorite(item)}
          />
          <IconButton icon="comment-outline" size={24} onPress={() => openCommentsModal(item.id)} />
          <IconButton icon="share" size={24} onPress={() => openShareModal(item)} />
        </View>
      </View>
      <Text style={styles.title}>{item.title || 'No Title'}</Text>
      <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
    </Card.Content>

    <Card.Actions style={styles.cardActions}>
      <Button icon="phone" mode="contained" onPress={() => Linking.openURL(`tel:26${item.user.phone}`)} style={styles.actionButton} labelStyle={styles.actionButtonLabel}>Call</Button>
      <Button icon="message" mode="contained" onPress={() => Linking.openURL(`sms:${item.user.phone}`)} style={styles.actionButton} labelStyle={styles.actionButtonLabel}>SMS</Button>
      <Button icon="whatsapp" mode="contained" onPress={() => Linking.openURL(`https://wa.me/26${item.user.phone}`)} style={styles.actionButton} labelStyle={styles.actionButtonLabel}>WhatsApp</Button>
    </Card.Actions>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 0,
    elevation: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  location: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  mediaContainer: {
    position: 'relative',
    height: width,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 16,
  },
  priceTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(39, 174, 96, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priceText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    color: '#FFFFFF',
    marginLeft: 4,
    fontSize: 14,
  },
  mediaCount: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  mediaCountText: {
    color: '#FFFFFF',
    marginLeft: 4,
    fontSize: 14,
  },
  content: {
    padding: 12,
  },
  actionIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leftIcons: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#34495e',
  },
  cardActions: {
    justifyContent: 'space-between',
    padding: 12,
  },
  actionButton: {
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonLabel: {
    fontSize: 12,
  },
});

export default RenderItem;
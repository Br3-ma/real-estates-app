import React from 'react';
import { View, TouchableOpacity, Linking, StyleSheet, Dimensions, Image } from 'react-native';
import { Card, Button, IconButton, Avatar, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Video } from 'expo-av';
import { SERVER_BASE_URL } from '../confg/config';

const { width } = Dimensions.get('window');

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
      <TouchableOpacity style={styles.headerLeft}>
        <Avatar.Image
          size={36}
          source={
            item?.user?.avatar
              ? { uri: `${SERVER_BASE_URL}/storage/app/users/${item?.user?.avatar}` }
              : require('../assets/img/user.png')
          }
        />
        <View style={styles.headerText}>
          <Text style={styles.username}>{item?.user?.name}</Text>
          <Text style={styles.location}>📍 {item.location}</Text>
        </View>
      </TouchableOpacity>
    </View>

    <TouchableOpacity activeOpacity={0.95} onPress={() => showImageViewer(item.images, item)}>
      <View style={styles.mediaContainer}>
        {item.images && item.images.length > 0 ? (
          <Image 
            source={{ uri: `${SERVER_BASE_URL}/storage/app/` + item.images[0].path }} 
            style={styles.media}
            resizeMode="cover"
          />
        ) : item.videos && item.videos.length > 0 ? (
          <Video
            source={{ uri: `${SERVER_BASE_URL}/storage/app/` + item.videos[0].path }}
            style={styles.media}
            resizeMode="cover"
            isLooping
            shouldPlay={false}
          />
        ) : (
          <Image 
            source={{ uri: `${SERVER_BASE_URL}/storage/app/images/home.webp` }} 
            style={styles.media}
            resizeMode="cover"
          />
        )}
        
        <View style={styles.overlayContainer}>
          <View style={styles.topOverlay}>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>K{item.price.toLocaleString()}</Text>
            </View>
            {(item.images?.length > 1 || item.videos?.length > 0) && (
              <View style={styles.mediaCount}>
                <MaterialCommunityIcons 
                  name={item.videos?.length > 0 ? "video" : "image-multiple"} 
                  size={18} 
                  color="#FFFFFF" 
                />
                <Text style={styles.mediaCountText}>{item.images?.length || item.videos?.length}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="bed" size={24} color="#463a52" />
              <Text style={styles.infoText}>{item.bedrooms}</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="bathtub" size={24} color="#463a52" />
              <Text style={styles.infoText}>{item.bathrooms}</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="vector-square" size={22} color="#463a52" />
              <Text style={styles.infoText}>{item.squareFootage || 0} Area</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>

    <Card.Content style={styles.content}>
      <View style={styles.actionIcons}>
        <View style={styles.leftIcons}>
          <IconButton
            icon={favorites.some(fav => fav.id === item.id) ? 'heart' : 'heart-outline'}
            color={favorites.some(fav => fav.id === item.id) ? '#e74c3c' : '#7f8c8d'}
            size={22}
            onPress={() => toggleFavorite(item)}
            style={styles.iconButton}
          />
          <IconButton 
            icon="comment-outline" 
            size={22} 
            onPress={() => openCommentsModal(item.id)}
            style={styles.iconButton}
          />
          <IconButton 
            icon="share" 
            size={22} 
            onPress={() => openShareModal(item)}
            style={styles.iconButton}
          />
        </View>
      </View>
      <Text style={styles.title}>{item.title || 'No Title'}</Text>
      <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
        {item.description}
      </Text>
    </Card.Content>

    <View style={styles.cardActions}>
      <Button 
        icon="phone" 
        mode="contained" 
        onPress={() => Linking.openURL(`tel:26${item?.user?.phone}`)} 
        style={[styles.actionButton, styles.callButton]} 
        labelStyle={styles.actionButtonLabel}
        compact
      >
        Call
      </Button>
      <Button 
        icon="message" 
        mode="contained" 
        onPress={() => Linking.openURL(`sms:${item?.user?.phone}`)} 
        style={[styles.actionButton, styles.smsButton]} 
        labelStyle={styles.actionButtonLabel}
        compact
      >
        SMS
      </Button>
      <Button 
        icon="whatsapp" 
        mode="contained" 
        onPress={() => Linking.openURL(`https://wa.me/26${item?.user?.phone}`)} 
        style={[styles.actionButton, styles.whatsappButton]} 
        labelStyle={styles.actionButtonLabel}
        compact
      >
        WhatsApp
      </Button>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: 10,
    flex: 1,
  },
  username: {
    fontWeight: '600',
    fontSize: 15,
    color: '#333',
  },
  location: {
    fontSize: 13,
    color: '#666',
    marginTop: 1,
  },
  mediaContainer: {
    width: width,
    height: width * 0.8,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 12,
  },
  topOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  priceTag: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  priceText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  infoText: {
    color: '#333',
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '500',
  },
  mediaCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  mediaCountText: {
    color: '#FFFFFF',
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
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
    marginLeft: -8,
  },
  iconButton: {
    margin: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopWidth: 0.5,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 6,
    height: 36,
  },
  actionButtonLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  callButton: {
    backgroundColor: '#2ecc71',
  },
  smsButton: {
    backgroundColor: '#3498db',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
});

export default RenderItem;
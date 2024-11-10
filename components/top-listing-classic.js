import React, { useCallback, useState } from 'react';
import { ActivityIndicator, View, Text, ScrollView, StyleSheet, TouchableOpacity, ImageBackground,SafeAreaView } from 'react-native';
import { Icon, Avatar } from 'react-native-elements';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
import { SERVER_BASE_URL } from '../confg/config';
import { formatDistanceToNow } from 'date-fns';

const TopListingClassic = ({ properties, loading, onPress }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState({});

  const handleScrollEnd = useCallback((itemId, event) => {
    const slideIndex = Math.floor(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
    setCurrentMediaIndex(prevState => ({
      ...prevState,
      [itemId]: slideIndex,
    }));
  }, []);

  const renderItem = useCallback(({ item, index }) => {
    const totalMediaCount = item.images.length + item.videos.length;
    const currentIndex = currentMediaIndex[item.id] || 0;

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.itemContainer}
        onPress={() => onPress(item)}
      >
        <View style={styles.userInfoContainer}>
        <Avatar
            rounded
            source={{
              uri: `${SERVER_BASE_URL}/storage/app/${item?.user?.picture}`
            }}
            placeholderStyle={{ backgroundColor: '#e1e4e8' }}
            PlaceholderContent={<ActivityIndicator />}
            size="small"
          />
          <View style={styles.userTextContainer}>
            <Text style={styles.userName}>{item?.user?.name}</Text>
            {item?.user?.location !== 'Not set' && (
              <Text style={styles.userLocation}>{item?.user?.location}</Text>
            )}
          </View>
        </View>

        <View style={styles.mediaContainer}>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => handleScrollEnd(item.id, event)}
          >
            {item.images.map((img, imgIndex) => (
              <ImageBackground
                key={`image-${imgIndex}`}
                source={{ uri: `${SERVER_BASE_URL}/storage/app/${img.path}` }}
                style={styles.mediaItem}
                imageStyle={styles.mediaItemStyle}
              >
                {item.hot && (
                  <View style={styles.hotRibbon}>
                    <Text style={styles.hotRibbonText}>NEW</Text>
                  </View>
                )}
              </ImageBackground>
            ))}
            {item.videos.map((video, vidIndex) => (
              <TouchableOpacity key={`video-${vidIndex}`} style={styles.mediaItem}>
                <ImageBackground
                  source={{ uri: `${SERVER_BASE_URL}/storage/app/${video.path}` }}
                  style={styles.mediaItem}
                  imageStyle={styles.mediaItemStyle}
                >
                  <Icon name="play-circle" type="font-awesome-5" size={40} color="#fff" />
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.mediaIndicatorContainer}>
            {[...Array(totalMediaCount)].map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.mediaIndicator, 
                  i === currentIndex ? styles.mediaIndicatorActive : null
                ]} 
              />
            ))}
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.price}>K{parseFloat(item.price).toLocaleString()}</Text>
          <Text style={styles.address} numberOfLines={1}>{item.location}</Text>
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Icon name="bed" type="font-awesome-5" size={12} color="#666" />
              <Text style={styles.detailText}>{item.bedrooms}</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="bath" type="font-awesome-5" size={12} color="#666" />
              <Text style={styles.detailText}>{item.bathrooms}</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="vector-square" type="font-awesome-5" size={12} color="#666" />
              <Text style={styles.detailText}>{item.area} sqft</Text>
            </View>
          </View>
          <Text style={styles.propertyType}>{item.property_type}</Text>
          <Text style={styles.timePosted}>
            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, [currentMediaIndex, handleScrollEnd, onPress]);

  const renderPlaceholders = useCallback(() => (
    Array(3).fill().map((_, index) => (
      <ShimmerPlaceholder
        key={index}
        LinearGradient={LinearGradient}
        style={styles.placeholder}
      />
    ))
  ), []);

  // Conditional rendering based on properties length
  if (!properties || properties.length === 0) {
    return null; // Don't render the component if properties are empty
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Top Listings</Text>
      <SafeAreaView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {loading
            ? renderPlaceholders()
            : properties.slice(0, 10).map((item, index) => renderItem({ item, index }))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 12,
    color: '#333',
  },
  itemContainer: {
    width: 280,
    marginRight: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  userTextContainer: {
    marginLeft: 8,
  },
  userName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  userLocation: {
    fontSize: 10,
    color: '#666',
  },
  mediaContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  mediaItem: {
    width: 280,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaItemStyle: {
    resizeMode: 'cover',
  },
  mediaIndicatorContainer: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  mediaIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 2,
  },
  mediaIndicatorActive: {
    backgroundColor: '#fff',
  },
  hotRibbon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF385C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  hotRibbonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#60279C',
  },
  address: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  propertyType: {
    marginTop: 8,
    fontSize: 12,
    color: '#60279C',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  timePosted: {
    marginTop: 4,
    fontSize: 10,
    color: '#999',
  },
  placeholder: {
    width: 280,
    height: 380,
    borderRadius: 8,
    marginRight: 16,
  },
});

export default React.memo(TopListingClassic);

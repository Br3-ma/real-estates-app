import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, Modal, Platform, StatusBar, Keyboard, TextInput, ImageBackground, Animated, Easing } from 'react-native';
import { Card, Button, Icon, SearchBar, ButtonGroup, Avatar } from 'react-native-elements';
import { fetchUserInfo } from '../controllers/auth/userController';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import moment from 'moment';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [commentSectionHeight, setCommentSectionHeight] = useState(new Animated.Value(height * 0.2));
  const [isImageShrunk, setIsImageShrunk] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const scrollViewRef = useRef();
  const fetchIntervalRef = useRef(null); // Reference for the fetch interval

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://192.168.43.63/realestserver/est-server/api/property-posts');
        setProperties(response.data);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      const user = await fetchUserInfo();
      setUserInfo(user);
    };

    fetchUser();
    fetchProperties();

    return () => {
      terminateFetchInterval();
    };
  }, []);

  const terminateFetchInterval = () => {
    if (fetchIntervalRef.current !== null) {
      clearInterval(fetchIntervalRef.current);
      fetchIntervalRef.current = null;
    }
  };

  const updateSearch = (search) => {
    setSearch(search);
  };

  const buttons = ['Buy', 'Rent', 'Projects'];
  const updateIndex = (selectedIndex) => {
    setSelectedIndex(selectedIndex);
  };

  const showImageViewer = async (images, itemId, property) => {
    setCurrentImages(images);
    setSelectedProperty(property);
    setImageViewVisible(true);

    try {
      const response = await axios.get(`http://192.168.43.63/realestserver/est-server/api/post-comments/${itemId}`);
      setMessages(response.data);

      // Clear any existing interval before setting a new one
      terminateFetchInterval();

      // Set up continuous fetching of messages every 4 seconds
      fetchIntervalRef.current = setInterval(async () => {
        const newResponse = await axios.get(`http://192.168.43.63/realestserver/est-server/api/post-comments/${itemId}`);
        setMessages(newResponse.data);
      }, 4000);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      await axios.post('http://192.168.43.63/realestserver/est-server/api/comment-reply', {
        post_id: selectedProperty.id,
        user_id: userInfo.user.id,
        content: newMessage,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }

    setNewMessage('');
    Keyboard.dismiss();

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const toggleImageSize = () => {
    setIsImageShrunk(!isImageShrunk);
    Animated.timing(commentSectionHeight, {
      toValue: isImageShrunk ? height * 0.3 : height * 0.5,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const getImageStyle = (imageCount) => ({
    width: imageCount === 1 ? width : width / Math.min(imageCount, 3),
    height: 250,
    resizeMode: 'cover',
    marginRight: 5,
  });

  const renderPropertyItem = ({ item }) => (
    <Card containerStyle={styles.fullWidthCard}>
      <Card.Title>{item.title}</Card.Title>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {item.images.map((img, index) => (
          <TouchableOpacity key={index} onPress={() => showImageViewer(item.images, item.id, item)}>
            <Image source={{ uri: img }} style={getImageStyle(item.images.length)} />
          </TouchableOpacity>
        ))}
        <View style={styles.overlayStyle}>
          <Text style={styles.ribbonTag}>{`Posted ${moment(item.created_at).fromNow()}`}</Text>
        </View>
      </ScrollView>
      <View>
        <View style={styles.priceLocationRow}>
          <Text style={styles.priceText}>K{item.price}</Text>

          <TouchableOpacity onPress={() => navigation.navigate('MapScreen', { location: item.location })}>
            <Text>
              <MaterialIcons name="place" size={20} color="#000" />
              {item.location}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.iconRow}>
          <View style={styles.iconTextContainer}>
            <MaterialIcons name="hotel" size={20} color="#000" />
            <Text style={styles.iconText}>{item.bedrooms} Beds</Text>
          </View>
          <View style={styles.iconTextContainer}>
            <MaterialIcons name="bathtub" size={20} color="#000" />
            <Text style={styles.iconText}>{item.bathrooms} Baths</Text>
          </View>
          <View style={styles.iconTextContainer}>
            <MaterialIcons name="aspect-ratio" size={20} color="#000" />
            <Text style={styles.iconText}>{item.area} sqft</Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonRow}>
        <Button type="clear" icon={<MaterialIcons name="favorite-border" size={24} color="black" />} />
        <Button type="clear" icon={<MaterialIcons name="comment" size={24} color="black" />} />
        <Button type="clear" icon={<MaterialIcons name="share" size={24} color="black" />} />
      </View>
    </Card>
  );

  const timeElapsed = (date) => {
    return moment(date).fromNow();
  };

  const renderMessage = (message) => (
    <View key={message.id} style={styles.messageContainer}>
      <Avatar
        rounded
        source={{ uri: message?.user?.picture }}
        size="small"
        containerStyle={{ marginRight: 10 }}
      />
      <View style={styles.messageContent}>
        <Text style={styles.messageTextTitle}>{message.user?.name}</Text>
        <Text style={styles.messageText}>{message.content}</Text>
        <Text style={styles.messageTime}>{timeElapsed(message.created_at)}</Text>
        <TouchableOpacity onPress={() => console.log('Reply to:', message.user.name)}>
          <Text style={styles.replyLink}>Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderImageViewerModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={isImageViewVisible}
        onRequestClose={() => {
          setImageViewVisible(false);
          setSelectedProperty(null);
          terminateFetchInterval();
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableOpacity style={styles.closeButton} onPress={() => {
            setImageViewVisible(false);
            setSelectedProperty(null);
            terminateFetchInterval();
          }}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <ScrollView style={styles.topImageContiner} horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {currentImages.map((image, index) => (
              <View key={index} style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 1 }}>
                <ImageBackground
                  source={{ uri: image }}
                  style={{ width: width, height: isImageShrunk ? height * 0.1 : height * 0.6 }}
                />
                {selectedProperty && (
                  <View style={styles.overlayDetails}>
                    <Text style={styles.overlayText}>{selectedProperty.title} - K{selectedProperty.price}</Text>
                    <Text style={styles.overlayTextSmall}>{selectedProperty.description}</Text>
                    <View style={styles.overlayIconRow}>
                      <Icon name="bed" type="material" size={15} color="#fff" />
                      <Text style={styles.overlayTextSmall}>{selectedProperty?.beds} Beds</Text>
                      <Icon name="bathtub" type="material" size={15} color="#fff" />
                      <Text style={styles.overlayTextSmall}>{selectedProperty.baths} Baths</Text>
                      <Icon name="square-foot" type="material" size={15} color="#fff" />
                      <Text style={styles.overlayTextSmall}>{selectedProperty.area} sqft</Text>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.toggleButton} onPress={toggleImageSize}>
            <MaterialIcons name={isImageShrunk ? 'expand-more' : 'expand-less'} size={24} color="#000" />
          </TouchableOpacity>
          <Animated.View style={[styles.commentSection, { height: commentSectionHeight }]}>
            <ScrollView ref={scrollViewRef}>
              {messages.map((message) => renderMessage(message))}
            </ScrollView>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Add a comment..."
                multiline
              />
              <TouchableOpacity onPress={sendMessage}>
                <MaterialIcons name="send" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SearchBar
        placeholder="Search properties..."
        onChangeText={updateSearch}
        value={search}
        platform={Platform.OS}
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInput}
      />
      <ButtonGroup
        buttons={buttons}
        selectedIndex={selectedIndex}
        onPress={updateIndex}
        containerStyle={styles.buttonGroupContainer}
        selectedButtonStyle={styles.selectedButton}
      />
      <ScrollView>
        {loading ? (
          <View style={styles.loader}>
            {[1, 2, 3].map((item) => (
              <ShimmerPlaceholder key={item} style={styles.placeholder} />
            ))}
          </View>
        ) : (
          <View>
          {properties.map((property) => (
            <View key={property.id}>{renderPropertyItem({ item: property })}</View>
          ))}
        </View>
        )}
      </ScrollView>
      {renderImageViewerModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchBarInput: {
    backgroundColor: '#ececec',
  },
  buttonGroupContainer: {
    marginBottom: 10,
  },
  selectedButton: {
    backgroundColor: '#6c63ff',
  },
  fullWidthCard: {
    width: '100%',
  },
  priceLocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    marginLeft: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  closeButton: {
    marginLeft: 10,
    marginTop: 10,
  },
  topImageContiner: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  overlayDetails: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 5,
  },
  overlayIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlayTextSmall: {
    color: '#fff',
    fontSize: 12,
  },
  toggleButton: {
    alignItems: 'center',
    marginVertical: 5,
  },
  commentSection: {
    backgroundColor: '#f1f1f1',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  messageContent: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  messageText: {
    fontSize: 14,
    marginBottom: 5,
  },
  messageTextTitle: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold',
    color: 'purple'
  },
  messageTime: {
    fontSize: 12,
    color: '#888',
  },
  replyLink: {
    fontSize: 12,
    color: '#007aff',
    marginTop: 5,
  },
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: '90%',
    height: 200,
    marginBottom: 10,
  },
  overlayStyle: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 5,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  ribbonTag: {
    color: '#fff',
    fontSize: 12,
  },
});

export default HomeScreen;

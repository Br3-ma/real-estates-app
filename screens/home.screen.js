import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, Modal, Platform, StatusBar, Keyboard, TextInput, ImageBackground, Animated, Easing } from 'react-native';
import { Card, Button, Icon, SearchBar, ButtonGroup, Avatar } from 'react-native-elements';
import { fetchUserInfo } from '../controllers/auth/userController';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import moment from 'moment';
import axios from 'axios';
import io from 'socket.io-client'; // Import Socket.io client library

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
  const socket = useRef(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost/realestserver/est-server/api/property-posts');
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
  }, []);

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

      // Initialize Socket.io connection
      socket.current = io('http://192.168.43.63/realestserver/est-server');

      socket.current.on('connect', () => {
        console.log('Socket.io connected');
      });

      socket.current.on('comment.created', (data) => {
        console.log('Received new comment:', data);
        setMessages((prevMessages) => [...prevMessages, data.comment]);
      });

      socket.current.on('error', (error) => {
        console.error('Socket.io error:', error);
      });

      socket.current.on('disconnect', () => {
        console.log('Socket.io disconnected');
      });

    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup Socket.io connection when the component unmounts
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);


  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      const response = await axios.post('http://192.168.43.63/realestserver/est-server/api/comment-reply', {
        post_id: selectedProperty.id,
        user_id: userInfo.user.id,
        content: newMessage,
      });

      // const updatedMessages = await axios.get(`http://192.168.43.63/realestserver/est-server/api/post-comments/${selectedProperty.id}`);
      // setMessages(updatedMessages.data);
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
      toValue: isImageShrunk ? height * 0.2 : height * 0.5,
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
          <Text style={styles.priceText}>${item.price}</Text>

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
        <Text style={styles.messageText}>{message.user?.name}</Text>
        <Text style={styles.messageText}>{message.content}</Text>
        <Text style={styles.messageTime}>{timeElapsed(message.created_at)}</Text>
        <TouchableOpacity onPress={() => console.log('Reply to:', message.user.name)}><Text style={styles.replyLink}>Reply</Text></TouchableOpacity>
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
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableOpacity style={styles.closeButton} onPress={() => {
            setImageViewVisible(false);
          }}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <ScrollView style={styles.topImageContiner} horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {currentImages.map((image, index) => (
              <View key={index} style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 1 }}>
                <ImageBackground
                  source={{ uri: image }}
                  style={{ width: width, height: isImageShrunk ? height * 0.25 : height * 0.5 }}                />
                  {selectedProperty && (
                    <View style={styles.overlayDetails}>
                      <Text style={styles.overlayText}>{selectedProperty.name} - ${selectedProperty.price}</Text>
                      <Text style={styles.overlayTextSmall}>{selectedProperty.description}</Text>
                      <View style={styles.overlayIconRow}>
                        <Icon name="bed" type="material" size={15} color="#fff" />
                        <Text style={styles.overlayTextSmall}>{selectedProperty.bedrooms} Beds</Text>
                        <Icon name="bathtub" type="material" size={15} color="#fff" />
                        <Text style={styles.overlayTextSmall}>{selectedProperty.bathrooms} Baths</Text>
                        <Icon name="square-foot" type="material" size={15} color="#fff" />
                        <Text style={styles.overlayTextSmall}>{selectedProperty.area} sqft</Text>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
  
            <TouchableOpacity style={styles.toggleButton} onPress={toggleImageSize}>
              <MaterialIcons name={isImageShrunk ? "expand-less" : "expand-more"} size={32} color="#000" />
            </TouchableOpacity>
  
            <Animated.View style={[styles.commentSection, { height: commentSectionHeight }]}>
              <ScrollView style={styles.commentsContainer} onContentSizeChange={() => {
                Animated.timing(commentSectionHeight, {
                  toValue: isImageShrunk ? height * 0.6 : height * 0.1,
                  duration: 300,
                  useNativeDriver: false,
                }).start();
              }}>
                {messages.map(renderMessage)}
              </ScrollView>
              <View style={styles.messageInputContainer}>
                <TextInput
                  style={styles.messageInput}
                  placeholder="Type a message..."
                  value={newMessage}
                  onChangeText={setNewMessage}
                />
                <TouchableOpacity onPress={sendMessage}>
                  <MaterialIcons name="send" size={24} color="#2096F3" />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </SafeAreaView>
        </Modal>
      );
    };
  
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <SearchBar
          placeholder="Type Here..."
          onChangeText={updateSearch}
          value={search}
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInputContainer}
          lightTheme
        />
        <ButtonGroup
          onPress={updateIndex}
          selectedIndex={selectedIndex}
          buttons={buttons}
          containerStyle={styles.buttonGroupContainer}
          selectedButtonStyle={styles.selectedButtonStyle}
        />
        <ScrollView style={styles.container} ref={scrollViewRef}>
          {loading ? (
            <ShimmerPlaceholder style={{ height: 200, marginBottom: 10 }} />
          ) : (
            properties.map((property) => renderPropertyItem({ item: property }))
          )}
        </ScrollView>
        {renderImageViewerModal()}
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    searchContainer: {
      backgroundColor: '#fff',
      borderBottomColor: 'transparent',
      borderTopColor: 'transparent',
    },
    searchInputContainer: {
      backgroundColor: '#e0e0e0',
      borderRadius: 10,
    },
    buttonGroupContainer: {
      marginBottom: 10,
    },
    selectedButtonStyle: {
      backgroundColor: '#2096F3',
    },
    fullWidthCard: {
      width: width * 0.95,
      alignSelf: 'center',
      borderRadius: 10,
    },
    priceLocationRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 10,
    },
    priceText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    iconRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 10,
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
      marginVertical: 10,
    },
    overlayStyle: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 5,
      borderRadius: 5,
    },
    ribbonTag: {
      color: '#fff',
      fontSize: 12,
    },
    messageInput: {
      backgroundColor: '#fff',
      padding: 10,
      borderRadius: 20,
      margin: 10,
    },
    safeAreaContainer: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    closeButton: {
      padding: 10,
    },
    topImageContiner: {
      flex: 1,
    },
    commentSection: {
      backgroundColor: '#fff',
      overflow: 'hidden',
    },
    commentsContainer: {
      flex: 1,
      backgroundColor: '#FFF',
    },
    messageContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginVertical: 10,
      padding: 10,
      marginTop: 5,
    },
    messageContent: {
      flex: 1,
    },
    messageText: {
      marginVertical: 5,
    },
    messageTitle: {
      fontSize: 13,
      fontWeight: 'bold',
    },
    messageTime: {
      color: 'gray',
      fontSize: 12,
    },
    messageInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: '#ccc',
      backgroundColor: '#fff',
    },
    messageInput: {
      flex: 1,
      padding: 10,
      borderRadius: 20,
      backgroundColor: '#f0f0f0',
      marginRight: 10,
    },
    replyLink: {
      color: '#2096F3',
    },
    overlayDetails: {
      position: 'absolute',
      bottom: 30,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      width: '100%',
      padding: 10,
    },
    overlayText: {
      fontSize: 18,
      color: '#fff',
      fontWeight: 'bold',
      marginBottom: 5,
    },
    overlayTextSmall: {
      fontSize: 14,
      color: '#fff',
      marginLeft: 5,
    },
    overlayIconRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    toggleButton: {
      alignSelf: 'center',
      marginVertical: 10,
    },
  });
  
  export default HomeScreen;
  

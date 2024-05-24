import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, Modal, Platform, StatusBar, Keyboard, TextInput, ImageBackground } from 'react-native';
import { Card, Button, Icon, SearchBar, ButtonGroup, Avatar } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import moment from 'moment';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollViewRef = useRef();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));  // Simulating fetch delay
        setProperties([
          { id: '1', name: 'Cozy Cottage', images: [require('../assets/house1.jpg'), require('../assets/house2.jpeg'), require('../assets/house3.jpg')], price: '250,000', location: 'Suburb', beds: 3, baths: 2, area: 1200 },
          { id: '2', name: 'Luxury Villa', images: [require('../assets/house1.jpg'), require('../assets/house3.jpg')], price: '950,000', location: 'City Center', beds: 5, baths: 4, area: 3500 },
          { id: '3', name: '2 Bedroom House in Kalundu', images: [require('../assets/house3.jpg')], price: '950,000', location: 'City Center', beds: 5, baths: 4, area: 3500 },
        ]);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchMessages = async () => {
      try {
        // Simulating fetch delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        const previousMessages = [
          {
            _id: 1,
            text: 'Hello! Is this property still available?',
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'Buyer',
              avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsPZBbkX2hmZKVaKjIYvpTNftoabiOLZwMjXJ50PkFdw&s',
            },
          },
          {
            _id: 2,
            text: 'Yes, it is available.',
            createdAt: new Date(),
            user: {
              _id: 1,
              name: 'Agent',
              avatar: 'https://placeimg.com/140/140/any',
            },
          },
          {
            _id: 3,
            text: 'Call 09328383992.',
            createdAt: new Date(),
            user: {
              _id: 1,
              name: 'Banda',
              avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsPZBbkX2hmZKVaKjIYvpTNftoabiOLZwMjXJ50PkFdw&s',
            },
          },
          {
            _id: 4,
            text: 'Alright, thank you. I will let you know once I get back home from work, probably around 20:00...please dont give it to anyone',
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'Agent',
              avatar: 'https://placeimg.com/140/140/any',
            },
          },
        ];

        setMessages(previousMessages);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        // Log the updated state
        console.log(messages);
        console.log(properties);
      }
    };

    fetchProperties();
    fetchMessages();
  }, []);

  const updateSearch = (search) => {
    setSearch(search);
  };

  const buttons = ['Buy', 'Rent', 'Projects'];
  const updateIndex = (selectedIndex) => {
    setSelectedIndex(selectedIndex);
  };

  const showImageViewer = (images) => {
    setCurrentImages(images);
    setImageViewVisible(true);
  };

  const sendMessage = () => {
    if (newMessage.trim() === '') return;
    const newMsg = {
      _id: messages.length + 1,
      text: newMessage,
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'Agent',
        avatar: 'https://placeimg.com/140/140/any'
      },
    };
    setMessages([...messages, newMsg]);
    setNewMessage('');
    Keyboard.dismiss();

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const getImageStyle = (imageCount) => ({
    width: imageCount === 1 ? width : width / Math.min(imageCount, 3),
    height: 250,
    resizeMode: 'cover',
    marginRight: 5,
  });

  const renderPropertyItem = ({ item }) => (
    <Card containerStyle={styles.fullWidthCard}>
      <Card.Title>{item.name}</Card.Title>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {item.images.map((img, index) => (
          <TouchableOpacity key={index} onPress={() => showImageViewer(item.images)}>
            <Image source={img} style={getImageStyle(item.images.length)} />
          </TouchableOpacity>
        ))}
        <View style={styles.overlayStyle}>
          <Text style={styles.ribbonTag}>{`Posted 2 hours ago`}</Text>
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
            <Text style={styles.iconText}>{item.beds} Beds</Text>
          </View>
          <View style={styles.iconTextContainer}>
            <MaterialIcons name="bathtub" size={20} color="#000" />
            <Text style={styles.iconText}>{item.baths} Baths</Text>
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
    <View key={message._id} style={styles.messageContainer}>
      <Avatar
        rounded
        source={{ uri: message.user.avatar }}
        size="small"
        containerStyle={{ marginRight: 10 }}
      />
      <View style={styles.messageContent}>
        <Text style={styles.messageUserName}>{message.user.name}</Text>
        <Text style={styles.messageText}>{message.text}</Text>
        <Text style={styles.messageTime}>{timeElapsed(message.createdAt)}</Text>
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
        onRequestClose={() => setImageViewVisible(false)}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setImageViewVisible(false)}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <ScrollView style={styles.topImageContiner} horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {currentImages.map((image, index) => (
              <View key={index} style={{ borderRadius: 20, overflow: 'hidden', marginHorizontal: 10 }}>
                <ImageBackground source={image} style={{ width, height: height * 0.4, resizeMode: 'cover' }}>
                  <View style={styles.overlayDetails}>
                    <Text style={styles.overlayText}>{properties[selectedIndex]?.name} - ${properties[selectedIndex]?.price}</Text>
                    <View style={styles.overlayIconRow}>
                      <Icon name="bed" type="material" size={15} color="#fff" />
                      <Text style={styles.overlayTextSmall}>{properties[selectedIndex]?.beds} Beds</Text>
                      <Icon name="bathtub" type="material" size={15} color="#fff" />
                      <Text style={styles.overlayTextSmall}>{properties[selectedIndex]?.baths} Baths</Text>
                      <Icon name="square-foot" type="material" size={15} color="#fff" />
                      <Text style={styles.overlayTextSmall}>{properties[selectedIndex]?.area} sqft</Text>
                    </View>
                  </View>
                </ImageBackground>
              </View>
            ))}
          </ScrollView>
          
          {/* Comment Section */}
          <View style={styles.commentSection}>
            <ScrollView ref={scrollViewRef} style={styles.commentsContainer}>
              {messages.map(renderMessage)}
            </ScrollView>
            <View style={styles.messageInputContainer}>
              <TextInput
                placeholder="Type your comment..."
                value={newMessage}
                onChangeText={(text) => setNewMessage(text)}
                style={styles.messageInput}
                onSubmitEditing={sendMessage}
                blurOnSubmit={false}
              />
              <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                <MaterialIcons name="send" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <SearchBar placeholder="Type Here..." onChangeText={updateSearch} value={search} />
        <ButtonGroup buttons={buttons} selectedIndex={selectedIndex} onPress={updateIndex} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {loading ? (
          <ShimmerPlaceholder
            style={styles.shimmerPlaceholder}
            autoRun={true}
            visible={!loading}
          />
        ) : (
          properties.map((property) => (
            <React.Fragment key={property.id}>
              {renderPropertyItem({ item: property })}
            </React.Fragment>
          ))
        )}
      </ScrollView>
      {renderImageViewerModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  fullWidthCard: {
    width: width - 20,
    margin: 10,
    padding: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  shimmerPlaceholder: {
    height: 200,
    width: '100%',
    marginBottom: 20,
  },
  overlayDetails: {
    position: 'absolute',
    bottom: 60,  // Adjusted to move slightly upwards
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
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
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    marginLeft: 5,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  overlayStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  },
  ribbonTag: {
    color: 'white',
    fontWeight: 'bold',
  },
  priceLocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  priceText: {
    fontSize: 18,
    color: '#4169E1',
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 10,
    alignSelf: 'flex-start',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  messageContent: {
    flex: 1,
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  messageUserName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageText: {
    color: '#333',
  },
  messageTime: {
    marginTop: 5,
    color: '#999',
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
  sendButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 50,
  },
  commentSection: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    height: height * 0.6,
    overflow: 'hidden',
    marginTop: -150,
    borderRadius: 50,
  },
  commentsContainer: {
    flex: 1,
    bottom:0,
    top:0,
    backgroundColor:'#fff', //orange
  },
  topImageContiner:{
    height: height * 0.1,
  },
  replyLink: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});

export default HomeScreen;

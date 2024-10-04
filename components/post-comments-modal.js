import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, View, Text, FlatList, SafeAreaView, TouchableOpacity, TextInput, Keyboard, ActivityIndicator, Image, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import moment from 'moment';
import axios from 'axios';
import { API_BASE_URL, SERVER_BASE_URL } from '../confg/config';
import { fetchUserInfo } from '../controllers/auth/userController';
import { throttle } from 'lodash';

const { width } = Dimensions.get('window');
const placeholderImage = 'https://cdn.vectorstock.com/i/500p/90/02/profile-photo-placeholder-icon-design-vector-43189002.jpg';

const CommentsModal = ({ visible, postId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const flatListRef = useRef(null);
  const fetchIntervalRef = useRef(null);
  const backoffTimeRef = useRef(4000);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/post-comments/${postId}`);
        setMessages(response.data);
        setLoading(false);

        terminateFetchInterval();
        startFetchInterval(postId);

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
        setLoading(false);
        backoffTimeRef.current = Math.min(backoffTimeRef.current * 2, 60000);
      }
    };

    const fetchUserData = async () => {
      try {
        const user = await fetchUserInfo();
        setUserInfo(user);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    if (visible) {
      fetchComments();
      fetchUserData();
    }

    return () => {
      terminateFetchInterval();
    };
  }, [visible, postId]);

  const terminateFetchInterval = useCallback(() => {
    if (fetchIntervalRef.current !== null) {
      clearInterval(fetchIntervalRef.current);
      fetchIntervalRef.current = null;
    }
  }, []);

  const startFetchInterval = useCallback(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/post-comments/${postId}`);
        setMessages(response.data);
        backoffTimeRef.current = 4000;
      } catch (error) {
        console.error('Failed to fetch comments:', error);
        backoffTimeRef.current = Math.min(backoffTimeRef.current * 2, 60000);
      }
    };

    fetchIntervalRef.current = setInterval(fetchComments, backoffTimeRef.current);
    fetchComments();
  }, [postId]);

  const sendMessage = useCallback(async () => {
    if (newMessage.trim() === '' || !userInfo) return;

    try {
      await axios.post(`${API_BASE_URL}/comment-reply`, {
        post_id: postId,
        user_id: userInfo.user.id,
        content: newMessage,
      });

      setNewMessage('');
      Keyboard.dismiss();

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [newMessage, postId, userInfo]);

  const throttledSendMessage = useCallback(throttle(sendMessage, 2000), [sendMessage]);

  const timeElapsed = (createdAt) => {
    return moment(createdAt).fromNow();
  };

  const renderMessage = useCallback(({ item: message }) => (
    <View style={styles.messageContainer}>
      <Image
        source={{ uri: `${SERVER_BASE_URL}/storage/app/${message?.user?.picture}` || placeholderImage }}
        style={styles.avatar}
        defaultSource={{ uri: placeholderImage }}
      />
      <View style={styles.messageContent}>
        <Text style={styles.messageTextTitle}>{message.user?.name}</Text>
        <Text style={styles.messageText}>{message.content}</Text>
        <View style={styles.messageFooter}>
          <Text style={styles.messageTime}>{timeElapsed(message.created_at)}</Text>
          <TouchableOpacity onPress={() => console.log('Reply to:', message.user.name)}>
            {/* <Text style={styles.replyLink}>Reply</Text> */}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ), []);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Comments</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.messageList}
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Add a comment..."
            multiline
          />
          <TouchableOpacity onPress={throttledSendMessage} style={styles.sendButton}>
            <MaterialIcons name="send" size={24} color="#3897f0" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageList: {
    padding: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageContent: {
    flex: 1,
  },
  messageTextTitle: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 14,
    marginBottom: 4,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageTime: {
    fontSize: 12,
    color: '#8e8e8e',
    marginRight: 10,
  },
  replyLink: {
    fontSize: 12,
    color: '#8e8e8e',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    padding: 5,
  },
});

export default CommentsModal;
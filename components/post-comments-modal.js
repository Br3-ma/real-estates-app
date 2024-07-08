import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Keyboard, ActivityIndicator, Image } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import moment from 'moment';
import axios from 'axios';
import { API_BASE_URL, SERVER_BASE_URL } from '../confg/config'; // Ensure this path is correct
import styles from '../assets/css/home.css'; // Adjust path as per your project structure
import { fetchUserInfo } from '../controllers/auth/userController';
import { throttle } from 'lodash';

const placeholderImage = 'https://cdn.vectorstock.com/i/500p/90/02/profile-photo-placeholder-icon-design-vector-43189002.jpg';

const CommentsModal = ({ visible, postId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state for better UX

  const scrollViewRef = useRef(null); // useRef for ScrollView
  const fetchIntervalRef = useRef(null); // useRef for fetch interval
  const backoffTimeRef = useRef(4000); // initial interval time in milliseconds

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true); // Set loading state while fetching
        const response = await axios.get(`${API_BASE_URL}/post-comments/${postId}`);
        setMessages(response.data);
        setLoading(false); // Clear loading state on successful fetch

        terminateFetchInterval();
        startFetchInterval(postId);

        // Scroll to bottom after fetching comments
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
        setLoading(false); // Clear loading state on error
        backoffTimeRef.current = Math.min(backoffTimeRef.current * 2, 60000); // exponential backoff up to 60s
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
        backoffTimeRef.current = 4000; // reset backoff time on success
      } catch (error) {
        console.error('Failed to fetch comments:', error);
        backoffTimeRef.current = Math.min(backoffTimeRef.current * 2, 60000); // exponential backoff up to 60s
      }
    };

    fetchIntervalRef.current = setInterval(fetchComments, backoffTimeRef.current);
    fetchComments(); // Initial fetch
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
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [newMessage, postId, userInfo]);

  // limit the number of times the sendMessage function can be called.
  const throttledSendMessage = useCallback(throttle(sendMessage, 2000), [sendMessage]);

  const timeElapsed = (createdAt) => {
    return moment(createdAt).fromNow();
  };

  const renderMessage = useCallback((message) => (
    <View key={message.id} style={styles.messageContainer}>
      <Image
        source={{ uri: `${SERVER_BASE_URL}/storage/app/${message?.user?.picture}` || placeholderImage }}
        style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
        defaultSource={{ uri: placeholderImage }}
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
  ), []);

  const renderCommentsModal = useCallback(() => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
          <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }}>
            {messages.map((message) => renderMessage(message))}
          </ScrollView>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Add a comment..."
            multiline
          />
          <TouchableOpacity onPress={throttledSendMessage}>
            <MaterialIcons name="send" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  ), [visible, loading, messages, newMessage, throttledSendMessage, onClose]);

  return renderCommentsModal();
};

export default CommentsModal;

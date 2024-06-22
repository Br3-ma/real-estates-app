import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import moment from 'moment';
import axios from 'axios';
import { API_BASE_URL } from '../confg/config';
import styles from '../assets/css/home.css'; // Adjust path as per your project structure

const CommentsModal = ({ visible, postId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollViewRef = useRef(null); // useRef for ScrollView
  const fetchIntervalRef = useRef(null); // useRef for fetch interval

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/post-comments/${postId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };

    if (visible) {
      fetchComments();
    }

    return () => {
      terminateFetchInterval();
    };
  }, [visible, postId]);

  const terminateFetchInterval = () => {
    if (fetchIntervalRef.current !== null) {
      clearInterval(fetchIntervalRef.current);
      fetchIntervalRef.current = null;
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      await axios.post(`${API_BASE_URL}/comment-reply`, {
        post_id: postId,
        content: newMessage,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }

    setNewMessage('');
    Keyboard.dismiss();

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = (message) => (
    <View key={message.id} style={styles.messageContainer}>
      <Text style={styles.messageTextTitle}>{message.user?.name}</Text>
      <Text style={styles.messageText}>{message.content}</Text>
      <Text style={styles.messageTime}>{moment(message.created_at).fromNow()}</Text>
    </View>
  );

  const renderCommentsModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={{ flex: 1 }}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }}>
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
        </View>
      </Modal>
    );
  };

  return renderCommentsModal();
};

export default CommentsModal;

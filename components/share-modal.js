import React from 'react';
import { View, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { IconButton, Text as PaperText } from 'react-native-paper';
import * as Sharing from 'expo-sharing';
import Toast from 'react-native-toast-message';

const ShareModal = ({ isVisible, onClose, item, serverBaseUrl }) => {
  const shareItem = async (platform) => {
    try {
      const shareOptions = {
        message: `Check out this property: ${item.title}\nPrice: K${item.price}\nLocation: ${item.location}\nMore details: ${serverBaseUrl}/property/${item.id}`,
        url: `${serverBaseUrl}/storage/app/${item.images[0]?.path || 'placeholder.jpg'}` 
      };

      let url = '';
      switch (platform) {
        case 'FACEBOOK':
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareOptions.url)}`;
          break;
        case 'TWITTER':
          url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareOptions.message)}&url=${encodeURIComponent(shareOptions.url)}`;
          break;
        case 'WHATSAPP':
          url = `whatsapp://send?text=${encodeURIComponent(`${shareOptions.message} ${shareOptions.url}`)}`;
          break;
        case 'EMAIL':
          await Sharing.shareAsync(shareOptions.url, shareOptions);
          break;
        default:
          console.warn('Unknown platform:', platform);
          break;
      }

      if (url) {
        await Linking.openURL(url);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Sharing Failed',
        text2: error.message || 'An error occurred while trying to share.'
      });
      console.error('Failed to share:', error);
    }
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={24} color="black" />
        </TouchableOpacity>
        <PaperText style={styles.headerText}>Share Property</PaperText>
        <View style={styles.shareButtonsRow}>
          <TouchableOpacity onPress={() => shareItem('FACEBOOK')}>
            <IconButton icon="facebook" size={40} color="#3b5998" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => shareItem('TWITTER')}>
            <IconButton icon="twitter" size={40} color="#00acee" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => shareItem('WHATSAPP')}>
            <IconButton icon="whatsapp" size={40} color="#25D366" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => shareItem('EMAIL')}>
            <IconButton icon="email" size={40} color="#D44638" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  shareButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 15,
  },
});

export default ShareModal;

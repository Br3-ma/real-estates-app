import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Menu } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import PropertyVerificationModal from './post-verification';

const { width } = Dimensions.get('window');
const STATUS_TYPES = {
  0: { label: 'Not Verified', color: '#FFA500', icon: 'error-outline' },
  1: { label: 'Verified', color: '#4CAF50', icon: 'verified' },
  2: { label: 'Stalled', color: '#FFC107', icon: 'warning' },
  3: { label: 'Rejected', color: '#F44336', icon: 'cancel' },
  4: { label: 'Unknown', color: '#9E9E9E', icon: 'help-outline' }
};
const MenuContainer = ({ itemId, hideFromPosts, openSetBidModal, editProperty, handleDeleteProperty, item }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const handleVerificationPress = () => {
    setMenuVisible(false);
    setVerificationModalVisible(true);
  };

  return (
    <View style={styles.menuContainer}>
      <Menu
        visible={menuVisible}
        onDismiss={toggleMenu}
        anchor={
          <TouchableOpacity
            style={styles.menuButton}
            onPress={toggleMenu}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#4158D0', '#C850C0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <MaterialIcons name="more-vert" size={24} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        }
        contentStyle={styles.menuContent}
      >
        <Menu.Item
          onPress={() => { hideFromPosts(itemId); setMenuVisible(false); }}
          title={item.status_id === 1 ? 'Hide Post' : 'Show Post'}
          leadingIcon={({ size, color }) => (
            <MaterialIcons
              name={item.status_id === 1 ? 'visibility-off' : 'visibility'}
              size={size}
              color={color}
            />
          )}
          style={styles.menuItem}
        />
        <Menu.Item
          onPress={() => { openSetBidModal(itemId); setMenuVisible(false); }}
          title={item.on_bid ? 'Cancel Boost' : 'Boost Post'}
          leadingIcon={({ size, color }) => (
            <MaterialIcons
              name={item.on_bid ? 'cancel' : 'rocket-launch'}
              size={size}
              color={color}
            />
          )}
          style={styles.menuItem}
        />
        {/* <Menu.Item
          onPress={() => { editProperty(item); setMenuVisible(false); }}
          title="Edit Property"
          leadingIcon={({ size, color }) => (
            <MaterialIcons name="edit" size={size} color={color} />
          )}
          style={styles.menuItem}
        /> */}

        <Menu.Item
          onPress={handleVerificationPress}
          title={`${STATUS_TYPES[item.verified_status]?.label || STATUS_TYPES[4].label} Property`}
          leadingIcon={({ size }) => (
            <MaterialIcons
              name={STATUS_TYPES[item.verified_status]?.icon || STATUS_TYPES[4].icon}
              size={size}
              color={STATUS_TYPES[item.verified_status]?.color || STATUS_TYPES[4].color}
            />
          )}
          titleStyle={{
            color: STATUS_TYPES[item.verified_status]?.color || STATUS_TYPES[4].color
          }}
          style={[
            styles.menuItem,
            {
              opacity: item.verified_status === 1 ? 0.7 : 1 // slightly dim if already verified
            }
          ]}
        />
        <Menu.Item
          onPress={() => { handleDeleteProperty(itemId); setMenuVisible(false); }}
          title="Delete"
          leadingIcon={({ size, color }) => (
            <MaterialIcons name="delete" size={size} color="#FF5252" />
          )}
          style={[styles.menuItem, styles.deleteItem]}
        />
      </Menu>

      <PropertyVerificationModal
        visible={verificationModalVisible}
        onClose={() => setVerificationModalVisible(false)}
        propertyId={ item.id }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'relative',
  },
  menuButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#4158D0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  gradientButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginTop: 8,
    width: width * 0.5,
  },
  menuItem: {
    height: 48,
    justifyContent: 'center',
    color:'#000',
    fontFamily: 'Montserrat',
  },
  deleteItem: {
    borderTopWidth: 0.5,
    borderTopColor: '#E0E0E0',
  },
  verificationText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Montserrat',
  },
});

export default MenuContainer;

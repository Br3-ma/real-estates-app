import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Menu } from 'react-native-paper';  
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const MenuContainer = ({ itemId, hideFromPosts, openSetBidModal, editProperty, handleDeleteProperty, item }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  return (
    <View style={styles.menuContainer}>
      <Menu
        visible={menuVisible}
        onDismiss={toggleMenu}
        anchor={
          <TouchableOpacity style={styles.kabutton} onPress={toggleMenu}>
            <MaterialIcons name="more-vert" size={24} color="black" />
          </TouchableOpacity>
        }
        contentStyle={styles.menuContent}
      >
        <Menu.Item
          onPress={() => { hideFromPosts(itemId); setMenuVisible(false); }}
          title={item.status_id === 1 ? 'Hide' : 'Show'}
          leadingIcon={item.status_id === 1 ? 'eye-off-outline' : 'eye-on-outline'}
        />
        <Menu.Item
          onPress={() => { openSetBidModal(itemId); setMenuVisible(false); }}
          title={item.on_bid ? 'Cancel Boost' : 'Boost Post'}
          leadingIcon={item.on_bid ? 'check-circle-outline' : 'rocket-outline'}
        />
        <Menu.Item
          onPress={() => { editProperty(itemId); setMenuVisible(false); }}
          title="Edit"
          leadingIcon="pencil-outline"
        />
        <Menu.Item
          onPress={() => { handleDeleteProperty(itemId); setMenuVisible(false); }}
          title="Delete"
          leadingIcon="delete-outline"
        />
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'relative',
  },
  kabutton: {
    padding: 10,
  },
  menuContent: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 4,
    elevation: 4,
  },
});

export default MenuContainer;

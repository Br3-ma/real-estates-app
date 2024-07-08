import { StyleSheet, Dimensions, StatusBar } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    kabutton:{
      padding:5,
      borderRadius:20,
      backgroundColor:'#FCF7F4',
    },
    menuContainer: {
      position: 'absolute',
      top: 10,
      right: 0,
      padding: 8,
    },
    cardImage: {
      width: 200,
      height: 200,
      borderRadius: 10,
      marginRight: 10,
    },
    illustrativeImage: {
      width: 200,
      height: 200,
      borderRadius: 10,
      marginRight: 10,
      resizeMode: 'contain',
    },
    priceLocationRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 10,
    },
    priceText: {
      fontSize: 16,
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
      fontSize: 14,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    createPostButton: {
      position: 'absolute',
      top: StatusBar.currentHeight + 10, // Adjust as needed
      right: 10,
      zIndex: 1, // Ensure it's above other content
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
      padding:0,
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    modalScrollView: {
      paddingVertical: 20,
      width: width - 40,
      margin:0,
    },
    textarea: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      padding: 10,
      marginVertical: 10,
      textAlignVertical: 'top',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      padding: 10,
      marginVertical: 10,
    },
    inputRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    inputRowItem: {
      width: '30%',
    },
    uploadButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      padding: 10,
      borderRadius: 10,
      marginVertical: 10,
    },
    uploadButtonText: {
      marginLeft: 10,
    },
    uploadedImageContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    uploadedImage: {
      width: 60,
      height: 60,
      borderRadius: 10,
      margin: 5,
    },
    modalFooter: {
      marginTop: 10,
    },
    overlayDetails: {
      position: 'absolute',
      bottom: 10,
      left: 10,
    },
    overlayText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    overlayTextSmall: {
      color: '#fff',
      fontSize: 14,
    },
    overlayIconRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    floatingButton: {
      position: 'absolute',
      bottom: 100,
      right: 20,
      backgroundColor: '#f4511e',
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8,
    },
  });
  export default styles;


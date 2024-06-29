import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  buttonCover:{
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    paddingHorizontal:15,
  },
  searchBarInput: {
    backgroundColor: '#ececec',
    borderRadius: 20,
    height: 40,
    borderColor: '#c1dbeb',
    borderWidth: 1,
  },
  searchModalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  searchInput: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    padding: 10,
  },
  dropdownContainer: {
    width: '100%',
    marginBottom: 20,
  },
  dropdown: {
    width: '100%',
    height: 50,
  },
  // searchButton: {
  //   backgroundColor: 'blue',
  //   padding: 15,
  //   borderRadius: 10,
  // },
  // searchButtonText: {
  //   color: 'white',
  //   fontWeight: 'bold',
  // },
  buttonGroupContainer: {
    marginBottom: 10,
    borderRadius:10,
  },
  selectedButton: {
    backgroundColor: '#7D7399',
  },
  fullWidthCard: {
    width: width - 20, // Full width of the screen minus padding
    alignSelf: 'center', // Center horizontally
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  homeBody:{
    marginTop:-1,
    backgroundColor: 'transparent',
  },
  bodyContent:{
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 2,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'contain' as per your preference
  },  
  postTitle: {
    textAlign:'left',
  },
  priceLocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
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
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  closeButton: {
    marginLeft: 10,
    marginTop: 10,
    paddingBottom:10,
  },
  modalContent:{
    backgroundColor: '#fff',
  },
  topImageContainer: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  imageContainer: {
    width: width,
    height: 300,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  overlayDetails: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
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
    flexDirection: 'row', // Changed to row layout
    justifyContent: 'space-around', // Adjusted spacing between buttons
    alignItems: 'center', // Center items vertically
    marginVertical: 5,
    paddingTop:5,
    borderRadius:10,
    marginHorizontal:5,
    borderColor:'#f1f1f1',
  },
  commentSection: {
    backgroundColor: '#f1f1f1',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#7D7399',
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
  // loader: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  placeholder: {
    width: '90%',
    height: 200,
    marginBottom: 10,
  },  
  overlaySearch: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  overlayStyle: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 5,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  ribbonTag: {
    color: '#fff',
    fontSize: 12,
  },
  // =================== Property Details ===
  detailsContainer: {
    padding: 20,
    backgroundColor: '#3f7a9d',
    borderBottomLeftRadius:30,
    borderBottomRightRadius:30,
  },
  propertyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color:'#fff'
  },
  propertyPrice: {
    fontSize: 20,
    color: '#b3e5f9',
    marginBottom: 8,
  },
  propertyDescription: {
    fontSize: 16,
    color: '#e4e9eb',
    marginBottom: 16,
  },
  propertyDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  propertyDetailsItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyDetailsText: {
    marginLeft: 4,
    fontSize: 16,
    color:'#f5f5f5',
  },
  // =================== New Modal Sections ===
  featureAmenitiesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#EFEEFA',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: 10,
    marginHorizontal:10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  featureAmenitiesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featureAmenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureAmenitiesItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
  },
  featureAmenitiesText: {
    fontSize: 14,
    marginLeft: 8,
  },
  featureAmenitiesLink: {
    color: '#007aff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  // --------------------MapFinder Section --
  mapFinderContainer: {
    alignItems: 'left',
    marginTop: 0,
    marginHorizontal:10,
    padding: 13,
    backgroundColor: '#f9f9f9',
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    shadowColor: '#000', // Shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // Android shadow
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mapImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
    borderRadius: 10, // Rounded corners for the image
    overflow: 'hidden', // Ensure borderRadius works
  },
  openMapButton: {
    backgroundColor: '#6c63ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20, // Rounded button
    marginTop: 10,
    elevation: 3, // Android shadow
  },
  openMapButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  recommendedPropertiesContainer: {
    marginTop: 10,
    borderRadius: 10, // Rounded corners
    shadowColor: '#000', // Shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // Android shadow
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 25,
  },
  recommendedPropertyImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8, // Rounded corners for the image
    overflow: 'hidden',
    marginBottom: 10,
    shadowColor: '#000', // Shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // Android shadow
  },
  recommendedPropertyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recommendedPropertyPrice: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  recommendedPropertyDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  recommendedPropertyItem:{
    padding: 10,
  },
  buttonLabel:{
    color:'#3f7a9d'
  },


  featuredSection: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom:10,
  },
  featuredSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'#405466', 
  },


  //search bottom sheet
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalSearchContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  picker: {
    width: '100%',
    height: 40,
    marginBottom: 20,
  },
  searchButton: {
    width: '100%',
    backgroundColor: '#165F56',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fullScreenLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default styles;

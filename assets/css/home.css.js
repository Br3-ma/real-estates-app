import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  gradient: {
    flex: 1,
  },
  searchBarContainer: {
    backgroundColor: '#8E2DE2',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    paddingHorizontal: 15,
    marginBottom: 10,
    borderBottomRightRadius:10,
    borderBottomLeftRadius:10,
  },
  searchBarInput: {
    backgroundColor: '#efd4f9',
    borderRadius: 25,
    height: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  homeBody: {
    flex: 1,
  },
  featuredSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  featuredSectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
    color: '#333',
  },
  bodyContent: {
    paddingHorizontal: 5,
  },
  loader: {
    padding: 15,
  },
  placeholder: {
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#60279C',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fullScreenLoading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flexGrow: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
    padding: 10,
  },
  topImageContainer: {
    height: height * 0.4,
  },
  imageContainer: {
    width: width,
    height: '100%',
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
  },
  overlayDetails: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
  },
  overlayText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  videoCover: {
    width: width,
    height: height * 0.4,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  propertyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  propertyPrice: {
    fontSize: 20,
    color: '#60279C',
    fontWeight: '600',
    marginBottom: 10,
  },
  propertyDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    lineHeight: 24,
  },
  propertyDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  propertyDetailsItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyDetailsText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#333',
  },
  featureAmenitiesContainer: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  featureAmenitiesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  featureAmenitiesItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureAmenitiesText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#555',
  },
  featureAmenitiesLink: {
    color: '#60279C',
    marginLeft: 10,
    textDecorationLine: 'underline',
  },
  mapFinderContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  mapImage: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openMapButton: {
    backgroundColor: '#60279C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  toggleButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  commentButton: {
    alignItems: 'center',
  },
  whatsappIcon: {
    alignItems: 'center',
  },
  buttonLabel: {
    marginTop: 5,
    fontSize: 12,
    color: '#333',
  },
  messageContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  messageContent: {
    flex: 1,
  },
  messageTextTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  messageTime: {
    fontSize: 12,
    color: '#888',
  },
  replyLink: {
    color: '#60279C',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 16,
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
    paddingHorizontal:4,
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
  videoCover: {
    width: width,
    height: 300,
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
  floatingButton: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    backgroundColor: '#438ab5',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  
});

export default styles;

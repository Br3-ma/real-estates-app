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
    backgroundColor: '#fff',
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
    marginTop: 14,
    marginBottom: 5,
  },
  featuredSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 5,
    color: '#000',
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
  
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
    padding: 10,
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
    width: '100%',
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

import { StyleSheet, Dimensions, StatusBar, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const COLORS = {
  background: '#F4F6F9',
  card: '#FFFFFF',
  primary: '#2C3E50',
  accent: '#3498DB',
  text: '#34495E',
  muted: '#7F8C8D',
  border: '#ECF0F1',
};

const TYPOGRAPHY = {
  small: 12,
  medium: 14,
  large: 16,
  xlarge: 18,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.large,
    fontWeight: '700',
    color: COLORS.primary,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  menuContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    fontFamily: 'Montserrat',
  },
  kabutton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F0F2F5',
  },
  cardImage: {
    width: width - 24,
    height: width * 0.6,
    resizeMode: 'cover',
  },
  illustrativeImage: {
    width: width,
    height: width * 0.75,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 15,
  },
  priceLocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceText: {
    fontSize: TYPOGRAPHY.xlarge,
    fontWeight: '700',
    color: COLORS.accent,
    fontFamily: 'Montserrat-Bold',
  },
  locationText: {
    fontSize: TYPOGRAPHY.medium,
    color: COLORS.muted,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily: 'Montserrat-Bold',
  },
  iconText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#65676B',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: '#E4E6EB',
    paddingVertical: 10,
  },
  createPostButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight + 10,
    right: 16,
    zIndex: 100,
    backgroundColor: '#1877F2',
    padding: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    width: width * 0.9,
    maxHeight: height * 0.7,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C2331',
  },
  modalScrollView: {
    marginVertical: 16,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#CED0D4',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: TYPOGRAPHY.medium,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputRowItem: {
    width: '30%',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1877F2',
    padding: 14,
    borderRadius: 12,
    marginVertical: 16,
  },
  uploadButtonText: {
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadedImageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  uploadedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    margin: 4,
  },
  modalFooter: {
    marginTop: 20,
  },
  overlayDetails: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    borderRadius: 8,
  },
  overlayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  overlayTextSmall: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  overlayIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
  },  
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8f8f8', // Light gray background
  },
  emptyStateImage: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Darker gray text color
    textAlign: 'center',
    marginTop: 12,
    fontFamily: 'Montserrat',
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#757575', // Lighter gray description color
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'Montserrat',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: COLORS.accent,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default styles;
// utils.js
import axios from 'axios';
import { API_BASE_URL } from '../confg/config';
import { fetchUserInfo } from '../controllers/auth/userController';

export const fetchMyProperties = async () => {
  try {
    const user = await fetchUserInfo();
    const response = await axios.get(`${API_BASE_URL}/my-property-posts/${user.id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch properties:', error);
    throw error;
  }
};

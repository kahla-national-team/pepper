import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getCalendarData = async () => {
  try {
    const response = await axios.get(`${API_URL}/calendar/data`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    throw error;
  }
}; 
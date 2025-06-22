import api from './api';

export const getReports = async (timeRange = 'month') => {
  try {
    const response = await api.get(`/reports`, { params: { timeRange } });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 
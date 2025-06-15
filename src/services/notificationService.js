import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return {
    Authorization: `Bearer ${token}`
  };
};

export const fetchNotifications = async () => {
  try {
    const response = await axios.get(`${API_URL}/notifications`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const fetchUnreadCount = async () => {
  try {
    const response = await axios.get(`${API_URL}/notifications/unread`, {
      headers: getAuthHeader()
    });
    return response.data.count;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    console.error('Error fetching unread count:', error);
    throw error;
  }
};

export const markAsRead = async (notificationId) => {
  try {
    const response = await axios.put(
      `${API_URL}/notifications/${notificationId}/read`,
      {},
      {
        headers: getAuthHeader()
      }
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllAsRead = async () => {
  try {
    const response = await axios.put(
      `${API_URL}/notifications/read-all`,
      {},
      {
        headers: getAuthHeader()
      }
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

export const archiveNotification = async (notificationId) => {
  try {
    const response = await axios.put(
      `${API_URL}/notifications/${notificationId}/archive`,
      {},
      {
        headers: getAuthHeader()
      }
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    console.error('Error archiving notification:', error);
    throw error;
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/notifications/${notificationId}`,
      {
        headers: getAuthHeader()
      }
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    console.error('Error deleting notification:', error);
    throw error;
  }
};

export const createNotification = async (notificationData) => {
  try {
    const response = await axios.post(
      `${API_URL}/notifications`,
      notificationData,
      {
        headers: getAuthHeader()
      }
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Hook to use notification service
export const useNotificationService = () => {
  const notifyBookingRequest = async (booking) => {
    return createNotification({
      recipient_id: booking.userId,
      type: 'booking',
      title: 'New Booking Request',
      message: `You have a new booking request for ${booking.serviceName} on ${new Date(
        booking.date
      ).toLocaleDateString()}`,
      link: `/bookings/${booking.id}`,
    });
  };

  const notifyPaymentReminder = async (payment) => {
    return createNotification({
      recipient_id: payment.userId,
      type: 'payment',
      title: 'Payment Reminder',
      message: `Your next payment of $${payment.amount} for ${payment.serviceName} is due in ${payment.daysLeft} days`,
      link: `/payments/${payment.id}`,
    });
  };

  const notifyBookingAcceptance = async (booking) => {
    return createNotification({
      recipient_id: booking.userId,
      type: 'acceptance',
      title: 'Booking Accepted',
      message: `Your booking for ${booking.serviceName} has been accepted by the owner`,
      link: `/bookings/${booking.id}`,
    });
  };

  const notifyBookingRejection = async (booking) => {
    return createNotification({
      recipient_id: booking.userId,
      type: 'rejection',
      title: 'Booking Rejected',
      message: `Your booking for ${booking.serviceName} has been rejected by the owner`,
      link: `/bookings/${booking.id}`,
    });
  };

  const formatNotification = (notification) => {
    return {
      ...notification,
      sender: notification.sender || null,
      created_at: new Date(notification.created_at),
      read_at: notification.read_at ? new Date(notification.read_at) : null
    };
  };

  return {
    fetchNotifications: async () => {
      const notifications = await fetchNotifications();
      return notifications.map(formatNotification);
    },
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    notifyBookingRequest,
    notifyPaymentReminder,
    notifyBookingAcceptance,
    notifyBookingRejection,
  };
}; 
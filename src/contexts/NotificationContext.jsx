import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  fetchNotifications,
  fetchUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../services/notificationService';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const loadNotifications = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await fetchNotifications();
      setNotifications(data);
      const count = await fetchUnreadCount();
      setUnreadCount(count);
      setError(null);
    } catch (err) {
      if (err.message === 'No authentication token found') {
        setIsAuthenticated(false);
        setError('Please log in to view notifications');
      } else {
        setError('Failed to load notifications');
        console.error('Error loading notifications:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    // Set up polling for new notifications every minute
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleMarkAsRead = async (notificationId) => {
    if (!isAuthenticated) return;

    try {
      await markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      if (err.message === 'No authentication token found') {
        setIsAuthenticated(false);
      }
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!isAuthenticated) return;

    try {
      await markAllAsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      if (err.message === 'No authentication token found') {
        setIsAuthenticated(false);
      }
      console.error('Error marking all notifications as read:', err);
    }
  };

  const handleRemoveNotification = async (notificationId) => {
    if (!isAuthenticated) return;

    try {
      await deleteNotification(notificationId);
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );
      // Update unread count if the deleted notification was unread
      const deletedNotification = notifications.find(
        (n) => n.id === notificationId
      );
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      if (err.message === 'No authentication token found') {
        setIsAuthenticated(false);
      }
      console.error('Error removing notification:', err);
    }
  };

  const handleClearAllNotifications = async () => {
    if (!isAuthenticated) return;

    try {
      // Delete all notifications one by one
      await Promise.all(
        notifications.map((notification) =>
          deleteNotification(notification.id)
        )
      );
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      if (err.message === 'No authentication token found') {
        setIsAuthenticated(false);
      }
      console.error('Error clearing all notifications:', err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        isAuthenticated,
        markAsRead: handleMarkAsRead,
        markAllAsRead: handleMarkAllAsRead,
        removeNotification: handleRemoveNotification,
        clearAllNotifications: handleClearAllNotifications,
        refreshNotifications: loadNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}; 
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Check, X } from 'lucide-react';
import { useNotificationService } from '../services/notificationService';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const notificationService = useNotificationService();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.fetchNotifications();
      setNotifications(response);
      setUnreadCount(response.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_request':
        return '📅';
      case 'booking_confirmed':
        return '✅';
      case 'booking_cancelled':
        return '❌';
      case 'payment_received':
        return '💰';
      case 'review_received':
        return '⭐';
      default:
        return '📢';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-1/2 mt-2 w-[480px] bg-white rounded-xl shadow-2xl overflow-hidden z-50 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Bell className="h-7 w-7" />
                <h3 className="text-xl font-bold">Notifications</h3>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 text-sm font-medium bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === 'all' ? 'bg-white text-blue-600' : 'hover:bg-white/20'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === 'unread' ? 'bg-white text-blue-600' : 'hover:bg-white/20'
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === 'read' ? 'bg-white text-blue-600' : 'hover:bg-white/20'
                }`}
              >
                Read
              </button>
            </div>
          </div>

          <div className="max-h-[480px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <Bell className="h-12 w-12 mb-4 text-gray-400" />
                <p className="text-center">No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-5 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-base text-gray-900 font-medium">
                        {notification.message}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                      {notification.link && (
                        <Link
                          to={notification.link}
                          className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block"
                          onClick={() => markAsRead(notification.id)}
                        >
                          View details
                        </Link>
                      )}
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{notifications.length} notifications</span>
              <Link
                to="/notifications"
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => setIsOpen(false)}
              >
                View all notifications
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications; 
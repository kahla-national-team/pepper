import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useNotificationService } from '../services/notificationService';
import {
  Bell,
  Check,
  X,
  User,
  Calendar,
  CreditCard,
  Star,
  MessageSquare,
  Trash2,
  Home,
  MoreVertical,
  Wrench
} from 'lucide-react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const notificationService = useNotificationService();

  const categories = ['all', 'unread', 'bookings', 'maintenance', 'payments', 'concierge', 'system'];

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await notificationService.fetchNotifications();
      setNotifications(response);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_request':
      case 'booking_confirmed':
      case 'booking_cancelled':
        return <Calendar className="h-6 w-6 text-blue-500" />;
      case 'maintenance_request':
      case 'maintenance_completed':
        return <Wrench className="h-6 w-6 text-orange-500" />;
      case 'payment_received':
      case 'payment_due':
        return <CreditCard className="h-6 w-6 text-green-500" />;
      case 'concierge_service':
        return <Bell className="h-6 w-6 text-purple-500" />;
      case 'review_received':
        return <Star className="h-6 w-6 text-yellow-500" />;
      case 'system_message':
        return <MessageSquare className="h-6 w-6 text-gray-500" />;
      default:
        return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };

  const getNotificationTag = (type) => {
    let tagText = type.replace(/_/g, ' ');
    let bgColor = 'bg-gray-200';
    let textColor = 'text-gray-800';

    if (type.includes('booking')) {
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-700';
    } else if (type.includes('maintenance')) {
      bgColor = 'bg-orange-100';
      textColor = 'text-orange-700';
    } else if (type.includes('payment')) {
      bgColor = 'bg-green-100';
      textColor = 'text-green-700';
    } else if (type.includes('concierge')) {
      bgColor = 'bg-purple-100';
      textColor = 'text-purple-700';
    } else if (type.includes('review')) {
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-700';
    } else if (type.includes('system')) {
      bgColor = 'bg-gray-200';
      textColor = 'text-gray-800';
    }

    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}>
        {tagText}
      </span>
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'all') return true;
    
    return notification.type.includes(filter.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Bell className="h-7 w-7 text-gray-700" />
              <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
              {unreadCount > 0 && (
                <span className="ml-2 px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Mark all as read
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto -mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`py-2 px-4 text-sm font-medium whitespace-nowrap ${
                  filter === category
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-6 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mb-4 text-gray-300" />
              <p className="text-lg">No notifications found.</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`relative p-4 bg-white rounded-lg shadow-sm border ${
                  !notification.read ? 'border-blue-200 ring-1 ring-blue-500' : 'border-gray-200'
                }`} 
              >
                {!notification.read && (
                  <span className="absolute -top-1 -left-1 h-3 w-3 bg-red-500 rounded-full ring-2 ring-white"></span> 
                )}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0"> 
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <p className={`text-base font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.message}
                        </p>
                        {getNotificationTag(notification.type.split('_')[0])} 
                      </div>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-full transition-colors"
                        title="Dismiss notification"
                      >
                        <MoreVertical className="h-5 w-5" /> 
                      </button>
                    </div>
                    
                    <div className="text-sm text-gray-500 flex items-center space-x-4 mt-2"> 
                      <span>{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}</span>
                      {notification.property_name && (
                        <span className="flex items-center space-x-1">
                          <Home className="h-4 w-4 text-gray-400" />
                          <span>{notification.property_name}</span>
                        </span>
                      )}
                    </div>
                    {notification.link && (
                      <Link
                        to={notification.link}
                        className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800 font-medium"
                        onClick={() => markAsRead(notification.id)}
                      >
                        View details
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {!isLoading && filteredNotifications.length > 0 && (
          <div className="p-4 text-center text-gray-500 border-t border-gray-100 mt-6">
            <p>End of notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage; 
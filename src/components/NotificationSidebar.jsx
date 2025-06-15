import React, { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { FaSpinner, FaArchive } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NotificationSidebar = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    removeNotification,
    clearAllNotifications,
  } = useNotifications();

  const [selectedSender, setSelectedSender] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking':
        return '📅';
      case 'payment':
        return '💰';
      case 'acceptance':
        return '✅';
      case 'rejection':
        return '❌';
      case 'service':
        return '🔧';
      case 'system':
        return '⚙️';
      default:
        return '📢';
    }
  };

  // Get unique senders from notifications
  const senders = ['all', ...new Set(notifications.map(n => n.sender?.full_name || 'System'))];

  // Filter notifications by selected sender and status
  const filteredNotifications = notifications.filter(notification => {
    const senderMatch = selectedSender === 'all' || notification.sender?.full_name === selectedSender;
    const statusMatch = selectedStatus === 'all' || notification.status === selectedStatus;
    return senderMatch && statusMatch;
  });

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  if (loading) {
    return (
      <div className="w-80 h-full bg-white shadow-lg flex items-center justify-center">
        <FaSpinner className="animate-spin text-[#ff385c] text-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-80 h-full bg-white shadow-lg flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-white shadow-lg flex flex-col">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <div className="flex gap-2">
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Mark all as read
            </button>
            <button
              onClick={clearAllNotifications}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Clear all
            </button>
          </div>
        </div>
        
        {/* Status filter */}
        <div className="flex gap-2 mb-2">
          {['all', 'unread', 'read', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                selectedStatus === status
                  ? 'bg-[#ff385c] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Sender filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {senders.map((sender) => (
            <button
              key={sender}
              onClick={() => setSelectedSender(sender)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                selectedSender === sender
                  ? 'bg-[#ff385c] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {sender}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                notification.status === 'unread' ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">
                  {getNotificationIcon(notification.type)}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    {notification.sender && (
                      <span className="text-xs text-gray-500">
                        from {notification.sender.full_name}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                    <div className="flex gap-2">
                      {notification.status === 'unread' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Mark as read
                        </button>
                      )}
                      {notification.status !== 'archived' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            archiveNotification(notification.id);
                          }}
                          className="text-xs text-gray-600 hover:text-gray-800"
                        >
                          <FaArchive className="inline mr-1" />
                          Archive
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationSidebar; 
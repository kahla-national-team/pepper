import React from 'react';
import { FaBell, FaCalendarAlt, FaStar, FaMoneyBillWave } from 'react-icons/fa';

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'booking':
        return <FaCalendarAlt className="text-blue-500" />;
      case 'review':
        return <FaStar className="text-yellow-500" />;
      case 'payment':
        return <FaMoneyBillWave className="text-green-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'booking':
        return 'bg-blue-50 text-blue-700';
      case 'review':
        return 'bg-yellow-50 text-yellow-700';
      case 'payment':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#ff385c]">Recent Activity</h2>
        <span className="text-sm text-gray-500">{activities.length} activities</span>
      </div>

      <div className="space-y-4">;
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No recent activities to display
          </div>
        ) : (
          activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className={`p-3 rounded-full ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <p className="text-sm text-gray-500 mt-1">{activity.timestamp}</p>
              </div>
              {activity.status && (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                  activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {activity.status}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity; 
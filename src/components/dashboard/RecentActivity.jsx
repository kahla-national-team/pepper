import React from 'react';

const RecentActivity = ({ activities }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center justify-between border-b pb-4 last:border-b-0">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-full ${activity.iconBg}`}>
                {activity.icon}
              </div>
              <div>
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{activity.amount}</p>
              <p className={`text-sm ${activity.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                {activity.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity; 
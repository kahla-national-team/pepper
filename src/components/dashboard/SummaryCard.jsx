import React from 'react';

const SummaryCard = ({ icon: Icon, title, value, subtitle, trend, trendValue, iconBg }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/50 shadow-lg hover:shadow-xl transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${iconBg || 'bg-[#ff385c]/10'}`}>
          {Icon && <Icon className={`text-xl ${iconBg ? 'text-white' : 'text-[#ff385c]'}`} />}
        </div>
        {trend && (
          <span className="text-sm font-medium text-green-600 flex items-center">
            {trend}
            {trendValue && <span className="ml-1">{trendValue}</span>}
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
    </div>
  );
};

export default SummaryCard; 
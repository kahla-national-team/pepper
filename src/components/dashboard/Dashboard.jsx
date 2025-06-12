import React from 'react';
import WelcomeSection from './WelcomeSection';
import SummaryCard from './SummaryCard';
import RecentActivity from './RecentActivity';
import ServiceAnnouncements from './ServiceAnnouncements';
import QuickActions from './QuickActions';
import PendingApprovalsWidget from './PendingApprovalsWidget';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <WelcomeSection />
      <div className="dashboard-widgets">
        <SummaryCard title="Total Users" value="1,234" />
        <SummaryCard title="Total Bookings" value="567" />
        <SummaryCard title="Revenue" value="$12,345" />
        <PendingApprovalsWidget />
      </div>
      <RecentActivity />
      <ServiceAnnouncements />
      <QuickActions />
    </div>
  );
};

export default Dashboard; 
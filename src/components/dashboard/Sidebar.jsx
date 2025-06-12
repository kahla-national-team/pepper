import React from 'react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><a href="#dashboard">Dashboard</a></li>
          <li><a href="#manage-users">Manage Users</a></li>
          <li><a href="#rentals-bookings">Rentals & Bookings</a></li>
          <li><a href="#concierge-services">Concierge Services</a></li>
          <li><a href="#payments-invoices">Payments & Invoices</a></li>
          <li><a href="#reviews-reports">Reviews & Reports</a></li>
          <li><a href="#support-tickets">Support Tickets</a></li>
          <li><a href="#system-logs">System Logs</a></li>
          <li><a href="#settings">Settings</a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar; 
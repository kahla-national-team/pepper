import React from 'react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><a href="#dashboard">Dashboard</a></li>
          <li><a href="#manage-users">Manage Users</a></li>
          <li><a href="#rentals-bookings">Rentals & Bookings</a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar; 
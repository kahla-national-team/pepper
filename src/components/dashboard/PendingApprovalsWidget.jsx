import React, { useState } from 'react';

const PendingApprovalsWidget = () => {
  const [pendingBookings, setPendingBookings] = useState([
    { id: 1, user: 'John Doe', service: 'Luxury Apartment', date: '2024-08-01', status: 'pending' },
    { id: 2, user: 'Jane Smith', service: 'Cozy Studio', date: '2024-08-05', status: 'pending' },
  ]);

  const handleAccept = (bookingId) => {
    console.log(`Accepted booking: ${bookingId}`);
    setPendingBookings(pendingBookings.filter(booking => booking.id !== bookingId));
    // In a real application, you would make an API call to update the booking status
  };

  const handleReject = (bookingId) => {
    console.log(`Rejected booking: ${bookingId}`);
    setPendingBookings(pendingBookings.filter(booking => booking.id !== bookingId));
    // In a real application, you would make an API call to update the booking status
  };

  return (
    <div className="card pending-approvals-widget">
      <h3>Pending Approvals (Bookings)</h3>
      {pendingBookings.length > 0 ? (
        <ul>
          {pendingBookings.map((booking) => (
            <li key={booking.id}>
              <div>
                <strong>{booking.user}</strong> wants to book <strong>{booking.service}</strong> on {booking.date}.
              </div>
              <div>
                <button onClick={() => handleAccept(booking.id)}>Accept</button>
                <button onClick={() => handleReject(booking.id)}>Reject</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending booking approvals.</p>
      )}
    </div>
  );
};

export default PendingApprovalsWidget; 
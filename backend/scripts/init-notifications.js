const { sequelize } = require('../config/database');
const Notification = require('../models/Notification');

async function initNotifications() {
  try {
    // Sync the Notification model with the database
    await Notification.sync({ force: true });
    console.log('Notifications table created successfully');

    // Create some test notifications
    const testNotifications = [
      {
        recipient_id: 1, // Make sure this user exists in your database
        sender_id: 2, // Make sure this user exists in your database
        title: 'Welcome to Pepper',
        message: 'Thank you for joining our platform!',
        type: 'system',
        status: 'unread',
        link: '/dashboard',
      },
      {
        recipient_id: 1,
        sender_id: 2,
        title: 'New Booking Request',
        message: 'You have a new booking request for your service',
        type: 'booking',
        status: 'unread',
        link: '/bookings/1',
      },
    ];

    await Notification.bulkCreate(testNotifications);
    console.log('Test notifications created successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error initializing notifications:', error);
    process.exit(1);
  }
}

initNotifications(); 
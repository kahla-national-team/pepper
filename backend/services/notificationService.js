const Notification = require('../models/Notification');

class NotificationService {
  constructor(pool) {
    this.pool = pool;
  }

  // Create a notification
  async createNotification(data) {
    try {
      const notification = await Notification.create({
        recipient_id: data.recipient_id,
        sender_id: data.sender_id,
        title: data.title,
        message: data.message,
        type: data.type || 'general',
        link: data.link,
        status: 'unread'
      });
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Booking related notifications
  async notifyNewBooking(booking) {
    try {
      // Notify the property owner
      await this.createNotification({
        recipient_id: booking.owner_id,
        sender_id: booking.user_id,
        title: 'New Booking Request',
        message: `You have a new booking request for ${booking.property_name} from ${booking.user_name}`,
        type: 'booking',
        link: `/bookings/${booking.id}`
      });

      // Notify the guest
      await this.createNotification({
        recipient_id: booking.user_id,
        sender_id: booking.owner_id,
        title: 'Booking Request Sent',
        message: `Your booking request for ${booking.property_name} has been sent to the host`,
        type: 'booking',
        link: `/bookings/${booking.id}`
      });
    } catch (error) {
      console.error('Error sending booking notifications:', error);
      throw error;
    }
  }

  async notifyBookingStatusChange(booking, status) {
    try {
      const statusMessages = {
        confirmed: 'Your booking request has been confirmed',
        cancelled: 'Your booking request has been cancelled',
        rejected: 'Your booking request has been rejected'
      };

      await this.createNotification({
        recipient_id: booking.user_id,
        sender_id: booking.owner_id,
        title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `${statusMessages[status]} for ${booking.property_name}`,
        type: status === 'confirmed' ? 'acceptance' : 'rejection',
        link: `/bookings/${booking.id}`
      });
    } catch (error) {
      console.error('Error sending booking status notification:', error);
      throw error;
    }
  }

  // Payment related notifications
  async notifyPaymentDue(payment) {
    try {
      await this.createNotification({
        recipient_id: payment.user_id,
        sender_id: payment.owner_id,
        title: 'Payment Due',
        message: `Your payment of $${payment.amount} for ${payment.property_name} is due in ${payment.days_left} days`,
        type: 'payment',
        link: `/payments/${payment.id}`
      });
    } catch (error) {
      console.error('Error sending payment due notification:', error);
      throw error;
    }
  }

  async notifyPaymentReceived(payment) {
    try {
      // Notify the guest
      await this.createNotification({
        recipient_id: payment.user_id,
        sender_id: payment.owner_id,
        title: 'Payment Received',
        message: `Your payment of $${payment.amount} for ${payment.property_name} has been received`,
        type: 'payment',
        link: `/payments/${payment.id}`
      });

      // Notify the host
      await this.createNotification({
        recipient_id: payment.owner_id,
        sender_id: payment.user_id,
        title: 'Payment Received',
        message: `You have received a payment of $${payment.amount} for ${payment.property_name}`,
        type: 'payment',
        link: `/payments/${payment.id}`
      });
    } catch (error) {
      console.error('Error sending payment received notification:', error);
      throw error;
    }
  }

  // Service request notifications
  async notifyNewServiceRequest(serviceRequest) {
    try {
      await this.createNotification({
        recipient_id: serviceRequest.provider_id,
        sender_id: serviceRequest.user_id,
        title: 'New Service Request',
        message: `You have a new service request for ${serviceRequest.service_name}`,
        type: 'service',
        link: `/services/${serviceRequest.id}`
      });
    } catch (error) {
      console.error('Error sending service request notification:', error);
      throw error;
    }
  }

  async notifyServiceRequestStatus(serviceRequest, status) {
    try {
      const statusMessages = {
        accepted: 'Your service request has been accepted',
        rejected: 'Your service request has been rejected',
        completed: 'Your service request has been completed'
      };

      await this.createNotification({
        recipient_id: serviceRequest.user_id,
        sender_id: serviceRequest.provider_id,
        title: `Service Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `${statusMessages[status]} for ${serviceRequest.service_name}`,
        type: status === 'accepted' ? 'acceptance' : 'rejection',
        link: `/services/${serviceRequest.id}`
      });
    } catch (error) {
      console.error('Error sending service request status notification:', error);
      throw error;
    }
  }

  // Review notifications
  async notifyNewReview(review) {
    try {
      await this.createNotification({
        recipient_id: review.owner_id,
        sender_id: review.user_id,
        title: 'New Review',
        message: `You have received a new ${review.rating}-star review for ${review.property_name}`,
        type: 'review',
        link: `/reviews/${review.id}`
      });
    } catch (error) {
      console.error('Error sending review notification:', error);
      throw error;
    }
  }
}

module.exports = NotificationService; 
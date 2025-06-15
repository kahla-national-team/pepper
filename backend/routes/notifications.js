const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Get all notifications for the current user
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { recipient_id: req.user.id },
      order: [['created_at', 'DESC']],
    });

    // Get sender information for each notification
    const notificationsWithSenders = await Promise.all(
      notifications.map(async (notification) => {
        if (notification.sender_id) {
          const userModel = new User(req.app.locals.pool);
          const sender = await userModel.findById(notification.sender_id);
          return {
            ...notification.toJSON(),
            sender: sender ? {
              id: sender.id,
              full_name: sender.full_name,
              profile_image: sender.profile_image
            } : null
          };
        }
        return notification.toJSON();
      })
    );

    res.json(notificationsWithSenders);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unread notifications count
router.get('/unread', auth, async (req, res) => {
  try {
    const count = await Notification.count({
      where: {
        recipient_id: req.user.id,
        status: 'unread',
      },
    });
    res.json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: req.params.id,
        recipient_id: req.user.id,
      },
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.update({
      status: 'read',
      read_at: new Date(),
    });
    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark all notifications as read
router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.update(
      {
        status: 'read',
        read_at: new Date(),
      },
      {
        where: {
          recipient_id: req.user.id,
          status: 'unread',
        },
      }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Archive a notification
router.put('/:id/archive', auth, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: req.params.id,
        recipient_id: req.user.id,
      },
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.update({ status: 'archived' });
    res.json(notification);
  } catch (error) {
    console.error('Error archiving notification:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: req.params.id,
        recipient_id: req.user.id,
      },
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.destroy();
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a notification
router.post('/', auth, [
  body('recipient_id').isInt(),
  body('title').notEmpty(),
  body('message').notEmpty(),
  body('type').optional().isIn(['general', 'booking', 'service', 'system', 'payment', 'acceptance', 'rejection']),
  body('link').optional().isString(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { recipient_id, title, message, type, link } = req.body;

    const notification = await Notification.create({
      recipient_id,
      sender_id: req.user.id,
      title,
      message,
      type: type || 'general',
      link,
      status: 'unread',
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');
const { DataTypes } = Sequelize;

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  recipient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING(50),
    defaultValue: 'general',
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'unread',
  },
  link: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  read_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'notifications',
  timestamps: false,
});

module.exports = Notification; 
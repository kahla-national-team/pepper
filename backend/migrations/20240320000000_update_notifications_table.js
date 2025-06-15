'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, drop the existing table if it exists
    await queryInterface.dropTable('notifications', { force: true });

    // Create the new table with the updated schema
    await queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      recipient_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      sender_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING(50),
        defaultValue: 'general',
      },
      status: {
        type: Sequelize.STRING(20),
        defaultValue: 'unread',
      },
      link: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      read_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Add indexes for better query performance
    await queryInterface.addIndex('notifications', ['recipient_id']);
    await queryInterface.addIndex('notifications', ['sender_id']);
    await queryInterface.addIndex('notifications', ['status']);
    await queryInterface.addIndex('notifications', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the changes by dropping the table
    await queryInterface.dropTable('notifications');
  }
}; 
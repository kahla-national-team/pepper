const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.PG_DATABASE || 'butlerdb',
  process.env.PG_USER || 'postgres',
  process.env.PG_PASSWORD || 'dembele',
  {
    host: process.env.PG_HOST || 'localhost',
    port: process.env.PG_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test the connection
sequelize.authenticate()
  .then(() => console.log('Database connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Export both the Sequelize instance and the configuration
module.exports = {
  sequelize,
  Sequelize,
  development: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_NAME || 'pepper_db',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres'
  },
  test: {
    // ... test configuration
  },
  production: {
    // ... production configuration
  }
}; 
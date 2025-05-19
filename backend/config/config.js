require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  pgConfig: {
    user: process.env.PG_USER || 'postgres',
    host: process.env.PG_HOST || 'localhost',
    database: process.env.PG_DATABASE || 'butler',
    password: process.env.PG_PASSWORD || 'dembele',
    port: process.env.PG_PORT || 5432,
  },
  jwtSecret: process.env.JWT_SECRET || '03863720d1d99147640d11ed1ef6bf4b92aad71e6075fc565ef5eb7d47e8d3eb9a94ef7ae8100e73dddfbe3cab71524b0f5fb5ae469c30f8f6a2536642189f9e',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOptions: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.CORS_ORIGIN 
      : 'http://localhost:5173',
    credentials: true
  }
}; 
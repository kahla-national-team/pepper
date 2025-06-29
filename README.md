# Pepper - Property Rental Platform

A modern property rental platform built with React, Node.js, and PostgreSQL.

## 🚀 Features

- **Property Listings**: Browse and search rental properties
- **User Authentication**: Secure JWT-based authentication
- **Booking System**: Reserve properties with calendar integration
- **Concierge Services**: Additional services for guests
- **Reviews & Ratings**: User feedback system
- **Interactive Maps**: Google Maps integration
- **Image Upload**: Cloudinary integration for media
- **Responsive Design**: Mobile-first approach

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- React Icons

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Cloudinary (image storage)
- Multer (file uploads)

### Infrastructure
- Docker & Docker Compose
- Nginx (reverse proxy)
- PostgreSQL (database)

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for development)
- PostgreSQL (for development)

## 🚀 Quick Start

### Option 1: Docker Deployment (Recommended)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pepper
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Run the deployment script**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

4. **Access your application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432

### Option 2: Manual Development Setup

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   npm install
   npm run dev
   ```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
PG_DATABASE=butler
PG_USER=postgres
PG_PASSWORD=your-password
PG_HOST=localhost
PG_PORT=5432

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Environment
NODE_ENV=production
```

## 📁 Project Structure

```
pepper/
├── src/                    # Frontend React code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── utils/             # Utility functions
├── backend/               # Backend Node.js code
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   └── migrations/       # Database migrations
├── Dockerfile            # Frontend Docker configuration
├── docker-compose.yml    # Multi-container setup
└── nginx.conf           # Nginx configuration
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up --build -d

# Access database
docker-compose exec postgres psql -U postgres -d butler
```

## 🔍 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Properties
- `GET /api/properties` - Get all properties
- `POST /api/properties` - Create property
- `GET /api/properties/:id` - Get property by ID
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Rentals
- `GET /api/rentals` - Get all rentals
- `POST /api/rentals` - Create rental
- `GET /api/rentals/:id` - Get rental by ID

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking

## 🚀 Production Deployment

### Cloud Platforms

#### Heroku
1. Create Heroku app
2. Add PostgreSQL addon
3. Set environment variables
4. Deploy with Git

#### Railway
1. Connect GitHub repository
2. Add PostgreSQL service
3. Configure environment variables
4. Deploy automatically

#### DigitalOcean App Platform
1. Connect repository
2. Configure build settings
3. Set environment variables
4. Deploy

### VPS Deployment
1. Set up server with Docker
2. Clone repository
3. Configure environment variables
4. Run `docker-compose up -d`

## 🔒 Security

- JWT authentication
- Password hashing with bcrypt
- CORS configuration
- Helmet.js security headers
- Input validation
- SQL injection prevention

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@pepper.com or create an issue in the repository.

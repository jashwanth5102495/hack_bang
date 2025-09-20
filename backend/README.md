# Mood App Backend

A Node.js/Express backend for the mood-based social app with real-time chat functionality.

## Features

- User authentication (register/login/logout)
- User profiles with location-based matching
- Mood tracking and analysis
- Real-time chat with Socket.io
- Movie recommendations
- Geospatial queries for nearby users
- RESTful API design

## Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/moodapp
JWT_SECRET=your_secure_jwt_secret_here
```

5. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/location` - Update user location
- `GET /api/users/nearby` - Find nearby users
- `POST /api/users/connect/:userId` - Send connection request
- `PUT /api/users/connect/:userId/:action` - Accept/reject connection

### Moods
- `POST /api/moods/analysis` - Save mood analysis
- `GET /api/moods/history` - Get mood history
- `GET /api/moods/stats` - Get mood statistics

### Movies
- `GET /api/movies` - Get movies by category
- `GET /api/movies/theaters/nearby` - Get nearby theaters
- `GET /api/movies/recommendations` - Get mood-based recommendations

### Chat
- `POST /api/chat/room` - Create/get chat room
- `GET /api/chat/room/:roomId/messages` - Get messages
- `POST /api/chat/room/:roomId/message` - Send message
- `GET /api/chat/rooms` - Get user's chat rooms

## Socket.io Events

### Client to Server
- `join-room` - Join a chat room
- `send-message` - Send a message
- `disconnect` - User disconnected

### Server to Client
- `receive-message` - Receive a message

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  age: Number,
  bio: String,
  interests: [String],
  profileImage: String,
  location: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  currentMood: String,
  isOnline: Boolean,
  lastSeen: Date,
  moodHistory: [{
    mood: String,
    timestamp: Date,
    analysis: Object
  }],
  connections: [{
    userId: ObjectId,
    status: String,
    createdAt: Date
  }]
}
```

## Development

### Running in Development Mode
```bash
npm run dev
```

This uses nodemon for automatic server restarts on file changes.

### Testing the API

You can test the API endpoints using tools like:
- Postman
- curl
- Thunder Client (VS Code extension)

Example registration request:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "age": 25,
    "bio": "Love meeting new people!",
    "interests": ["music", "travel", "food"]
  }'
```

## Production Deployment

1. Set up MongoDB Atlas or your preferred MongoDB hosting
2. Update environment variables for production
3. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start server.js --name "mood-app-backend"
```

## Security Considerations

- JWT tokens expire in 7 days
- Passwords are hashed using bcryptjs
- CORS is configured for cross-origin requests
- Input validation should be added for production use
- Rate limiting should be implemented
- HTTPS should be used in production

## Future Enhancements

- Add input validation middleware
- Implement rate limiting
- Add file upload for profile images
- Integrate with external movie APIs (TMDB)
- Add push notifications
- Implement advanced matching algorithms
- Add content moderation for chat messages
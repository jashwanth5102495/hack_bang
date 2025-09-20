const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files with proper MIME types
app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (path.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json');
    }
  }
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/moods', require('./routes/moods'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/chat', require('./routes/chat'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Chat functionality
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('send-message', (data) => {
    socket.to(data.roomId).emit('receive-message', data);
  });

  // Real-time mood tracking
  socket.on('mood-update', (data) => {
    console.log(`Mood update from ${socket.id}:`, data);
    
    // Broadcast mood update to connected clients (for social features)
    socket.broadcast.emit('user-mood-changed', {
      userId: data.userId,
      mood: data.mood,
      timestamp: new Date().toISOString(),
      analysis: data.analysis
    });

    // Send personalized recommendations based on mood
    const recommendations = generateRealtimeRecommendations(data.mood, data.analysis);
    socket.emit('mood-recommendations', recommendations);
  });

  // Real-time music sync
  socket.on('music-sync', (data) => {
    console.log(`Music sync from ${socket.id}:`, data);
    
    // Broadcast current playing song to friends/followers
    socket.broadcast.emit('friend-music-update', {
      userId: data.userId,
      currentSong: data.currentSong,
      timestamp: new Date().toISOString(),
      mood: data.mood
    });
  });

  // Real-time activity tracking
  socket.on('activity-update', (data) => {
    console.log(`Activity update from ${socket.id}:`, data);
    
    // Track user activity for analytics
    socket.broadcast.emit('user-activity', {
      userId: data.userId,
      activity: data.activity,
      timestamp: new Date().toISOString()
    });
  });

  // Join user-specific room for personalized updates
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${socket.id} joined personal room: user-${userId}`);
    
    // Send welcome message with current system status
    socket.emit('system-status', {
      status: 'connected',
      features: ['mood-tracking', 'music-sync', 'real-time-recommendations'],
      timestamp: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Generate real-time recommendations based on mood
function generateRealtimeRecommendations(mood, analysis) {
  const recommendations = {
    music: [],
    videos: [],
    activities: [],
    timestamp: new Date().toISOString()
  };

  // Music recommendations based on mood
  const musicRecommendations = {
    happy: [
      { title: "Upbeat Playlist", genre: "Pop", energy: "high" },
      { title: "Feel Good Hits", genre: "Rock", energy: "medium" }
    ],
    sad: [
      { title: "Healing Melodies", genre: "Ambient", energy: "low" },
      { title: "Emotional Ballads", genre: "Indie", energy: "low" }
    ],
    excited: [
      { title: "Energy Boost", genre: "Electronic", energy: "high" },
      { title: "Workout Beats", genre: "Hip-Hop", energy: "high" }
    ],
    tired: [
      { title: "Relaxing Sounds", genre: "Classical", energy: "low" },
      { title: "Sleep Music", genre: "Ambient", energy: "very-low" }
    ],
    angry: [
      { title: "Release Tension", genre: "Metal", energy: "high" },
      { title: "Calming Down", genre: "Meditation", energy: "low" }
    ]
  };

  // Video recommendations
  const videoRecommendations = {
    happy: ["Comedy", "Feel-good movies", "Funny animal videos"],
    sad: ["Inspirational content", "Motivational videos", "Healing content"],
    excited: ["Adventure videos", "High-energy content", "Sports highlights"],
    tired: ["ASMR videos", "Nature documentaries", "Meditation guides"],
    angry: ["Stress relief videos", "Breathing exercises", "Calming nature scenes"]
  };

  // Activity suggestions
  const activitySuggestions = {
    happy: ["Share your mood with friends", "Create a playlist", "Dance to music"],
    sad: ["Journal your thoughts", "Listen to healing music", "Connect with a friend"],
    excited: ["Explore new music", "Share your energy", "Try a new activity"],
    tired: ["Take a break", "Listen to calming music", "Practice meditation"],
    angry: ["Take deep breaths", "Listen to release music", "Go for a walk"]
  };

  const moodKey = mood.toLowerCase();
  recommendations.music = musicRecommendations[moodKey] || musicRecommendations.happy;
  recommendations.videos = videoRecommendations[moodKey] || videoRecommendations.happy;
  recommendations.activities = activitySuggestions[moodKey] || activitySuggestions.happy;

  return recommendations;
}

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moodapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
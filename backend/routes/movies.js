const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// Mock movie data - in production, integrate with TMDB API
const mockMovies = [
  {
    id: '1',
    title: 'Guardians of the Galaxy Vol. 3',
    genre: 'Action/Adventure',
    rating: 8.2,
    duration: '150 min',
    platform: 'Theater',
    description: 'The final chapter of the Guardians trilogy',
    poster: 'https://via.placeholder.com/300x400/667eea/ffffff?text=GOTG3'
  },
  {
    id: '2',
    title: 'The Menu',
    genre: 'Thriller/Horror',
    rating: 7.8,
    duration: '107 min',
    platform: 'Netflix',
    description: 'A culinary thriller that will keep you on edge',
    poster: 'https://via.placeholder.com/300x400/ec4899/ffffff?text=Menu'
  },
  {
    id: '3',
    title: 'Everything Everywhere All at Once',
    genre: 'Sci-Fi/Comedy',
    rating: 9.1,
    duration: '139 min',
    platform: 'Amazon Prime',
    description: 'A mind-bending multiverse adventure',
    poster: 'https://via.placeholder.com/300x400/10b981/ffffff?text=EEAAO'
  }
];

const mockTheaters = [
  {
    id: '1',
    name: 'AMC Empire 25',
    address: '234 W 42nd St, New York, NY',
    coordinates: [-73.9857, 40.7589],
    movies: ['1']
  },
  {
    id: '2',
    name: 'Regal Union Square',
    address: '850 Broadway, New York, NY',
    coordinates: [-73.9903, 40.7359],
    movies: ['1']
  }
];

// Get movies by category
router.get('/', auth, async (req, res) => {
  try {
    const { category = 'all' } = req.query;
    
    let filteredMovies = mockMovies;
    
    if (category === 'theater') {
      filteredMovies = mockMovies.filter(movie => movie.platform === 'Theater');
    } else if (category === 'streaming') {
      filteredMovies = mockMovies.filter(movie => movie.platform !== 'Theater');
    }
    
    res.json({
      movies: filteredMovies,
      category
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get nearby theaters
router.get('/theaters/nearby', auth, async (req, res) => {
  try {
    const { latitude, longitude, radius = 10000 } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Location coordinates required' });
    }
    
    // In production, use geospatial queries
    // For now, return mock data with calculated distances
    const theatersWithDistance = mockTheaters.map(theater => {
      const distance = calculateDistance(
        [parseFloat(longitude), parseFloat(latitude)],
        theater.coordinates
      );
      
      return {
        ...theater,
        distance: `${distance.toFixed(1)} km`,
        moviesPlaying: mockMovies.filter(movie => 
          theater.movies.includes(movie.id) && movie.platform === 'Theater'
        )
      };
    });
    
    // Sort by distance
    theatersWithDistance.sort((a, b) => 
      parseFloat(a.distance) - parseFloat(b.distance)
    );
    
    res.json({
      theaters: theatersWithDistance,
      userLocation: { latitude, longitude }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get movie recommendations based on mood
router.get('/recommendations', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.userId).select('currentMood');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Simple mood-based filtering
    let recommendedMovies = mockMovies;
    
    switch (user.currentMood) {
      case 'Happy':
      case 'Excited':
        recommendedMovies = mockMovies.filter(movie => 
          movie.genre.includes('Comedy') || movie.genre.includes('Adventure')
        );
        break;
      case 'Sad':
      case 'Lonely':
        recommendedMovies = mockMovies.filter(movie => 
          movie.genre.includes('Drama') || movie.genre.includes('Romance')
        );
        break;
      case 'Tired':
        recommendedMovies = mockMovies.filter(movie => 
          movie.rating > 8.0 // High-rated, engaging movies
        );
        break;
      default:
        recommendedMovies = mockMovies;
    }
    
    // If no mood-specific movies, return all
    if (recommendedMovies.length === 0) {
      recommendedMovies = mockMovies;
    }
    
    res.json({
      recommendations: recommendedMovies,
      basedOnMood: user.currentMood
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to calculate distance
function calculateDistance(coords1, coords2) {
  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;
  
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

module.exports = router;
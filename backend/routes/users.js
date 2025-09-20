const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, age, bio, interests, currentMood } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (age) user.age = age;
    if (bio) user.bio = bio;
    if (interests) user.interests = interests;
    if (currentMood) user.currentMood = currentMood;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        bio: user.bio,
        interests: user.interests,
        currentMood: user.currentMood,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user location
router.put('/location', auth, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.location = {
      type: 'Point',
      coordinates: [longitude, latitude]
    };

    await user.save();
    res.json({ message: 'Location updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Find nearby users
router.get('/nearby', auth, async (req, res) => {
  try {
    const { radius = 10000 } = req.query; // Default 10km radius
    
    const currentUser = await User.findById(req.userId);
    if (!currentUser || !currentUser.location.coordinates) {
      return res.status(400).json({ message: 'Location not set' });
    }

    const nearbyUsers = await User.find({
      _id: { $ne: req.userId },
      location: {
        $near: {
          $geometry: currentUser.location,
          $maxDistance: parseInt(radius)
        }
      }
    }).select('-password -email').limit(20);

    // Calculate distances and format response
    const usersWithDistance = nearbyUsers.map(user => {
      const distance = calculateDistance(
        currentUser.location.coordinates,
        user.location.coordinates
      );
      
      return {
        id: user._id,
        name: user.name,
        age: user.age,
        bio: user.bio,
        interests: user.interests,
        currentMood: user.currentMood,
        profileImage: user.profileImage,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
        distance: `${distance.toFixed(1)} km`
      };
    });

    res.json(usersWithDistance);
  } catch (error) {
    console.error('Nearby users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send connection request
router.post('/connect/:userId', auth, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    
    if (targetUserId === req.userId) {
      return res.status(400).json({ message: 'Cannot connect to yourself' });
    }

    const currentUser = await User.findById(req.userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if connection already exists
    const existingConnection = currentUser.connections.find(
      conn => conn.userId.toString() === targetUserId
    );

    if (existingConnection) {
      return res.status(400).json({ message: 'Connection already exists' });
    }

    // Add connection to both users
    currentUser.connections.push({
      userId: targetUserId,
      status: 'pending'
    });

    targetUser.connections.push({
      userId: req.userId,
      status: 'pending'
    });

    await currentUser.save();
    await targetUser.save();

    res.json({ message: 'Connection request sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept/reject connection request
router.put('/connect/:userId/:action', auth, async (req, res) => {
  try {
    const { userId: targetUserId, action } = req.params;
    
    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const currentUser = await User.findById(req.userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update connection status
    const currentUserConnection = currentUser.connections.find(
      conn => conn.userId.toString() === targetUserId
    );
    const targetUserConnection = targetUser.connections.find(
      conn => conn.userId.toString() === req.userId
    );

    if (!currentUserConnection || !targetUserConnection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    const newStatus = action === 'accept' ? 'accepted' : 'rejected';
    currentUserConnection.status = newStatus;
    targetUserConnection.status = newStatus;

    await currentUser.save();
    await targetUser.save();

    res.json({ message: `Connection ${action}ed` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to calculate distance between two coordinates
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
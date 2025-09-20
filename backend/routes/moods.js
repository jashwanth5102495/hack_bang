const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Save mood analysis
router.post('/analysis', auth, async (req, res) => {
  try {
    const { dominantMood, dominantGenre, likedCount } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update current mood
    user.currentMood = dominantMood;
    
    // Add to mood history
    user.moodHistory.push({
      mood: dominantMood,
      analysis: {
        dominantMood,
        dominantGenre,
        likedCount
      }
    });

    // Keep only last 50 mood entries
    if (user.moodHistory.length > 50) {
      user.moodHistory = user.moodHistory.slice(-50);
    }

    await user.save();

    res.json({
      message: 'Mood analysis saved',
      currentMood: user.currentMood,
      analysis: {
        dominantMood,
        dominantGenre,
        likedCount,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.error('Mood analysis error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get mood history
router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('moodHistory currentMood');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      currentMood: user.currentMood,
      history: user.moodHistory.slice(-20) // Last 20 entries
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get mood statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('moodHistory');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const moodCounts = {};
    const last30Days = user.moodHistory.filter(
      entry => entry.timestamp > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    last30Days.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    const totalEntries = last30Days.length;
    const moodPercentages = {};
    
    Object.keys(moodCounts).forEach(mood => {
      moodPercentages[mood] = Math.round((moodCounts[mood] / totalEntries) * 100);
    });

    res.json({
      totalEntries,
      moodCounts,
      moodPercentages,
      streak: calculateMoodStreak(user.moodHistory)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to calculate mood tracking streak
function calculateMoodStreak(moodHistory) {
  if (!moodHistory.length) return 0;
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = moodHistory.length - 1; i >= 0; i--) {
    const entryDate = new Date(moodHistory[i].timestamp);
    entryDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

module.exports = router;
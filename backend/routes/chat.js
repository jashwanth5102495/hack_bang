const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// Simple in-memory chat storage - use MongoDB in production
const chatRooms = new Map();
const messages = new Map();

// Get or create chat room between two users
router.post('/room', auth, async (req, res) => {
  try {
    const { otherUserId } = req.body;
    
    if (!otherUserId) {
      return res.status(400).json({ message: 'Other user ID required' });
    }
    
    // Create room ID (consistent regardless of user order)
    const roomId = [req.userId, otherUserId].sort().join('-');
    
    if (!chatRooms.has(roomId)) {
      chatRooms.set(roomId, {
        id: roomId,
        participants: [req.userId, otherUserId],
        createdAt: new Date(),
        lastActivity: new Date()
      });
      messages.set(roomId, []);
    }
    
    res.json({
      roomId,
      room: chatRooms.get(roomId)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a chat room
router.get('/room/:roomId/messages', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    const room = chatRooms.get(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Chat room not found' });
    }
    
    // Check if user is participant
    if (!room.participants.includes(req.userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const roomMessages = messages.get(roomId) || [];
    const paginatedMessages = roomMessages
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit))
      .reverse(); // Most recent first
    
    res.json({
      messages: paginatedMessages,
      total: roomMessages.length,
      roomId
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a message
router.post('/room/:roomId/message', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { content, type = 'text' } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Message content required' });
    }
    
    const room = chatRooms.get(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Chat room not found' });
    }
    
    // Check if user is participant
    if (!room.participants.includes(req.userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const message = {
      id: Date.now().toString(),
      senderId: req.userId,
      content,
      type,
      timestamp: new Date(),
      roomId
    };
    
    // Add message to room
    const roomMessages = messages.get(roomId) || [];
    roomMessages.push(message);
    messages.set(roomId, roomMessages);
    
    // Update room last activity
    room.lastActivity = new Date();
    chatRooms.set(roomId, room);
    
    res.json({
      message,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's chat rooms
router.get('/rooms', auth, async (req, res) => {
  try {
    const userRooms = [];
    
    for (const [roomId, room] of chatRooms.entries()) {
      if (room.participants.includes(req.userId)) {
        const roomMessages = messages.get(roomId) || [];
        const lastMessage = roomMessages[roomMessages.length - 1];
        
        userRooms.push({
          ...room,
          messageCount: roomMessages.length,
          lastMessage: lastMessage || null
        });
      }
    }
    
    // Sort by last activity
    userRooms.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
    
    res.json({
      rooms: userRooms
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
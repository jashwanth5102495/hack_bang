# Code Description and Functionalities
## Mood Music & Cook Application

### 📋 Table of Contents
1. [Application Overview](#application-overview)
2. [Core Features](#core-features)
3. [Frontend Components](#frontend-components)
4. [Backend Services](#backend-services)
5. [Key Functionalities](#key-functionalities)
6. [Code Structure Analysis](#code-structure-analysis)
7. [API Endpoints](#api-endpoints)
8. [Data Models](#data-models)
9. [User Interface Components](#user-interface-components)
10. [Integration Features](#integration-features)

---

## 🎯 Application Overview

The **Mood Music & Cook** application is a comprehensive React Native mobile app that provides personalized recommendations for music, food, and entertainment based on the user's current mood. The application combines mood detection, social features, and e-commerce functionality to create a unique user experience.

### Core Purpose
- **Mood-Based Recommendations**: Analyze user mood and provide tailored content
- **Social Interaction**: Connect users with similar moods and preferences
- **E-commerce Integration**: Purchase recommended food items and recipes
- **Entertainment Hub**: Access mood-appropriate music, movies, and videos

---

## 🚀 Core Features

### 1. Mood Detection & Analysis
```typescript
// Mood selection with visual feedback
const MoodCards = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  
  const moodOptions = [
    { id: 'happy', name: 'Happy', color: '#FFD700', emoji: '😊' },
    { id: 'sad', name: 'Sad', color: '#4169E1', emoji: '😢' },
    { id: 'energetic', name: 'Energetic', color: '#FF6347', emoji: '⚡' },
    { id: 'calm', name: 'Calm', color: '#98FB98', emoji: '🧘' },
    { id: 'romantic', name: 'Romantic', color: '#FF69B4', emoji: '💕' },
    { id: 'stressed', name: 'Stressed', color: '#DC143C', emoji: '😰' }
  ];
  
  return (
    <View style={styles.moodContainer}>
      {moodOptions.map((mood) => (
        <MoodCard
          key={mood.id}
          mood={mood}
          isSelected={selectedMood === mood.id}
          onSelect={() => handleMoodSelection(mood)}
        />
      ))}
    </View>
  );
};
```

### 2. Personalized Recommendations
```typescript
// Recommendation engine based on mood
const MoodRecommendations = ({ mood }) => {
  const [recommendations, setRecommendations] = useState({
    food: [],
    music: [],
    movies: [],
    activities: []
  });
  
  useEffect(() => {
    fetchMoodBasedRecommendations(mood).then(setRecommendations);
  }, [mood]);
  
  return (
    <ScrollView>
      <FoodRecommendations items={recommendations.food} />
      <MusicRecommendations items={recommendations.music} />
      <MovieRecommendations items={recommendations.movies} />
      <ActivityRecommendations items={recommendations.activities} />
    </ScrollView>
  );
};
```

### 3. Social Features
```typescript
// User connections and mood sharing
const ConnectScreen = () => {
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [moodMatches, setMoodMatches] = useState([]);
  
  const findMoodMatches = async () => {
    const matches = await api.findUsersByMood(currentUserMood);
    setMoodMatches(matches);
  };
  
  return (
    <View>
      <MoodMatchSection users={moodMatches} />
      <NearbyUsersSection users={nearbyUsers} />
      <ChatInvitations />
    </View>
  );
};
```

---

## 🧩 Frontend Components

### Core UI Components

#### 1. MoodCards Component
```typescript
// Interactive mood selection cards with animations
export const MoodCards = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  const handleMoodPress = (mood) => {
    setSelectedMood(mood);
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    
    // Navigate to recommendations
    router.push(`/recommendations?mood=${mood.id}`);
  };
  
  return (
    <View style={styles.container}>
      {MOOD_OPTIONS.map((mood) => (
        <Animated.View
          key={mood.id}
          style={[
            styles.moodCard,
            {
              backgroundColor: mood.color,
              transform: [
                {
                  scale: selectedMood?.id === mood.id 
                    ? animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.1]
                      })
                    : 1
                }
              ]
            }
          ]}
        >
          <TouchableOpacity onPress={() => handleMoodPress(mood)}>
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text style={styles.moodName}>{mood.name}</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );
};
```

#### 2. CircularDishCards Component
```typescript
// Food recommendation cards with swipe functionality
export const CircularDishCards = ({ dishes, onDishSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const panResponder = useRef(
    PanGestureHandler.create({
      onGestureEvent: handleSwipe,
      onHandlerStateChange: handleSwipeEnd,
    })
  ).current;
  
  const handleSwipe = (event) => {
    const { translationX } = event.nativeEvent;
    
    if (translationX > 100) {
      // Swipe right - like dish
      likeDish(dishes[currentIndex]);
      nextDish();
    } else if (translationX < -100) {
      // Swipe left - skip dish
      skipDish(dishes[currentIndex]);
      nextDish();
    }
  };
  
  return (
    <View style={styles.cardContainer}>
      <PanGestureHandler {...panResponder}>
        <Animated.View style={styles.dishCard}>
          <Image source={{ uri: dishes[currentIndex]?.image }} />
          <Text style={styles.dishName}>{dishes[currentIndex]?.name}</Text>
          <Text style={styles.dishDescription}>
            {dishes[currentIndex]?.description}
          </Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={() => viewRecipe(dishes[currentIndex])}>
              <Text>View Recipe</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => addToCart(dishes[currentIndex])}>
              <Text>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};
```

#### 3. SwipeCard Component
```typescript
// Reusable swipe card for various content types
export const SwipeCard = ({ item, onSwipeLeft, onSwipeRight, children }) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
      opacity.value = interpolate(
        Math.abs(translateX.value),
        [0, 150],
        [1, 0.5]
      );
    },
    onEnd: (event) => {
      const shouldSwipeLeft = event.translationX < -100;
      const shouldSwipeRight = event.translationX > 100;
      
      if (shouldSwipeLeft) {
        translateX.value = withTiming(-300);
        runOnJS(onSwipeLeft)(item);
      } else if (shouldSwipeRight) {
        translateX.value = withTiming(300);
        runOnJS(onSwipeRight)(item);
      } else {
        translateX.value = withSpring(0);
        opacity.value = withTiming(1);
      }
    },
  });
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));
  
  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.card, animatedStyle]}>
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};
```

### Screen Components

#### 1. Home Screen (Dashboard)
```typescript
// Main dashboard with mood overview and quick actions
export default function HomeScreen() {
  const { user } = useUserContext();
  const { currentMood, moodHistory } = useMoodContext();
  const [todayStats, setTodayStats] = useState(null);
  
  useEffect(() => {
    loadTodayStats();
    loadRecentActivity();
  }, []);
  
  return (
    <ScrollView style={styles.container}>
      <Header user={user} />
      
      <MoodOverview 
        currentMood={currentMood}
        moodHistory={moodHistory}
      />
      
      <QuickActions 
        onMoodSelect={() => router.push('/mood')}
        onViewRecommendations={() => router.push('/recommendations')}
        onOpenChat={() => router.push('/chat')}
      />
      
      <TodayStats stats={todayStats} />
      
      <RecentActivity activities={recentActivity} />
      
      <MoodInsights insights={moodInsights} />
    </ScrollView>
  );
}
```

#### 2. Mood Selection Screen
```typescript
// Dedicated mood selection with enhanced UI
export default function MoodScreen() {
  const { setCurrentMood } = useMoodContext();
  const [selectedMood, setSelectedMood] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleMoodSelection = async (mood) => {
    setSelectedMood(mood);
    setIsLoading(true);
    
    try {
      // Update global mood state
      setCurrentMood(mood);
      
      // Save mood to backend
      await api.saveMoodSelection(mood);
      
      // Navigate to recommendations
      router.push({
        pathname: '/recommendations',
        params: { mood: mood.id }
      });
    } catch (error) {
      console.error('Error saving mood:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>
      
      <MoodCards 
        onMoodSelect={handleMoodSelection}
        selectedMood={selectedMood}
      />
      
      <MoodHistory />
      
      <MoodTips />
      
      {isLoading && <LoadingOverlay />}
    </View>
  );
}
```

#### 3. Recommendations Screen
```typescript
// Mood-based recommendations display
export default function RecommendationsScreen() {
  const { mood } = useLocalSearchParams();
  const [recommendations, setRecommendations] = useState(null);
  const [activeTab, setActiveTab] = useState('food');
  
  useEffect(() => {
    if (mood) {
      fetchRecommendations(mood);
    }
  }, [mood]);
  
  const fetchRecommendations = async (moodId) => {
    try {
      const data = await api.getMoodRecommendations(moodId);
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <MoodHeader mood={mood} />
      
      <TabNavigation 
        tabs={['food', 'music', 'movies', 'activities']}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <TabContent>
        {activeTab === 'food' && (
          <FoodRecommendations 
            items={recommendations?.food}
            onItemSelect={handleFoodSelect}
          />
        )}
        
        {activeTab === 'music' && (
          <MusicRecommendations 
            items={recommendations?.music}
            onItemSelect={handleMusicSelect}
          />
        )}
        
        {activeTab === 'movies' && (
          <MovieRecommendations 
            items={recommendations?.movies}
            onItemSelect={handleMovieSelect}
          />
        )}
        
        {activeTab === 'activities' && (
          <ActivityRecommendations 
            items={recommendations?.activities}
            onItemSelect={handleActivitySelect}
          />
        )}
      </TabContent>
    </View>
  );
}
```

---

## 🔧 Backend Services

### API Server Structure
```javascript
// Main server setup with Express.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/moods', require('./routes/moods'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/chat', require('./routes/chat'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Authentication Service
```javascript
// User authentication and authorization
const authRoutes = express.Router();

// User registration
authRoutes.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      profile: { name }
    });
    
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.profile.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// User login
authRoutes.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.profile.name,
        preferences: user.profile.preferences
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = authRoutes;
```

### Mood Service
```javascript
// Mood-related API endpoints
const moodRoutes = express.Router();
const authenticateToken = require('../middleware/auth');

// Save mood selection
moodRoutes.post('/select', authenticateToken, async (req, res) => {
  try {
    const { mood, timestamp } = req.body;
    const userId = req.user.userId;
    
    // Update user's mood history
    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          moodHistory: {
            mood,
            timestamp: timestamp || new Date(),
            recommendations: []
          }
        }
      }
    );
    
    res.json({ message: 'Mood saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving mood', error: error.message });
  }
});

// Get mood-based recommendations
moodRoutes.get('/recommendations/:mood', authenticateToken, async (req, res) => {
  try {
    const { mood } = req.params;
    const userId = req.user.userId;
    
    // Get user preferences
    const user = await User.findById(userId);
    const preferences = user.profile.preferences || {};
    
    // Generate recommendations based on mood and preferences
    const recommendations = await generateMoodRecommendations(mood, preferences);
    
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching recommendations', 
      error: error.message 
    });
  }
});

// Recommendation generation logic
async function generateMoodRecommendations(mood, preferences) {
  const recommendations = {
    food: [],
    music: [],
    movies: [],
    activities: []
  };
  
  // Food recommendations based on mood
  switch (mood) {
    case 'happy':
      recommendations.food = [
        { name: 'Colorful Fruit Salad', type: 'healthy', mood: 'happy' },
        { name: 'Celebration Cake', type: 'dessert', mood: 'happy' },
        { name: 'Fresh Smoothie Bowl', type: 'breakfast', mood: 'happy' }
      ];
      break;
    case 'sad':
      recommendations.food = [
        { name: 'Comfort Mac & Cheese', type: 'comfort', mood: 'sad' },
        { name: 'Warm Chocolate Pudding', type: 'dessert', mood: 'sad' },
        { name: 'Hearty Chicken Soup', type: 'soup', mood: 'sad' }
      ];
      break;
    case 'energetic':
      recommendations.food = [
        { name: 'Protein Power Bowl', type: 'healthy', mood: 'energetic' },
        { name: 'Energy Bars', type: 'snack', mood: 'energetic' },
        { name: 'Green Smoothie', type: 'drink', mood: 'energetic' }
      ];
      break;
    // Add more mood-based recommendations
  }
  
  // Music recommendations
  recommendations.music = await getMusicByMood(mood, preferences.musicGenres);
  
  // Movie recommendations
  recommendations.movies = await getMoviesByMood(mood, preferences.movieGenres);
  
  // Activity recommendations
  recommendations.activities = await getActivitiesByMood(mood);
  
  return recommendations;
}

module.exports = moodRoutes;
```

---

## 🎨 Key Functionalities

### 1. Mood-Based Content Curation
```typescript
// Advanced mood analysis and content matching
class MoodAnalyzer {
  static analyzeMood(userInput: MoodInput): MoodProfile {
    const moodProfile = {
      primary: userInput.selectedMood,
      intensity: this.calculateIntensity(userInput),
      duration: userInput.duration || 'current',
      context: userInput.context || 'general',
      preferences: userInput.userPreferences
    };
    
    return moodProfile;
  }
  
  static generateRecommendations(moodProfile: MoodProfile): Recommendations {
    const recommendations = {
      food: this.getFoodRecommendations(moodProfile),
      music: this.getMusicRecommendations(moodProfile),
      movies: this.getMovieRecommendations(moodProfile),
      activities: this.getActivityRecommendations(moodProfile)
    };
    
    return this.personalizeRecommendations(recommendations, moodProfile);
  }
  
  private static getFoodRecommendations(mood: MoodProfile): FoodItem[] {
    const moodFoodMap = {
      happy: ['colorful salads', 'fresh fruits', 'light desserts'],
      sad: ['comfort foods', 'warm soups', 'chocolate treats'],
      energetic: ['protein bowls', 'energy snacks', 'smoothies'],
      calm: ['herbal teas', 'light meals', 'soothing foods'],
      romantic: ['elegant dishes', 'wine pairings', 'desserts'],
      stressed: ['comfort foods', 'calming teas', 'easy meals']
    };
    
    return this.fetchFoodItems(moodFoodMap[mood.primary]);
  }
}
```

### 2. Social Mood Matching
```typescript
// Connect users with similar moods
class SocialMoodMatcher {
  static async findMoodMatches(userId: string, currentMood: string): Promise<User[]> {
    const matches = await User.find({
      _id: { $ne: userId },
      'currentMood.mood': currentMood,
      'currentMood.timestamp': {
        $gte: new Date(Date.now() - 2 * 60 * 60 * 1000) // Last 2 hours
      },
      'privacy.allowMoodMatching': true
    }).limit(10);
    
    return matches.map(user => ({
      id: user._id,
      name: user.profile.name,
      avatar: user.profile.avatar,
      mood: user.currentMood,
      compatibility: this.calculateCompatibility(userId, user._id)
    }));
  }
  
  static calculateCompatibility(user1Id: string, user2Id: string): number {
    // Calculate compatibility based on mood history, preferences, etc.
    // Return compatibility score between 0-100
    return Math.floor(Math.random() * 100); // Placeholder
  }
  
  static async sendMoodInvitation(fromUserId: string, toUserId: string, mood: string) {
    const invitation = new MoodInvitation({
      from: fromUserId,
      to: toUserId,
      mood,
      type: 'mood_match',
      status: 'pending',
      createdAt: new Date()
    });
    
    await invitation.save();
    
    // Send real-time notification
    this.sendRealTimeNotification(toUserId, {
      type: 'mood_invitation',
      from: fromUserId,
      mood,
      message: `Someone with a ${mood} mood wants to connect!`
    });
  }
}
```

### 3. E-commerce Integration
```typescript
// Shopping cart and payment processing
class EcommerceService {
  static async addToCart(userId: string, item: FoodItem, quantity: number) {
    const cartItem = {
      itemId: item.id,
      name: item.name,
      price: item.price,
      quantity,
      mood: item.recommendedForMood,
      addedAt: new Date()
    };
    
    await User.findByIdAndUpdate(
      userId,
      { $push: { 'cart.items': cartItem } }
    );
    
    return cartItem;
  }
  
  static async processPayment(userId: string, paymentDetails: PaymentDetails) {
    try {
      // Integrate with Razorpay or other payment gateway
      const paymentResult = await RazorpayService.processPayment({
        amount: paymentDetails.amount,
        currency: 'INR',
        orderId: paymentDetails.orderId,
        paymentMethodId: paymentDetails.paymentMethodId
      });
      
      if (paymentResult.success) {
        // Update order status
        await this.createOrder(userId, paymentDetails);
        await this.clearCart(userId);
        
        return {
          success: true,
          orderId: paymentResult.orderId,
          transactionId: paymentResult.transactionId
        };
      }
      
      return { success: false, error: paymentResult.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  static async createOrder(userId: string, paymentDetails: PaymentDetails) {
    const order = new Order({
      userId,
      items: paymentDetails.items,
      totalAmount: paymentDetails.amount,
      paymentStatus: 'completed',
      orderStatus: 'confirmed',
      deliveryAddress: paymentDetails.deliveryAddress,
      createdAt: new Date()
    });
    
    await order.save();
    return order;
  }
}
```

### 4. Real-time Chat System
```typescript
// WebSocket-based chat functionality
class ChatService {
  private static io: SocketIOServer;
  
  static initializeSocket(server: any) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    
    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id);
      
      socket.on('join_mood_room', (mood) => {
        socket.join(`mood_${mood}`);
        socket.emit('joined_room', `mood_${mood}`);
      });
      
      socket.on('send_message', async (data) => {
        const message = await this.saveMessage(data);
        this.io.to(data.roomId).emit('new_message', message);
      });
      
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }
  
  static async saveMessage(messageData: any) {
    const message = new ChatMessage({
      senderId: messageData.senderId,
      roomId: messageData.roomId,
      content: messageData.content,
      type: messageData.type || 'text',
      timestamp: new Date()
    });
    
    await message.save();
    return message;
  }
  
  static async getChatHistory(roomId: string, limit: number = 50) {
    const messages = await ChatMessage.find({ roomId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('senderId', 'profile.name profile.avatar');
    
    return messages.reverse();
  }
}
```

---

## 📊 Data Models

### User Model
```javascript
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: null
    },
    dateOfBirth: Date,
    location: {
      city: String,
      country: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    preferences: {
      cuisines: [String],
      musicGenres: [String],
      movieGenres: [String],
      dietaryRestrictions: [String],
      allergies: [String]
    }
  },
  moodHistory: [{
    mood: {
      type: String,
      required: true
    },
    intensity: {
      type: Number,
      min: 1,
      max: 10,
      default: 5
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    context: String,
    recommendations: [{
      type: String,
      category: String,
      interacted: Boolean,
      rating: Number
    }]
  }],
  currentMood: {
    mood: String,
    timestamp: Date,
    intensity: Number
  },
  cart: {
    items: [{
      itemId: String,
      name: String,
      price: Number,
      quantity: Number,
      mood: String,
      addedAt: Date
    }],
    totalAmount: {
      type: Number,
      default: 0
    }
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  socialConnections: {
    friends: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      connectedAt: Date,
      connectionType: String
    }],
    moodMatches: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      mood: String,
      matchedAt: Date
    }]
  },
  privacy: {
    allowMoodMatching: {
      type: Boolean,
      default: true
    },
    shareLocation: {
      type: Boolean,
      default: false
    },
    profileVisibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'friends'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
```

### Food Item Model
```javascript
const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  image: String,
  category: {
    type: String,
    enum: ['appetizer', 'main', 'dessert', 'beverage', 'snack'],
    required: true
  },
  cuisine: String,
  moodTags: [String],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number
  },
  ingredients: [String],
  recipe: {
    instructions: [String],
    prepTime: Number,
    cookTime: Number,
    servings: Number,
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    }
  },
  price: {
    type: Number,
    required: true
  },
  availability: {
    type: Boolean,
    default: true
  },
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FoodItem', foodItemSchema);
```

---

## 🎵 API Endpoints

### Authentication Endpoints
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/verify-email/:token
```

### User Management Endpoints
```
GET    /api/users/profile
PUT    /api/users/profile
DELETE /api/users/account
GET    /api/users/mood-history
POST   /api/users/update-preferences
GET    /api/users/recommendations
POST   /api/users/save-recommendation-feedback
```

### Mood-Related Endpoints
```
POST /api/moods/select
GET  /api/moods/recommendations/:mood
GET  /api/moods/history
POST /api/moods/share
GET  /api/moods/matches
POST /api/moods/invite-user
```

### Food & E-commerce Endpoints
```
GET    /api/food/items
GET    /api/food/items/:id
POST   /api/food/search
GET    /api/food/by-mood/:mood
POST   /api/cart/add
GET    /api/cart
PUT    /api/cart/update
DELETE /api/cart/remove/:itemId
POST   /api/orders/create
GET    /api/orders/history
POST   /api/payment/process
```

### Social Features Endpoints
```
GET  /api/social/nearby-users
GET  /api/social/mood-matches
POST /api/social/send-invitation
POST /api/social/accept-invitation
GET  /api/social/connections
POST /api/social/chat/send-message
GET  /api/social/chat/history/:roomId
```

---

## 🎨 User Interface Components

### Animation Components
```typescript
// Smooth animations for mood transitions
export const MoodTransition = ({ children, mood }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [mood]);
  
  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      {children}
    </Animated.View>
  );
};
```

### Interactive Components
```typescript
// Interactive food cards with gestures
export const InteractiveFoodCard = ({ food, onLike, onDislike, onViewRecipe }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;
  
  const flipCard = () => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 0 : 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };
  
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });
  
  return (
    <View style={styles.cardContainer}>
      <Animated.View
        style={[
          styles.card,
          { transform: [{ rotateY: frontInterpolate }] }
        ]}
      >
        <Image source={{ uri: food.image }} style={styles.foodImage} />
        <Text style={styles.foodName}>{food.name}</Text>
        <Text style={styles.foodDescription}>{food.description}</Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={onDislike} style={styles.dislikeButton}>
            <Icon name="x" size={24} color="#ff4757" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={flipCard} style={styles.infoButton}>
            <Icon name="info" size={24} color="#3742fa" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={onLike} style={styles.likeButton}>
            <Icon name="heart" size={24} color="#2ed573" />
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      <Animated.View
        style={[
          styles.card,
          styles.cardBack,
          { transform: [{ rotateY: backInterpolate }] }
        ]}
      >
        <ScrollView>
          <Text style={styles.recipeTitle}>Recipe</Text>
          <Text style={styles.ingredients}>
            Ingredients: {food.recipe?.ingredients?.join(', ')}
          </Text>
          <Text style={styles.instructions}>
            {food.recipe?.instructions?.join('\n')}
          </Text>
          
          <TouchableOpacity onPress={onViewRecipe} style={styles.fullRecipeButton}>
            <Text style={styles.buttonText}>View Full Recipe</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>
  );
};
```

---

## 🔗 Integration Features

### Payment Integration (Razorpay)
```typescript
// Razorpay payment processing
export const RazorpayPayment = ({ amount, orderId, onSuccess, onFailure }) => {
  const processPayment = async () => {
    try {
      const options = {
        description: 'Mood-based food order',
        image: 'https://your-app-logo.png',
        currency: 'INR',
        key: 'your_razorpay_key',
        amount: amount * 100, // Amount in paise
        name: 'Mood Music & Cook',
        order_id: orderId,
        prefill: {
          email: 'user@example.com',
          contact: '9999999999',
          name: 'User Name'
        },
        theme: { color: '#3399cc' }
      };
      
      RazorpayCheckout.open(options)
        .then((data) => {
          onSuccess(data);
        })
        .catch((error) => {
          onFailure(error);
        });
    } catch (error) {
      onFailure(error);
    }
  };
  
  return (
    <TouchableOpacity onPress={processPayment} style={styles.payButton}>
      <Text style={styles.payButtonText}>Pay ₹{amount}</Text>
    </TouchableOpacity>
  );
};
```

### Music Integration
```typescript
// Music streaming integration
export const MusicPlayer = ({ playlist, currentMood }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    if (playlist && playlist.length > 0) {
      setCurrentTrack(playlist[0]);
    }
  }, [playlist]);
  
  const playTrack = async (track) => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.streamUrl },
        { shouldPlay: true }
      );
      
      setIsPlaying(true);
      setCurrentTrack(track);
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };
  
  return (
    <View style={styles.musicPlayer}>
      <Text style={styles.moodLabel}>Music for {currentMood} mood</Text>
      
      {currentTrack && (
        <View style={styles.currentTrack}>
          <Image source={{ uri: currentTrack.albumArt }} style={styles.albumArt} />
          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle}>{currentTrack.title}</Text>
            <Text style={styles.trackArtist}>{currentTrack.artist}</Text>
          </View>
        </View>
      )}
      
      <View style={styles.controls}>
        <TouchableOpacity onPress={previousTrack}>
          <Icon name="skip-back" size={24} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={togglePlayPause}>
          <Icon name={isPlaying ? "pause" : "play"} size={32} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={nextTrack}>
          <Icon name="skip-forward" size={24} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={playlist}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => playTrack(item)}>
            <Text>{item.title} - {item.artist}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};
```

---

This comprehensive documentation covers all the major code components and functionalities of the Mood Music & Cook application, providing detailed insights into the implementation, architecture, and features that make this app a unique mood-based recommendation platform.
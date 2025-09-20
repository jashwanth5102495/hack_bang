# Project Architecture Overview
## Mood Music & Cook Application

### 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [Data Flow](#data-flow)
7. [Design Patterns](#design-patterns)
8. [Security Architecture](#security-architecture)

---

## 🏗️ Architecture Overview

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Web App       │    │   Backend API   │
│  (React Native) │◄──►│  (Expo Web)     │◄──►│   (Node.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Local Storage │    │   Session       │    │   MongoDB       │
│   (AsyncStorage)│    │   Storage       │    │   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Application Layers
1. **Presentation Layer**: React Native components and screens
2. **Business Logic Layer**: Context providers and custom hooks
3. **Data Access Layer**: API services and local storage
4. **Backend Layer**: Express.js server with MongoDB

---

## 💻 Technology Stack

### Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.74.x | Cross-platform mobile framework |
| Expo | SDK 51 | Development platform and tools |
| TypeScript | 5.x | Type safety and development experience |
| Expo Router | v3 | File-based navigation system |
| React Context | Built-in | State management |
| Lucide React Native | Latest | Icon library |
| Expo Linear Gradient | Latest | Visual effects |

### Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x+ | Server runtime environment |
| Express.js | 4.x | Web application framework |
| MongoDB | 6.x | NoSQL database |
| Mongoose | 7.x | MongoDB object modeling |
| JWT | Latest | Authentication tokens |
| bcryptjs | Latest | Password hashing |

### Development Tools
| Tool | Purpose |
|------|---------|
| ESLint | Code linting and quality |
| Prettier | Code formatting |
| TypeScript | Static type checking |
| Metro | JavaScript bundler |
| Expo CLI | Development and build tools |

---

## 📁 Project Structure

### Root Directory Structure
```
project/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Tab navigation screens
│   └── *.tsx              # Individual screens
├── components/            # Reusable UI components
├── contexts/              # React Context providers
├── hooks/                 # Custom React hooks
├── assets/                # Static assets (images, fonts)
├── img/                   # Local images for mood cards
├── videos/                # Video content by mood
├── food images/           # Food images organized by mood
├── backend/               # Backend server code
├── data/                  # Static data and configurations
└── docs/                  # Documentation files
```

### Frontend Architecture Breakdown

#### App Directory (Expo Router)
```
app/
├── (auth)/                # Authentication flow
│   ├── _layout.tsx       # Auth layout wrapper
│   ├── login.tsx         # Login screen
│   ├── profile-setup.tsx # Profile setup
│   ├── verify.tsx        # Email verification
│   └── welcome.tsx       # Welcome screen
├── (tabs)/               # Main app navigation
│   ├── _layout.tsx       # Tab layout with bottom navigation
│   ├── index.tsx         # Home/Dashboard screen
│   ├── mood.tsx          # Mood selection screen
│   ├── chat.tsx          # Chat functionality
│   ├── connect.tsx       # Social connections
│   ├── profile.tsx       # User profile
│   └── reels.tsx         # Video content
├── recommendations.tsx    # Mood-based recommendations
├── mood-results.tsx      # Mood analysis results
├── cart.tsx              # Shopping cart
├── movies.tsx            # Movie recommendations
├── music.tsx             # Music recommendations
└── _layout.tsx           # Root layout
```

#### Components Architecture
```
components/
├── MoodCards.tsx          # Interactive mood selection cards
├── CircularDishCards.tsx  # Food recommendation cards
├── SwipeCard.tsx          # Swipeable card component
├── MoodRecommendations.tsx # Mood-based content suggestions
├── FoodActionPopup.tsx    # Food interaction modal
├── RecipeModal.tsx        # Recipe details modal
├── RazorpayPayment.tsx    # Payment integration
├── ScrollingMoodCode.tsx  # Animated mood codes
└── ScrollingMoodQuotes.tsx # Inspirational quotes
```

#### Context Providers
```
contexts/
├── MoodContext.tsx        # Mood state management
├── UserContext.tsx        # User authentication state
├── CartContext.tsx        # Shopping cart state
└── ThemeContext.tsx       # Theme switching
```

---

## 🎨 Frontend Architecture

### Component Hierarchy
```
App
├── RootLayout
│   ├── AuthLayout (for auth screens)
│   │   ├── LoginScreen
│   │   ├── WelcomeScreen
│   │   └── ProfileSetupScreen
│   └── TabLayout (for main app)
│       ├── HomeScreen
│       │   ├── MoodCards
│       │   ├── QuickActions
│       │   └── MoodStats
│       ├── MoodScreen
│       │   ├── MoodCards
│       │   └── MoodRecommendations
│       ├── ChatScreen
│       ├── ConnectScreen
│       └── ProfileScreen
```

### State Management Architecture
```
┌─────────────────┐
│   MoodContext   │ ──► Global mood state
├─────────────────┤
│   UserContext   │ ──► Authentication state
├─────────────────┤
│   CartContext   │ ──► Shopping cart state
├─────────────────┤
│  ThemeContext   │ ──► Theme preferences
└─────────────────┘
```

### Navigation Architecture
- **File-based routing** with Expo Router
- **Nested layouts** for different app sections
- **Tab navigation** for main app screens
- **Stack navigation** for detailed views
- **Modal navigation** for overlays and popups

---

## 🔧 Backend Architecture

### Server Structure
```
backend/
├── server.js              # Main server entry point
├── routes/                # API route handlers
│   ├── auth.js           # Authentication routes
│   ├── users.js          # User management
│   ├── moods.js          # Mood-related endpoints
│   ├── movies.js         # Movie recommendations
│   └── chat.js           # Chat functionality
├── models/               # Database models
│   └── User.js           # User schema
├── middleware/           # Custom middleware
│   └── auth.js           # Authentication middleware
└── package.json          # Backend dependencies
```

### API Architecture
```
┌─────────────────┐
│   Express.js    │ ──► Web framework
├─────────────────┤
│   Middleware    │ ──► Authentication, CORS, Logging
├─────────────────┤
│   Routes        │ ──► API endpoints
├─────────────────┤
│   Controllers   │ ──► Business logic
├─────────────────┤
│   Models        │ ──► Data models (Mongoose)
├─────────────────┤
│   Database      │ ──► MongoDB
└─────────────────┘
```

### Database Schema
```javascript
// User Model
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  profile: {
    name: String,
    avatar: String,
    preferences: {
      moods: [String],
      cuisines: [String],
      musicGenres: [String]
    }
  },
  moodHistory: [{
    mood: String,
    timestamp: Date,
    recommendations: [Object]
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔄 Data Flow

### Mood Selection Flow
```
1. User selects mood card
   ↓
2. MoodContext updates global state
   ↓
3. Navigation to recommendations screen
   ↓
4. API call to backend for personalized content
   ↓
5. Display mood-based recommendations
   ↓
6. User interacts with recommendations
   ↓
7. Update user preferences and history
```

### Authentication Flow
```
1. User enters credentials
   ↓
2. Frontend validates input
   ↓
3. API call to /auth/login
   ↓
4. Backend validates credentials
   ↓
5. JWT token generated and returned
   ↓
6. Token stored in secure storage
   ↓
7. UserContext updated with user data
   ↓
8. Navigation to main app
```

### Real-time Data Flow
```
Frontend ←──► WebSocket ←──► Backend ←──► Database
    │                              │
    ├── Mood updates              ├── User preferences
    ├── Chat messages             ├── Recommendation history
    └── Social interactions       └── Real-time notifications
```

---

## 🎯 Design Patterns

### Frontend Patterns

#### 1. Component Composition
```typescript
// Higher-order component pattern
const withMoodContext = (Component) => {
  return (props) => {
    const moodContext = useMoodContext();
    return <Component {...props} moodContext={moodContext} />;
  };
};
```

#### 2. Custom Hooks Pattern
```typescript
// Custom hook for mood management
const useMoodSelection = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  
  const selectMood = useCallback((mood) => {
    setSelectedMood(mood);
    fetchRecommendations(mood);
  }, []);
  
  return { selectedMood, recommendations, selectMood };
};
```

#### 3. Provider Pattern
```typescript
// Context provider pattern
export const MoodProvider = ({ children }) => {
  const [moodState, setMoodState] = useState(initialState);
  
  return (
    <MoodContext.Provider value={{ moodState, setMoodState }}>
      {children}
    </MoodContext.Provider>
  );
};
```

### Backend Patterns

#### 1. Middleware Pattern
```javascript
// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
```

#### 2. Repository Pattern
```javascript
// Data access layer
class UserRepository {
  async findById(id) {
    return await User.findById(id);
  }
  
  async create(userData) {
    return await User.create(userData);
  }
  
  async updateMoodHistory(userId, moodData) {
    return await User.findByIdAndUpdate(
      userId,
      { $push: { moodHistory: moodData } },
      { new: true }
    );
  }
}
```

---

## 🔒 Security Architecture

### Frontend Security
- **Secure Storage**: Sensitive data stored using Expo SecureStore
- **Input Validation**: Client-side validation for all user inputs
- **HTTPS Only**: All API communications over HTTPS
- **Token Management**: Automatic token refresh and secure storage

### Backend Security
- **Authentication**: JWT-based authentication
- **Password Security**: bcrypt hashing with salt rounds
- **CORS Configuration**: Restricted cross-origin requests
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Sanitization**: Mongoose schema validation
- **Environment Variables**: Sensitive data in environment variables

### Data Security
```javascript
// Password hashing
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// JWT token generation
const token = jwt.sign(
  { userId: user._id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

---

## 📊 Performance Architecture

### Frontend Optimization
- **Code Splitting**: Dynamic imports for large components
- **Image Optimization**: Optimized image formats and lazy loading
- **Caching**: React Query for API response caching
- **Bundle Optimization**: Tree shaking and minification

### Backend Optimization
- **Database Indexing**: Optimized MongoDB indexes
- **Caching Layer**: Redis for frequently accessed data
- **Connection Pooling**: MongoDB connection pooling
- **Compression**: Gzip compression for API responses

---

## 🔄 Scalability Considerations

### Horizontal Scaling
- **Microservices**: Modular backend services
- **Load Balancing**: Multiple server instances
- **Database Sharding**: Distributed database architecture
- **CDN Integration**: Content delivery network for assets

### Vertical Scaling
- **Resource Optimization**: Efficient memory and CPU usage
- **Database Optimization**: Query optimization and indexing
- **Caching Strategies**: Multi-level caching implementation

---

This architecture provides a solid foundation for the Mood Music & Cook application, ensuring scalability, maintainability, and excellent user experience across all platforms.
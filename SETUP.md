# Setup Instructions

## Install Missing Dependencies

Run the following command to install the missing dependencies:

```bash
npx expo install expo-location
```

## Fix Build Issues

The current build errors are likely due to:

1. **Missing expo-location dependency** - Install it with the command above
2. **Server configuration** - Make sure the development server is running properly

## After Installing Dependencies

1. **Restart the development server**:
   ```bash
   npx expo start --clear
   ```

2. **If you're still getting MIME type errors**, try:
   ```bash
   npx expo start --tunnel
   ```

## Enable Location Features

Once `expo-location` is installed, you can uncomment the location imports in:
- `app/movies.tsx`
- `app/friends.tsx`

And replace the mock location functions with the real ones.

## Backend Setup (Optional)

To enable the full backend functionality:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your MongoDB URI and JWT secret

5. Start the backend server:
   ```bash
   npm run dev
   ```

## Features Working Without Backend

The following features work with mock data:
- ✅ Mood analysis and recommendations
- ✅ Movies discovery (with mock data)
- ✅ Friends discovery (with mock data)  
- ✅ Profile management (local state)
- ✅ All UI components and navigation

## Features Requiring Backend

- Real-time chat
- User authentication
- Data persistence
- Location-based user matching
- Movie API integration
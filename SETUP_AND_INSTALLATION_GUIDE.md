# Setup and Installation Guide
## Mood Music & Cook Application

### 📋 Table of Contents
1. [System Requirements](#system-requirements)
2. [Prerequisites](#prerequisites)
3. [Installation Steps](#installation-steps)
4. [Environment Setup](#environment-setup)
5. [Running the Application](#running-the-application)
6. [Troubleshooting](#troubleshooting)
7. [Development Tools](#development-tools)

---

## 🖥️ System Requirements

### Minimum Requirements
- **Operating System**: Windows 10/11, macOS 10.15+, or Ubuntu 18.04+
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 5GB free space
- **Internet**: Stable internet connection for package downloads

### Recommended Development Environment
- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher (comes with Node.js)
- **Git**: Latest version
- **Code Editor**: Visual Studio Code (recommended)

---

## 🔧 Prerequisites

### 1. Install Node.js and npm
```bash
# Download from https://nodejs.org/
# Verify installation
node --version
npm --version
```

### 2. Install Git
```bash
# Download from https://git-scm.com/
# Verify installation
git --version
```

### 3. Install Expo CLI (Global)
```bash
npm install -g @expo/cli
```

### 4. Mobile Development Setup

#### For iOS Development (macOS only)
- Install Xcode from App Store
- Install Xcode Command Line Tools
- Install iOS Simulator

#### For Android Development
- Install Android Studio
- Set up Android SDK
- Configure Android Virtual Device (AVD)

---

## 📦 Installation Steps

### Step 1: Clone the Repository
```bash
git clone https://github.com/jashwanth5102495/hack_bang.git
cd project
```

### Step 2: Install Frontend Dependencies
```bash
# Install main project dependencies
npm install

# Verify package installation
npm list --depth=0
```

### Step 3: Install Backend Dependencies
```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Return to project root
cd ..
```

### Step 4: Verify Installation
```bash
# Check if all dependencies are installed correctly
npm run check-deps
```

---

## 🌍 Environment Setup

### 1. Environment Variables
Create a `.env` file in the project root:
```env
# Expo Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_APP_ENV=development

# Backend Configuration (in backend/.env)
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here
MONGODB_URI=mongodb://localhost:27017/mood_music_cook
```

### 2. Backend Environment Setup
Create `backend/.env` file:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key
MONGODB_URI=mongodb://localhost:27017/mood_music_cook
CORS_ORIGIN=http://localhost:8081
```

---

## 🚀 Running the Application

### Development Mode

#### Option 1: Start Everything at Once
```bash
# Start both frontend and backend
npm run dev
```

#### Option 2: Start Services Separately

**Terminal 1 - Frontend (Expo)**
```bash
npx expo start --clear
```

**Terminal 2 - Backend Server**
```bash
cd backend
npm start
```

### Production Build

#### Web Build
```bash
npm run build:web
```

#### Mobile Build
```bash
# Android
npm run build:android

# iOS (macOS only)
npm run build:ios
```

---

## 📱 Device Testing

### Physical Device Testing
1. Install Expo Go app on your mobile device
2. Scan QR code from Expo development server
3. App will load on your device

### Simulator/Emulator Testing
```bash
# iOS Simulator (macOS only)
npx expo start --ios

# Android Emulator
npx expo start --android
```

### Web Testing
```bash
# Open in web browser
npx expo start --web
```

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. Expo CLI Issues
```bash
# Update Expo CLI
npm install -g @expo/cli@latest

# Clear Expo cache
npx expo install --fix
```

#### 3. Metro Bundler Issues
```bash
# Clear Metro cache
npx expo start --clear

# Reset Metro cache
npx react-native start --reset-cache
```

#### 4. Port Conflicts
```bash
# Kill processes on port 3000
npx kill-port 3000

# Kill processes on port 8081
npx kill-port 8081
```

#### 5. Android Emulator Issues
```bash
# List available AVDs
emulator -list-avds

# Start specific AVD
emulator -avd YOUR_AVD_NAME
```

### Error Messages and Solutions

| Error | Solution |
|-------|----------|
| `EADDRINUSE: address already in use` | Kill process on port or use different port |
| `Module not found` | Run `npm install` or check import paths |
| `Expo CLI not found` | Install globally: `npm install -g @expo/cli` |
| `Android SDK not found` | Set ANDROID_HOME environment variable |
| `iOS Simulator not found` | Install Xcode and iOS Simulator |

---

## 🛠️ Development Tools

### Recommended VS Code Extensions
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "expo.vscode-expo-tools"
  ]
}
```

### Code Formatting Setup
```bash
# Install Prettier globally
npm install -g prettier

# Format all files
npm run format
```

### Linting Setup
```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix
```

---

## 📊 Performance Optimization

### Bundle Analysis
```bash
# Analyze bundle size
npx expo export --platform web
npx webpack-bundle-analyzer web-build/static/js/*.js
```

### Memory Usage
```bash
# Monitor memory usage during development
npx expo start --dev-client
```

---

## 🔄 Updates and Maintenance

### Keeping Dependencies Updated
```bash
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Update Expo SDK
npx expo install --fix
```

### Version Management
```bash
# Check current versions
npx expo diagnostics

# Upgrade Expo SDK
npx expo upgrade
```

---

## 📞 Support and Help

### Getting Help
- **Documentation**: Check this guide first
- **Expo Documentation**: https://docs.expo.dev/
- **React Native Documentation**: https://reactnative.dev/docs/getting-started
- **Community**: Stack Overflow, Reddit r/reactnative

### Reporting Issues
1. Check existing issues in the repository
2. Provide detailed error messages
3. Include system information
4. Share reproduction steps

---

## ✅ Installation Checklist

- [ ] Node.js and npm installed
- [ ] Git installed and configured
- [ ] Expo CLI installed globally
- [ ] Repository cloned
- [ ] Dependencies installed (frontend & backend)
- [ ] Environment variables configured
- [ ] Development server running
- [ ] Mobile device/simulator connected
- [ ] Application loads successfully

---

**🎉 Congratulations!** You have successfully set up the Mood Music & Cook application. You're now ready to start developing and exploring the features!

For the next steps, refer to the [Project Architecture Overview](./PROJECT_ARCHITECTURE_OVERVIEW.md) and [Code Description and Functionalities](./CODE_DESCRIPTION_AND_FUNCTIONALITIES.md) documentation.
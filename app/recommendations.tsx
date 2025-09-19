import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Heart, X, RotateCcw, Settings, SkipForward } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import SwipeCard from '../components/SwipeCard';
import { useMood } from '../contexts/MoodContext';

const { width, height } = Dimensions.get('window');

// Sample data - in a real app, this would come from an API
const recommendations = [
  {
    id: '1',
    title: 'Lofi Hip Hop',
    artist: 'ChilledCow',
    genre: 'Lofi',
    mood: 'Relaxed',
    gradient: ['#667eea', '#764ba2'],
    description: 'Perfect for studying and relaxation. Smooth beats to calm your mind.',
  },
  {
    id: '2',
    title: 'Energetic Pop',
    artist: 'Various Artists',
    genre: 'Pop',
    mood: 'Happy',
    gradient: ['#f093fb', '#f5576c'],
    description: 'Upbeat tracks to boost your energy and mood. Dance-worthy hits.',
  },
  {
    id: '3',
    title: 'Ambient Soundscapes',
    artist: 'Nature Sounds',
    genre: 'Ambient',
    mood: 'Peaceful',
    gradient: ['#4facfe', '#00f2fe'],
    description: 'Immersive soundscapes for meditation and deep focus.',
  },
  {
    id: '4',
    title: 'Indie Rock Vibes',
    artist: 'Indie Collective',
    genre: 'Rock',
    mood: 'Energetic',
    gradient: ['#fa709a', '#fee140'],
    description: 'Alternative rock tracks with a modern twist. Perfect for motivation.',
  },
  {
    id: '5',
    title: 'Jazz Classics',
    artist: 'Jazz Masters',
    genre: 'Jazz',
    mood: 'Sophisticated',
    gradient: ['#a8edea', '#fed6e3'],
    description: 'Timeless jazz pieces for a refined listening experience.',
  },
  {
    id: '6',
    title: 'Electronic Chill',
    artist: 'Synth Wave',
    genre: 'Electronic',
    mood: 'Focused',
    gradient: ['#d299c2', '#fef9d7'],
    description: 'Atmospheric electronic music for deep work sessions.',
  },
];

export default function RecommendationsScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedItems, setLikedItems] = useState<string[]>([]);
  const [passedItems, setPassedItems] = useState<string[]>([]);
  const { setMoodAnalysis } = useMood();

  const currentCard = recommendations[currentIndex];
  const nextCardData = recommendations[currentIndex + 1];

  const handleSwipeRight = () => {
    if (currentCard) {
      setLikedItems(prev => [...prev, currentCard.id]);
      goToNextCard();
    }
  };

  const handleSwipeLeft = () => {
    if (currentCard) {
      setPassedItems(prev => [...prev, currentCard.id]);
      goToNextCard();
    }
  };

  const analyzeMood = () => {
    const likedRecommendations = recommendations.filter(rec => likedItems.includes(rec.id));
    
    // Analyze mood based on liked items
    const moodCounts: { [key: string]: number } = {};
    const genreCounts: { [key: string]: number } = {};
    
    likedRecommendations.forEach(rec => {
      moodCounts[rec.mood] = (moodCounts[rec.mood] || 0) + 1;
      genreCounts[rec.genre] = (genreCounts[rec.genre] || 0) + 1;
    });
    
    const dominantMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b, 'Balanced'
    );
    
    const dominantGenre = Object.keys(genreCounts).reduce((a, b) => 
      genreCounts[a] > genreCounts[b] ? a : b, 'Mixed'
    );
    
    return { dominantMood, dominantGenre, likedCount: likedRecommendations.length };
  };

  const goToNextCard = () => {
    if (currentIndex < recommendations.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // All cards swiped, analyze mood and show results
      const analysis = analyzeMood();
      const moodAnalysisData = {
        ...analysis,
        timestamp: Date.now()
      };
      
      console.log('Mood Analysis:', moodAnalysisData);
      
      // Store mood analysis in context
      setMoodAnalysis(moodAnalysisData);
      
      // Navigate to main app with mood analysis complete
      router.replace('/(tabs)');
    }
  };

  const handleManualLike = () => {
    handleSwipeRight();
  };

  const handleManualPass = () => {
    handleSwipeLeft();
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      // Remove last action from liked/passed arrays
      const lastCard = recommendations[currentIndex - 1];
      setLikedItems(prev => prev.filter(id => id !== lastCard.id));
      setPassedItems(prev => prev.filter(id => id !== lastCard.id));
    }
  };

  const handleSkip = () => {
    // Skip the card swiping and go directly to the main app
    router.replace('/(tabs)');
  };

  if (currentIndex >= recommendations.length) {
    return (
      <LinearGradient
        colors={['#000000', '#0a0a0a', '#1a1a1a']}
        style={styles.container}
      >
        <View style={styles.completedContainer}>
          <Animated.Text 
            entering={FadeInUp.delay(200)}
            style={styles.completedTitle}
          >
            Great choices! 🎉
          </Animated.Text>
          <Animated.Text 
            entering={FadeInUp.delay(400)}
            style={styles.completedSubtitle}
          >
            We've curated your perfect playlist based on your preferences
          </Animated.Text>
          <Animated.View entering={FadeInUp.delay(600)}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => router.replace('/(tabs)')}
            >
              <Text style={styles.continueButtonText}>Continue to App</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#000000', '#0a0a0a', '#1a1a1a']}
      style={styles.container}
    >
      {/* Header */}
      <Animated.View 
        entering={FadeInDown.delay(200)}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => router.back()}
        >
          <Settings size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Music Recommendations</Text>
          <Text style={styles.headerSubtitle}>
            {currentIndex + 1} of {recommendations.length}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <SkipForward size={20} color="#ffffff" />
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Cards Container */}
      <View style={styles.cardsContainer}>
        {/* Next Card (Background) */}
        {nextCardData && (
          <SwipeCard
            item={nextCardData}
            onSwipeLeft={() => {}}
            onSwipeRight={() => {}}
            isActive={false}
          />
        )}
        
        {/* Current Card */}
        {currentCard && (
          <SwipeCard
            item={currentCard}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            isActive={true}
          />
        )}
      </View>

      {/* Action Buttons */}
      <Animated.View 
        entering={FadeInUp.delay(400)}
        style={styles.actionButtons}
      >
        <TouchableOpacity
          style={[styles.actionButton, styles.undoButton]}
          onPress={handleUndo}
          disabled={currentIndex === 0}
        >
          <RotateCcw size={24} color={currentIndex === 0 ? "#666" : "#ffffff"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={handleManualPass}
        >
          <X size={28} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={handleManualLike}
        >
          <Heart size={28} color="#ffffff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Instructions */}
      <Animated.View 
        entering={FadeInUp.delay(600)}
        style={styles.instructions}
      >
        <Text style={styles.instructionText}>
          Swipe right to like • Swipe left to pass
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  skipButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  undoButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  passButton: {
    backgroundColor: '#ef4444',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  likeButton: {
    backgroundColor: '#10b981',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  instructions: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 24,
  },
  completedTitle: {
    fontSize: 32,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
  },
  completedSubtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 26,
  },
  continueButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    marginTop: 20,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});
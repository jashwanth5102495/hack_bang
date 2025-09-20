import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Heart, X, RotateCcw, Settings, SkipForward } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import SwipeCard from '../components/SwipeCard';
import { useMood } from '../contexts/MoodContext';

// const { width } = Dimensions.get('window');

// Mood analyzing cards with images and therapeutic content
const moodCards = [
  {
    id: 'happy',
    title: 'Happy',
    emoji: '😊',
    mood: 'Happy',
    gradient: ['rgba(255, 217, 61, 0.3)', 'rgba(255, 107, 107, 0.3)'],
    description: 'Celebration foods, positive vibes, uplifting content',
    image: { uri: 'https://images.unsplash.com/photo-1607344645866-009c7d0435c9?w=400&h=300&fit=crop' },
    content: 'Upbeat vibes, celebration foods, positive energy',
    benefits: ['Maintain positive energy', 'Social connection', 'Joyful experiences']
  },
  {
    id: 'sad',
    title: 'Sad',
    emoji: '😢',
    mood: 'Sad',
    gradient: ['rgba(102, 126, 234, 0.2)', 'rgba(118, 75, 162, 0.2)'],
    description: 'Comfort foods, warm dishes, cozy places for healing',
    image: { uri: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=300&fit=crop' },
    content: 'Warm foods, cozy places, therapeutic comfort',
    benefits: ['Emotional healing', 'Comfort and warmth', 'Mood lifting']
  },
  {
    id: 'romantic',
    title: 'Romantic',
    emoji: '💕',
    mood: 'Romantic',
    gradient: ['rgba(255, 154, 158, 0.2)', 'rgba(254, 207, 239, 0.2)'],
    description: 'Romantic dining, intimate settings, love-focused content',
    image: { uri: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop' },
    content: 'Romantic dining, intimate settings, love vibes',
    benefits: ['Enhance romance', 'Intimate connection', 'Special moments']
  },
  {
    id: 'tired',
    title: 'Tired',
    emoji: '😴',
    mood: 'Tired',
    gradient: ['rgba(168, 237, 234, 0.2)', 'rgba(254, 214, 227, 0.2)'],
    description: 'Energy foods, quick options, revitalizing content',
    image: { uri: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop' },
    content: 'Energy foods, quick options, revitalizing vibes',
    benefits: ['Boost energy', 'Quick recovery', 'Mental clarity']
  },
  {
    id: 'excited',
    title: 'Excited',
    emoji: '🤩',
    mood: 'Excited',
    gradient: ['rgba(255, 107, 107, 0.2)', 'rgba(254, 202, 87, 0.2)'],
    description: 'Power foods, active spaces, high-energy content',
    image: { uri: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop' },
    content: 'Power foods, active spaces, high energy vibes',
    benefits: ['Sustain excitement', 'High energy', 'Active lifestyle']
  },
  {
    id: 'lonely',
    title: 'Lonely',
    emoji: '😔',
    mood: 'Lonely',
    gradient: ['rgba(116, 185, 255, 0.2)', 'rgba(9, 132, 227, 0.2)'],
    description: 'Comfort treats, peaceful places, connection-focused content',
    image: { uri: 'https://images.unsplash.com/photo-1494790108755-2616c27b40e2?w=400&h=300&fit=crop' },
    content: 'Comfort treats, peaceful places, connection vibes',
    benefits: ['Feel connected', 'Emotional support', 'Peaceful comfort']
  },
  {
    id: 'hungry',
    title: 'Hungry',
    emoji: '🤤',
    mood: 'Hungry',
    gradient: ['rgba(253, 121, 168, 0.2)', 'rgba(253, 203, 110, 0.2)'],
    description: 'Satisfying meals, hearty portions, food-focused content',
    image: { uri: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' },
    content: 'Satisfying meals, hearty portions, food inspiration',
    benefits: ['Complete satisfaction', 'Hearty nourishment', 'Food joy']
  },
  {
    id: 'moody',
    title: 'Moody',
    emoji: '🎭',
    mood: 'Moody',
    gradient: ['rgba(162, 155, 254, 0.2)', 'rgba(108, 92, 231, 0.2)'],
    description: 'Mood-boosting foods, creative spaces, balancing content',
    image: { uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop' },
    content: 'Mood-boosting foods, creative spaces, balancing vibes',
    benefits: ['Emotional balance', 'Creative expression', 'Mood stability']
  }
];

export default function RecommendationsScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedItems, setLikedItems] = useState<string[]>([]);
  const { setCurrentMoodAnalysis } = useMood();

  const currentCard = moodCards[currentIndex];
  const nextCardData = moodCards[currentIndex + 1];

  const handleSwipeRight = () => {
    if (currentCard) {
      setLikedItems(prev => [...prev, currentCard.id]);
      goToNextCard();
    }
  };

  const handleSwipeLeft = () => {
    if (currentCard) {
      goToNextCard();
    }
  };

  const analyzeMood = () => {
    const likedMoods = moodCards.filter(card => likedItems.includes(card.id));

    // Analyze mood based on liked items
    const moodCounts: { [key: string]: number } = {};

    likedMoods.forEach(card => {
      moodCounts[card.mood] = (moodCounts[card.mood] || 0) + 1;
    });

    const dominantMood = Object.keys(moodCounts).reduce((a, b) =>
      moodCounts[a] > moodCounts[b] ? a : b, 'Happy'
    );

    return {
      dominantMood,
      dominantGenre: 'Therapeutic Content',
      likedCount: likedMoods.length
    };
  };

  const goToNextCard = () => {
    if (currentIndex < moodCards.length - 1) {
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
      setCurrentMoodAnalysis(moodAnalysisData);

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
      // Remove last action from liked arrays
      const lastCard = moodCards[currentIndex - 1];
      setLikedItems(prev => prev.filter(id => id !== lastCard.id));
    }
  };

  const handleSkip = () => {
    // Skip the card swiping and go directly to the main app
    router.replace('/(tabs)');
  };

  if (currentIndex >= moodCards.length) {
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
            We've analyzed your mood and prepared personalized recommendations
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
          <Text style={styles.headerTitle}>Mood Analysis</Text>
          <Text style={styles.headerSubtitle}>
            {currentIndex + 1} of {moodCards.length}
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
            onSwipeLeft={() => { }}
            onSwipeRight={() => { }}
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
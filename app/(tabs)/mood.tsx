import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Smile, Frown, Heart, Coffee, Zap, Moon, Music, ChefHat } from 'lucide-react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { GestureDetector, Gesture, PanGestureHandler } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const moods = [
  { id: 'happy', title: 'Happy', icon: Smile, color: ['#fbbf24', '#f59e0b'], emoji: '😊' },
  { id: 'sad', title: 'Sad', icon: Frown, color: ['#3b82f6', '#1e40af'], emoji: '😢' },
  { id: 'romantic', title: 'Romantic', icon: Heart, color: ['#ec4899', '#be185d'], emoji: '💕' },
  { id: 'tired', title: 'Tired', icon: Coffee, color: ['#6b7280', '#374151'], emoji: '😴' },
  { id: 'excited', title: 'Excited', icon: Zap, color: ['#10b981', '#059669'], emoji: '🤩' },
  { id: 'lonely', title: 'Lonely', icon: Moon, color: ['#8b5cf6', '#7c3aed'], emoji: '😔' },
  { id: 'hungry', title: 'Hungry', icon: ChefHat, color: ['#f97316', '#ea580c'], emoji: '🤤' },
  { id: 'moody', title: 'Moody', icon: Music, color: ['#06b6d4', '#0891b2'], emoji: '🎭' },
];

export default function MoodScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const currentMood = moods[currentIndex];

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      setSelectedMoods(prev => [...prev, currentMood.id]);
    }
    
    if (currentIndex < moods.length - 1) {
      setCurrentIndex(prev => prev + 1);
      translateX.value = withSpring(0);
      opacity.value = withTiming(1);
    } else {
      // All moods processed
      const dominantMood = selectedMoods[selectedMoods.length - 1] || 'happy';
      router.push({
        pathname: '/mood-results',
        params: { mood: dominantMood, selectedMoods: selectedMoods.join(',') }
      });
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      opacity.value = 1 - Math.abs(event.translationX) / (width * 0.5);
    })
    .onEnd((event) => {
      const threshold = width * 0.3;
      
      if (event.translationX > threshold) {
        translateX.value = withTiming(width, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 });
        runOnJS(handleSwipe)('right');
      } else if (event.translationX < -threshold) {
        translateX.value = withTiming(-width, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 });
        runOnJS(handleSwipe)('left');
      } else {
        translateX.value = withSpring(0);
        opacity.value = withTiming(1);
      }
    });

  if (!currentMood) {
    return (
      <LinearGradient
        colors={['#000000', '#0a0a0a']}
        style={styles.container}
      >
        <View style={styles.completedContainer}>
          <Text style={styles.completedTitle}>Mood detection complete!</Text>
          <Text style={styles.completedSubtitle}>
            Processing your mood profile...
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#000000', '#0a0a0a', '#1a1a1a']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Discover Your Mood</Text>
        <Text style={styles.subtitle}>Swipe right to select, left to skip</Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill, 
                { width: `${((currentIndex + 1) / moods.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentIndex + 1} of {moods.length}
          </Text>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.moodCard, animatedStyle]}>
            <LinearGradient
              colors={currentMood.color}
              style={styles.moodGradient}
            >
              <Text style={styles.moodEmoji}>{currentMood.emoji}</Text>
              <Text style={styles.moodTitle}>{currentMood.title}</Text>
              <currentMood.icon size={40} color="#ffffff" />
            </LinearGradient>
          </Animated.View>
        </GestureDetector>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleSwipe('left')}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#ef444420' }]}>
            <Text style={styles.actionEmoji}>❌</Text>
          </View>
          <Text style={styles.actionText}>Nope</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleSwipe('right')}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#10b98120' }]}>
            <Text style={styles.actionEmoji}>✨</Text>
          </View>
          <Text style={styles.actionText}>Yes!</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Swipe left to skip • Swipe right to select
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 120, // Space for floating navigation
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    textAlign: 'center',
    marginBottom: 24,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodCard: {
    width: width - 60,
    height: 450,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  moodGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    padding: 20,
  },
  moodEmoji: {
    fontSize: 80,
  },
  moodTitle: {
    fontSize: 32,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 40,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#a1a1aa',
  },
  instructions: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  completedTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  completedSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
  },
});
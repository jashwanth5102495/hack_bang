import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  interpolate,
  FadeInLeft
} from 'react-native-reanimated';
import { useMood } from '../contexts/MoodContext';

const { width } = Dimensions.get('window');

interface MoodCard {
  id: string;
  mood: string;
  emoji: string;
  description: string;
  color: string;
  gradient: string[];
  tips: string[];
}

const moodCards: MoodCard[] = [
  {
    id: '1',
    mood: 'Happy',
    emoji: '😊',
    description: 'Feeling joyful and positive',
    color: '#ffd93d',
    gradient: ['#ffd93d', '#ff6b6b'],
    tips: ['Share your joy', 'Try new activities', 'Connect with friends']
  },
  {
    id: '2',
    mood: 'Sad',
    emoji: '😢',
    description: 'Feeling down or melancholic',
    color: '#74b9ff',
    gradient: ['#74b9ff', '#0984e3'],
    tips: ['Take deep breaths', 'Listen to calming music', 'Talk to someone']
  },
  {
    id: '3',
    mood: 'Active',
    emoji: '⚡',
    description: 'Full of energy and motivation',
    color: '#00b894',
    gradient: ['#00b894', '#00cec9'],
    tips: ['Exercise or dance', 'Start new projects', 'Be productive']
  },
  {
    id: '4',
    mood: 'Relaxed',
    emoji: '😌',
    description: 'Calm and peaceful state',
    color: '#a29bfe',
    gradient: ['#a29bfe', '#6c5ce7'],
    tips: ['Meditate', 'Read a book', 'Take a warm bath']
  },
  {
    id: '5',
    mood: 'Focused',
    emoji: '🎯',
    description: 'Concentrated and determined',
    color: '#fd79a8',
    gradient: ['#fd79a8', '#e84393'],
    tips: ['Work on goals', 'Minimize distractions', 'Plan your day']
  },
  {
    id: '6',
    mood: 'Anxious',
    emoji: '😰',
    description: 'Feeling worried or stressed',
    color: '#fdcb6e',
    gradient: ['#fdcb6e', '#e17055'],
    tips: ['Practice breathing', 'Ground yourself', 'Seek support']
  },
  {
    id: '7',
    mood: 'Excited',
    emoji: '🤩',
    description: 'Enthusiastic and thrilled',
    color: '#ff7675',
    gradient: ['#ff7675', '#d63031'],
    tips: ['Channel your energy', 'Share excitement', 'Plan adventures']
  },
  {
    id: '8',
    mood: 'Thoughtful',
    emoji: '🤔',
    description: 'Reflective and contemplative',
    color: '#636e72',
    gradient: ['#636e72', '#2d3436'],
    tips: ['Journal thoughts', 'Reflect on goals', 'Practice mindfulness']
  }
];

interface MoodCardsProps {
  onMoodSelect?: (mood: MoodCard) => void;
}

export default function MoodCards({ onMoodSelect }: MoodCardsProps) {
  const { moodAnalysis } = useMood();
  const scrollX = useSharedValue(0);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const currentMood = moodAnalysis?.dominantMood || 'Unknown';

  useEffect(() => {
    // Auto-scroll animation from left to right
    const startAutoScroll = () => {
      scrollX.value = withRepeat(
        withTiming(width * 1.5, { duration: 20000 }),
        -1,
        false
      );
    };

    const timer = setTimeout(startAutoScroll, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleMoodPress = (mood: MoodCard) => {
    if (onMoodSelect) {
      onMoodSelect(mood);
    }
  };

  const renderMoodCard = (mood: MoodCard, index: number) => {
    const isCurrentMood = mood.mood.toLowerCase() === currentMood.toLowerCase();
    
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * 180,
        index * 180,
        (index + 1) * 180,
      ];

      const scale = interpolate(
        scrollX.value,
        inputRange,
        [0.85, 1, 0.85],
        'clamp'
      );

      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.6, 1, 0.6],
        'clamp'
      );

      return {
        transform: [{ scale }],
        opacity,
      };
    });

    return (
      <Animated.View
        key={mood.id}
        style={[styles.cardContainer, animatedStyle]}
      >
        <TouchableOpacity
          style={[
            styles.moodCard,
            isCurrentMood && styles.currentMoodCard
          ]}
          onPress={() => handleMoodPress(mood)}
          activeOpacity={0.8}
        >
          <Animated.View style={[styles.cardContent, { backgroundColor: mood.gradient[0] }]}>
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text style={styles.moodName}>{mood.mood}</Text>
            <Text style={styles.moodDescription}>{mood.description}</Text>
            
            {isCurrentMood && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Current</Text>
              </View>
            )}
            
            <View style={styles.tipsContainer}>
              {mood.tips.slice(0, 2).map((tip, tipIndex) => (
                <Text key={tipIndex} style={styles.tipText}>• {tip}</Text>
              ))}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Animated.View 
      entering={FadeInLeft.delay(100).springify()}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>How Are You Feeling?</Text>
        <Text style={styles.sectionSubtitle}>
          Discover your mood and get personalized suggestions
        </Text>
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        snapToInterval={180}
        decelerationRate="fast"
        onScroll={(event) => {
          scrollX.value = event.nativeEvent.contentOffset.x;
        }}
        scrollEventThrottle={16}
      >
        {moodCards.map((mood, index) => renderMoodCard(mood, index))}
        {/* Duplicate for infinite scroll effect */}
        {moodCards.map((mood, index) => 
          renderMoodCard({ ...mood, id: `${mood.id}_dup` }, index + moodCards.length)
        )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#ffffff60',
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingRight: width,
  },
  cardContainer: {
    width: 160,
    marginRight: 20,
  },
  moodCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  currentMoodCard: {
    borderWidth: 2,
    borderColor: '#ffd93d',
  },
  cardContent: {
    padding: 16,
    height: 200,
    justifyContent: 'space-between',
  },
  moodEmoji: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 8,
  },
  moodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  moodDescription: {
    fontSize: 12,
    color: '#ffffff90',
    textAlign: 'center',
    marginBottom: 12,
  },
  currentBadge: {
    backgroundColor: '#ffd93d',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 8,
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  tipsContainer: {
    marginTop: 'auto',
  },
  tipText: {
    fontSize: 10,
    color: '#ffffff80',
    marginBottom: 2,
  },
});
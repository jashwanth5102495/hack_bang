import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  interpolate,
  FadeInLeft,
  Easing
} from 'react-native-reanimated';
import { useMood } from '../contexts/MoodContext';

const { width } = Dimensions.get('window');

interface QuoteSnippet {
  id: string;
  mood: string;
  category: string;
  quote: string;
  author: string;
  color: string;
}

const quoteSnippets: QuoteSnippet[] = [
  // Energetic mood quotes
  {
    id: '1',
    mood: 'Energetic',
    category: 'Motivation',
    quote: `"The only way to do great work is to love what you do."`,
    author: 'Steve Jobs',
    color: '#ff6b6b'
  },
  {
    id: '2',
    mood: 'Energetic',
    category: 'Success',
    quote: `"Success is not final, failure is not fatal: it is the courage to continue that counts."`,
    author: 'Winston Churchill',
    color: '#4ecdc4'
  },
  {
    id: '3',
    mood: 'Energetic',
    category: 'Achievement',
    quote: `"Don't watch the clock; do what it does. Keep going."`,
    author: 'Sam Levenson',
    color: '#45b7d1'
  },
  
  // Relaxed mood quotes
  {
    id: '4',
    mood: 'Relaxed',
    category: 'Peace',
    quote: `"Peace comes from within. Do not seek it without."`,
    author: 'Buddha',
    color: '#96ceb4'
  },
  {
    id: '5',
    mood: 'Relaxed',
    category: 'Mindfulness',
    quote: `"The present moment is the only time over which we have dominion."`,
    author: 'Thich Nhat Hanh',
    color: '#ffeaa7'
  },
  {
    id: '6',
    mood: 'Relaxed',
    category: 'Serenity',
    quote: `"In the midst of winter, I found there was, within me, an invincible summer."`,
    author: 'Albert Camus',
    color: '#dda0dd'
  },
  
  // Focused mood quotes
  {
    id: '7',
    mood: 'Focused',
    category: 'Determination',
    quote: `"The way to get started is to quit talking and begin doing."`,
    author: 'Walt Disney',
    color: '#74b9ff'
  },
  {
    id: '8',
    mood: 'Focused',
    category: 'Excellence',
    quote: `"Excellence is never an accident. It is always the result of high intention."`,
    author: 'Aristotle',
    color: '#a29bfe'
  },
  {
    id: '9',
    mood: 'Focused',
    category: 'Purpose',
    quote: `"Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work."`,
    author: 'Steve Jobs',
    color: '#fd79a8'
  },
  
  // Happy mood quotes
  {
    id: '10',
    mood: 'Happy',
    category: 'Joy',
    quote: `"Happiness is not something you chase, it's something you create within."`,
    author: 'Anonymous',
    color: '#fdcb6e'
  },
  {
    id: '11',
    mood: 'Happy',
    category: 'Positivity',
    quote: `"A smile is the shortest distance between two hearts."`,
    author: 'Victor Borge',
    color: '#e17055'
  },
  {
    id: '12',
    mood: 'Happy',
    category: 'Life',
    quote: `"Collect memories, not worries."`,
    author: 'Anonymous',
    color: '#00b894'
  },
  {
    id: '13',
    mood: 'Happy',
    category: 'Inspiration',
    quote: `"Joy is contagious—spread it everywhere you go."`,
    author: 'Anonymous',
    color: '#ff7675'
  },
  {
    id: '14',
    mood: 'Happy',
    category: 'Gratitude',
    quote: `"A grateful heart is always a happy heart."`,
    author: 'Anonymous',
    color: '#74b9ff'
  },
  
  // Default/Unknown mood quotes
  {
    id: '15',
    mood: 'Unknown',
    category: 'Wisdom',
    quote: `"The journey of a thousand miles begins with one step."`,
    author: 'Lao Tzu',
    color: '#636e72'
  },
  {
    id: '16',
    mood: 'Unknown',
    category: 'Growth',
    quote: `"Every expert was once a beginner. Every pro was once an amateur."`,
    author: 'Robin Sharma',
    color: '#2d3436'
  }
];

export default function ScrollingMoodQuotes() {
  const { moodAnalysis } = useMood();
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const currentMood = moodAnalysis?.dominantMood || 'Unknown';
  
  // Filter quote snippets based on current mood
  const relevantSnippets = quoteSnippets.filter(snippet => 
    snippet.mood === currentMood || snippet.mood === 'Unknown'
  );

  useEffect(() => {
    // Reset index when mood changes
    setCurrentIndex(0);
    scrollX.value = 0;
  }, [currentMood]);

  useEffect(() => {
    // Cycle through different quotes every 10 seconds
    const quoteTimer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % Math.max(1, relevantSnippets.length)
      );
      // Reset scroll position when changing quotes
      scrollX.value = 0;
      // Start scrolling animation for the new quote
      scrollX.value = withRepeat(
        withTiming(width * 0.8, { 
          duration: 15000, // Much slower scrolling - 15 seconds
          easing: Easing.linear 
        }),
        -1,
        false
      );
    }, 10000); // 10 seconds per quote

    // Initial scroll animation with delay
    const initialTimer = setTimeout(() => {
      scrollX.value = withRepeat(
        withTiming(width * 0.8, { 
          duration: 15000, // 15 seconds for full scroll
          easing: Easing.linear 
        }),
        -1,
        false
      );
    }, 2000); // 2 second delay before starting
    
    return () => {
      clearInterval(quoteTimer);
      clearTimeout(initialTimer);
    };
  }, [currentMood, relevantSnippets.length]);

  // Show only one thought at a time
  const currentThought = relevantSnippets[currentIndex] || relevantSnippets[0];

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: -scrollX.value }],
    };
  });

  return (
    <Animated.View 
      entering={FadeInLeft.delay(100).springify()}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>
          Inspirational Thoughts
        </Text>
      </View>
      
      <View style={styles.scrollingContainer}>
        <Animated.View style={[styles.scrollingContent, animatedStyle]}>
          <Text style={[styles.quoteText, { color: currentThought?.color || '#FFFFFF' }]} numberOfLines={1}>
            {currentThought?.quote || 'Loading inspirational thoughts...'} — {currentThought?.author || ''}
          </Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30, // Increased top margin to avoid overlap with icons
    marginBottom: 20,
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  scrollingContainer: {
    height: 60,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 30,
    marginHorizontal: 20,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  scrollingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    minWidth: width * 3, // Wider content for better scrolling
    height: '100%',
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    lineHeight: 24,
  },
  separator: {
    color: '#666',
    fontSize: 16,
  },
});
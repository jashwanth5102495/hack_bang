import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
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
  image: any;
  musicType: string;
  foodType: string;
}

const moodCards: MoodCard[] = [
  {
    id: '1',
    mood: 'Happy',
    emoji: '😊',
    description: 'Upbeat music, celebration foods, positive vibes',
    color: '#ffd93d',
    gradient: ['#ffd93d', '#ff6b6b'],
    tips: ['Share your joy', 'Try new activities', 'Connect with friends'],
    image: require('../img/happy.png'),
    musicType: 'Upbeat music',
    foodType: 'Celebration foods'
  },
  {
    id: '2',
    mood: 'Sad',
    emoji: '😢',
    description: 'Comfort songs, warm foods, cozy places',
    color: '#74b9ff',
    gradient: ['#74b9ff', '#0984e3'],
    tips: ['Take deep breaths', 'Listen to calming music', 'Talk to someone'],
    image: require('../img/sad.png'),
    musicType: 'Comfort songs',
    foodType: 'Warm foods'
  },
  {
    id: '3',
    mood: 'Romantic',
    emoji: '💕',
    description: 'Love ballads, romantic dining, intimate settings',
    color: '#fd79a8',
    gradient: ['#fd79a8', '#e84393'],
    tips: ['Plan romantic moments', 'Express your feelings', 'Create intimate atmosphere'],
    image: require('../img/Romantic.png'),
    musicType: 'Love ballads',
    foodType: 'Romantic dining'
  },
  {
    id: '4',
    mood: 'Tired',
    emoji: '😴',
    description: 'Relaxing sounds, energy foods, quick options',
    color: '#a29bfe',
    gradient: ['#a29bfe', '#6c5ce7'],
    tips: ['Rest and recharge', 'Choose easy meals', 'Listen to calming music'],
    image: require('../img/Tired.png'),
    musicType: 'Relaxing sounds',
    foodType: 'Energy foods'
  },
  {
    id: '5',
    mood: 'Excited',
    emoji: '🤩',
    description: 'High energy music, power foods, active spaces',
    color: '#ff7675',
    gradient: ['#ff7675', '#d63031'],
    tips: ['Channel your energy', 'Share excitement', 'Plan adventures'],
    image: require('../img/Excited.png'),
    musicType: 'High energy music',
    foodType: 'Power foods'
  },
  {
    id: '6',
    mood: 'Lonely',
    emoji: '😔',
    description: 'Soulful music, comfort treats, peaceful places',
    color: '#636e72',
    gradient: ['#636e72', '#2d3436'],
    tips: ['Connect with others', 'Practice self-care', 'Find peaceful moments'],
    image: require('../img/Lonely.png'),
    musicType: 'Soulful music',
    foodType: 'Comfort treats'
  },
  {
    id: '7',
    mood: 'Hungry',
    emoji: '🤤',
    description: 'Cooking playlists, satisfying meals, hearty portions',
    color: '#00b894',
    gradient: ['#00b894', '#00cec9'],
    tips: ['Explore new recipes', 'Cook with music', 'Enjoy hearty meals'],
    image: require('../img/Hungry.png'),
    musicType: 'Cooking playlists',
    foodType: 'Satisfying meals'
  },
  {
    id: '8',
    mood: 'Moody',
    emoji: '🎭',
    description: 'Alternative music, mood-boosting foods, creative spaces',
    color: '#fdcb6e',
    gradient: ['#fdcb6e', '#e17055'],
    tips: ['Express creativity', 'Try alternative music', 'Boost your mood'],
    image: require('../img/Moody.png'),
    musicType: 'Alternative music',
    foodType: 'Mood-boosting foods'
  }
];

interface MoodCardsProps {
  onMoodSelect?: (mood: MoodCard) => void;
}

export default function MoodCards({ onMoodSelect }: MoodCardsProps) {
  const { moodAnalysis, currentMoodAnalysis, setCurrentMoodAnalysis, analyzeMoodFromSelection, isAnalyzing } = useMood();
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

  const handleMoodPress = async (mood: MoodCard) => {
    // Trigger AI mood analysis
    await analyzeMoodFromSelection(mood.mood);
    if (onMoodSelect) {
      onMoodSelect(mood);
    }
  };

  const renderMoodCard = (mood: MoodCard, index: number) => {
    const isCurrentMood = currentMoodAnalysis?.dominantMood === mood.mood;
    
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
            <View style={styles.imageContainer}>
              <Image source={mood.image} style={styles.moodImage} resizeMode="contain" />
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            </View>
            
            <View style={styles.contentContainer}>
              <Text style={styles.moodName}>{mood.mood}</Text>
              <Text style={styles.moodDescription}>{mood.description}</Text>
              
              {isCurrentMood && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Current Mood</Text>
                </View>
              )}
              
              {isAnalyzing && (
                <View style={styles.analyzingBadge}>
                  <Text style={styles.analyzingText}>Analyzing...</Text>
                </View>
              )}
              
              <View style={styles.featuresContainer}>
                <Text style={styles.featureText}>🎵 {mood.musicType}</Text>
                <Text style={styles.featureText}>🍽️ {mood.foodType}</Text>
              </View>
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
    height: 240,
    justifyContent: 'space-between',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  moodImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  moodEmoji: {
    fontSize: 24,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  moodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 6,
  },
  moodDescription: {
    fontSize: 11,
    color: '#ffffff90',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 16,
  },
  currentBadge: {
    backgroundColor: '#ffd93d',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'center',
    marginBottom: 8,
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  analyzingBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'center',
    marginBottom: 8,
  },
  analyzingText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  featuresContainer: {
    marginTop: 'auto',
  },
  featureText: {
    fontSize: 10,
    color: '#ffffff80',
    marginBottom: 3,
    textAlign: 'center',
  },
});
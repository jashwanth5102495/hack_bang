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
  title: string;
  emoji: string;
  description: string;
  gradient: string[];
  tips: string[];
  image: any;
  therapeuticContent: string;
  foodType: string;
}

const moodCards: MoodCard[] = [
  {
    id: 'happy',
    title: 'Happy',
    emoji: '😊',
    description: 'Upbeat vibes, celebration foods, positive energy',
    gradient: ['#ffd93d', '#ff6b6b'],
    tips: ['Share your joy', 'Try new activities', 'Connect with friends'],
    image: require('../img/happy.png'),
    therapeuticContent: 'Keep the positive energy flowing',
    foodType: 'Celebration foods'
  },
  {
    id: 'sad',
    title: 'Sad',
    emoji: '😢',
    description: 'Comfort foods, warm dishes, cozy places',
    gradient: ['#667eea', '#764ba2'],
    tips: ['Practice self-care', 'Reach out to friends', 'Try gentle activities'],
    image: require('../img/sad.png'),
    therapeuticContent: 'Uplifting content to brighten your mood',
    foodType: 'Warm comfort foods'
  },
  {
    id: 'romantic',
    title: 'Romantic',
    emoji: '💕',
    description: 'Romantic dining, intimate settings, love vibes',
    gradient: ['#ff9a9e', '#fecfef'],
    tips: ['Plan a date', 'Express your feelings', 'Create romantic moments'],
    image: require('../img/Romantic.png'),
    therapeuticContent: 'Romantic content for special moments',
    foodType: 'Romantic dining'
  },
  {
    id: 'tired',
    title: 'Tired',
    emoji: '😴',
    description: 'Energy foods, quick options, relaxing vibes',
    gradient: ['#a8edea', '#fed6e3'],
    tips: ['Get enough rest', 'Take breaks', 'Practice relaxation'],
    image: require('../img/Tired.png'),
    therapeuticContent: 'Energizing content to help you recharge',
    foodType: 'Energy-boosting foods'
  },
  {
    id: 'excited',
    title: 'Excited',
    emoji: '🤩',
    description: 'Power foods, active spaces, high energy vibes',
    gradient: ['#ff6b6b', '#feca57'],
    tips: ['Channel your energy', 'Try new things', 'Share your excitement'],
    image: require('../img/Excited.png'),
    therapeuticContent: 'High-energy content to match your vibe',
    foodType: 'Power foods'
  },
  {
    id: 'lonely',
    title: 'Lonely',
    emoji: '😔',
    description: 'Comfort treats, peaceful places, soulful vibes',
    gradient: ['#74b9ff', '#0984e3'],
    tips: ['Connect with others', 'Join communities', 'Practice self-compassion'],
    image: require('../img/Lonely.png'),
    therapeuticContent: 'Uplifting content to help you feel connected',
    foodType: 'Comfort treats'
  },
  {
    id: 'hungry',
    title: 'Hungry',
    emoji: '🤤',
    description: 'Satisfying meals, hearty portions, cooking vibes',
    gradient: ['#fd79a8', '#fdcb6e'],
    tips: ['Plan your meals', 'Try new recipes', 'Enjoy the cooking process'],
    image: require('../img/Hungry.png'),
    therapeuticContent: 'Cooking content and food inspiration',
    foodType: 'Satisfying meals'
  },
  {
    id: 'moody',
    title: 'Moody',
    emoji: '🎭',
    description: 'Mood-boosting foods, creative spaces, alternative vibes',
    gradient: ['#a29bfe', '#6c5ce7'],
    tips: ['Embrace your complexity', 'Express yourself creatively', 'Find balance'],
    image: require('../img/Moody.png'),
    therapeuticContent: 'Mood-balancing content to help you find peace',
    foodType: 'Mood-boosting foods'
  }
];

interface MoodCardsProps {
  onMoodSelect?: (mood: MoodCard) => void;
}

export default function MoodCards({ onMoodSelect }: MoodCardsProps) {
  const { currentMoodAnalysis, setCurrentMoodAnalysis, analyzeMoodFromSelection, isAnalyzing } = useMood();
  const scrollX = useSharedValue(0);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const currentMood = currentMoodAnalysis?.dominantMood || 'Unknown';

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
    await analyzeMoodFromSelection(mood.title);
    if (onMoodSelect) {
      onMoodSelect(mood);
    }
  };

  const MoodCardItem = ({ mood, index }: { mood: MoodCard; index: number }) => {
    const isCurrentMood = currentMoodAnalysis?.dominantMood === mood.title;
    
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
              <Text style={styles.moodName}>{mood.title}</Text>
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
                <Text style={styles.featureText}>🍽️ {mood.foodType}</Text>
                <Text style={styles.featureText}>✨ {mood.therapeuticContent}</Text>
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
        {moodCards.map((mood, index) => (
          <MoodCardItem key={mood.id} mood={mood} index={index} />
        ))}
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
    paddingRight: 100,
  },
  cardContainer: {
    width: 160,
    marginRight: 16,
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
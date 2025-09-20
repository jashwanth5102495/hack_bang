import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Music, ArrowLeft, Play, Users, Brain, Clock, ChefHat, Star, Utensils } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import { useMood } from '../contexts/MoodContext';

const { width } = Dimensions.get('window');

const moodContent = {
  happy: {
    color: ['#fbbf24', '#f59e0b'],
    emoji: '😊',
    music: ['Upbeat Pop Hits', 'Feel Good Classics', 'Happy Vibes'],
    dishes: [
      { id: 'chicken-biryani', name: 'Chicken Dum Biryani', cuisine: 'Indian', cookingTime: '60 min', difficulty: 'Medium', image: require('../assets/food-images/chicken-biryani.webp') },
      { id: 'margherita-pizza', name: 'Margherita Pizza', cuisine: 'Italian', cookingTime: '30 min', difficulty: 'Medium', image: require('../assets/food-images/margherita-pizza.jpg') },
      { id: 'chole-bhature', name: 'Chole Bhature', cuisine: 'Indian', cookingTime: '45 min', difficulty: 'Medium', image: require('../assets/food-images/chole-bhature.jpg') },
      { id: 'fresh-sushi', name: 'Fresh Sushi', cuisine: 'Japanese', cookingTime: '30 min', difficulty: 'Hard', image: require('../assets/food-images/sushi.jpg') }
    ]
  },
  sad: {
    color: ['#3b82f6', '#1e40af'],
    emoji: '😢',
    music: ['Comfort Songs', 'Healing Melodies', 'Gentle Piano'],
    dishes: [
      { id: 'french-onion-soup', name: 'French Onion Soup', cuisine: 'French', cookingTime: '45 min', difficulty: 'Medium', image: require('../assets/food-images/french-onion-soup.jpg') },
      { id: 'dal-tadka', name: 'Dal Tadka', cuisine: 'Indian', cookingTime: '30 min', difficulty: 'Easy', image: require('../assets/food-images/dal-tadka.jpg') },
      { id: 'khichdi', name: 'Khichdi', cuisine: 'Indian', cookingTime: '25 min', difficulty: 'Easy', image: require('../assets/food-images/khichdi.jpg') },
      { id: 'risotto', name: 'Risotto', cuisine: 'Italian', cookingTime: '35 min', difficulty: 'Medium', image: require('../assets/food-images/risotto.jpg') }
    ]
  },
  tired: {
    color: ['#6b7280', '#374151'],
    emoji: '😴',
    music: ['Relaxing Instrumentals', 'Sleep Sounds', 'Ambient Chill'],
    dishes: [
      { id: 'upma', name: 'Upma', cuisine: 'Indian', cookingTime: '20 min', difficulty: 'Easy', image: require('../assets/food-images/upma.jpg') },
      { id: 'minestrone-soup', name: 'Minestrone Soup', cuisine: 'Italian', cookingTime: '40 min', difficulty: 'Easy', image: require('../assets/food-images/minestrone-soup.webp') },
      { id: 'thai-green-curry', name: 'Thai Green Curry', cuisine: 'Thai', cookingTime: '35 min', difficulty: 'Medium', image: require('../assets/food-images/thai-green-curry.jpg') },
      { id: 'stuffed-paratha', name: 'Stuffed Paratha', cuisine: 'Indian', cookingTime: '30 min', difficulty: 'Medium', image: require('../assets/food-images/stuffed-paratha.jpg') }
    ]
  },
  hungry: {
    color: ['#ef4444', '#dc2626'],
    emoji: '🤤',
    music: ['Energetic Beats', 'Cooking Playlist', 'Kitchen Vibes'],
    dishes: [
      { id: 'chicken-biryani', name: 'Chicken Dum Biryani', cuisine: 'Indian', cookingTime: '60 min', difficulty: 'Medium', image: require('../assets/food-images/chicken-biryani.webp') },
      { id: 'margherita-pizza', name: 'Margherita Pizza', cuisine: 'Italian', cookingTime: '30 min', difficulty: 'Medium', image: require('../assets/food-images/margherita-pizza.jpg') },
      { id: 'chole-bhature', name: 'Chole Bhature', cuisine: 'Indian', cookingTime: '45 min', difficulty: 'Medium', image: require('../assets/food-images/chole-bhature.jpg') },
      { id: 'fresh-sushi', name: 'Fresh Sushi', cuisine: 'Japanese', cookingTime: '30 min', difficulty: 'Hard', image: require('../assets/food-images/sushi.jpg') }
    ]
  },
  // Add more moods as needed
};

export default function MoodResultsScreen() {
  const { mood, selectedMoods } = useLocalSearchParams();
  const { currentMoodAnalysis } = useMood();
  const currentMood = (mood as string) || 'happy';
  const moodData = moodContent[currentMood as keyof typeof moodContent] || moodContent.happy;

  return (
    <LinearGradient
      colors={['#000000', '#0a0a0a']}
      style={styles.container}
    >
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color="#ffffff" />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View 
          entering={FadeInLeft.delay(200).springify()}
          style={styles.header}
        >
          <Text style={styles.moodEmoji}>{moodData.emoji}</Text>
          <Text style={styles.title}>You're feeling {currentMood}</Text>
          <Text style={styles.subtitle}>
            Here's what we recommend for your current mood
          </Text>
          
          {currentMoodAnalysis && (
            <View style={styles.analysisCard}>
              <View style={styles.analysisHeader}>
                <Brain size={20} color="#8b5cf6" />
                <Text style={styles.analysisTitle}>AI Analysis Results</Text>
              </View>
              <View style={styles.analysisDetails}>
                <Text style={styles.analysisText}>
                  Confidence: {Math.round((currentMoodAnalysis.confidence || 0.85) * 100)}%
                </Text>
                {currentMoodAnalysis.timestamp && (
                  <View style={styles.timestampContainer}>
                    <Clock size={14} color="#a1a1aa" />
                    <Text style={styles.timestampText}>
                      Analyzed at {new Date(currentMoodAnalysis.timestamp).toLocaleString()}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(400).springify()}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Music size={24} color="#3b82f6" />
            <Text style={styles.sectionTitle}>Music Therapy</Text>
          </View>
          
          {moodData.music.map((playlist, index) => (
            <TouchableOpacity key={playlist} style={styles.musicCard}>
              <LinearGradient
                colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
                style={styles.cardContent}
              >
                <Play size={20} color="#3b82f6" />
                <Text style={styles.cardTitle}>{playlist}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </Animated.View>



        {/* Dish Recommendations */}
        {currentMood && moodData?.dishes && (
          <Animated.View 
            entering={FadeInDown.delay(600).springify()}
            style={styles.section}
          >
            <View style={styles.sectionHeader}>
              <ChefHat size={24} color="#ffffff" />
              <Text style={styles.sectionTitle}>Recommended Dishes</Text>
            </View>
            <Text style={styles.sectionSubtitle}>Perfect recipes to match how you're feeling right now</Text>
            
            <View style={styles.dishGrid}>
              {moodData.dishes.map((dish, index) => (
                <Animated.View 
                  key={dish.id} 
                  entering={FadeInLeft.delay(700 + index * 100).springify()}
                  style={styles.dishCard}
                >
                  <TouchableOpacity 
                    style={styles.dishCardContent}
                    onPress={() => router.push(`/recipe-detail?recipeId=${dish.id}&dishName=${dish.name}&cuisine=${dish.cuisine}&cookingTime=${dish.cookingTime}&difficulty=${dish.difficulty}`)}
                  >
                    <Image source={dish.image} style={styles.dishImage} />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.8)']}
                      style={styles.dishOverlay}
                    >
                      <View style={styles.dishInfo}>
                        <Text style={styles.dishName}>{dish.name}</Text>
                        <Text style={styles.dishCuisine}>{dish.cuisine}</Text>
                        <View style={styles.dishMeta}>
                          <View style={styles.metaItem}>
                            <Clock size={12} color="#ffffff" />
                            <Text style={styles.metaText}>{dish.cookingTime}</Text>
                          </View>
                          <View style={styles.metaItem}>
                            <Star size={12} color="#ffffff" />
                            <Text style={styles.metaText}>{dish.difficulty}</Text>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.letsCookButton}
                    onPress={() => router.push(`/recipe-detail?recipeId=${dish.id}&dishName=${dish.name}&cuisine=${dish.cuisine}&cookingTime=${dish.cookingTime}&difficulty=${dish.difficulty}`)}
                  >
                    <LinearGradient
                      colors={moodData.color}
                      style={styles.letsCookGradient}
                    >
                      <Utensils size={16} color="#ffffff" />
                      <Text style={styles.letsCookText}>Let's Cook</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}

        <Animated.View 
          entering={FadeInDown.delay(800).springify()}
          style={styles.section}
        >
          <TouchableOpacity 
            style={styles.connectButton}
            onPress={() => router.push('/connect')}
          >
            <LinearGradient
              colors={['#ec4899', '#8b5cf6']}
              style={styles.connectGradient}
            >
              <Users size={24} color="#ffffff" />
              <Text style={styles.connectTitle}>Find Others Like You</Text>
              <Text style={styles.connectSubtitle}>
                Connect with people who share your current mood
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  moodEmoji: {
    fontSize: 80,
    marginBottom: 16,
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
    paddingHorizontal: 20,
  },
  analysisCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  analysisTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#8b5cf6',
  },
  analysisDetails: {
    gap: 8,
  },
  analysisText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timestampText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  musicCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginBottom: 20,
    textAlign: 'center',
  },
  dishGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  dishCard: {
    width: (width - 64) / 2,
    marginBottom: 16,
  },
  dishCardContent: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },
  dishImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  dishOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
    padding: 12,
  },
  dishInfo: {
    gap: 4,
  },
  dishName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  dishCuisine: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.8,
  },
  dishMeta: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.9,
  },
  letsCookButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  letsCookGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  letsCookText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  connectButton: {
    height: 120,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 40,
  },
  connectGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  connectTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginTop: 8,
    textAlign: 'center',
  },
  connectSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 4,
  },
});
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Music, ChefHat, Clock, Star } from 'lucide-react-native';
import { useMood, FoodRecommendation } from '../contexts/MoodContext';

export default function MoodRecommendations() {
  const { moodAnalysis, getFoodRecommendations, getMusicRecommendations } = useMood();
  
  if (!moodAnalysis) {
    return (
      <Animated.View 
        entering={FadeInDown.delay(1200).springify()}
        style={styles.container}
      >
        <Text style={styles.sectionTitle}>Personalized Recommendations</Text>
        <Text style={styles.noMoodText}>
          Complete the mood assessment to get personalized food and music recommendations!
        </Text>
        <TouchableOpacity style={styles.assessmentButton}>
          <Text style={styles.assessmentButtonText}>Start Assessment</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  const foodRecommendations = getFoodRecommendations();
  const musicRecommendations = getMusicRecommendations();

  const handleFoodPress = (food: FoodRecommendation) => {
    Alert.alert(
      food.name,
      `${food.description}\n\n🍽️ ${food.cuisine} • ⏱️ ${food.cookingTime} • 📊 ${food.difficulty}`,
      [
        {
          text: '👨‍🍳 Cook',
          onPress: () => {
            Alert.alert('Recipe', `Ingredients for ${food.name}:\n\n${food.ingredients.join('\n• ')}\n\nFull recipe coming soon!`);
          }
        },
        {
          text: '🛒 Order',
          onPress: () => {
            Alert.alert('Order', `Finding restaurants near you that serve ${food.name}...`);
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleMusicPress = (music: any) => {
    Alert.alert(
      music.title,
      `${music.description}\n\n🎵 ${music.genre} • 🎭 ${music.mood}`,
      [
        {
          text: '🎧 Listen',
          onPress: () => {
            Alert.alert('Music Player', `Now playing: ${music.title} by ${music.artist}`);
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  return (
    <Animated.View 
      entering={FadeInDown.delay(1200).springify()}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>For Your {moodAnalysis.dominantMood} Mood</Text>
        <Text style={styles.sectionSubtitle}>
          Based on your preferences • {moodAnalysis.likedCount} songs liked
        </Text>
      </View>

      {/* Food Recommendations */}
      {foodRecommendations.length > 0 && (
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <ChefHat size={20} color="#f59e0b" />
            <Text style={styles.categoryTitle}>Recommended Dishes</Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {foodRecommendations.map((food, index) => (
              <TouchableOpacity
                key={food.id}
                style={styles.foodCard}
                onPress={() => handleFoodPress(food)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#1f2937', '#374151']}
                  style={styles.cardGradient}
                >
                  <Text style={styles.foodEmoji}>{food.image}</Text>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodCuisine}>{food.cuisine}</Text>
                  
                  <View style={styles.foodInfo}>
                    <View style={styles.infoItem}>
                      <Clock size={12} color="#9ca3af" />
                      <Text style={styles.infoText}>{food.cookingTime}</Text>
                    </View>
                    <View style={[styles.difficultyBadge, 
                      { backgroundColor: food.difficulty === 'Easy' ? '#10b981' : 
                        food.difficulty === 'Medium' ? '#f59e0b' : '#ef4444' }
                    ]}>
                      <Text style={styles.difficultyText}>{food.difficulty}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Music Recommendations */}
      {musicRecommendations.length > 0 && (
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Music size={20} color="#8b5cf6" />
            <Text style={styles.categoryTitle}>Recommended Music</Text>
          </View>
          
          <View style={styles.musicList}>
            {musicRecommendations.slice(0, 3).map((music, index) => (
              <TouchableOpacity
                key={music.id}
                style={styles.musicCard}
                onPress={() => handleMusicPress(music)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#312e81', '#1e1b4b']}
                  style={styles.musicGradient}
                >
                  <View style={styles.musicInfo}>
                    <Text style={styles.musicTitle}>{music.title}</Text>
                    <Text style={styles.musicArtist}>{music.artist}</Text>
                    <Text style={styles.musicGenre}>{music.genre} • {music.mood}</Text>
                  </View>
                  <View style={styles.musicAction}>
                    <Star size={16} color="#fbbf24" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  noMoodText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 24,
  },
  assessmentButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'center',
  },
  assessmentButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  horizontalScroll: {
    paddingRight: 20,
  },
  foodCard: {
    width: 140,
    height: 160,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodEmoji: {
    fontSize: 32,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  foodCuisine: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  foodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 10,
    color: '#9ca3af',
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 9,
    color: '#ffffff',
    fontWeight: '600',
  },
  musicList: {
    gap: 8,
  },
  musicCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  musicGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  musicInfo: {
    flex: 1,
  },
  musicTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  musicArtist: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 2,
  },
  musicGenre: {
    fontSize: 12,
    color: '#9ca3af',
  },
  musicAction: {
    padding: 8,
  },
});
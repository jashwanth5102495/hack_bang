import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ChefHat, Clock, Users, Star, Heart, Zap, ShoppingCart } from 'lucide-react-native';
import { useMood, FoodRecommendation } from '../contexts/MoodContext';
import { router } from 'expo-router';

export default function MoodRecommendations() {
  const { currentMoodAnalysis, getFoodRecommendations, getTherapeuticRecommendations } = useMood();
  
  if (!currentMoodAnalysis) {
    return (
      <Animated.View 
        entering={FadeInDown.delay(1200).springify()}
        style={styles.container}
      >
        <Text style={styles.sectionTitle}>Personalized Food Recommendations</Text>
        <Text style={styles.noMoodText}>
          Complete the mood assessment to get personalized food recommendations!
        </Text>
        <TouchableOpacity style={styles.assessmentButton}>
          <Text style={styles.assessmentButtonText}>Start Assessment</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  const foodRecommendations = getFoodRecommendations();
  const therapeuticRecommendations = getTherapeuticRecommendations(currentMoodAnalysis?.dominantMood || 'Happy');

  const handleFoodPress = (food: FoodRecommendation) => {
    Alert.alert(
      food.name,
      `${food.description}\n\n🍽️ ${food.cuisine} • ⏱️ ${food.cookingTime} • 📊 ${food.difficulty}`,
      [
        {
          text: '👨‍🍳 Cook Recipes',
          onPress: () => {
            router.push('/cook-dishes');
          }
        },
        {
          text: '🛒 Order Food',
          onPress: () => {
            router.push('/order-dishes');
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleTherapyPress = (content: any) => {
    Alert.alert(
      content.title,
      `${content.description}\n\n✨ ${content.benefit}\n\n🍽️ Recommended dishes:\n${content.dishes?.join(', ') || 'Various therapeutic options'}`,
      [
        {
          text: '🍽️ Explore Dishes',
          onPress: () => {
            Alert.alert('Dishes', `Therapeutic dishes for ${content.mood} mood:\n\n${content.dishes?.map((dish: string) => `• ${dish}`).join('\n') || 'Coming soon!'}`);
          }
        },
        {
          text: '💡 Learn More',
          onPress: () => {
            Alert.alert('Therapy Info', `${content.benefit}\n\nThis therapeutic approach is designed to help you feel better when you're ${content.mood.toLowerCase()}.`);
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
        <Text style={styles.sectionTitle}>For Your {currentMoodAnalysis.dominantMood} Mood</Text>
        <Text style={styles.sectionSubtitle}>
          Based on your preferences • {currentMoodAnalysis.likedCount} foods recommended
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
                  <Text style={styles.foodEmoji}>
                    {food.cuisine === 'Indian' ? '🍛' : 
                     food.cuisine === 'Italian' ? '🍝' : 
                     food.cuisine === 'Japanese' ? '🍣' : 
                     food.cuisine === 'Mexican' ? '🌮' : 
                     food.cuisine === 'French' ? '🍲' : '🍽️'}
                  </Text>
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

      {/* Therapeutic Content */}
      {therapeuticRecommendations.length > 0 && (
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Zap size={20} color="#10b981" />
            <Text style={styles.categoryTitle}>Mood Therapy</Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {therapeuticRecommendations.map((content, index) => (
              <TouchableOpacity
                key={content.id}
                style={styles.therapyCard}
                onPress={() => handleTherapyPress(content)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#065f46', '#10b981']}
                  style={styles.cardGradient}
                >
                  <Text style={styles.therapyEmoji}>{content.image}</Text>
                  <Text style={styles.therapyTitle}>{content.title}</Text>
                  <Text style={styles.therapyDescription}>{content.description}</Text>
                  
                  <View style={styles.therapyInfo}>
                    <View style={styles.benefitBadge}>
                      <Text style={styles.benefitText}>Therapeutic</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
  therapyCard: {
    width: 160,
    height: 180,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  therapyEmoji: {
    fontSize: 32,
  },
  therapyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  therapyDescription: {
    fontSize: 11,
    color: '#d1fae5',
    textAlign: 'center',
    lineHeight: 14,
    flex: 1,
  },
  therapyInfo: {
    alignItems: 'center',
    width: '100%',
  },
  benefitBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  benefitText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
});
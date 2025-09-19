import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, ChefHat, Clock, Star, Utensils } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import { useMood } from '../contexts/MoodContext';

const { width } = Dimensions.get('window');

const moodDishes = {
  happy: [
    { id: 1, name: 'Rainbow Smoothie Bowl', image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop', cuisine: 'Healthy', time: '10 min', difficulty: 'Easy', gradient: ['#fbbf24', '#f59e0b'], rating: 4.8 },
    { id: 2, name: 'Celebration Cake', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop', cuisine: 'Dessert', time: '45 min', difficulty: 'Medium', gradient: ['#ec4899', '#be185d'], rating: 4.9 },
    { id: 3, name: 'Fruit Parfait', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop', cuisine: 'Light', time: '5 min', difficulty: 'Easy', gradient: ['#10b981', '#059669'], rating: 4.7 },
    { id: 4, name: 'Sunshine Pancakes', image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&h=300&fit=crop', cuisine: 'Breakfast', time: '20 min', difficulty: 'Easy', gradient: ['#f59e0b', '#d97706'], rating: 4.6 },
  ],
  sad: [
    { id: 5, name: 'Warm Chicken Soup', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop', cuisine: 'Comfort', time: '30 min', difficulty: 'Easy', gradient: ['#3b82f6', '#1e40af'], rating: 4.8 },
    { id: 6, name: 'Mac & Cheese', image: 'https://images.unsplash.com/photo-1543826173-1ad0e8b4e7b7?w=400&h=300&fit=crop', cuisine: 'Comfort', time: '25 min', difficulty: 'Easy', gradient: ['#f59e0b', '#d97706'], rating: 4.7 },
    { id: 7, name: 'Hot Chocolate', image: 'https://images.unsplash.com/photo-1542990253-0b8de10fb5d4?w=400&h=300&fit=crop', cuisine: 'Beverage', time: '5 min', difficulty: 'Easy', gradient: ['#8b5cf6', '#7c3aed'], rating: 4.5 },
    { id: 8, name: 'Grilled Cheese', image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400&h=300&fit=crop', cuisine: 'Comfort', time: '10 min', difficulty: 'Easy', gradient: ['#f97316', '#ea580c'], rating: 4.6 },
  ],
  romantic: [
    { id: 9, name: 'Chocolate Fondue', image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=300&fit=crop', cuisine: 'Dessert', time: '15 min', difficulty: 'Easy', gradient: ['#ec4899', '#be185d'], rating: 4.9 },
    { id: 10, name: 'Strawberry Dessert', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop', cuisine: 'Dessert', time: '20 min', difficulty: 'Medium', gradient: ['#f43f5e', '#e11d48'], rating: 4.8 },
    { id: 11, name: 'Wine Pairing Platter', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop', cuisine: 'Appetizer', time: '15 min', difficulty: 'Easy', gradient: ['#7c3aed', '#6d28d9'], rating: 4.7 },
    { id: 12, name: 'Candlelit Pasta', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop', cuisine: 'Italian', time: '25 min', difficulty: 'Medium', gradient: ['#dc2626', '#b91c1c'], rating: 4.8 },
  ],
  tired: [
    { id: 13, name: 'Energy Smoothie', image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop', cuisine: 'Healthy', time: '5 min', difficulty: 'Easy', gradient: ['#10b981', '#059669'], rating: 4.6 },
    { id: 14, name: 'Quick Protein Bowl', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', cuisine: 'Healthy', time: '10 min', difficulty: 'Easy', gradient: ['#06b6d4', '#0891b2'], rating: 4.7 },
    { id: 15, name: 'Herbal Tea', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop', cuisine: 'Beverage', time: '3 min', difficulty: 'Easy', gradient: ['#84cc16', '#65a30d'], rating: 4.4 },
    { id: 16, name: 'Overnight Oats', image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop', cuisine: 'Breakfast', time: '5 min', difficulty: 'Easy', gradient: ['#a855f7', '#9333ea'], rating: 4.5 },
  ],
  excited: [
    { id: 17, name: 'Power Breakfast', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop', cuisine: 'Breakfast', time: '15 min', difficulty: 'Easy', gradient: ['#10b981', '#059669'], rating: 4.7 },
    { id: 18, name: 'Energy Bars', image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=300&fit=crop', cuisine: 'Snack', time: '30 min', difficulty: 'Medium', gradient: ['#f59e0b', '#d97706'], rating: 4.5 },
    { id: 19, name: 'Pre-Workout Smoothie', image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop', cuisine: 'Healthy', time: '5 min', difficulty: 'Easy', gradient: ['#ef4444', '#dc2626'], rating: 4.6 },
    { id: 20, name: 'Spicy Tacos', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', cuisine: 'Mexican', time: '20 min', difficulty: 'Medium', gradient: ['#f97316', '#ea580c'], rating: 4.8 },
  ],
  lonely: [
    { id: 21, name: 'Comfort Tea', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop', cuisine: 'Beverage', time: '5 min', difficulty: 'Easy', gradient: ['#8b5cf6', '#7c3aed'], rating: 4.4 },
    { id: 22, name: 'Self-Care Treats', image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400&h=300&fit=crop', cuisine: 'Dessert', time: '25 min', difficulty: 'Medium', gradient: ['#ec4899', '#be185d'], rating: 4.7 },
    { id: 23, name: 'Warm Pastries', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop', cuisine: 'Bakery', time: '20 min', difficulty: 'Easy', gradient: ['#f59e0b', '#d97706'], rating: 4.6 },
    { id: 24, name: 'Cozy Hot Cocoa', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', cuisine: 'Beverage', time: '8 min', difficulty: 'Easy', gradient: ['#6b7280', '#4b5563'], rating: 4.5 },
  ],
  hungry: [
    { id: 25, name: 'Hearty Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', cuisine: 'Fast Food', time: '15 min', difficulty: 'Easy', gradient: ['#f97316', '#ea580c'], rating: 4.8 },
    { id: 26, name: 'Pizza Feast', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop', cuisine: 'Italian', time: '30 min', difficulty: 'Medium', gradient: ['#dc2626', '#b91c1c'], rating: 4.9 },
    { id: 27, name: 'BBQ Ribs', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop', cuisine: 'BBQ', time: '45 min', difficulty: 'Hard', gradient: ['#92400e', '#78350f'], rating: 4.7 },
    { id: 28, name: 'Loaded Nachos', image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop', cuisine: 'Mexican', time: '20 min', difficulty: 'Easy', gradient: ['#f59e0b', '#d97706'], rating: 4.6 },
  ],
  moody: [
    { id: 29, name: 'Dark Chocolate Cake', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop', cuisine: 'Dessert', time: '40 min', difficulty: 'Medium', gradient: ['#06b6d4', '#0891b2'], rating: 4.8 },
    { id: 30, name: 'Comfort Ramen', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', cuisine: 'Asian', time: '25 min', difficulty: 'Medium', gradient: ['#8b5cf6', '#7c3aed'], rating: 4.7 },
    { id: 31, name: 'Mood-Boosting Salad', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop', cuisine: 'Healthy', time: '15 min', difficulty: 'Easy', gradient: ['#10b981', '#059669'], rating: 4.5 },
    { id: 32, name: 'Artisan Coffee', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop', cuisine: 'Beverage', time: '5 min', difficulty: 'Easy', gradient: ['#78716c', '#57534e'], rating: 4.6 },
  ],
};

export default function DishesScreen() {
  const { moodAnalysis } = useMood();
  const currentMood = moodAnalysis?.dominantMood || 'moody';
  const dishes = moodDishes[currentMood as keyof typeof moodDishes] || moodDishes.moody;

  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    romantic: '💕',
    tired: '😴',
    excited: '🤩',
    lonely: '😔',
    hungry: '🤤',
    moody: '🎭'
  };

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
          <Text style={styles.moodEmoji}>{moodEmojis[currentMood as keyof typeof moodEmojis]}</Text>
          <Text style={styles.title}>Dishes for your {currentMood} mood</Text>
          <Text style={styles.subtitle}>
            Perfect recipes to match how you're feeling right now
          </Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(400).springify()}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Utensils size={24} color="#f97316" />
            <Text style={styles.sectionTitle}>Recommended Dishes</Text>
          </View>

          <View style={styles.dishesGrid}>
            {dishes.map((dish, index) => (
              <Animated.View
                key={dish.id}
                entering={FadeInDown.delay(600 + index * 100).springify()}
                style={styles.dishCard}
              >
                <TouchableOpacity
                  style={styles.dishCardContent}
                  activeOpacity={0.8}
                  onPress={() => {
                    // Handle dish selection
                    console.log('Selected dish:', dish.name);
                  }}
                >
                  <View style={styles.dishCard}>
                    <Image 
                      source={{ uri: dish.image }}
                      style={styles.dishImage}
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.8)']}
                      style={styles.dishOverlay}
                    >
                      <Text style={styles.dishName}>{dish.name}</Text>
                      <Text style={styles.dishCuisine}>{dish.cuisine}</Text>
                      
                      <View style={styles.dishDetails}>
                        <View style={styles.dishDetail}>
                          <Clock size={12} color="#ffffff" />
                          <Text style={styles.dishDetailText}>{dish.time}</Text>
                        </View>
                        <View style={styles.dishDetail}>
                          <Star size={12} color="#fbbf24" />
                          <Text style={styles.dishDetailText}>{dish.rating}</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(800).springify()}
          style={styles.cookingTipsSection}
        >
          <View style={styles.sectionHeader}>
            <ChefHat size={24} color="#3b82f6" />
            <Text style={styles.sectionTitle}>Cooking Tips</Text>
          </View>
          
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>Perfect for your {currentMood} mood</Text>
            <Text style={styles.tipText}>
              These dishes are specially selected to complement your current emotional state and help enhance your mood through delicious, comforting flavors.
            </Text>
          </View>
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
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  dishesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  dishCard: {
    width: (width - 64) / 2,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  dishImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  dishOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    justifyContent: 'flex-end',
  },
  dishName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dishCuisine: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dishDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dishDetailText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    opacity: 0.9,
  },
  cookingTipsSection: {
    marginBottom: 40,
  },
  tipCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    lineHeight: 20,
  },
});
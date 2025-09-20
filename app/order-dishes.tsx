import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, ShoppingCart, Clock, Star, Utensils } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import { useMood } from '../contexts/MoodContext';
import { useCart } from '../contexts/CartContext';

const { width } = Dimensions.get('window');

export default function OrderDishesScreen() {
  const { currentMoodAnalysis, getFoodRecommendations, getTherapeuticMood } = useMood();
  const { addToCart, getTotalItems } = useCart();

  const currentMood = currentMoodAnalysis?.dominantMood || 'moody';
  const therapeuticMood = getTherapeuticMood(currentMood);
  const dishes = getFoodRecommendations(currentMood);

  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    romantic: '💕',
    tired: '😴',
    excited: '🤩',
    lonely: '😔',
    hungry: '🤤',
    moody: '🎭',
    calming: '🧘‍♀️'
  };

  const displayMood = therapeuticMood === 'Calming' ? 'calming' : currentMood.toLowerCase();

  const orderDish = (dish: any) => {
    const cartItem = {
      id: dish.id,
      name: dish.name,
      price: dish.price,
      cuisine: dish.cuisine,
      cookingTime: dish.cookingTime,
      image: dish.image
    };
    
    addToCart(cartItem);
  };

  return (
    <LinearGradient
      colors={['#000000', '#0a0a0a', '#111111']}
      style={styles.container}
    >
      {/* Header with Back and Cart */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => router.push('/cart')}
        >
          <ShoppingCart size={24} color="#ffffff" />
          {getTotalItems() > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View 
          entering={FadeInLeft.delay(200).springify()}
          style={styles.header}
        >
          <Text style={styles.moodEmoji}>{moodEmojis[displayMood as keyof typeof moodEmojis]}</Text>
          <Text style={styles.title}>
            {therapeuticMood === 'Calming' 
              ? `Order calming dishes for delivery` 
              : `Order dishes for your ${currentMood} mood`}
          </Text>
          <Text style={styles.subtitle}>
            {therapeuticMood === 'Calming' 
              ? 'Soothing meals delivered to bring comfort to your day'
              : 'Delicious food delivered to match how you\'re feeling right now'}
          </Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(400).springify()}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <ShoppingCart size={24} color="#10b981" />
            <Text style={styles.sectionTitle}>Order for Delivery</Text>
          </View>

          <View style={styles.dishesGrid}>
            {dishes.map((dish, index) => (
              <Animated.View
                key={dish.id}
                entering={FadeInDown.delay(600 + index * 100).springify()}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => orderDish(dish)}
                  style={styles.dishCard}
                >
                  <Image 
                    source={dish.image}
                    style={styles.dishImage}
                    resizeMode="cover"
                    onError={(error) => {
                      console.log('Image loading error for', dish.name, ':', error.nativeEvent.error);
                    }}
                    defaultSource={{ uri: 'https://via.placeholder.com/400x300/1f2937/ffffff?text=Food' }}
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
                        <Text style={styles.dishDetailText}>{dish.cookingTime}</Text>
                      </View>
                      <View style={styles.dishDetail}>
                        <Star size={12} color="#fbbf24" />
                        <Text style={styles.dishDetailText}>{dish.difficulty}</Text>
                      </View>
                    </View>

                    <View style={styles.actionButtons}>
                      <TouchableOpacity 
                        style={styles.orderButton}
                        onPress={() => orderDish(dish)}
                      >
                        <ShoppingCart size={16} color="#ffffff" />
                        <Text style={styles.orderButtonText}>Order ₹{dish.price}</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(800).springify()}
          style={styles.deliveryInfoSection}
        >
          <View style={styles.sectionHeader}>
            <Utensils size={24} color="#3b82f6" />
            <Text style={styles.sectionTitle}>Delivery Info</Text>
          </View>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Fast delivery for your {String(currentMood)} mood</Text>
            <Text style={styles.infoText}>
              • Free delivery on orders above ₹299{'\n'}
              • Average delivery time: 30-45 minutes{'\n'}
              • Fresh ingredients and authentic flavors{'\n'}
              • Track your order in real-time
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Floating Cart Button */}
      {getTotalItems() > 0 && (
        <Animated.View 
          entering={FadeInDown.delay(1000)}
          style={styles.floatingCartContainer}
        >
          <TouchableOpacity
            style={styles.floatingCartButton}
            onPress={() => router.push('/cart')}
          >
            <ShoppingCart size={20} color="#ffffff" />
            <Text style={styles.floatingCartText}>
              View Cart ({getTotalItems()})
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'absolute',
    top: 60,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
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
    height: (width - 64) / 2,
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
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dishDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  actionButtons: {
    marginTop: 12,
    alignItems: 'center',
  },
  orderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  orderButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  deliveryInfoSection: {
    marginBottom: 40,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    lineHeight: 20,
  },
  floatingCartContainer: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
  },
  floatingCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingCartText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});
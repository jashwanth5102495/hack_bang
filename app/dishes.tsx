import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, ChefHat, Clock, Star, Utensils, ShoppingCart } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import { useMood } from '../contexts/MoodContext';
import { useCart } from '../contexts/CartContext';
import { initiatePayment, trackOrder } from '../components/RazorpayPayment';

const { width } = Dimensions.get('window');

// Food recommendations are now handled by MoodContext

export default function DishesScreen() {
  const { currentMoodAnalysis, getFoodRecommendations, getTherapeuticMood } = useMood();
  const { addToCart, cartItems, getTotalItems } = useCart();
  
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

  const handleDishPress = (dish: any) => {
    Alert.alert(
      dish.name,
      `${dish.cuisine} • ${dish.cookingTime} • ${dish.difficulty}\n\nPrice: ₹${dish.price}`,
      [
        {
          text: '🛒 Order Now',
          onPress: () => orderDish(dish)
        },
        {
          text: '👨‍🍳 View Recipe',
          onPress: () => {
            router.push('/cook-dishes');
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const orderDish = (dish: any) => {
    Alert.alert(
      `Add ${dish.name} to Cart?`,
      `Price: ₹${dish.price}`,
      [
        {
          text: 'Add to Cart',
          onPress: () => {
            addToCart({
              id: dish.id,
              name: dish.name,
              price: dish.price,
              cuisine: dish.cuisine,
              cookingTime: dish.cookingTime,
              image: dish.image
            });
          }
        },
        {
          text: 'View Cart',
          onPress: () => router.push('/cart')
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
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
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => router.push('/cart')}
          >
            <ShoppingCart size={24} color="#fff" />
            {getTotalItems() > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.moodEmoji}>{moodEmojis[displayMood as keyof typeof moodEmojis]}</Text>
          <Text style={styles.title}>
            {therapeuticMood === 'Calming' 
              ? `Calming dishes to help you feel better` 
              : `Dishes for your ${currentMood} mood`}
          </Text>
          <Text style={styles.subtitle}>
            {therapeuticMood === 'Calming' 
              ? 'Soothing recipes to bring peace and comfort to your day'
              : 'Perfect recipes to match how you\'re feeling right now'}
          </Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(400).springify()}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <ShoppingCart size={24} color="#10b981" />
            <Text style={styles.sectionTitle}>Order Dishes</Text>
          </View>

          <View style={styles.dishesGrid}>
            {dishes.map((dish, index) => (
              <Animated.View
                key={dish.id}
                entering={FadeInDown.delay(600 + index * 100).springify()}
                style={styles.dishCard}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleDishPress(dish)}
                >
                  <View style={styles.dishCard}>
                    <Image 
                      source={dish.image}
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
                          <Text style={styles.dishDetailText}>{dish.cookingTime}</Text>
                        </View>
                        <View style={styles.dishDetail}>
                          <Star size={12} color="#fbbf24" />
                          <Text style={styles.dishDetailText}>{dish.difficulty}</Text>
                        </View>
                      </View>

                      <View style={styles.priceSection}>
                        <Text style={styles.priceText}>₹{dish.price}</Text>
                        <View style={styles.orderHints}>
                          <ShoppingCart size={12} color="#10b981" />
                          <Text style={styles.orderHintText}>Tap to Order</Text>
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
            <ShoppingCart size={24} color="#10b981" />
            <Text style={styles.sectionTitle}>Delivery Info</Text>
          </View>
          
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>Perfect for your {String(currentMood)} mood</Text>
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
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#10b981',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  orderHints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  orderHintText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#10b981',
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
  cartButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  cartBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
});
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  interpolate,
  FadeInDown,
  runOnJS
} from 'react-native-reanimated';
import { ChefHat, ShoppingCart } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = 160;
const CARD_HEIGHT = 200;

interface DishCard {
  id: string;
  name: string;
  emoji: string;
  cuisine: string;
  cookingTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  gradient: string[];
}

const dishCards: DishCard[] = [
  {
    id: '1',
    name: 'Spicy Ramen',
    emoji: '🍜',
    cuisine: 'Japanese',
    cookingTime: '25 min',
    difficulty: 'Medium',
    gradient: ['#1a1a1a', '#2a2a2a']
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    emoji: '🍕',
    cuisine: 'Italian',
    cookingTime: '30 min',
    difficulty: 'Easy',
    gradient: ['#1a1a1a', '#2a2a2a']
  },
  {
    id: '3',
    name: 'Sushi Platter',
    emoji: '🍣',
    cuisine: 'Japanese',
    cookingTime: '45 min',
    difficulty: 'Hard',
    gradient: ['#1a1a1a', '#2a2a2a']
  },
  {
    id: '4',
    name: 'Tacos Al Pastor',
    emoji: '🌮',
    cuisine: 'Mexican',
    cookingTime: '20 min',
    difficulty: 'Easy',
    gradient: ['#1a1a1a', '#2a2a2a']
  },
  {
    id: '5',
    name: 'Pad Thai',
    emoji: '🍝',
    cuisine: 'Thai',
    cookingTime: '35 min',
    difficulty: 'Medium',
    gradient: ['#1a1a1a', '#2a2a2a']
  },
  {
    id: '6',
    name: 'Burger Deluxe',
    emoji: '🍔',
    cuisine: 'American',
    cookingTime: '15 min',
    difficulty: 'Easy',
    gradient: ['#1a1a1a', '#2a2a2a']
  },
  {
    id: '7',
    name: 'Curry Bowl',
    emoji: '🍛',
    cuisine: 'Indian',
    cookingTime: '40 min',
    difficulty: 'Medium',
    gradient: ['#1a1a1a', '#2a2a2a']
  },
  {
    id: '8',
    name: 'Croissant',
    emoji: '🥐',
    cuisine: 'French',
    cookingTime: '60 min',
    difficulty: 'Hard',
    gradient: ['#1a1a1a', '#2a2a2a']
  }
];

interface CircularDishCardsProps {
  onDishSelect: (dish: DishCard) => void;
}

export default function CircularDishCards({ onDishSelect }: CircularDishCardsProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);

  // Create extended array for infinite scroll
  const extendedDishes = [...dishCards, ...dishCards, ...dishCards];
  const totalWidth = CARD_WIDTH * dishCards.length;

  useEffect(() => {
    const autoScroll = () => {
      if (scrollViewRef.current) {
        const nextIndex = currentIndex + 1;
        const scrollToX = nextIndex * (CARD_WIDTH + 16); // Include margin
        
        scrollViewRef.current.scrollTo({
          x: scrollToX,
          animated: true,
        });
        
        // Reset to beginning when reaching the end of first set
        if (nextIndex >= dishCards.length) {
          setTimeout(() => {
            if (scrollViewRef.current) {
              scrollViewRef.current.scrollTo({
                x: 0,
                animated: false,
              });
              setCurrentIndex(0);
            }
          }, 500);
        } else {
          setCurrentIndex(nextIndex);
        }
      }
    };

    const interval = setInterval(autoScroll, 3000); // Auto-scroll every 3 seconds
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleDishPress = (dish: DishCard) => {
    Alert.alert(
      dish.name,
      `${dish.cuisine} • ${dish.cookingTime} • ${dish.difficulty}`,
      [
        {
          text: '👨‍🍳 Cook',
          onPress: () => {
            Alert.alert('Cook Mode', `Let's cook ${dish.name}! Recipe coming soon...`);
          }
        },
        {
          text: '🛒 Order',
          onPress: () => {
            Alert.alert('Order Mode', `Ordering ${dish.name} from nearby restaurants...`);
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const renderDishCard = (dish: DishCard, index: number) => {
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        (index + 1) * CARD_WIDTH,
      ];

      const scale = interpolate(
        scrollX.value,
        inputRange,
        [0.8, 1, 0.8],
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
        key={dish.id}
        style={[styles.cardContainer, animatedStyle]}
      >
        <TouchableOpacity
          style={styles.dishCard}
          onPress={() => handleDishPress(dish)}
          activeOpacity={0.8}
        >
          <View style={styles.cardGradient}>
            <View style={styles.foodImageContainer}>
              <Text style={styles.dishEmoji}>{dish.emoji}</Text>
              <View style={styles.foodImageOverlay} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.dishName}>{dish.name}</Text>
              <Text style={styles.dishCuisine}>{dish.cuisine}</Text>
              
              <View style={styles.dishInfo}>
                <Text style={styles.dishTime}>{dish.cookingTime}</Text>
                <View style={[styles.difficultyBadge, 
                  { backgroundColor: dish.difficulty === 'Easy' ? '#10b981' : 
                    dish.difficulty === 'Medium' ? '#f59e0b' : '#ef4444' }
                ]}>
                  <Text style={styles.difficultyText}>{dish.difficulty}</Text>
                </View>
              </View>

              <View style={styles.actionHint}>
                <ChefHat size={16} color="#ffffff80" />
                <ShoppingCart size={16} color="#ffffff80" />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Animated.View 
      entering={FadeInDown.delay(1000).springify()}
      style={styles.container}
    >
      <Text style={styles.sectionTitle}>Dishes to be tried</Text>
      <Text style={styles.sectionSubtitle}>Tap to cook or order</Text>
      
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        snapToInterval={CARD_WIDTH + 16}
        decelerationRate="fast"
        onScroll={(event) => {
          scrollX.value = event.nativeEvent.contentOffset.x;
        }}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          const offsetX = event.nativeEvent.contentOffset.x;
          const index = Math.round(offsetX / (CARD_WIDTH + 16));
          setCurrentIndex(index % dishCards.length);
        }}
      >
        {extendedDishes.map((dish, index) => renderDishCard(dish, index))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    paddingHorizontal: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#ffffff60',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingRight: 20,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: 16,
  },
  dishCard: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradient: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    overflow: 'hidden',
  },
  foodImageContainer: {
    height: 120,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dishEmoji: {
    fontSize: 48,
    zIndex: 2,
  },
  foodImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1,
  },
  cardContent: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  dishName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  dishCuisine: {
    fontSize: 12,
    color: '#ffffff80',
    textAlign: 'center',
    marginBottom: 8,
  },
  dishInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  dishTime: {
    fontSize: 11,
    color: '#ffffff80',
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  actionHint: {
    flexDirection: 'row',
    gap: 8,
    opacity: 0.6,
  },
});
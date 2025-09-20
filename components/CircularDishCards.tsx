import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  FadeInDown
} from 'react-native-reanimated';
import { ChefHat, ShoppingCart } from 'lucide-react-native';
import { router } from 'expo-router';
import { useMood } from '../contexts/MoodContext';
import { initiatePayment, trackOrder } from './RazorpayPayment';
import FoodActionPopup from './FoodActionPopup';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = 160;
const CARD_HEIGHT = 200;

interface DishCard {
  id: string;
  name: string;
  emoji: string;
  cuisine: string;
  cookingTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  image: any;
}

// Mood-based dish recommendations with local images
const getMoodBasedDishes = (mood: string): DishCard[] => {
  const dishDatabase: { [key: string]: DishCard[] } = {
    'Happy': [
      {
        id: 'h1',
        name: 'Chicken Biryani',
        emoji: '🍛',
        cuisine: 'Indian',
        cookingTime: '60 min',
        difficulty: 'Medium',
        image: require('../assets/food-images/chicken-biryani.webp')
      },
      {
        id: 'h2',
        name: 'Margherita Pizza',
        emoji: '🍕',
        cuisine: 'Italian',
        cookingTime: '30 min',
        difficulty: 'Medium',
        image: require('../assets/food-images/margherita-pizza.jpg')
      },
      {
        id: 'h3',
        name: 'Sushi Platter',
        emoji: '🍣',
        cuisine: 'Japanese',
        cookingTime: '45 min',
        difficulty: 'Hard',
        image: require('../assets/food-images/sushi.jpg')
      },
      {
        id: 'h4',
        name: 'Chole Bhature',
        emoji: '🍛',
        cuisine: 'Indian',
        cookingTime: '45 min',
        difficulty: 'Medium',
        image: require('../assets/food-images/chole-bhature.jpg')
      }
    ],
    'Sad': [
      {
        id: 's1',
        name: 'French Onion Soup',
        emoji: '🍲',
        cuisine: 'French',
        cookingTime: '45 min',
        difficulty: 'Medium',
        image: require('../assets/food-images/french-onion-soup.jpg')
      },
      {
        id: 's2',
        name: 'Tomato Rasam',
        emoji: '�',
        cuisine: 'Indian',
        cookingTime: '25 min',
        difficulty: 'Easy',
        image: require('../assets/food-images/tomato-rasam.jpg')
      }
    ],
    'Excited': [
      {
        id: 'e1',
        name: 'Spicy Tacos',
        emoji: '🌮',
        cuisine: 'Mexican',
        cookingTime: '25 min',
        difficulty: 'Easy',
        image: require('../assets/food-images/street-tacos.jpg')
      },
      {
        id: 'e2',
        name: 'Pav Bhaji',
        emoji: '�',
        cuisine: 'Indian',
        cookingTime: '30 min',
        difficulty: 'Medium',
        image: require('../assets/food-images/pav-bhaji.jpg')
      }
    ],
    'Lonely': [
      {
        id: 'l1',
        name: 'Warm Soup',
        emoji: '🍲',
        cuisine: 'Comfort',
        cookingTime: '30 min',
        difficulty: 'Easy',
        image: { uri: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop' }
      }
    ],
    'Romantic': [
      {
        id: 'r1',
        name: 'Pasta Alfredo',
        emoji: '🍝',
        cuisine: 'Italian',
        cookingTime: '35 min',
        difficulty: 'Medium',
        image: { uri: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop' }
      }
    ],
    'Tired': [
      {
        id: 't1',
        name: 'Simple Salad',
        emoji: '🥗',
        cuisine: 'Healthy',
        cookingTime: '10 min',
        difficulty: 'Easy',
        image: { uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop' }
      }
    ],
    'Moody': [
      {
        id: 'm1',
        name: 'Comfort Food',
        emoji: '🍛',
        cuisine: 'Comfort',
        cookingTime: '40 min',
        difficulty: 'Medium',
        image: { uri: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400&h=300&fit=crop' }
      }
    ]
  };

  const moodKey = mood.charAt(0).toUpperCase() + mood.slice(1).toLowerCase();
  return dishDatabase[moodKey] || dishDatabase['Happy'];
};

interface CircularDishCardsProps {
  onDishSelect?: (dish: DishCard) => void;
}

export default function CircularDishCards({ onDishSelect }: CircularDishCardsProps) {
  // Use onDishSelect if provided
  const handleDishSelection = onDishSelect || (() => { });
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDish, setSelectedDish] = useState<DishCard | null>(null);
  const scrollX = useSharedValue(0);
  const { currentMoodAnalysis } = useMood();

  const currentMood = currentMoodAnalysis?.dominantMood || 'Happy';
  const dishCards = getMoodBasedDishes(currentMood);

  // Create extended array for infinite scroll effect
  const extendedDishes = [...dishCards, ...dishCards, ...dishCards];

  useEffect(() => {
    const timer = setInterval(() => {
      if (scrollViewRef.current) {
        const nextIndex = (currentIndex + 1) % dishCards.length;
        const scrollToX = nextIndex * (CARD_WIDTH + 16);

        scrollViewRef.current.scrollTo({
          x: scrollToX,
          animated: true,
        });

        setCurrentIndex(nextIndex);
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleDishPress = (dish: DishCard) => {
    handleDishSelection(dish);
    setSelectedDish(dish);
    setShowPopup(true);
  };

  const handleCook = () => {
    setShowPopup(false);
    router.push('/cook-dishes');
  };

  const handleOrder = () => {
    setShowPopup(false);
    router.push('/order-dishes');
  };

  const orderDish = async (dish: DishCard) => {
    const orderAmount = Math.floor(Math.random() * 500) + 200;

    try {
      const orderDetails = {
        dishName: dish.name,
        price: orderAmount,
        cuisine: dish.cuisine,
        cookingTime: dish.cookingTime
      };

      const result = await initiatePayment(orderDetails);

      if (result.success) {
        const orderId = result.orderId || `ORD${Date.now()}`;
        const tracking = trackOrder(orderId);

        Alert.alert(
          'Order Placed Successfully! 🎉',
          `Order ID: ${orderId}\nAmount: ₹${orderAmount}\n\nStatus: ${tracking.status}\nEstimated Delivery: ${tracking.estimatedDeliveryTime}`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Payment Failed', 'Please try again or contact support.', [{ text: 'OK' }]);
      }
    } catch (error) {
      Alert.alert('Payment Error', 'Unable to process payment. Please try again.', [{ text: 'OK' }]);
    }
  };

  const DishCardItem = ({ dish, index }: { dish: DishCard; index: number }) => {
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
            style={styles.imageOverlay}
          >
            <View style={styles.cardContent}>
              <Text style={styles.dishName}>{dish.name}</Text>
              <Text style={styles.dishCuisine}>{dish.cuisine}</Text>

              <View style={styles.dishInfo}>
                <Text style={styles.dishTime}>{dish.cookingTime}</Text>
                <View style={[styles.difficultyBadge,
                {
                  backgroundColor: dish.difficulty === 'Easy' ? '#10b981' :
                    dish.difficulty === 'Medium' ? '#f59e0b' : '#ef4444'
                }
                ]}>
                  <Text style={styles.difficultyText}>{dish.difficulty}</Text>
                </View>
              </View>

              <View style={styles.actionHint}>
                <ChefHat size={16} color="#ffffff80" />
                <ShoppingCart size={16} color="#ffffff80" />
              </View>
            </View>
          </LinearGradient>
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
        {extendedDishes.map((dish, index) => (
          <DishCardItem key={`${dish.id}-${index}`} dish={dish} index={index} />
        ))}
      </ScrollView>

      <FoodActionPopup
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        onCook={handleCook}
        onOrder={handleOrder}
        dishName={selectedDish?.name}
      />
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
    gap: 16,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
  },
  dishCard: {
    width: '100%',
    height: '100%',
  },
  dishImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
  },
  cardContent: {
    padding: 16,
  },
  dishName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dishCuisine: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dishInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dishTime: {
    fontSize: 10,
    color: '#ffffff',
    opacity: 0.8,
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 8,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  actionHint: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
});
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Alert, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Clock, Users, ChefHat, Star, Play, Pause, Share2, Heart, BookOpen, ShoppingCart } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInLeft, FadeInUp } from 'react-native-reanimated';
import { useCart } from '../contexts/CartContext';
import { Linking } from 'react-native';

const { width, height } = Dimensions.get('window');

interface Recipe {
  id: string;
  name: string;
  cuisine: string;
  cookingTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: number;
  rating: number;
  ingredients: string[];
  instructions: string[];
  tips?: string[];
  youtubeVideoId?: string;
}

// Recipe database with YouTube video IDs
const recipeDatabase: { [key: string]: Recipe } = {
  'chicken-biryani': {
    id: 'chicken-biryani',
    name: 'Chicken Biryani',
    cuisine: 'Indian',
    cookingTime: '60 min',
    difficulty: 'Medium',
    servings: 4,
    rating: 4.8,
    youtubeVideoId: 'qbpTVvQANtQ', // Popular chicken biryani recipe
    ingredients: [
      '500g Basmati rice',
      '500g Chicken (cut into pieces)',
      '2 cups Yogurt',
      '2 Large onions (thinly sliced)',
      '1/4 cup Saffron soaked in warm milk',
      '4 Bay leaves',
      '6 Green cardamom pods',
      '2 inch Cinnamon stick',
      '1 tsp Cumin seeds',
      '2 tbsp Ginger-garlic paste',
      '1 tsp Red chili powder',
      '1/2 tsp Turmeric powder',
      '1 tsp Garam masala',
      '4 tbsp Ghee',
      'Salt to taste',
      'Fresh mint leaves',
      'Fresh coriander leaves'
    ],
    instructions: [
      'Marinate chicken with yogurt, ginger-garlic paste, red chili powder, turmeric, and salt for 30 minutes.',
      'Soak basmati rice in water for 30 minutes, then drain.',
      'Heat ghee in a heavy-bottomed pot and fry sliced onions until golden brown. Remove and set aside.',
      'In the same pot, cook marinated chicken until 70% done. Remove and set aside.',
      'Boil water with whole spices (bay leaves, cardamom, cinnamon, cumin seeds) and salt.',
      'Add soaked rice to boiling water and cook until 70% done. Drain the rice.',
      'Layer the partially cooked rice over the chicken in the pot.',
      'Sprinkle fried onions, saffron milk, mint, and coriander leaves on top.',
      'Cover with aluminum foil, then place the lid. Cook on high heat for 3-4 minutes.',
      'Reduce heat to low and cook for 45 minutes (dum cooking).',
      'Turn off heat and let it rest for 10 minutes before opening.',
      'Gently mix and serve hot with raita and boiled eggs.'
    ],
    tips: [
      'Use aged basmati rice for better texture and aroma.',
      'Don\'t overcook the rice in step 5 - it should be 70% done.',
      'The dum cooking process is crucial for the authentic biryani flavor.',
      'Let the biryani rest after cooking to allow flavors to meld together.'
    ]
  },
  'chole-bhature': {
    id: 'chole-bhature',
    name: 'Chole Bhature',
    cuisine: 'Indian',
    cookingTime: '45 min',
    difficulty: 'Medium',
    servings: 4,
    rating: 4.6,
    youtubeVideoId: 'VVnZNyWdHjg', // Popular chole bhature recipe
    ingredients: [
      '2 cups Chickpeas (soaked overnight)',
      '2 cups All-purpose flour',
      '1/4 cup Yogurt',
      '1 tsp Baking powder',
      '2 Large onions (chopped)',
      '3 Tomatoes (chopped)',
      '2 tsp Ginger-garlic paste',
      '2 tsp Chole masala',
      '1 tsp Cumin seeds',
      '1 tsp Red chili powder',
      '1/2 tsp Turmeric powder',
      '1 tsp Garam masala',
      'Oil for deep frying',
      'Salt to taste',
      'Fresh coriander leaves'
    ],
    instructions: [
      'Pressure cook soaked chickpeas with salt until tender. Set aside.',
      'For bhature: Mix flour, yogurt, baking powder, and salt. Knead into soft dough.',
      'Rest the dough for 30 minutes.',
      'Heat oil in a pan. Add cumin seeds and let them splutter.',
      'Add onions and sauté until golden brown.',
      'Add ginger-garlic paste and cook for 2 minutes.',
      'Add tomatoes and cook until soft.',
      'Add all spices and cook for 2 minutes.',
      'Add cooked chickpeas with some cooking liquid.',
      'Simmer for 15 minutes until thick gravy forms.',
      'Roll bhature dough into circles and deep fry until puffed and golden.',
      'Serve hot chole with bhature, garnished with coriander.'
    ],
    tips: [
      'Soak chickpeas overnight for better texture.',
      'The bhature dough should be soft and well-rested.',
      'Fry bhature on medium-high heat for best puffing.',
      'Serve immediately while bhature are hot and crispy.'
    ]
  },
  'margherita-pizza': {
    id: 'margherita-pizza',
    name: 'Margherita Pizza',
    cuisine: 'Italian',
    cookingTime: '30 min',
    difficulty: 'Medium',
    servings: 2,
    rating: 4.6,
    youtubeVideoId: 'sv3TXMSv6Lw', // Popular margherita pizza recipe
    ingredients: [
      '1 Pizza dough (store-bought or homemade)',
      '1/2 cup Pizza sauce',
      '200g Fresh mozzarella cheese (sliced)',
      '2 Large tomatoes (sliced)',
      '1/4 cup Fresh basil leaves',
      '2 tbsp Extra virgin olive oil',
      '1 clove Garlic (minced)',
      'Salt and black pepper to taste',
      'Cornmeal for dusting'
    ],
    instructions: [
      'Preheat your oven to 475°F (245°C). If using a pizza stone, place it in the oven.',
      'Roll out the pizza dough on a floured surface to your desired thickness.',
      'Transfer dough to a pizza pan dusted with cornmeal.',
      'Brush the dough lightly with olive oil and minced garlic.',
      'Spread pizza sauce evenly, leaving a 1-inch border for the crust.',
      'Arrange mozzarella slices and tomato slices on top.',
      'Season with salt and pepper.',
      'Bake for 12-15 minutes until crust is golden and cheese is bubbly.',
      'Remove from oven and immediately top with fresh basil leaves.',
      'Drizzle with remaining olive oil and serve hot.'
    ],
    tips: [
      'Use fresh mozzarella for the best flavor and texture.',
      'Don\'t overload with toppings - less is more for Margherita.',
      'Fresh basil should be added after baking to preserve its flavor.',
      'A pizza stone will give you a crispier crust.'
    ]
  },
  'fresh-sushi': {
    id: 'fresh-sushi',
    name: 'Fresh Sushi',
    cuisine: 'Japanese',
    cookingTime: '30 min',
    difficulty: 'Hard',
    servings: 2,
    rating: 4.9,
    youtubeVideoId: 'joweUxpHaqc', // Popular sushi making tutorial
    ingredients: [
      '2 cups Sushi rice',
      '3 tbsp Rice vinegar',
      '1 tbsp Sugar',
      '1 tsp Salt',
      '4 Nori sheets',
      '200g Fresh salmon (sashimi grade)',
      '1 Cucumber (julienned)',
      '1 Avocado (sliced)',
      'Wasabi paste',
      'Pickled ginger',
      'Soy sauce',
      'Sesame seeds'
    ],
    instructions: [
      'Cook sushi rice according to package instructions.',
      'Mix rice vinegar, sugar, and salt. Heat until dissolved.',
      'Mix the vinegar mixture into warm rice and let cool.',
      'Place nori sheet on bamboo mat, shiny side down.',
      'Spread rice evenly on nori, leaving 1-inch border at top.',
      'Place salmon, cucumber, and avocado in a line across rice.',
      'Roll tightly using the bamboo mat.',
      'Wet a sharp knife and slice into 8 pieces.',
      'Repeat with remaining ingredients.',
      'Serve with wasabi, ginger, and soy sauce.'
    ],
    tips: [
      'Use only sashimi-grade fish for safety.',
      'Keep hands wet when handling sushi rice.',
      'Roll firmly but don\'t compress too much.',
      'Clean knife between cuts for neat slices.'
    ]
  },
  'french-onion-soup': {
    id: 'french-onion-soup',
    name: 'French Onion Soup',
    cuisine: 'French',
    cookingTime: '45 min',
    difficulty: 'Medium',
    servings: 4,
    rating: 4.7,
    youtubeVideoId: 'WaEuBUMy6Lk', // Popular French onion soup recipe
    ingredients: [
      '6 Large onions (thinly sliced)',
      '4 cups Beef broth',
      '1/2 cup Dry white wine',
      '3 tbsp Butter',
      '2 tbsp Olive oil',
      '1 tsp Sugar',
      '1 tsp Fresh thyme',
      '2 Bay leaves',
      '4 slices French bread',
      '1 cup Gruyere cheese (grated)',
      '1/4 cup Parmesan cheese (grated)',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Heat butter and olive oil in a large pot over medium heat.',
      'Add sliced onions and sugar. Cook, stirring occasionally, for 30-40 minutes until caramelized.',
      'Add wine and cook for 2 minutes to evaporate alcohol.',
      'Add beef broth, thyme, and bay leaves. Bring to a boil.',
      'Reduce heat and simmer for 20 minutes. Season with salt and pepper.',
      'Preheat broiler. Toast bread slices until golden.',
      'Ladle soup into oven-safe bowls.',
      'Top each bowl with a slice of toasted bread.',
      'Sprinkle generously with Gruyere and Parmesan cheese.',
      'Broil for 2-3 minutes until cheese is melted and bubbly.',
      'Serve immediately while hot.'
    ],
    tips: [
      'Patience is key - properly caramelized onions take 30-40 minutes.',
      'Use a mix of yellow and sweet onions for complex flavor.',
      'Good quality beef broth makes a significant difference.',
      'Make sure your bowls are oven-safe before broiling.'
    ]
  },
  'dal-tadka': {
    id: 'dal-tadka',
    name: 'Dal Tadka',
    cuisine: 'Indian',
    cookingTime: '30 min',
    difficulty: 'Easy',
    servings: 4,
    rating: 4.5,
    youtubeVideoId: 'Woi-WaFfN2o', // Popular dal tadka recipe
    ingredients: [
      '1 cup Yellow lentils (toor dal)',
      '2 Tomatoes (chopped)',
      '1 Onion (chopped)',
      '3 Garlic cloves (minced)',
      '1 inch Ginger (minced)',
      '2 Green chilies',
      '1 tsp Cumin seeds',
      '1 tsp Mustard seeds',
      '1/4 tsp Asafoetida (hing)',
      '1 tsp Turmeric powder',
      '1 tsp Red chili powder',
      '2 tbsp Ghee',
      'Curry leaves',
      'Salt to taste',
      'Fresh coriander leaves'
    ],
    instructions: [
      'Wash and pressure cook lentils with turmeric and salt until soft.',
      'Mash the cooked lentils lightly and set aside.',
      'Heat ghee in a pan for tempering (tadka).',
      'Add cumin seeds, mustard seeds, and asafoetida.',
      'When seeds splutter, add curry leaves and green chilies.',
      'Add ginger-garlic paste and sauté for 1 minute.',
      'Add onions and cook until golden brown.',
      'Add tomatoes and cook until soft and mushy.',
      'Add red chili powder and cook for 1 minute.',
      'Add the cooked lentils and mix well.',
      'Add water if needed to adjust consistency.',
      'Simmer for 10 minutes and garnish with coriander.',
      'Serve hot with rice or roti.'
    ],
    tips: [
      'Don\'t overcook lentils - they should be soft but not mushy.',
      'The tadka (tempering) is crucial for authentic flavor.',
      'Adjust water to get your preferred consistency.',
      'Fresh curry leaves make a huge difference in taste.'
    ]
  },
  'stuffed-paratha': {
    id: 'stuffed-paratha',
    name: 'Stuffed Paratha',
    cuisine: 'Indian',
    cookingTime: '30 min',
    difficulty: 'Medium',
    servings: 4,
    rating: 4.7,
    youtubeVideoId: 'VVnZNyWdHjg', // Popular stuffed paratha recipe
    ingredients: [
      '2 cups Whole wheat flour',
      '3 Large potatoes (boiled and mashed)',
      '1 Onion (finely chopped)',
      '2 Green chilies (minced)',
      '1 tsp Ginger (minced)',
      '1 tsp Cumin seeds',
      '1/2 tsp Turmeric powder',
      '1 tsp Coriander powder',
      '1/2 tsp Garam masala',
      'Ghee or oil for cooking',
      'Salt to taste',
      'Fresh coriander leaves'
    ],
    instructions: [
      'Mix flour with water and a pinch of salt to make soft dough. Rest for 20 minutes.',
      'For filling: mix mashed potatoes with onion, chilies, ginger, and all spices.',
      'Add fresh coriander and mix well. Season with salt.',
      'Divide dough into portions and roll into small circles.',
      'Place filling in center and seal edges to enclose filling.',
      'Gently roll the stuffed dough into a paratha.',
      'Heat a griddle and cook paratha with ghee until golden spots appear.',
      'Flip and cook the other side until golden.',
      'Serve hot with yogurt, pickle, or butter.'
    ],
    tips: [
      'Don\'t overstuff or the paratha will break.',
      'Roll gently to avoid filling coming out.',
      'Cook on medium heat for even cooking.',
      'Serve immediately while hot and crispy.'
    ]
  }
};

export default function RecipeDetailScreen() {
  const params = useLocalSearchParams();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart, getTotalItems } = useCart();

  // Get recipe from params
  const recipeId = params.recipeId as string;
  const recipe = recipeDatabase[recipeId];
  
  // Fallback dish info from params
  const dishName = params.dishName as string;
  const dishCuisine = params.dishCuisine as string;
  const dishTime = params.dishTime as string;
  const dishDifficulty = params.dishDifficulty as string;

  if (!recipe && !dishName) {
    return (
      <LinearGradient colors={['#0f0f23', '#1a1a2e']} style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Recipe not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  // Use recipe data if available, otherwise use fallback data
  const displayData = recipe || {
    name: dishName,
    cuisine: dishCuisine,
    cookingTime: dishTime,
    difficulty: dishDifficulty as 'Easy' | 'Medium' | 'Hard',
    servings: 4,
    rating: 4.5,
    ingredients: [],
    instructions: [],
    tips: []
  };

  const difficultyColor = {
    Easy: '#10b981',
    Medium: '#f59e0b',
    Hard: '#ef4444'
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing ${displayData.name} recipe! It's ${displayData.difficulty} to make and takes ${displayData.cookingTime}.`,
        title: `${displayData.name} Recipe`
      });
    } catch (error) {
      console.error('Error sharing recipe:', error);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
      `${displayData.name} has been ${isFavorite ? 'removed from' : 'added to'} your favorites.`
    );
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: recipeId || displayData.name.toLowerCase().replace(/\s+/g, '-'),
      name: displayData.name,
      price: 299, // Default price for recipes
      cuisine: displayData.cuisine,
      cookingTime: displayData.cookingTime,
      image: { uri: 'https://via.placeholder.com/400x300/1f2937/ffffff?text=Food' }
    };
    
    addToCart(cartItem);
    // Note: addToCart already shows an alert, so we don't need another one here
  };

  return (
    <LinearGradient colors={['#000000', '#0a0a0a', '#111111']} style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Recipe</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={toggleFavorite}>
            <Heart size={24} color={isFavorite ? "#ef4444" : "#ffffff"} fill={isFavorite ? "#ef4444" : "none"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Share2 size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.headerButton, { position: 'relative' }]} 
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
      </Animated.View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Recipe Title */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.titleSection}>
          <Text style={styles.recipeName}>{displayData.name}</Text>
          <Text style={styles.recipeCuisine}>{displayData.cuisine} Cuisine</Text>
          
          <View style={styles.recipeStats}>
            <View style={styles.statItem}>
              <Clock size={16} color="#3b82f6" />
              <Text style={styles.statText}>{displayData.cookingTime}</Text>
            </View>
            <View style={styles.statItem}>
              <Users size={16} color="#10b981" />
              <Text style={styles.statText}>{displayData.servings} servings</Text>
            </View>
            <View style={styles.statItem}>
              <ChefHat size={16} color={difficultyColor[displayData.difficulty]} />
              <Text style={styles.statText}>{displayData.difficulty}</Text>
            </View>
            <View style={styles.statItem}>
              <Star size={16} color="#fbbf24" />
              <Text style={styles.statText}>{displayData.rating}/5</Text>
            </View>
          </View>
        </Animated.View>

        {/* YouTube Video */}
        <Animated.View entering={FadeInUp.delay(600)} style={styles.videoSection}>
          <View style={styles.sectionHeader}>
            <Play size={20} color="#ef4444" />
            <Text style={styles.sectionTitle}>Cooking Video</Text>
          </View>
          
          {recipe?.youtubeVideoId ? (
            <TouchableOpacity 
              style={styles.videoContainer}
              onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${recipe.youtubeVideoId}`)}
            >
              <View style={styles.videoThumbnail}>
                <View style={styles.playButton}>
                  <Play size={32} color="#ffffff" fill="#ffffff" />
                </View>
                <Text style={styles.videoTitle}>Watch Cooking Tutorial</Text>
                <Text style={styles.videoSubtitle}>Tap to open in YouTube</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.noVideoContainer}>
              <Play size={48} color="#6b7280" />
              <Text style={styles.noVideoText}>Cooking video coming soon!</Text>
              <Text style={styles.noVideoSubtext}>Follow the written instructions below for now</Text>
            </View>
          )}
        </Animated.View>

        {/* Ingredients */}
        <Animated.View entering={FadeInUp.delay(800)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <BookOpen size={20} color="#10b981" />
            <Text style={styles.sectionTitle}>Ingredients</Text>
          </View>
          
          {displayData.ingredients.length > 0 ? (
            <View style={styles.ingredientsList}>
              {displayData.ingredients.map((ingredient, index) => (
                <Animated.View 
                  key={index}
                  entering={FadeInLeft.delay(1000 + index * 100)}
                  style={styles.ingredientItem}
                >
                  <View style={styles.ingredientBullet} />
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </Animated.View>
              ))}
            </View>
          ) : (
            <View style={styles.comingSoonContainer}>
              <Text style={styles.comingSoonText}>Detailed ingredients list coming soon!</Text>
              <Text style={styles.comingSoonSubtext}>Check back later for the complete recipe</Text>
            </View>
          )}
        </Animated.View>

        {/* Instructions */}
        <Animated.View entering={FadeInUp.delay(1200)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <ChefHat size={20} color="#f59e0b" />
            <Text style={styles.sectionTitle}>Instructions</Text>
          </View>
          
          {displayData.instructions.length > 0 ? (
            <View style={styles.instructionsList}>
              {displayData.instructions.map((instruction, index) => (
                <Animated.View 
                  key={index}
                  entering={FadeInLeft.delay(1400 + index * 100)}
                  style={styles.instructionItem}
                >
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </Animated.View>
              ))}
            </View>
          ) : (
            <View style={styles.comingSoonContainer}>
              <Text style={styles.comingSoonText}>Step-by-step instructions coming soon!</Text>
              <Text style={styles.comingSoonSubtext}>We're working on detailed cooking instructions</Text>
            </View>
          )}
        </Animated.View>

        {/* Tips */}
        {displayData.tips && displayData.tips.length > 0 && (
          <Animated.View entering={FadeInUp.delay(1600)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Star size={20} color="#8b5cf6" />
              <Text style={styles.sectionTitle}>Chef's Tips</Text>
            </View>
            
            <View style={styles.tipsList}>
              {displayData.tips.map((tip, index) => (
                <Animated.View 
                  key={index}
                  entering={FadeInLeft.delay(1800 + index * 100)}
                  style={styles.tipItem}
                >
                  <Text style={styles.tipIcon}>💡</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Fixed Add to Cart Button */}
      <Animated.View entering={FadeInUp.delay(2000)} style={styles.fixedBottomButton}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <ShoppingCart size={20} color="#ffffff" />
          <Text style={styles.addToCartText}>Add to Cart - ₹299</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  recipeName: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  recipeCuisine: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#a1a1aa',
    marginBottom: 24,
  },
  recipeStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  videoSection: {
    marginBottom: 32,
  },
  videoContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#ef4444',
  },
  videoThumbnail: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'linear-gradient(135deg, #ef4444, #dc2626)',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  videoTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  videoSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  noVideoContainer: {
    height: 200,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(107, 114, 128, 0.3)',
    borderStyle: 'dashed',
  },
  noVideoText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#9ca3af',
    marginTop: 12,
  },
  noVideoSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  comingSoonContainer: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(107, 114, 128, 0.3)',
    borderStyle: 'dashed',
  },
  comingSoonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#9ca3af',
    textAlign: 'center',
  },
  comingSoonSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
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
  ingredientsList: {
    gap: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
  },
  ingredientBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    lineHeight: 24,
  },
  instructionsList: {
    gap: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    lineHeight: 24,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
  },
  tipIcon: {
    fontSize: 20,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#e5e7eb',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 100,
  },
  fixedBottomButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: 'rgba(15, 15, 35, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  addToCartText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
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
});
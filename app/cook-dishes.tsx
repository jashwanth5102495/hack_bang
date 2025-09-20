import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, ChefHat, Clock, Star, Utensils } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import { useMood } from '../contexts/MoodContext';
import { useCart } from '../contexts/CartContext';

import { initiatePayment, trackOrder } from '../components/RazorpayPayment';

const { width } = Dimensions.get('window');

interface Dish {
  id: string;
  name: string;
  cuisine: string;
  cookingTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  image: string;
  rating: number;
  servings: number;
  price: number;
}

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
}

// Recipe database
const recipeDatabase: { [key: string]: Recipe } = {
  'chicken-biryani': {
    id: 'chicken-biryani',
    name: 'Chicken Biryani',
    cuisine: 'Indian',
    cookingTime: '60 min',
    difficulty: 'Medium',
    servings: 4,
    rating: 4.8,
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
  'margherita-pizza': {
    id: 'margherita-pizza',
    name: 'Margherita Pizza',
    cuisine: 'Italian',
    cookingTime: '30 min',
    difficulty: 'Medium',
    servings: 2,
    rating: 4.6,
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
  'french-onion-soup': {
    id: 'french-onion-soup',
    name: 'French Onion Soup',
    cuisine: 'French',
    cookingTime: '45 min',
    difficulty: 'Medium',
    servings: 4,
    rating: 4.7,
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
  'chole-bhature': {
    id: 'chole-bhature',
    name: 'Chole Bhature',
    cuisine: 'Indian',
    cookingTime: '45 min',
    difficulty: 'Medium',
    servings: 4,
    rating: 4.8,
    ingredients: [
      '2 cups Chickpeas (soaked overnight)',
      '2 cups All-purpose flour',
      '1/4 cup Yogurt',
      '1 tsp Baking powder',
      '2 Large onions (finely chopped)',
      '3 Tomatoes (chopped)',
      '2 tbsp Ginger-garlic paste',
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
  'fresh-sushi': {
    id: 'fresh-sushi',
    name: 'Fresh Sushi',
    cuisine: 'Japanese',
    cookingTime: '30 min',
    difficulty: 'Hard',
    servings: 2,
    rating: 4.9,
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
  'tomato-rasam': {
    id: 'tomato-rasam',
    name: 'Tomato Rasam',
    cuisine: 'Indian',
    cookingTime: '25 min',
    difficulty: 'Easy',
    servings: 4,
    rating: 4.5,
    ingredients: [
      '4 Large tomatoes (chopped)',
      '1/4 cup Tamarind paste',
      '2 tbsp Rasam powder',
      '1 tsp Turmeric powder',
      '1 tsp Mustard seeds',
      '1 tsp Cumin seeds',
      '4-5 Curry leaves',
      '2 Dry red chilies',
      '2 tbsp Ghee',
      '1 tbsp Jaggery',
      'Salt to taste',
      'Fresh coriander leaves',
      '2 cups Water'
    ],
    instructions: [
      'Heat ghee in a pan. Add mustard seeds and cumin seeds.',
      'When they splutter, add curry leaves and red chilies.',
      'Add chopped tomatoes and cook until soft.',
      'Add turmeric, rasam powder, and salt. Mix well.',
      'Add tamarind paste and 2 cups water.',
      'Bring to a boil and simmer for 15 minutes.',
      'Add jaggery and mix well.',
      'Garnish with fresh coriander leaves.',
      'Serve hot with rice or drink as soup.'
    ],
    tips: [
      'Adjust tamarind quantity based on your taste preference.',
      'Don\'t boil for too long after adding tamarind.',
      'Fresh curry leaves make a big difference in flavor.',
      'Can be served as soup or mixed with rice.'
    ]
  },
  'chicken-gnocchi': {
    id: 'chicken-gnocchi',
    name: 'Chicken Gnocchi',
    cuisine: 'Italian',
    cookingTime: '30 min',
    difficulty: 'Medium',
    servings: 4,
    rating: 4.7,
    ingredients: [
      '500g Potato gnocchi',
      '300g Chicken breast (diced)',
      '1 cup Heavy cream',
      '2 cups Fresh spinach',
      '1 Onion (diced)',
      '3 Garlic cloves (minced)',
      '1/2 cup Parmesan cheese',
      '2 tbsp Olive oil',
      '1 tsp Italian herbs',
      'Salt and pepper to taste',
      'Fresh basil for garnish'
    ],
    instructions: [
      'Heat olive oil in a large skillet over medium heat.',
      'Season chicken with salt, pepper, and Italian herbs.',
      'Cook chicken until golden and cooked through. Remove and set aside.',
      'In the same skillet, sauté onion until translucent.',
      'Add garlic and cook for 1 minute.',
      'Add gnocchi and cook until lightly golden.',
      'Pour in heavy cream and bring to a simmer.',
      'Add spinach and cook until wilted.',
      'Return chicken to the skillet.',
      'Add Parmesan cheese and stir until melted.',
      'Garnish with fresh basil and serve immediately.'
    ],
    tips: [
      'Don\'t overcook the gnocchi - they should be tender but not mushy.',
      'Fresh spinach works better than frozen for this recipe.',
      'Add cream gradually to prevent curdling.',
      'Serve immediately while hot and creamy.'
    ]
  },
  'creamy-risotto': {
    id: 'creamy-risotto',
    name: 'Creamy Risotto',
    cuisine: 'Italian',
    cookingTime: '35 min',
    difficulty: 'Medium',
    servings: 4,
    rating: 4.6,
    ingredients: [
      '1 1/2 cups Arborio rice',
      '4 cups Warm chicken broth',
      '1/2 cup White wine',
      '1 Large onion (finely chopped)',
      '2 Garlic cloves (minced)',
      '1/2 cup Parmesan cheese (grated)',
      '3 tbsp Butter',
      '2 tbsp Olive oil',
      'Salt and pepper to taste',
      'Fresh parsley for garnish'
    ],
    instructions: [
      'Heat olive oil and 1 tbsp butter in a large pan over medium heat.',
      'Add onion and cook until translucent, about 3 minutes.',
      'Add garlic and cook for 1 minute.',
      'Add rice and stir to coat with oil, cooking for 2 minutes.',
      'Pour in wine and stir until absorbed.',
      'Add warm broth one ladle at a time, stirring constantly.',
      'Continue adding broth and stirring until rice is creamy and tender (about 20 minutes).',
      'Remove from heat and stir in remaining butter and Parmesan.',
      'Season with salt and pepper.',
      'Garnish with fresh parsley and serve immediately.'
    ],
    tips: [
      'Use warm broth to maintain cooking temperature.',
      'Stir constantly for the creamiest texture.',
      'Don\'t rush - good risotto takes time and patience.',
      'Serve immediately as risotto continues to cook off heat.'
    ]
  },
  'spicy-tacos': {
    id: 'spicy-tacos',
    name: 'Spicy Tacos',
    cuisine: 'Mexican',
    cookingTime: '25 min',
    difficulty: 'Easy',
    servings: 4,
    rating: 4.5,
    ingredients: [
      '8 Corn tortillas',
      '500g Ground beef or chicken',
      '1 Onion (diced)',
      '2 Garlic cloves (minced)',
      '2 tsp Chili powder',
      '1 tsp Cumin',
      '1/2 tsp Paprika',
      '1/4 tsp Cayenne pepper',
      '1 cup Shredded cheese',
      '1 Tomato (diced)',
      '1 Avocado (sliced)',
      'Lettuce leaves',
      'Sour cream',
      'Hot sauce',
      'Lime wedges'
    ],
    instructions: [
      'Heat oil in a large skillet over medium-high heat.',
      'Add onion and cook until softened, about 3 minutes.',
      'Add garlic and cook for 1 minute.',
      'Add ground meat and cook until browned, breaking it up as it cooks.',
      'Add all spices and cook for 2 minutes until fragrant.',
      'Season with salt and pepper.',
      'Warm tortillas in a dry skillet or microwave.',
      'Fill tortillas with meat mixture.',
      'Top with cheese, tomato, avocado, and lettuce.',
      'Serve with sour cream, hot sauce, and lime wedges.'
    ],
    tips: [
      'Don\'t overfill the tortillas to prevent spillage.',
      'Warm tortillas make them more pliable and flavorful.',
      'Adjust spice level to your preference.',
      'Set up a taco bar for fun family dining.'
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
  },
  'dal-tadka': {
    id: 'dal-tadka',
    name: 'Dal Tadka',
    cuisine: 'Indian',
    cookingTime: '30 min',
    difficulty: 'Easy',
    servings: 4,
    rating: 4.5,
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
  'chicken-alfredo': {
    id: 'chicken-alfredo',
    name: 'Chicken Alfredo',
    cuisine: 'Italian',
    cookingTime: '25 min',
    difficulty: 'Medium',
    servings: 4,
    rating: 4.7,
    ingredients: [
      '400g Fettuccine pasta',
      '500g Chicken breast (sliced)',
      '1 cup Heavy cream',
      '1 cup Parmesan cheese (grated)',
      '4 Garlic cloves (minced)',
      '4 tbsp Butter',
      '2 tbsp Olive oil',
      '1/4 cup White wine (optional)',
      'Salt and black pepper',
      'Fresh parsley',
      'Italian seasoning'
    ],
    instructions: [
      'Cook fettuccine according to package instructions until al dente.',
      'Season chicken with salt, pepper, and Italian seasoning.',
      'Heat olive oil in a large skillet over medium-high heat.',
      'Cook chicken until golden brown and cooked through. Remove and set aside.',
      'In the same skillet, melt butter and add minced garlic.',
      'Cook garlic for 1 minute until fragrant.',
      'Add white wine (if using) and let it reduce.',
      'Pour in heavy cream and bring to a gentle simmer.',
      'Gradually add Parmesan cheese, whisking constantly.',
      'Return chicken to the skillet and add drained pasta.',
      'Toss everything together until well coated.',
      'Garnish with fresh parsley and serve immediately.'
    ],
    tips: [
      'Don\'t let the cream boil or it may curdle.',
      'Use freshly grated Parmesan for best results.',
      'Reserve some pasta water to adjust sauce consistency.',
      'Serve immediately while hot and creamy.'
    ]
  }
};

export default function CookDishesScreen() {
  const { currentMoodAnalysis, getFoodRecommendations, getTherapeuticMood } = useMood();
  const { addToCart } = useCart();

  
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
    // Directly navigate to recipe screen for better UX
    showRecipe(dish);
  };

  const showRecipe = (dish: any) => {
    // Create a more flexible recipe key matching
    let recipeKey = dish.name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, ''); // Remove special characters
    
    // Handle specific dish name mappings
    const nameMapping: { [key: string]: string } = {
      'chicken-dum-biryani': 'chicken-biryani',
      'chicken-biryani': 'chicken-biryani',
      'margherita-pizza': 'margherita-pizza',
      'french-onion-soup': 'french-onion-soup',
      'chole-bhature': 'chole-bhature',
      'fresh-sushi': 'fresh-sushi',
      'tomato-rasam': 'tomato-rasam',
      'chicken-gnocchi': 'chicken-gnocchi',
      'creamy-risotto': 'creamy-risotto',
      'spicy-tacos': 'spicy-tacos',
      'stuffed-paratha': 'stuffed-paratha',
      'dal-tadka': 'dal-tadka',
      'chicken-alfredo': 'chicken-alfredo'
    };
    
    // Use mapping if available, otherwise use generated key
    const finalKey = nameMapping[recipeKey] || recipeKey;
    
    try {
      // Navigate directly to recipe detail screen with YouTube videos
      router.push({
        pathname: '/recipe-detail',
        params: { 
          recipeId: finalKey,
          dishName: dish.name,
          dishCuisine: dish.cuisine,
          dishTime: dish.cookingTime,
          dishDifficulty: dish.difficulty
        }
      });
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Navigation Error', 'Unable to open recipe. Please try again.');
    }
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
      colors={['#000000', '#0a0a0a', '#111111']}
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
            <Utensils size={24} color="#f97316" />
            <Text style={styles.sectionTitle}>Recommended Dishes</Text>
          </View>

          <View style={styles.dishesGrid}>
            {dishes.map((dish, index) => (
              <Animated.View
                key={dish.id}
                entering={FadeInDown.delay(600 + index * 100).springify()}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleDishPress(dish)}
                  onLongPress={() => orderDish(dish)}
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
                        style={styles.cookButton}
                        onPress={() => showRecipe(dish)}
                      >
                        <ChefHat size={16} color="#ffffff" />
                        <Text style={styles.cookButtonText}>Cook Recipe</Text>
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
          style={styles.cookingTipsSection}
        >
          <View style={styles.sectionHeader}>
            <ChefHat size={24} color="#3b82f6" />
            <Text style={styles.sectionTitle}>Cooking Tips</Text>
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
  cookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  cookButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  actionHints: {
    alignItems: 'center',
  },
  actionHintText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    opacity: 0.8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
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
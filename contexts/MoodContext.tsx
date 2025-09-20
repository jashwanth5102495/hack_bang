import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface MoodAnalysis {
  dominantMood: string;
  dominantGenre: string;
  likedCount: number;
  timestamp: number;
}

export interface FoodRecommendation {
  id: string;
  name: string;
  description: string;
  mood: string;
  cuisine: string;
  image: string;
  cookingTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  price: number;
}

interface MoodContextType {
  currentMoodAnalysis: MoodAnalysis;
  setCurrentMoodAnalysis: (analysis: MoodAnalysis) => void;
  getFoodRecommendations: (mood: string) => FoodRecommendation[];
  getTherapeuticRecommendations: (mood: string) => any[];
  getTherapeuticMood: (mood: string) => string;
  analyzeMoodFromSelection: (selectedMood: string) => void;
  isAnalyzing: boolean;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const useMood = () => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};

interface MoodProviderProps {
  children: ReactNode;
}

export const MoodProvider: React.FC<MoodProviderProps> = ({ children }) => {
  const [currentMoodAnalysis, setCurrentMoodAnalysis] = useState<MoodAnalysis>({
    dominantMood: 'Happy',
    dominantGenre: 'Pop',
    likedCount: 0,
    timestamp: Date.now()
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // AI Mood Analysis Function
  const analyzeMoodFromSelection = async (selectedMood: string) => {
    setIsAnalyzing(true);

    // Simulate AI analysis with realistic delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // AI analysis logic - mapping mood to therapeutic approach
    const moodToTherapyMapping: { [key: string]: string } = {
      'Happy': 'Maintain positivity',
      'Sad': 'Uplifting content',      // Therapeutic approach for sad mood
      'Romantic': 'Romantic content',
      'Tired': 'Energizing content',   // Help boost energy
      'Excited': 'High-energy content',
      'Lonely': 'Connection content',  // Help feel connected
      'Hungry': 'Food inspiration',
      'Moody': 'Mood-balancing content', // Help stabilize mood
      'Angry': 'Calming content'       // Therapeutic calming for anger
    };

    const analysisResult: MoodAnalysis = {
      dominantMood: selectedMood,
      dominantGenre: moodToTherapyMapping[selectedMood] || 'Uplifting content',
      likedCount: Math.floor(Math.random() * 50) + 10, // Simulated engagement
      timestamp: Date.now()
    };

    setCurrentMoodAnalysis(analysisResult);
    setIsAnalyzing(false);
  };

  // Therapeutic mood balancing - recommend calming foods for negative moods
  const getTherapeuticMood = (currentMood: string): string => {
    const negativeMoods = ['Sad', 'Angry', 'Moody', 'Lonely', 'Tired'];
    return negativeMoods.includes(currentMood) ? 'Calming' : currentMood;
  };

  const getFoodRecommendations = (mood?: string): FoodRecommendation[] => {
    const originalMood = mood || currentMoodAnalysis?.dominantMood || 'Happy';
    const therapeuticMood = getTherapeuticMood(originalMood);

    // Food database with real images from the project folder
    const foodDatabase: FoodRecommendation[] = [
      // Happy mood foods - keep these for positive moods
      {
        id: 'f1',
        name: 'Chicken Dum Biryani',
        description: 'Aromatic and flavorful celebration rice dish',
        mood: 'Happy',
        cuisine: 'Indian',
        image: require('../assets/food-images/chicken-biryani.webp'),
        cookingTime: '60 min',
        difficulty: 'Medium',
        ingredients: ['basmati rice', 'chicken', 'spices', 'saffron', 'yogurt'],
        price: 450
      },
      {
        id: 'f2',
        name: 'Margherita Pizza',
        description: 'Classic Italian pizza to brighten your day',
        mood: 'Happy',
        cuisine: 'Italian',
        image: require('../assets/food-images/margherita-pizza.jpg'),
        cookingTime: '30 min',
        difficulty: 'Medium',
        ingredients: ['pizza dough', 'tomato sauce', 'mozzarella', 'basil'],
        price: 320
      },
      {
        id: 'f3',
        name: 'Chole Bhature',
        description: 'Delicious North Indian comfort food',
        mood: 'Happy',
        cuisine: 'Indian',
        image: require('../assets/food-images/chole-bhature.jpg'),
        cookingTime: '45 min',
        difficulty: 'Medium',
        ingredients: ['chickpeas', 'flour', 'spices', 'yogurt', 'onions'],
        price: 280
      },
      {
        id: 'f4',
        name: 'Fresh Sushi',
        description: 'Elegant and fresh Japanese delicacy',
        mood: 'Happy',
        cuisine: 'Japanese',
        image: require('../assets/food-images/sushi.jpg'),
        cookingTime: '30 min',
        difficulty: 'Hard',
        ingredients: ['sushi rice', 'fresh fish', 'nori', 'wasabi', 'soy sauce'],
        price: 650
      },

      // Sad mood foods - comforting and warm (therapeutic approach)
      {
        id: 'f5',
        name: 'French Onion Soup',
        description: 'Warm and comforting classic soup',
        mood: 'Calming',
        cuisine: 'French',
        image: require('../assets/food-images/french-onion-soup.jpg'),
        cookingTime: '45 min',
        difficulty: 'Medium',
        ingredients: ['onions', 'beef broth', 'cheese', 'bread', 'wine'],
        price: 380
      },
      {
        id: 'f6',
        name: 'Creamy Risotto',
        description: 'Rich and creamy Italian comfort food',
        mood: 'Calming',
        cuisine: 'Italian',
        image: require('../assets/food-images/chicken-gnocchi.webp'),
        cookingTime: '35 min',
        difficulty: 'Medium',
        ingredients: ['arborio rice', 'broth', 'parmesan', 'white wine', 'butter'],
        price: 420
      },
      {
        id: 'f7',
        name: 'Tomato Rasam',
        description: 'Soothing South Indian soup',
        mood: 'Calming',
        cuisine: 'Indian',
        image: require('../assets/food-images/tomato-rasam.jpg'),
        cookingTime: '25 min',
        difficulty: 'Easy',
        ingredients: ['tomatoes', 'tamarind', 'spices', 'curry leaves', 'ghee'],
        price: 180
      },

      // Lonely mood foods - comforting and familiar (therapeutic)
      {
        id: 'f8',
        name: 'Stuffed Paratha',
        description: 'Comforting Indian flatbread with filling',
        mood: 'Calming',
        cuisine: 'Indian',
        image: require('../assets/food-images/stuffed-paratha.jpg'),
        cookingTime: '30 min',
        difficulty: 'Medium',
        ingredients: ['flour', 'potatoes', 'spices', 'ghee', 'yogurt'],
        price: 220
      },
      {
        id: 'f9',
        name: 'Dal Tadka',
        description: 'Comforting lentil curry',
        mood: 'Calming',
        cuisine: 'Indian',
        image: require('../assets/food-images/dal-tadka.jpg'),
        cookingTime: '30 min',
        difficulty: 'Easy',
        ingredients: ['lentils', 'spices', 'onions', 'tomatoes', 'ghee'],
        price: 200
      },
      {
        id: 'f10',
        name: 'Chicken Gnocchi',
        description: 'Hearty and comforting pasta dish',
        mood: 'Calming',
        cuisine: 'Italian',
        image: require('../assets/food-images/chicken-gnocchi.webp'),
        cookingTime: '35 min',
        difficulty: 'Medium',
        ingredients: ['gnocchi', 'chicken', 'cream', 'vegetables', 'herbs'],
        price: 480
      },

      // Excited mood foods - vibrant and energizing
      {
        id: 'f11',
        name: 'Street Tacos',
        description: 'Vibrant and flavorful Mexican street food',
        mood: 'Excited',
        cuisine: 'Mexican',
        image: require('../assets/food-images/street-tacos.jpg'),
        cookingTime: '25 min',
        difficulty: 'Easy',
        ingredients: ['tortillas', 'meat', 'onions', 'cilantro', 'lime'],
        price: 350
      },
      {
        id: 'f12',
        name: 'Tandoori Chicken',
        description: 'Spicy and aromatic grilled chicken',
        mood: 'Excited',
        cuisine: 'Indian',
        image: require('../assets/food-images/tandoori-chicken.jpg'),
        cookingTime: '45 min',
        difficulty: 'Medium',
        ingredients: ['chicken', 'yogurt', 'spices', 'lemon', 'ginger'],
        price: 420
      },
      {
        id: 'f13',
        name: 'Pav Bhaji',
        description: 'Spicy and flavorful Mumbai street food',
        mood: 'Excited',
        cuisine: 'Indian',
        image: require('../assets/food-images/pav-bhaji.jpg'),
        cookingTime: '40 min',
        difficulty: 'Medium',
        ingredients: ['mixed vegetables', 'pav bread', 'spices', 'butter', 'onions'],
        price: 280
      },

      // Moody foods - complex and satisfying
      {
        id: 'f14',
        name: 'Ratatouille',
        description: 'Rustic French vegetable stew',
        mood: 'Moody',
        cuisine: 'French',
        image: require('../assets/food-images/ratatouille.jpg'),
        cookingTime: '50 min',
        difficulty: 'Medium',
        ingredients: ['eggplant', 'zucchini', 'tomatoes', 'herbs', 'olive oil'],
        price: 380
      },
      {
        id: 'f15',
        name: 'Paneer Butter Masala',
        description: 'Rich and creamy Indian curry',
        mood: 'Moody',
        cuisine: 'Indian',
        image: require('../assets/food-images/paneer-butter-masala.jpg'),
        cookingTime: '35 min',
        difficulty: 'Medium',
        ingredients: ['paneer', 'tomatoes', 'cream', 'spices', 'butter'],
        price: 350
      },
      {
        id: 'f16',
        name: 'Veg Pulao',
        description: 'Aromatic rice dish with vegetables',
        mood: 'Moody',
        cuisine: 'Indian',
        image: require('../assets/food-images/veg-pulao.jpg'),
        cookingTime: '30 min',
        difficulty: 'Easy',
        ingredients: ['basmati rice', 'mixed vegetables', 'spices', 'ghee'],
        price: 250
      },

      // Romantic mood foods
      {
        id: 'f17',
        name: 'Chicken Alfredo',
        description: 'Creamy and elegant pasta dish',
        mood: 'Romantic',
        cuisine: 'Italian',
        image: require('../assets/food-images/chicken-alfredo.jpg'),
        cookingTime: '25 min',
        difficulty: 'Medium',
        ingredients: ['pasta', 'chicken', 'cream', 'parmesan', 'garlic'],
        price: 450
      },
      {
        id: 'f18',
        name: 'Paneer Tikka Masala',
        description: 'Rich and creamy Indian curry',
        mood: 'Romantic',
        cuisine: 'Indian',
        image: require('../assets/food-images/paneer-tikka-masala.webp'),
        cookingTime: '35 min',
        difficulty: 'Medium',
        ingredients: ['paneer', 'tomatoes', 'cream', 'spices', 'onions'],
        price: 380
      },
      {
        id: 'f19',
        name: 'Garlic Naan',
        description: 'Aromatic Indian bread perfect for sharing',
        mood: 'Romantic',
        cuisine: 'Indian',
        image: require('../assets/food-images/garlic-naan.jpg'),
        cookingTime: '20 min',
        difficulty: 'Medium',
        ingredients: ['flour', 'yogurt', 'garlic', 'butter', 'herbs'],
        price: 120
      },

      // Tired mood foods - energizing but gentle
      {
        id: 'f20',
        name: 'Upma',
        description: 'Light and energizing South Indian breakfast',
        mood: 'Tired',
        cuisine: 'Indian',
        image: require('../assets/food-images/upma.jpg'),
        cookingTime: '20 min',
        difficulty: 'Easy',
        ingredients: ['semolina', 'vegetables', 'mustard seeds', 'curry leaves'],
        price: 150
      },
      {
        id: 'f21',
        name: 'Minestrone Soup',
        description: 'Nourishing vegetable soup for energy',
        mood: 'Tired',
        cuisine: 'Italian',
        image: require('../assets/food-images/minestrone-soup.webp'),
        cookingTime: '35 min',
        difficulty: 'Easy',
        ingredients: ['mixed vegetables', 'beans', 'pasta', 'herbs', 'broth'],
        price: 280
      },
      {
        id: 'f22',
        name: 'Thai Green Curry',
        description: 'Aromatic and energizing Thai curry',
        mood: 'Tired',
        cuisine: 'Thai',
        image: require('../assets/food-images/thai-green-curry.jpg'),
        cookingTime: '30 min',
        difficulty: 'Medium',
        ingredients: ['green curry paste', 'coconut milk', 'vegetables', 'basil'],
        price: 420
      }
    ];

    // Filter foods based on therapeutic mood, with fallbacks
    let filteredFoods = foodDatabase.filter(food =>
      food.mood === therapeuticMood
    );

    // If no foods found for therapeutic mood, try original mood
    if (filteredFoods.length === 0) {
      filteredFoods = foodDatabase.filter(food =>
        food.mood === originalMood
      );
    }

    // If still no foods found, return Happy mood foods as default
    if (filteredFoods.length === 0) {
      filteredFoods = foodDatabase.filter(food =>
        food.mood === 'Happy'
      );
    }

    // If still no foods, return all foods
    if (filteredFoods.length === 0) {
      filteredFoods = foodDatabase;
    }

    return filteredFoods.slice(0, 6);
  };

  const getTherapeuticRecommendations = (mood?: string): any[] => {
    if (!currentMoodAnalysis) return [];
    const originalMood = mood || currentMoodAnalysis.dominantMood;
    const therapeuticMood = getTherapeuticMood(originalMood);

    // Therapeutic content database focusing on food and wellness
    const therapeuticDatabase = [
      // Happy mood - maintain positivity with celebration foods
      {
        id: 't1',
        title: 'Celebration Feast',
        type: 'food',
        mood: 'Happy',
        description: 'Colorful, festive dishes to celebrate your joy',
        image: '🎉',
        benefit: 'Maintains positive energy and social connection',
        dishes: ['Chicken Biryani', 'Margherita Pizza', 'Fresh Sushi', 'Chocolate Cake'],
        tags: ['celebration', 'colorful', 'social']
      },

      // Sad mood - uplifting comfort foods (therapeutic approach)
      {
        id: 't2',
        title: 'Comfort & Warmth',
        type: 'food',
        mood: 'Sad',
        description: 'Warm, comforting dishes to lift your spirits',
        image: '🍲',
        benefit: 'Provides comfort and helps improve mood',
        dishes: ['French Onion Soup', 'Creamy Risotto', 'Hot Chocolate', 'Tomato Rasam'],
        tags: ['comfort', 'warm', 'nurturing']
      },

      // Lonely mood - connection-focused foods (therapeutic)
      {
        id: 't3',
        title: 'Cozy Connection',
        type: 'food',
        mood: 'Lonely',
        description: 'Comforting treats that make you feel less alone',
        image: '🤗',
        benefit: 'Creates feelings of warmth and connection',
        dishes: ['Chicken Gnocchi', 'Dal Tadka', 'Stuffed Paratha', 'Falafel Wrap'],
        tags: ['cozy', 'comforting', 'familiar']
      },

      // Tired mood - energizing foods (therapeutic)
      {
        id: 't4',
        title: 'Energy Revival',
        type: 'food',
        mood: 'Tired',
        description: 'Quick, energizing foods to boost your vitality',
        image: '⚡',
        benefit: 'Provides sustained energy and mental clarity',
        dishes: ['Thai Green Curry', 'Lemon Rice', 'Upma', 'Quiche Lorraine'],
        tags: ['energizing', 'quick', 'nutritious']
      },

      // Excited mood - high-energy foods
      {
        id: 't5',
        title: 'Power Fuel',
        type: 'food',
        mood: 'Excited',
        description: 'High-energy foods to match your enthusiasm',
        image: '🔥',
        benefit: 'Sustains high energy and excitement levels',
        dishes: ['Lasagna Bolognese', 'Street Tacos', 'Pav Bhaji', 'Tandoori Chicken'],
        tags: ['high-energy', 'protein', 'spicy']
      },

      // Romantic mood - intimate dining
      {
        id: 't6',
        title: 'Romantic Dining',
        type: 'food',
        mood: 'Romantic',
        description: 'Elegant dishes perfect for romantic moments',
        image: '💕',
        benefit: 'Enhances romantic atmosphere and connection',
        dishes: ['Chicken Alfredo', 'Paneer Tikka Masala', 'Garlic Naan', 'Baklava'],
        tags: ['elegant', 'intimate', 'sophisticated']
      },

      // Hungry mood - satisfying meals
      {
        id: 't7',
        title: 'Hearty Satisfaction',
        type: 'food',
        mood: 'Hungry',
        description: 'Filling, satisfying meals to curb your hunger',
        image: '🍽️',
        benefit: 'Provides complete satisfaction and nourishment',
        dishes: ['Cheese Burger', 'Penne Arrabbiata', 'Rajma Masala', 'Beef Bourguignon'],
        tags: ['hearty', 'filling', 'satisfying']
      },

      // Moody mood - mood-balancing foods (therapeutic)
      {
        id: 't8',
        title: 'Mood Balance',
        type: 'food',
        mood: 'Moody',
        description: 'Foods that help stabilize and improve your mood',
        image: '🎭',
        benefit: 'Helps balance emotions and stabilize mood',
        dishes: ['Ratatouille', 'Paneer Butter Masala', 'Spaghetti', 'Veg Pulao'],
        tags: ['mood-boosting', 'nutritious', 'balancing']
      }

    ];

    return therapeuticDatabase.filter(content =>
      content.mood === therapeuticMood || therapeuticMood === 'Happy'
    ).slice(0, 6);
  };

  return (
    <MoodContext.Provider value={{
      currentMoodAnalysis,
      setCurrentMoodAnalysis,
      getFoodRecommendations,
      getTherapeuticRecommendations,
      getTherapeuticMood,
      analyzeMoodFromSelection,
      isAnalyzing
    }}>
      {children}
    </MoodContext.Provider>
  );
};
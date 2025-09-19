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
}

interface MoodContextType {
  moodAnalysis: MoodAnalysis | null;
  setMoodAnalysis: (analysis: MoodAnalysis) => void;
  getFoodRecommendations: () => FoodRecommendation[];
  getMusicRecommendations: () => any[];
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
  const [moodAnalysis, setMoodAnalysis] = useState<MoodAnalysis | null>(null);

  const getFoodRecommendations = (): FoodRecommendation[] => {
    if (!moodAnalysis) return [];

    const { dominantMood } = moodAnalysis;

    // Food recommendations based on mood
    const foodDatabase: FoodRecommendation[] = [
      // Energetic mood foods
      {
        id: 'f1',
        name: 'Spicy Thai Curry',
        description: 'Vibrant and energizing curry with fresh herbs',
        mood: 'Energetic',
        cuisine: 'Thai',
        image: '🍛',
        cookingTime: '30 min',
        difficulty: 'Medium',
        ingredients: ['coconut milk', 'curry paste', 'vegetables', 'herbs']
      },
      {
        id: 'f2',
        name: 'Acai Bowl',
        description: 'Fresh and energizing superfood bowl',
        mood: 'Energetic',
        cuisine: 'Healthy',
        image: '🍓',
        cookingTime: '10 min',
        difficulty: 'Easy',
        ingredients: ['acai', 'berries', 'granola', 'honey']
      },
      // Relaxed mood foods
      {
        id: 'f3',
        name: 'Creamy Mushroom Risotto',
        description: 'Comforting and creamy Italian classic',
        mood: 'Relaxed',
        cuisine: 'Italian',
        image: '🍚',
        cookingTime: '45 min',
        difficulty: 'Medium',
        ingredients: ['arborio rice', 'mushrooms', 'parmesan', 'wine']
      },
      {
        id: 'f4',
        name: 'Chamomile Tea & Cookies',
        description: 'Soothing tea with homemade cookies',
        mood: 'Relaxed',
        cuisine: 'Comfort',
        image: '🍪',
        cookingTime: '20 min',
        difficulty: 'Easy',
        ingredients: ['chamomile tea', 'flour', 'butter', 'sugar']
      },
      // Focused mood foods
      {
        id: 'f5',
        name: 'Quinoa Buddha Bowl',
        description: 'Nutritious bowl for mental clarity',
        mood: 'Focused',
        cuisine: 'Healthy',
        image: '🥗',
        cookingTime: '25 min',
        difficulty: 'Easy',
        ingredients: ['quinoa', 'avocado', 'nuts', 'vegetables']
      },
      {
        id: 'f6',
        name: 'Green Smoothie',
        description: 'Brain-boosting green smoothie',
        mood: 'Focused',
        cuisine: 'Healthy',
        image: '🥤',
        cookingTime: '5 min',
        difficulty: 'Easy',
        ingredients: ['spinach', 'banana', 'apple', 'ginger']
      },
      // Happy mood foods
      {
        id: 'f7',
        name: 'Chocolate Lava Cake',
        description: 'Indulgent dessert to celebrate good vibes',
        mood: 'Happy',
        cuisine: 'Dessert',
        image: '🍰',
        cookingTime: '35 min',
        difficulty: 'Hard',
        ingredients: ['dark chocolate', 'butter', 'eggs', 'flour']
      },
      {
        id: 'f8',
        name: 'Rainbow Sushi Roll',
        description: 'Colorful and fresh sushi creation',
        mood: 'Happy',
        cuisine: 'Japanese',
        image: '🍣',
        cookingTime: '40 min',
        difficulty: 'Hard',
        ingredients: ['sushi rice', 'nori', 'fish', 'vegetables']
      }
    ];

    return foodDatabase.filter(food => 
      food.mood === dominantMood || dominantMood === 'Balanced'
    ).slice(0, 6);
  };

  const getMusicRecommendations = () => {
    if (!moodAnalysis) return [];

    const { dominantMood, dominantGenre } = moodAnalysis;

    // Additional music recommendations based on analyzed mood
    const musicDatabase = [
      {
        id: 'm1',
        title: 'Energetic Workout Mix',
        artist: 'Various Artists',
        genre: 'Electronic',
        mood: 'Energetic',
        description: 'High-energy beats to keep you moving'
      },
      {
        id: 'm2',
        title: 'Chill Vibes',
        artist: 'Lo-Fi Collective',
        genre: 'Lo-Fi',
        mood: 'Relaxed',
        description: 'Smooth beats for relaxation'
      },
      {
        id: 'm3',
        title: 'Focus Flow',
        artist: 'Ambient Masters',
        genre: 'Ambient',
        mood: 'Focused',
        description: 'Atmospheric sounds for concentration'
      },
      {
        id: 'm4',
        title: 'Happy Hits',
        artist: 'Pop Stars',
        genre: 'Pop',
        mood: 'Happy',
        description: 'Uplifting songs to brighten your day'
      }
    ];

    return musicDatabase.filter(music => 
      music.mood === dominantMood || music.genre === dominantGenre
    );
  };

  return (
    <MoodContext.Provider value={{
      moodAnalysis,
      setMoodAnalysis,
      getFoodRecommendations,
      getMusicRecommendations
    }}>
      {children}
    </MoodContext.Provider>
  );
};
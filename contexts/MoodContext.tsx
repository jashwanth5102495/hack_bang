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
  currentMoodAnalysis: MoodAnalysis;
  setCurrentMoodAnalysis: (analysis: MoodAnalysis) => void;
  getFoodRecommendations: (mood: string) => FoodRecommendation[];
  getMusicRecommendations: (mood: string, genre?: string) => any[];
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
    
    // AI analysis logic - mapping mood to therapeutic music genre
    const moodToGenreMapping: { [key: string]: string } = {
      'Happy': 'Pop',
      'Sad': 'Ambient',      // Calming instead of Blues
      'Romantic': 'R&B',
      'Tired': 'Indie',      // Gentle energy instead of Ambient
      'Excited': 'Electronic',
      'Lonely': 'Acoustic',  // Soothing instead of Indie
      'Hungry': 'Jazz',
      'Moody': 'Classical',  // Calming instead of Alternative
      'Angry': 'Nature'      // Added for therapeutic calming
    };

    const analysisResult: MoodAnalysis = {
      dominantMood: selectedMood,
      dominantGenre: moodToGenreMapping[selectedMood] || 'Pop',
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
    const originalMood = mood || currentMoodAnalysis.dominantMood;
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
        image: '../food images/(happy) Chicken-Dum-Biryani-785x1024-1.webp',
        cookingTime: '60 min',
        difficulty: 'Medium',
        ingredients: ['basmati rice', 'chicken', 'spices', 'saffron', 'yogurt']
      },
      {
        id: 'f2',
        name: 'Margherita Pizza',
        description: 'Classic Italian pizza to brighten your day',
        mood: 'Happy',
        cuisine: 'Italian',
        image: '../food images/(happy) Margherita-Pizza-082.jpg',
        cookingTime: '30 min',
        difficulty: 'Medium',
        ingredients: ['pizza dough', 'tomato sauce', 'mozzarella', 'basil']
      },
      {
        id: 'f3',
        name: 'Chole Bhature',
        description: 'Delicious North Indian comfort food',
        mood: 'Happy',
        cuisine: 'Indian',
        image: '../food images/(happy) chole-bhature-2.jpg',
        cookingTime: '45 min',
        difficulty: 'Medium',
        ingredients: ['chickpeas', 'flour', 'spices', 'onions', 'tomatoes']
      },
      {
        id: 'f4',
        name: 'Crème Brûlée',
        description: 'Elegant French dessert for special moments',
        mood: 'Happy',
        cuisine: 'French',
        image: '../food images/(happy) creme-brulee-for-two-5.jpg',
        cookingTime: '40 min',
        difficulty: 'Hard',
        ingredients: ['cream', 'egg yolks', 'sugar', 'vanilla']
      },
      {
        id: 'f5',
        name: 'Fresh Sushi',
        description: 'Light and refreshing Japanese delicacy',
        mood: 'Happy',
        cuisine: 'Japanese',
        image: '../food images/(happy) sushi.jpg',
        cookingTime: '30 min',
        difficulty: 'Hard',
        ingredients: ['sushi rice', 'nori', 'fresh fish', 'wasabi']
      },

      // Calming foods for negative moods (therapeutic recommendations)
      {
        id: 'f6',
        name: 'French Onion Soup',
        description: 'Warm, comforting soup to soothe your soul',
        mood: 'Calming',
        cuisine: 'French',
        image: '../food images/(sad) French-Onion-Soup-Recipe-1-1.jpg',
        cookingTime: '45 min',
        difficulty: 'Medium',
        ingredients: ['onions', 'beef broth', 'gruyere cheese', 'herbs']
      },
      {
        id: 'f7',
        name: 'Tomato Rasam',
        description: 'Healing South Indian soup with gentle spices',
        mood: 'Calming',
        cuisine: 'Indian',
        image: '../food images/(sad) Tomato-Rasam.jpg',
        cookingTime: '25 min',
        difficulty: 'Easy',
        ingredients: ['tomatoes', 'tamarind', 'turmeric', 'curry leaves']
      },
      {
        id: 'f8',
        name: 'Korean Bibimbap',
        description: 'Balanced and nourishing Korean bowl',
        mood: 'Calming',
        cuisine: 'Korean',
        image: '../food images/(sad) classic-korean-bibimbap.webp',
        cookingTime: '35 min',
        difficulty: 'Medium',
        ingredients: ['rice', 'vegetables', 'egg', 'gochujang', 'sesame oil']
      },
      {
        id: 'f9',
        name: 'Comfort Khichdi',
        description: 'Simple, healing one-pot meal',
        mood: 'Calming',
        cuisine: 'Indian',
        image: '../food images/(sad) kichdi.jpg',
        cookingTime: '30 min',
        difficulty: 'Easy',
        ingredients: ['rice', 'lentils', 'turmeric', 'ghee', 'ginger']
      },
      {
        id: 'f10',
        name: 'Risotto alla Milanese',
        description: 'Creamy, comforting Italian rice dish',
        mood: 'Calming',
        cuisine: 'Italian',
        image: '../food images/(sad) risotto-alla-milanese-recipe-snippet-3.jpg',
        cookingTime: '40 min',
        difficulty: 'Medium',
        ingredients: ['arborio rice', 'saffron', 'parmesan', 'white wine']
      },
      {
        id: 'f11',
        name: 'Dal Tadka',
        description: 'Nourishing lentil curry for comfort',
        mood: 'Calming',
        cuisine: 'Indian',
        image: '../food images/(lonely) Dal-Tadka-2.jpg',
        cookingTime: '35 min',
        difficulty: 'Easy',
        ingredients: ['yellow lentils', 'onions', 'tomatoes', 'spices', 'ghee']
      },
      {
        id: 'f12',
        name: 'Chicken Gnocchi',
        description: 'Hearty and comforting Italian comfort food',
        mood: 'Calming',
        cuisine: 'Italian',
        image: '../food images/(lonely) chicken-gnocchi-skillet_web-10.webp',
        cookingTime: '30 min',
        difficulty: 'Medium',
        ingredients: ['gnocchi', 'chicken', 'cream', 'spinach', 'herbs']
      },

      // Excited mood foods
      {
        id: 'f13',
        name: 'Lasagna Bolognese',
        description: 'Rich and hearty Italian classic',
        mood: 'Excited',
        cuisine: 'Italian',
        image: '../food images/(excited) Lasagna-Bolognese-scaled.jpg',
        cookingTime: '90 min',
        difficulty: 'Hard',
        ingredients: ['pasta sheets', 'ground beef', 'tomato sauce', 'cheese']
      },
      {
        id: 'f14',
        name: 'Seafood Stew',
        description: 'Exciting mix of fresh seafood',
        mood: 'Excited',
        cuisine: 'Mediterranean',
        image: '../food images/(excited) Seafood-Stew_Matt_Taylor-Gross-scaled.webp',
        cookingTime: '45 min',
        difficulty: 'Medium',
        ingredients: ['mixed seafood', 'tomatoes', 'white wine', 'herbs']
      },
      {
        id: 'f15',
        name: 'Pav Bhaji',
        description: 'Spicy and flavorful Mumbai street food',
        mood: 'Excited',
        cuisine: 'Indian',
        image: '../food images/(excited) pav bhaji.jpg',
        cookingTime: '40 min',
        difficulty: 'Medium',
        ingredients: ['mixed vegetables', 'pav bread', 'spices', 'butter']
      },
      {
        id: 'f16',
        name: 'Street Tacos',
        description: 'Vibrant and exciting Mexican street food',
        mood: 'Excited',
        cuisine: 'Mexican',
        image: '../food images/(excited) street-tacos-recipe-2.jpg',
        cookingTime: '25 min',
        difficulty: 'Medium',
        ingredients: ['corn tortillas', 'meat', 'onions', 'cilantro', 'lime']
      },

      // Romantic mood foods
      {
        id: 'f17',
        name: 'Chicken Alfredo',
        description: 'Creamy and romantic pasta dish',
        mood: 'Romantic',
        cuisine: 'Italian',
        image: '../food images/(romantic) chicken-alfredo-1.jpg',
        cookingTime: '30 min',
        difficulty: 'Medium',
        ingredients: ['fettuccine', 'chicken', 'cream', 'parmesan', 'garlic']
      },
      {
        id: 'f18',
        name: 'Baklava',
        description: 'Sweet and delicate Middle Eastern dessert',
        mood: 'Romantic',
        cuisine: 'Middle Eastern',
        image: '../food images/(romantic) Baklava.jpg',
        cookingTime: '60 min',
        difficulty: 'Hard',
        ingredients: ['phyllo pastry', 'nuts', 'honey', 'butter', 'cinnamon']
      },
      {
        id: 'f19',
        name: 'Garlic Naan',
        description: 'Aromatic Indian bread perfect for sharing',
        mood: 'Romantic',
        cuisine: 'Indian',
        image: '../food images/(romantic) garlic naan.jpg',
        cookingTime: '20 min',
        difficulty: 'Medium',
        ingredients: ['flour', 'yogurt', 'garlic', 'butter', 'herbs']
      },

      // Tired mood foods - energizing but gentle
      {
        id: 'f20',
        name: 'Upma',
        description: 'Light and energizing South Indian breakfast',
        mood: 'Tired',
        cuisine: 'Indian',
        image: '../food images/(tired)  upma .jpg',
        cookingTime: '20 min',
        difficulty: 'Easy',
        ingredients: ['semolina', 'vegetables', 'mustard seeds', 'curry leaves']
      },
      {
        id: 'f21',
        name: 'Minestrone Soup',
        description: 'Nourishing vegetable soup for energy',
        mood: 'Tired',
        cuisine: 'Italian',
        image: '../food images/(tired) Homemade-Minestrone-Soup.webp',
        cookingTime: '35 min',
        difficulty: 'Easy',
        ingredients: ['mixed vegetables', 'beans', 'pasta', 'herbs', 'broth']
      },
      {
        id: 'f22',
        name: 'Thai Green Curry',
        description: 'Aromatic and energizing Thai curry',
        mood: 'Tired',
        cuisine: 'Thai',
        image: '../food images/(tired) Thai-Green-Curry.jpg',
        cookingTime: '30 min',
        difficulty: 'Medium',
        ingredients: ['green curry paste', 'coconut milk', 'vegetables', 'basil']
      }
    ];

    return foodDatabase.filter(food => 
      food.mood === therapeuticMood || therapeuticMood === 'Balanced'
    ).slice(0, 6);
  };

  const getMusicRecommendations = (mood?: string, genre?: string): any[] => {
    const originalMood = mood || currentMoodAnalysis.dominantMood;
    const therapeuticMood = getTherapeuticMood(originalMood);
    const targetGenre = genre || currentMoodAnalysis.dominantGenre;

    // Therapeutic music database with calming recommendations for negative moods
    const musicDatabase = [
      // Happy mood music - keep uplifting for positive moods
      {
        id: 'm1',
        title: 'Happy Hits',
        artist: 'Pop Stars',
        genre: 'Pop',
        mood: 'Happy',
        description: 'Uplifting songs to brighten your day',
        songs: ['Good as Hell - Lizzo', 'Happy - Pharrell Williams', 'Can\'t Stop the Feeling - Justin Timberlake']
      },
      {
        id: 'm2',
        title: 'Feel Good Classics',
        artist: 'Various Artists',
        genre: 'Pop',
        mood: 'Happy',
        description: 'Timeless feel-good anthems',
        songs: ['Walking on Sunshine - Katrina & The Waves', 'I Want It That Way - Backstreet Boys', 'Mr. Blue Sky - ELO']
      },

      // Calming music for negative moods (therapeutic recommendations)
      {
        id: 'm3',
        title: 'Peaceful Mind',
        artist: 'Meditation Masters',
        genre: 'Ambient',
        mood: 'Calming',
        description: 'Gentle sounds to calm your mind and soothe your soul',
        songs: ['Weightless - Marconi Union', 'Aqueous Transmission - Incubus', 'Spiegel im Spiegel - Arvo Pärt']
      },
      {
        id: 'm4',
        title: 'Healing Frequencies',
        artist: 'Nature Sounds Collective',
        genre: 'Nature',
        mood: 'Calming',
        description: 'Natural sounds and healing frequencies for emotional balance',
        songs: ['Rain on Leaves', 'Ocean Waves at Dawn', 'Forest Birds Symphony']
      },
      {
        id: 'm5',
        title: 'Gentle Acoustic',
        artist: 'Acoustic Therapy',
        genre: 'Acoustic',
        mood: 'Calming',
        description: 'Soft acoustic melodies to ease tension and bring peace',
        songs: ['Mad World - Gary Jules', 'The Night We Met - Lord Huron', 'Holocene - Bon Iver']
      },
      {
        id: 'm6',
        title: 'Classical Comfort',
        artist: 'Classical Ensemble',
        genre: 'Classical',
        mood: 'Calming',
        description: 'Soothing classical pieces for emotional healing',
        songs: ['Clair de Lune - Debussy', 'Gymnopédie No. 1 - Satie', 'Adagio for Strings - Barber']
      },
      {
        id: 'm7',
        title: 'Lo-Fi Healing',
        artist: 'ChilledCow',
        genre: 'Lo-Fi',
        mood: 'Calming',
        description: 'Mellow lo-fi beats to help you relax and reset',
        songs: ['Study Session', 'Rainy Day Vibes', 'Midnight Coffee']
      },

      // Excited mood music
      {
        id: 'm8',
        title: 'High Energy Mix',
        artist: 'Electronic Collective',
        genre: 'Electronic',
        mood: 'Excited',
        description: 'Energetic beats to match your excitement',
        songs: ['Levels - Avicii', 'Titanium - David Guetta', 'Animals - Martin Garrix']
      },
      {
        id: 'm9',
        title: 'Rock Anthems',
        artist: 'Rock Legends',
        genre: 'Rock',
        mood: 'Excited',
        description: 'Powerful rock songs for high energy moments',
        songs: ['Don\'t Stop Believin\' - Journey', 'We Will Rock You - Queen', 'Eye of the Tiger - Survivor']
      },

      // Romantic mood music
      {
        id: 'm10',
        title: 'Love Ballads',
        artist: 'Romance Collection',
        genre: 'R&B',
        mood: 'Romantic',
        description: 'Smooth and romantic songs for intimate moments',
        songs: ['All of Me - John Legend', 'Perfect - Ed Sheeran', 'At Last - Etta James']
      },
      {
        id: 'm11',
        title: 'Jazz Romance',
        artist: 'Jazz Ensemble',
        genre: 'Jazz',
        mood: 'Romantic',
        description: 'Sultry jazz for romantic evenings',
        songs: ['The Way You Look Tonight - Frank Sinatra', 'Fly Me to the Moon - Norah Jones', 'La Vie En Rose - Édith Piaf']
      },

      // Tired mood music - gentle and energizing
      {
        id: 'm12',
        title: 'Gentle Energy',
        artist: 'Morning Collective',
        genre: 'Indie',
        mood: 'Tired',
        description: 'Soft but uplifting music to gently energize',
        songs: ['Here Comes the Sun - The Beatles', 'Three Little Birds - Bob Marley', 'Good Morning - Kanye West']
      },
      {
        id: 'm13',
        title: 'Acoustic Revival',
        artist: 'Folk Revival',
        genre: 'Folk',
        mood: 'Tired',
        description: 'Gentle acoustic songs to lift your spirits',
        songs: ['Ho Hey - The Lumineers', 'Home - Edward Sharpe', 'I Will Follow You into the Dark - Death Cab']
      }
    ];

    return musicDatabase.filter(music => 
      music.mood === therapeuticMood || music.genre === targetGenre
    );
  };

  return (
    <MoodContext.Provider value={{
      currentMoodAnalysis,
      setCurrentMoodAnalysis,
      getFoodRecommendations,
      getMusicRecommendations,
      analyzeMoodFromSelection,
      isAnalyzing
    }}>
      {children}
    </MoodContext.Provider>
  );
};
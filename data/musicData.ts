export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  mood: string;
  genre: string;
  description: string;
  audioUrl: string;
  coverImage: string;
  duration: number;
  likes: number;
  comments: number;
  isLiked: boolean;
  moodBenefit: string;
  tags: string[];
}

export const musicDatabase: MusicTrack[] = [
  // Angry/Calming Music
  {
    id: 'calm_1',
    title: 'Ocean Waves',
    artist: 'Nature Sounds',
    mood: 'Angry',
    genre: 'Nature',
    description: 'Gentle ocean waves to wash away anger and bring peace',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImage: '🌊',
    duration: 300,
    likes: 2847,
    comments: 156,
    isLiked: false,
    moodBenefit: 'Reduces anger and promotes inner peace',
    tags: ['calming', 'nature', 'peaceful']
  },
  {
    id: 'calm_2',
    title: 'Deep Breathing',
    artist: 'Mindful Moments',
    mood: 'Angry',
    genre: 'Meditation',
    description: 'Guided breathing exercise with soft background music',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImage: '🧘‍♀️',
    duration: 240,
    likes: 1923,
    comments: 89,
    isLiked: true,
    moodBenefit: 'Helps control anger through mindful breathing',
    tags: ['meditation', 'breathing', 'mindfulness']
  },
  {
    id: 'calm_3',
    title: 'Forest Rain',
    artist: 'Peaceful Earth',
    mood: 'Angry',
    genre: 'Ambient',
    description: 'Soothing rain sounds in a peaceful forest setting',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImage: '🌲',
    duration: 420,
    likes: 3156,
    comments: 203,
    isLiked: false,
    moodBenefit: 'Creates a calming environment to reduce stress',
    tags: ['rain', 'forest', 'relaxing']
  },

  // Sad/Uplifting Music
  {
    id: 'uplift_1',
    title: 'Sunrise Hope',
    artist: 'Gentle Hearts',
    mood: 'Sad',
    genre: 'Acoustic',
    description: 'Warm acoustic melodies to lift your spirits',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImage: '🌅',
    duration: 195,
    likes: 4521,
    comments: 287,
    isLiked: true,
    moodBenefit: 'Gently lifts mood and brings hope',
    tags: ['acoustic', 'hopeful', 'warm']
  },
  {
    id: 'uplift_2',
    title: 'Healing Light',
    artist: 'Soul Therapy',
    mood: 'Sad',
    genre: 'Ambient',
    description: 'Ethereal sounds designed to heal emotional wounds',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImage: '✨',
    duration: 360,
    likes: 2876,
    comments: 145,
    isLiked: false,
    moodBenefit: 'Provides emotional healing and comfort',
    tags: ['healing', 'ethereal', 'comforting']
  },
  {
    id: 'uplift_3',
    title: 'Gentle Embrace',
    artist: 'Comfort Zone',
    mood: 'Sad',
    genre: 'Piano',
    description: 'Soft piano melodies that feel like a warm hug',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImage: '🤗',
    duration: 280,
    likes: 3892,
    comments: 198,
    isLiked: true,
    moodBenefit: 'Offers emotional support and comfort',
    tags: ['piano', 'gentle', 'supportive']
  },

  // Happy/Energetic Music
  {
    id: 'happy_1',
    title: 'Sunshine Dance',
    artist: 'Joy Collective',
    mood: 'Happy',
    genre: 'Pop',
    description: 'Upbeat pop music to amplify your happiness',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImage: '☀️',
    duration: 210,
    likes: 8934,
    comments: 456,
    isLiked: true,
    moodBenefit: 'Boosts energy and amplifies positive emotions',
    tags: ['upbeat', 'energetic', 'joyful']
  },
  {
    id: 'happy_2',
    title: 'Feel Good Vibes',
    artist: 'Positive Energy',
    mood: 'Happy',
    genre: 'Electronic',
    description: 'Electronic beats that make you want to move',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImage: '🎉',
    duration: 185,
    likes: 6742,
    comments: 321,
    isLiked: false,
    moodBenefit: 'Increases motivation and positive energy',
    tags: ['electronic', 'motivating', 'uplifting']
  },
  {
    id: 'happy_3',
    title: 'Celebration Time',
    artist: 'Party Makers',
    mood: 'Happy',
    genre: 'Dance',
    description: 'High-energy dance music for celebration',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImage: '🎊',
    duration: 225,
    likes: 7856,
    comments: 389,
    isLiked: true,
    moodBenefit: 'Enhances celebratory mood and social connection',
    tags: ['dance', 'celebration', 'high-energy']
  },

  // Stressed/Relaxing Music
  {
    id: 'relax_1',
    title: 'Stress Away',
    artist: 'Calm Waters',
    mood: 'Stressed',
    genre: 'Meditation',
    description: 'Specially designed to melt away stress and tension',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImage: '🕯️',
    duration: 450,
    likes: 5234,
    comments: 267,
    isLiked: true,
    moodBenefit: 'Significantly reduces stress and anxiety',
    tags: ['stress-relief', 'meditation', 'calming']
  },
  {
    id: 'relax_2',
    title: 'Peaceful Garden',
    artist: 'Zen Masters',
    mood: 'Stressed',
    genre: 'Nature',
    description: 'Birds chirping in a peaceful garden setting',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImage: '🌸',
    duration: 380,
    likes: 4567,
    comments: 189,
    isLiked: false,
    moodBenefit: 'Creates a peaceful mental space',
    tags: ['nature', 'peaceful', 'zen']
  },
  {
    id: 'relax_3',
    title: 'Floating Clouds',
    artist: 'Sky Meditation',
    mood: 'Stressed',
    genre: 'Ambient',
    description: 'Drift away on clouds of soothing ambient sounds',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImage: '☁️',
    duration: 320,
    likes: 3891,
    comments: 156,
    isLiked: true,
    moodBenefit: 'Promotes deep relaxation and mental clarity',
    tags: ['ambient', 'floating', 'clarity']
  },

  // Focused/Concentration Music
  {
    id: 'focus_1',
    title: 'Deep Focus',
    artist: 'Productivity Sounds',
    mood: 'Focused',
    genre: 'Lo-Fi',
    description: 'Lo-fi beats perfect for concentration and study',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImage: '🎯',
    duration: 600,
    likes: 9876,
    comments: 543,
    isLiked: true,
    moodBenefit: 'Enhances focus and cognitive performance',
    tags: ['lo-fi', 'study', 'concentration']
  },
  {
    id: 'focus_2',
    title: 'Brain Waves',
    artist: 'Neural Sync',
    mood: 'Focused',
    genre: 'Binaural',
    description: 'Binaural beats to synchronize brain waves for focus',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImage: '🧠',
    duration: 720,
    likes: 6543,
    comments: 298,
    isLiked: false,
    moodBenefit: 'Optimizes brain function for peak performance',
    tags: ['binaural', 'brain-sync', 'performance']
  },
  {
    id: 'focus_3',
    title: 'Study Flow',
    artist: 'Academic Beats',
    mood: 'Focused',
    genre: 'Instrumental',
    description: 'Instrumental music designed for learning and retention',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImage: '📚',
    duration: 540,
    likes: 7234,
    comments: 367,
    isLiked: true,
    moodBenefit: 'Improves learning capacity and memory retention',
    tags: ['instrumental', 'learning', 'memory']
  },

  // Energetic/Workout Music
  {
    id: 'energy_1',
    title: 'Power Surge',
    artist: 'Fitness Beats',
    mood: 'Energetic',
    genre: 'Electronic',
    description: 'High-energy electronic music for workouts',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImage: '⚡',
    duration: 240,
    likes: 12456,
    comments: 678,
    isLiked: true,
    moodBenefit: 'Boosts physical energy and motivation',
    tags: ['workout', 'high-energy', 'motivating']
  },
  {
    id: 'energy_2',
    title: 'Adrenaline Rush',
    artist: 'Pump Up',
    mood: 'Energetic',
    genre: 'Rock',
    description: 'Rock music to get your adrenaline pumping',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImage: '🔥',
    duration: 195,
    likes: 8765,
    comments: 432,
    isLiked: false,
    moodBenefit: 'Increases adrenaline and physical performance',
    tags: ['rock', 'adrenaline', 'intense']
  },
  {
    id: 'energy_3',
    title: 'Victory March',
    artist: 'Champions',
    mood: 'Energetic',
    genre: 'Orchestral',
    description: 'Epic orchestral music for achieving goals',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImage: '🏆',
    duration: 300,
    likes: 9543,
    comments: 521,
    isLiked: true,
    moodBenefit: 'Inspires achievement and success mindset',
    tags: ['orchestral', 'epic', 'achievement']
  }
];

export const getMusicByMood = (mood: string): MusicTrack[] => {
  const moodMapping: { [key: string]: string[] } = {
    'angry': ['Angry'],
    'sad': ['Sad'],
    'happy': ['Happy'],
    'stressed': ['Stressed'],
    'focused': ['Focused'],
    'energetic': ['Energetic'],
    'relaxed': ['Stressed', 'Focused'], // Relaxed people might want to maintain calm or focus
    'balanced': ['Happy', 'Focused'], // Balanced mood gets positive and productive music
  };

  const targetMoods = moodMapping[mood.toLowerCase()] || ['Happy'];
  return musicDatabase.filter(track => targetMoods.includes(track.mood));
};

export const getRandomTrackByMood = (mood: string): MusicTrack | null => {
  const tracks = getMusicByMood(mood);
  if (tracks.length === 0) return null;
  return tracks[Math.floor(Math.random() * tracks.length)];
};

export const getAllGenres = (): string[] => {
  const genres = new Set(musicDatabase.map(track => track.genre));
  return Array.from(genres);
};

export const getTracksByGenre = (genre: string): MusicTrack[] => {
  return musicDatabase.filter(track => track.genre === genre);
};
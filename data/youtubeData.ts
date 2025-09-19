export interface YouTubeShort {
  id: string;
  title: string;
  creator: string;
  videoId: string; // YouTube video ID
  videoUrl: string; // Direct video URL for playback
  thumbnail: string;
  duration: string;
  mood: string;
  tags: string[];
  views: string;
  likes: string;
  description: string;
  channel: string; // Added channel property
}

// YouTube Shorts data organized by mood
export const youtubeShorts: YouTubeShort[] = [
  // Happy/Energetic mood videos
  {
    id: '1',
    title: 'Feel Good Dance Moves',
    creator: '@DanceVibes',
    videoId: 'dQw4w9WgXcQ',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    duration: '0:45',
    mood: 'happy',
    tags: ['dance', 'upbeat', 'energy'],
    views: '2.1M',
    likes: '156K',
    description: 'Quick dance moves to boost your mood! 💃✨',
    channel: 'DanceVibes'
  },
  {
    id: '2',
    title: 'Motivational Morning Routine',
    creator: '@LifeHacks',
    videoId: 'jNQXAC9IVRw',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
    duration: '1:20',
    mood: 'happy',
    tags: ['motivation', 'morning', 'productivity'],
    views: '890K',
    likes: '67K',
    description: 'Start your day with positive energy! ☀️',
    channel: 'LifeHacks'
  },
  
  // Relaxed/Calm mood videos
  {
    id: '3',
    title: 'Peaceful Nature Sounds',
    creator: '@CalmVibes',
    videoId: 'M7lc1UVf-VE',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://img.youtube.com/vi/M7lc1UVf-VE/maxresdefault.jpg',
    duration: '2:30',
    mood: 'relaxed',
    tags: ['nature', 'peaceful', 'meditation'],
    views: '1.5M',
    likes: '98K',
    description: 'Relax with soothing nature sounds 🌿',
    channel: 'CalmVibes'
  },
  {
    id: '4',
    title: 'Quick Meditation Guide',
    creator: '@MindfulMoments',
    videoId: 'YQHsXMglC9A',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://img.youtube.com/vi/YQHsXMglC9A/maxresdefault.jpg',
    duration: '1:45',
    mood: 'relaxed',
    tags: ['meditation', 'mindfulness', 'calm'],
    views: '743K',
    likes: '52K',
    description: '2-minute meditation for instant calm 🧘‍♀️',
    channel: 'MindfulMoments'
  },
  
  // Energetic/Excited mood videos
  {
    id: '5',
    title: 'Epic Workout Motivation',
    creator: '@FitLife',
    videoId: 'ZXsQAXx_ao0',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://img.youtube.com/vi/ZXsQAXx_ao0/maxresdefault.jpg',
    duration: '1:15',
    mood: 'energetic',
    tags: ['workout', 'fitness', 'motivation'],
    views: '3.2M',
    likes: '245K',
    description: 'Get pumped for your workout! 💪🔥',
    channel: 'FitLife'
  },
  {
    id: '6',
    title: 'High Energy Cooking',
    creator: '@QuickChef',
    videoId: 'kJQP7kiw5Fk',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
    duration: '0:58',
    mood: 'energetic',
    tags: ['cooking', 'fast', 'energy'],
    views: '1.8M',
    likes: '134K',
    description: 'Cook with energy and passion! 👨‍🍳⚡',
    channel: 'QuickChef'
  },
  
  // Sad/Melancholic mood videos - calming content to improve mood
  {
    id: '7',
    title: 'Comforting Self-Care Tips',
    creator: '@SelfCareSpace',
    videoId: 'L_jWHffIx5E',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnail: 'https://img.youtube.com/vi/L_jWHffIx5E/maxresdefault.jpg',
    duration: '2:10',
    mood: 'sad',
    tags: ['self-care', 'comfort', 'healing'],
    views: '567K',
    likes: '43K',
    description: 'Gentle self-care for tough days 💙',
    channel: 'SelfCareSpace'
  },
  {
    id: '8',
    title: 'Uplifting Quotes',
    creator: '@PositiveVibes',
    videoId: 'fJ9rUzIMcZQ',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnail: 'https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg',
    duration: '1:30',
    mood: 'sad',
    tags: ['quotes', 'inspiration', 'hope'],
    views: '892K',
    likes: '71K',
    description: 'Words to lift your spirits ✨💫',
    channel: 'PositiveVibes'
  },
  
  // Focused/Productive mood videos
  {
    id: '9',
    title: 'Study Music Vibes',
    creator: '@StudyBeats',
    videoId: 'jfKfPfyJRdk',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    thumbnail: 'https://img.youtube.com/vi/jfKfPfyJRdk/maxresdefault.jpg',
    duration: '3:00',
    mood: 'focused',
    tags: ['study', 'focus', 'productivity'],
    views: '2.7M',
    likes: '189K',
    description: 'Perfect beats for deep focus 🎧📚',
    channel: 'StudyBeats'
  },
  {
    id: '10',
    title: 'Productivity Hacks',
    creator: '@ProductivityPro',
    videoId: 'lDK9QqIzhwk',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://img.youtube.com/vi/lDK9QqIzhwk/maxresdefault.jpg',
    duration: '1:25',
    mood: 'focused',
    tags: ['productivity', 'tips', 'efficiency'],
    views: '1.3M',
    likes: '95K',
    description: 'Boost your productivity instantly! ⚡📈',
    channel: 'ProductivityPro'
  },
  
  // Angry/Stressed mood videos - calming content to reduce stress
  {
    id: '11',
    title: 'Deep Breathing Exercise',
    creator: '@CalmMind',
    videoId: 'breathing123',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    thumbnail: 'https://img.youtube.com/vi/breathing123/maxresdefault.jpg',
    duration: '2:30',
    mood: 'angry',
    tags: ['breathing', 'calm', 'stress-relief'],
    views: '1.2M',
    likes: '89K',
    description: 'Breathe away your stress 🌬️💙',
    channel: 'CalmMind'
  },
  {
    id: '12',
    title: 'Peaceful Nature Sounds',
    creator: '@NatureSounds',
    videoId: 'nature456',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnail: 'https://img.youtube.com/vi/nature456/maxresdefault.jpg',
    duration: '3:15',
    mood: 'angry',
    tags: ['nature', 'peaceful', 'meditation'],
    views: '2.1M',
    likes: '156K',
    description: 'Let nature calm your mind 🌿🦋',
    channel: 'NatureSounds'
  },
  {
    id: '13',
    title: 'Quick Meditation',
    creator: '@MindfulMoments',
    videoId: 'meditation789',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    thumbnail: 'https://img.youtube.com/vi/meditation789/maxresdefault.jpg',
    duration: '1:45',
    mood: 'angry',
    tags: ['meditation', 'mindfulness', 'peace'],
    views: '987K',
    likes: '67K',
    description: 'Find your inner peace 🧘‍♀️✨',
    channel: 'MindfulMoments'
  }
];

// Function to get YouTube shorts by mood
export function getYouTubeShortsByMood(mood: string): YouTubeShort[] {
  const moodMap: { [key: string]: string } = {
    'happy': 'happy',
    'joyful': 'happy',
    'excited': 'energetic',
    'energetic': 'energetic',
    'calm': 'relaxed',
    'relaxed': 'relaxed',
    'peaceful': 'relaxed',
    'sad': 'sad',
    'melancholic': 'sad',
    'focused': 'focused',
    'productive': 'focused',
    'motivated': 'energetic',
    'angry': 'angry',
    'stressed': 'angry',
    'frustrated': 'angry',
    'annoyed': 'angry'
  };

  const targetMood = moodMap[mood.toLowerCase()] || 'happy';
  const moodVideos = youtubeShorts.filter(video => video.mood === targetMood);
  
  // If no videos found for specific mood, return happy videos as fallback
  if (moodVideos.length === 0) {
    return youtubeShorts.filter(video => video.mood === 'happy');
  }
  
  return moodVideos;
}

// Function to get all YouTube shorts
export function getAllYouTubeShorts(): YouTubeShort[] {
  return youtubeShorts;
}
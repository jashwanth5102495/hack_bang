import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Heart, Shuffle, Repeat, Volume2 } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import { Audio } from 'expo-av';
import { useMood } from '../contexts/MoodContext';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  mood: string;
  therapeuticPurpose: string;
  image: string;
  audioUrl?: string;
}

// Therapeutic music database - mood-based recommendations with popular artists
const musicDatabase: Song[] = [
  // Happy mood - maintain positivity
  {
    id: 'h1',
    title: 'Happy',
    artist: 'Pharrell Williams',
    album: 'Girl',
    duration: '3:53',
    mood: 'Happy',
    therapeuticPurpose: 'Maintain positive energy',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 'h2',
    title: 'Sorry',
    artist: 'Justin Bieber',
    album: 'Purpose',
    duration: '3:20',
    mood: 'Happy',
    therapeuticPurpose: 'Uplifting pop energy',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 'h3',
    title: 'Lean On',
    artist: 'Major Lazer & DJ Snake',
    album: 'Peace Is The Mission',
    duration: '2:56',
    mood: 'Happy',
    therapeuticPurpose: 'Electronic dance energy',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    id: 'h4',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '3:20',
    mood: 'Happy',
    therapeuticPurpose: 'Retro-pop euphoria',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3'
  },
  {
    id: 'h5',
    title: 'Sunflower',
    artist: 'Post Malone & Swae Lee',
    album: 'Spider-Verse Soundtrack',
    duration: '2:38',
    mood: 'Happy',
    therapeuticPurpose: 'Feel-good vibes',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3'
  },

  // Sad mood - uplifting therapeutic music
  {
    id: 's1',
    title: 'Someone Like You',
    artist: 'Adele',
    album: '21',
    duration: '4:45',
    mood: 'Sad',
    therapeuticPurpose: 'Emotional release and healing',
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    id: 's2',
    title: 'Fix You',
    artist: 'Coldplay',
    album: 'X&Y',
    duration: '4:54',
    mood: 'Sad',
    therapeuticPurpose: 'Hope and comfort',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  },
  {
    id: 's3',
    title: 'The Night We Met',
    artist: 'Lord Huron',
    album: 'Strange Trails',
    duration: '3:28',
    mood: 'Sad',
    therapeuticPurpose: 'Nostalgic reflection',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
  },
  {
    id: 's4',
    title: 'Hurt',
    artist: 'Johnny Cash',
    album: 'American IV',
    duration: '3:38',
    mood: 'Sad',
    therapeuticPurpose: 'Deep emotional processing',
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3'
  },

  // Angry mood - calming therapeutic music
  {
    id: 'a1',
    title: 'Deep Calm',
    artist: 'Serenity Now',
    album: 'Peaceful Mind',
    duration: '8:10',
    mood: 'Angry',
    therapeuticPurpose: 'Scientifically proven to reduce anxiety',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3'
  },
  {
    id: 'a2',
    title: 'Tranquil Waters',
    artist: 'Meditation Masters',
    album: 'Inner Peace',
    duration: '4:30',
    mood: 'Angry',
    therapeuticPurpose: 'Classical calming effect',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
  },
  {
    id: 'a3',
    title: 'Breathe Easy',
    artist: 'Calm Collective',
    album: 'Stress Relief',
    duration: '5:45',
    mood: 'Angry',
    therapeuticPurpose: 'Anger management through music',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3'
  },

  // Lonely mood - connection and warmth
  {
    id: 'l1',
    title: 'Warm Embrace',
    artist: 'Connection',
    album: 'Together',
    duration: '4:17',
    mood: 'Lonely',
    therapeuticPurpose: 'Feeling of support and connection',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3'
  },
  {
    id: 'l2',
    title: 'Never Alone',
    artist: 'Friendship',
    album: 'Bonds',
    duration: '5:08',
    mood: 'Lonely',
    therapeuticPurpose: 'Comfort and friendship',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3'
  },

  // Tired mood - energizing but gentle
  {
    id: 't1',
    title: 'Gentle Energy',
    artist: 'Revitalize',
    album: 'Refresh',
    duration: '3:59',
    mood: 'Tired',
    therapeuticPurpose: 'Gentle energy boost',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3'
  },
  {
    id: 't2',
    title: 'Morning Light',
    artist: 'New Day',
    album: 'Fresh Start',
    duration: '2:48',
    mood: 'Tired',
    therapeuticPurpose: 'Mental clarity and optimism',
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3'
  },

  // Excited mood - maintain high energy
  {
    id: 'e1',
    title: 'Bangarang',
    artist: 'Skrillex',
    album: 'Bangarang EP',
    duration: '3:35',
    mood: 'Excited',
    therapeuticPurpose: 'High-energy electronic rush',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3'
  },
  {
    id: 'e2',
    title: 'Taki Taki',
    artist: 'DJ Snake ft. Selena Gomez',
    album: 'Carte Blanche',
    duration: '3:32',
    mood: 'Excited',
    therapeuticPurpose: 'Latin-infused dance energy',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3'
  },
  {
    id: 'e3',
    title: 'Titanium',
    artist: 'David Guetta ft. Sia',
    album: 'Nothing but the Beat',
    duration: '4:05',
    mood: 'Excited',
    therapeuticPurpose: 'Empowering electronic anthem',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3'
  },
  {
    id: 'e4',
    title: 'Levels',
    artist: 'Avicii',
    album: 'True',
    duration: '3:18',
    mood: 'Excited',
    therapeuticPurpose: 'Progressive house euphoria',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-21.mp3'
  },

  // Romantic mood - love and connection
  {
    id: 'r1',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    duration: '4:23',
    mood: 'Romantic',
    therapeuticPurpose: 'Romantic connection and love',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3'
  },
  {
    id: 'r2',
    title: 'All of Me',
    artist: 'John Legend',
    album: 'Love in the Future',
    duration: '4:29',
    mood: 'Romantic',
    therapeuticPurpose: 'Deep emotional intimacy',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-22.mp3'
  },
  {
    id: 'r3',
    title: 'Thinking Out Loud',
    artist: 'Ed Sheeran',
    album: 'x (Multiply)',
    duration: '4:41',
    mood: 'Romantic',
    therapeuticPurpose: 'Lasting love and commitment',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-23.mp3'
  }
];

export default function MusicScreen() {
  const { currentMoodAnalysis } = useMood();
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeated, setIsRepeated] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const currentMood = currentMoodAnalysis?.dominantMood || 'Happy';

  // Get therapeutic recommendations based on mood
  const getTherapeuticSongs = (mood: string): Song[] => {
    // For negative moods, recommend uplifting music
    const therapeuticMoods = ['Sad', 'Angry', 'Lonely', 'Tired', 'Moody'];
    
    if (therapeuticMoods.includes(mood)) {
      // Return mood-lifting songs for negative moods
      return musicDatabase.filter(song => 
        song.mood === mood || song.therapeuticPurpose.includes('uplifting') || song.therapeuticPurpose.includes('calming')
      );
    } else {
      // For positive moods, return songs that maintain the mood
      return musicDatabase.filter(song => song.mood === mood);
    }
  };

  const recommendedSongs = getTherapeuticSongs(currentMood);
  const allSongs = musicDatabase;

  useEffect(() => {
    // Setup audio mode
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error('Error setting up audio:', error);
      }
    };

    setupAudio();

    // Auto-select first recommended song
    if (recommendedSongs.length > 0 && !currentSong) {
      setCurrentSong(recommendedSongs[0]);
    }
  }, [recommendedSongs]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handlePlayPause = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else if (currentSong?.audioUrl) {
        // Load and play new audio
        await loadAndPlayAudio(currentSong.audioUrl);
      } else {
        Alert.alert('No Audio', 'Please select a song first.');
      }
    } catch (error) {
      console.error('Error playing/pausing audio:', error);
      Alert.alert('Audio Error', 'Unable to play audio. Please check your internet connection.');
    }
  };

  const loadAndPlayAudio = async (audioUrl: string) => {
    try {
      // Unload previous sound
      if (sound) {
        await sound.unloadAsync();
      }

      // Load new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true, isLooping: false }
      );
      
      setSound(newSound);
      setIsPlaying(true);

      // Set up playback status update
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        }
      });
    } catch (error) {
      console.error('Error loading audio:', error);
      Alert.alert('Loading Error', 'Unable to load audio. Please try again.');
    }
  };

  const handleSongSelect = async (song: Song) => {
    try {
      // Stop current song if playing
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
      }
      
      setCurrentSong(song);
      
      // Load and play the new song
      if (song.audioUrl) {
        await loadAndPlayAudio(song.audioUrl);
      } else {
        Alert.alert('Audio Unavailable', 'This song does not have an audio file available.');
      }
      
    } catch (error) {
      console.error('Error loading audio:', error);
      Alert.alert('Audio Error', 'Unable to load audio file. Please check your internet connection.');
    }
  };

  const handleNext = async () => {
    if (currentSong) {
      const currentIndex = recommendedSongs.findIndex(song => song.id === currentSong.id);
      const nextIndex = (currentIndex + 1) % recommendedSongs.length;
      const nextSong = recommendedSongs[nextIndex];
      await handleSongSelect(nextSong);
    }
  };

  const handlePrevious = async () => {
    if (currentSong) {
      const currentIndex = recommendedSongs.findIndex(song => song.id === currentSong.id);
      const prevIndex = currentIndex === 0 ? recommendedSongs.length - 1 : currentIndex - 1;
      const prevSong = recommendedSongs[prevIndex];
      await handleSongSelect(prevSong);
    }
  };

  const renderSongCard = (song: Song, isRecommended: boolean = false) => (
    <TouchableOpacity
      key={song.id}
      style={[styles.songCard, isRecommended && styles.recommendedSong]}
      onPress={() => handleSongSelect(song)}
    >
      <Image source={{ uri: song.image }} style={styles.songImage} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{song.title}</Text>
        <Text style={styles.songArtist}>{song.artist}</Text>
        <Text style={styles.songDuration}>{song.duration}</Text>
        {isRecommended && (
          <Text style={styles.therapeuticPurpose}>{song.therapeuticPurpose}</Text>
        )}
      </View>
      <TouchableOpacity 
        style={styles.playButton}
        onPress={() => handleSongSelect(song)}
      >
        <Play size={20} color="#ffffff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#0f0f23', '#1a1a2e', '#16213e']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Music Therapy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Current Mood Display */}
        <Animated.View
          entering={FadeInDown.delay(100)}
          style={styles.moodContainer}
        >
          <Text style={styles.moodTitle}>Current Mood: {String(currentMood)}</Text>
          <Text style={styles.moodDescription}>
            {currentMood === 'Happy' ? 'Keep the positive vibes going!' :
             currentMood === 'Sad' ? 'Let\'s lift your spirits with uplifting music' :
             currentMood === 'Angry' ? 'Calming music to help you relax' :
             currentMood === 'Lonely' ? 'Songs about connection and friendship' :
             currentMood === 'Tired' ? 'Gentle energy-boosting music' :
             'Music tailored to your current state'}
          </Text>
        </Animated.View>

        {/* Now Playing */}
        {currentSong && (
          <Animated.View
            entering={FadeInLeft.delay(200)}
            style={styles.nowPlayingContainer}
          >
            <Text style={styles.sectionTitle}>Now Playing</Text>
            <View style={styles.nowPlayingCard}>
              <Image source={{ uri: currentSong.image }} style={styles.nowPlayingImage} />
              <View style={styles.nowPlayingInfo}>
                <Text style={styles.nowPlayingTitle}>{currentSong.title}</Text>
                <Text style={styles.nowPlayingArtist}>{currentSong.artist}</Text>
                <Text style={styles.nowPlayingPurpose}>{currentSong.therapeuticPurpose}</Text>
              </View>
            </View>

            {/* Player Controls */}
            <View style={styles.playerControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => setIsShuffled(!isShuffled)}
              >
                <Shuffle size={20} color={isShuffled ? "#3b82f6" : "#a1a1aa"} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.controlButton} onPress={handlePrevious}>
                <SkipBack size={24} color="#ffffff" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.playPauseButton} onPress={handlePlayPause}>
                {isPlaying ? (
                  <Pause size={32} color="#ffffff" />
                ) : (
                  <Play size={32} color="#ffffff" />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.controlButton} onPress={handleNext}>
                <SkipForward size={24} color="#ffffff" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => setIsRepeated(!isRepeated)}
              >
                <Repeat size={20} color={isRepeated ? "#3b82f6" : "#a1a1aa"} />
              </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <Text style={styles.timeText}>{currentTime}</Text>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
              <Text style={styles.timeText}>{currentSong.duration}</Text>
            </View>
          </Animated.View>
        )}

        {/* Recommended for Your Mood */}
        <Animated.View
          entering={FadeInDown.delay(300)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Recommended for Your Mood</Text>
          <Text style={styles.sectionSubtitle}>
            Therapeutic music to help improve your {currentMood.toLowerCase()} mood
          </Text>
          {recommendedSongs.map(song => renderSongCard(song, true))}
        </Animated.View>

        {/* All Songs */}
        <Animated.View
          entering={FadeInDown.delay(400)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>All Songs</Text>
          {allSongs.map(song => renderSongCard(song))}
        </Animated.View>
      </ScrollView>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
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
  placeholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  moodContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  moodTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#3b82f6',
    marginBottom: 8,
  },
  moodDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#93c5fd',
    lineHeight: 20,
  },
  nowPlayingContainer: {
    marginBottom: 32,
  },
  nowPlayingCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  nowPlayingImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  nowPlayingInfo: {
    flex: 1,
  },
  nowPlayingTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  nowPlayingArtist: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#a1a1aa',
    marginBottom: 4,
  },
  nowPlayingPurpose: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#10b981',
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playPauseButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#a1a1aa',
    minWidth: 35,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
  },
  progressFill: {
    width: '30%',
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginBottom: 16,
  },
  songCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  recommendedSong: {
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  songImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 2,
  },
  songArtist: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#a1a1aa',
    marginBottom: 2,
  },
  songDuration: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#71717a',
  },
  therapeuticPurpose: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#10b981',
    marginTop: 2,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
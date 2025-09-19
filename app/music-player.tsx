import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, Heart, Shuffle, Repeat } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInLeft, useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { Audio } from 'expo-av';
import { useMood } from '../contexts/MoodContext';

const { width } = Dimensions.get('window');

const moodPlaylists = {
  happy: {
    name: 'Happy Vibes',
    color: ['#fbbf24', '#f59e0b'],
    songs: [
      { id: 1, title: 'Good as Hell', artist: 'Lizzo', duration: '3:32', isPlaying: false, audioUrl: 'https://sample-music.netlify.app/death%20bed.mp3' },
      { id: 2, title: 'Can\'t Stop the Feeling', artist: 'Justin Timberlake', duration: '3:56', isPlaying: false, audioUrl: 'https://sample-music.netlify.app/death%20bed.mp3' },
      { id: 3, title: 'Happy', artist: 'Pharrell Williams', duration: '3:53', isPlaying: false, audioUrl: 'https://sample-music.netlify.app/death%20bed.mp3' },
      { id: 4, title: 'Walking on Sunshine', artist: 'Katrina & The Waves', duration: '3:58', isPlaying: false, audioUrl: 'https://sample-music.netlify.app/death%20bed.mp3' },
      { id: 5, title: 'I Gotta Feeling', artist: 'Black Eyed Peas', duration: '4:05', isPlaying: false, audioUrl: 'https://sample-music.netlify.app/death%20bed.mp3' },
    ]
  },
  sad: {
    name: 'Healing Melodies',
    color: ['#3b82f6', '#1e40af'],
    songs: [
      { id: 6, title: 'Someone Like You', artist: 'Adele', duration: '4:45', isPlaying: false, audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3' },
      { id: 7, title: 'Mad World', artist: 'Gary Jules', duration: '3:07', isPlaying: false, audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3' },
      { id: 8, title: 'Hurt', artist: 'Johnny Cash', duration: '3:38', isPlaying: false, audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3' },
      { id: 9, title: 'Black', artist: 'Pearl Jam', duration: '5:43', isPlaying: false, audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3' },
      { id: 10, title: 'Tears in Heaven', artist: 'Eric Clapton', duration: '4:32', isPlaying: false, audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3' },
    ]
  },
  romantic: {
    name: 'Love Ballads',
    color: ['#ec4899', '#be185d'],
    songs: [
      { id: 11, title: 'Perfect', artist: 'Ed Sheeran', duration: '4:23', isPlaying: false, audioUrl: 'https://sample-music.netlify.app/death%20bed.mp3' },
      { id: 12, title: 'All of Me', artist: 'John Legend', duration: '4:29', isPlaying: false, audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3' },
      { id: 13, title: 'Thinking Out Loud', artist: 'Ed Sheeran', duration: '4:41', isPlaying: false, audioUrl: 'https://sample-music.netlify.app/death%20bed.mp3' },
      { id: 14, title: 'Make You Feel My Love', artist: 'Adele', duration: '3:32', isPlaying: false, audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3' },
      { id: 15, title: 'At Last', artist: 'Etta James', duration: '3:01', isPlaying: false, audioUrl: 'https://sample-music.netlify.app/death%20bed.mp3' },
    ]
  },
  tired: {
    name: 'Relaxing Sounds',
    color: ['#6b7280', '#374151'],
    songs: [
      { id: 16, title: 'Weightless', artist: 'Marconi Union', duration: '8:08', isPlaying: false, audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3' },
      { id: 17, title: 'Clair de Lune', artist: 'Claude Debussy', duration: '5:02', isPlaying: false, audioUrl: 'https://sample-music.netlify.app/death%20bed.mp3' },
      { id: 18, title: 'Gymnopédie No. 1', artist: 'Erik Satie', duration: '3:33', isPlaying: false, audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3' },
      { id: 19, title: 'River Flows in You', artist: 'Yiruma', duration: '3:06', isPlaying: false, audioUrl: 'https://sample-music.netlify.app/death%20bed.mp3' },
      { id: 20, title: 'Ambient 1', artist: 'Brian Eno', duration: '6:14', isPlaying: false, audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3' },
    ]
  },
  excited: {
    name: 'High Energy',
    color: ['#10b981', '#059669'],
    songs: [
      { id: 21, title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', duration: '4:30', isPlaying: false, audioUrl: 'https://sample-music.netlify.app/death%20bed.mp3' },
      { id: 22, title: 'Can\'t Hold Us', artist: 'Macklemore & Ryan Lewis', duration: '4:18', isPlaying: false, audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3' },
      { id: 23, title: 'Pump It', artist: 'Black Eyed Peas', duration: '3:33', isPlaying: false, audioUrl: 'https://sample-music.netlify.app/death%20bed.mp3' },
      { id: 24, title: 'Thunder', artist: 'Imagine Dragons', duration: '3:07', isPlaying: false, audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3' },
      { id: 25, title: 'Stronger', artist: 'Kelly Clarkson', duration: '3:42', isPlaying: false, audioUrl: 'https://sample-music.netlify.app/death%20bed.mp3' },
    ]
  },
  lonely: {
    name: 'Soulful Melodies',
    color: ['#8b5cf6', '#7c3aed'],
    songs: [
      { id: 26, title: 'The Sound of Silence', artist: 'Simon & Garfunkel', duration: '3:05', isPlaying: false, audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3' },
      { id: 27, title: 'Mad About You', artist: 'Sting', duration: '3:56', isPlaying: false, audioUrl: 'https://sample-music.netlify.app/death%20bed.mp3' },
      { id: 28, title: 'Everybody Hurts', artist: 'R.E.M.', duration: '5:17', isPlaying: false, audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3' },
      { id: 29, title: 'Alone', artist: 'Heart', duration: '3:50', isPlaying: false, audioUrl: 'https://sample-music.netlify.app/death%20bed.mp3' },
      { id: 30, title: 'Lonely', artist: 'Akon', duration: '3:56', isPlaying: false, audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3' },
    ]
  },
  hungry: {
    name: 'Cooking Vibes',
    color: ['#f97316', '#ea580c'],
    songs: [
      { id: 31, title: 'Cooking Up Something Good', artist: 'Mac DeMarco', duration: '3:17', isPlaying: false, audioUrl: 'https://sample-music.netlify.app/death%20bed.mp3' },
      { id: 32, title: 'Sugar', artist: 'Maroon 5', duration: '3:55', isPlaying: false, audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3' },
      { id: 33, title: 'Banana Pancakes', artist: 'Jack Johnson', duration: '3:12', isPlaying: false, audioUrl: 'https://sample-music.netlify.app/death%20bed.mp3' },
      { id: 34, title: 'Food Song', artist: 'Porno for Pyros', duration: '4:23', isPlaying: false, audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3' },
      { id: 35, title: 'Cheeseburger in Paradise', artist: 'Jimmy Buffett', duration: '3:18', isPlaying: false, audioUrl: 'https://sample-music.netlify.app/death%20bed.mp3' },
    ]
  },
  moody: {
    name: 'Alternative Vibes',
    color: ['#06b6d4', '#0891b2'],
    songs: [
      { id: 36, title: 'Creep', artist: 'Radiohead', duration: '3:58', isPlaying: false, audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3' },
      { id: 37, title: 'Black Hole Sun', artist: 'Soundgarden', duration: '5:18', isPlaying: false, audioUrl: 'https://sample-music.netlify.app/death%20bed.mp3' },
      { id: 38, title: 'Smells Like Teen Spirit', artist: 'Nirvana', duration: '5:01', isPlaying: false, audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3' },
      { id: 39, title: 'Losing Religion', artist: 'R.E.M.', duration: '4:27', isPlaying: false, audioUrl: 'https://sample-music.netlify.app/death%20bed.mp3' },
      { id: 40, title: 'Bitter Sweet Symphony', artist: 'The Verve', duration: '5:58', isPlaying: false, audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3' },
    ]
  },
};

export default function MusicPlayerScreen() {
  const { currentMoodAnalysis } = useMood();
  const currentMood = currentMoodAnalysis?.dominantMood?.toLowerCase() || 'moody';
  const playlist = moodPlaylists[currentMood as keyof typeof moodPlaylists] || moodPlaylists.moody;
  
  const [currentSong, setCurrentSong] = useState(playlist.songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeated, setIsRepeated] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  useEffect(() => {
    if (isPlaying) {
      rotation.value = withRepeat(withTiming(360, { duration: 10000 }), -1, false);
    } else {
      rotation.value = withTiming(rotation.value);
    }
  }, [isPlaying]);

  useEffect(() => {
    loadAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [currentSong]);

  const loadAudio = async () => {
    try {
      setIsLoading(true);
      if (sound) {
        await sound.unloadAsync();
      }
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: currentSong.audioUrl },
        { shouldPlay: false }
      );
      
      setSound(newSound);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading audio:', error);
      setIsLoading(false);
    }
  };

  const handlePlayPause = async () => {
    try {
      if (!sound) return;
      
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error playing/pausing audio:', error);
    }
  };

  const handleNext = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
      }
      setIsPlaying(false);
      
      const currentIndex = playlist.songs.findIndex(song => song.id === currentSong.id);
      const nextIndex = (currentIndex + 1) % playlist.songs.length;
      setCurrentSong(playlist.songs[nextIndex]);
    } catch (error) {
      console.error('Error switching to next song:', error);
    }
  };

  const handlePrevious = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
      }
      setIsPlaying(false);
      
      const currentIndex = playlist.songs.findIndex(song => song.id === currentSong.id);
      const prevIndex = currentIndex === 0 ? playlist.songs.length - 1 : currentIndex - 1;
      setCurrentSong(playlist.songs[prevIndex]);
    } catch (error) {
      console.error('Error switching to previous song:', error);
    }
  };

  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    romantic: '💕',
    tired: '😴',
    excited: '🤩',
    lonely: '😔',
    hungry: '🤤',
    moody: '🎭'
  };

  return (
    <LinearGradient
      colors={['#000000', '#0a0a0a']}
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
          <Text style={styles.moodEmoji}>{moodEmojis[currentMood as keyof typeof moodEmojis]}</Text>
          <Text style={styles.title}>{playlist.name}</Text>
          <Text style={styles.subtitle}>
            Perfect music for your {currentMood} mood
          </Text>
        </Animated.View>

        {/* Now Playing Card */}
        <Animated.View 
          entering={FadeInDown.delay(400).springify()}
          style={styles.nowPlayingCard}
        >
          <LinearGradient
            colors={[...playlist.color, 'rgba(0,0,0,0.3)']}
            style={styles.nowPlayingGradient}
          >
            <Animated.View style={[styles.albumArt, animatedStyle]}>
              <LinearGradient
                colors={playlist.color}
                style={styles.albumArtGradient}
              >
                <Text style={styles.albumEmoji}>🎵</Text>
              </LinearGradient>
            </Animated.View>
            
            <Text style={styles.songTitle}>{currentSong.title}</Text>
            <Text style={styles.artistName}>{currentSong.artist}</Text>
            
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '30%' }]} />
              </View>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{currentTime}</Text>
                <Text style={styles.timeText}>{currentSong.duration}</Text>
              </View>
            </View>

            {/* Controls */}
            <View style={styles.controlsContainer}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => setIsShuffled(!isShuffled)}
              >
                <Shuffle size={20} color={isShuffled ? "#ffffff" : "#ffffff60"} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={handlePrevious}
              >
                <SkipBack size={24} color="#ffffff" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.playButton}
                onPress={handlePlayPause}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#ffffff', '#f0f0f0']}
                  style={styles.playButtonGradient}
                >
                  {isLoading ? (
                    <Text style={styles.loadingText}>...</Text>
                  ) : isPlaying ? (
                    <Pause size={28} color="#000000" />
                  ) : (
                    <Play size={28} color="#000000" />
                  )}
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={handleNext}
              >
                <SkipForward size={24} color="#ffffff" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => setIsRepeated(!isRepeated)}
              >
                <Repeat size={20} color={isRepeated ? "#ffffff" : "#ffffff60"} />
              </TouchableOpacity>
            </View>

            {/* Additional Controls */}
            <View style={styles.additionalControls}>
              <TouchableOpacity 
                style={styles.additionalButton}
                onPress={() => setIsLiked(!isLiked)}
              >
                <Heart size={20} color={isLiked ? "#ef4444" : "#ffffff60"} fill={isLiked ? "#ef4444" : "none"} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.additionalButton}>
                <Volume2 size={20} color="#ffffff60" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Playlist */}
        <Animated.View 
          entering={FadeInDown.delay(600).springify()}
          style={styles.playlistSection}
        >
          <Text style={styles.sectionTitle}>Up Next</Text>
          
          {playlist.songs.map((song, index) => (
            <TouchableOpacity
              key={song.id}
              style={[
                styles.songItem,
                currentSong.id === song.id && styles.currentSongItem
              ]}
              onPress={() => setCurrentSong(song)}
            >
              <View style={styles.songInfo}>
                <Text style={[
                  styles.songItemTitle,
                  currentSong.id === song.id && styles.currentSongText
                ]}>
                  {song.title}
                </Text>
                <Text style={styles.songItemArtist}>{song.artist}</Text>
              </View>
              
              <View style={styles.songActions}>
                <Text style={styles.songDuration}>{song.duration}</Text>
                {currentSong.id === song.id && isPlaying && (
                  <View style={styles.playingIndicator}>
                    <View style={styles.playingBar} />
                    <View style={styles.playingBar} />
                    <View style={styles.playingBar} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
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
    marginBottom: 32,
  },
  moodEmoji: {
    fontSize: 60,
    marginBottom: 12,
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
  },
  nowPlayingCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
  },
  nowPlayingGradient: {
    padding: 32,
    alignItems: 'center',
  },
  albumArt: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 24,
    overflow: 'hidden',
  },
  albumArtGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumEmoji: {
    fontSize: 60,
  },
  songTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  artistName: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 32,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 32,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.7,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 24,
  },
  controlButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
  },
  playButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  additionalControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  additionalButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playlistSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  currentSongItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  songInfo: {
    flex: 1,
  },
  songItemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginBottom: 4,
  },
  currentSongText: {
    color: '#3b82f6',
  },
  songItemArtist: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
  },
  songActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  songDuration: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
  },
  playingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  playingBar: {
    width: 3,
    height: 12,
    backgroundColor: '#3b82f6',
  },
  loadingText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    borderRadius: 1.5,
  },
});
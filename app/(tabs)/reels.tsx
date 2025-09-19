import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { 
  Play, 
  Pause, 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal,
  Volume2,
  VolumeX,
  Eye,
  ThumbsUp
} from 'lucide-react-native';
import { useMood } from '../../contexts/MoodContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getYouTubeShortsByMood, getAllYouTubeShorts, YouTubeShort } from '../../data/youtubeData';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ReelsScreen() {
  const { theme } = useTheme();
  const { moodAnalysis } = useMood();
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [likedVideos, setLikedVideos] = useState<string[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  // Animation values
  const heartScale = useSharedValue(1);
  const playButtonRotation = useSharedValue(0);

  // Get recommended YouTube shorts based on current mood
  const getRecommendedReels = (): YouTubeShort[] => {
    if (!moodAnalysis) {
      // If no mood analysis, return a mix of different moods
      return getAllYouTubeShorts();
    }
    
    const currentMood = moodAnalysis.dominantMood;
    const moodBasedShorts = getYouTubeShortsByMood(currentMood);
    
    // If we have shorts for the current mood, return them
    if (moodBasedShorts.length > 0) {
      return moodBasedShorts;
    }
    
    // Fallback to happy videos if no specific mood videos found
    return getYouTubeShortsByMood('happy');
  };

  const recommendedReels = getRecommendedReels();

  useEffect(() => {
    // Auto-play videos immediately when component mounts
    setIsPlaying(true);
    setCurrentReelIndex(0);

    return () => {
      // Cleanup when component unmounts - pause all videos
      pauseAllVideos();
      setIsPlaying(false);
    };
  }, [recommendedReels]);

  useEffect(() => {
    // Handle play/pause state changes
    const currentVideo = recommendedReels[currentReelIndex];
    if (currentVideo && videoRefs.current[currentVideo.id]) {
      if (isPlaying) {
        videoRefs.current[currentVideo.id].playAsync().catch(console.log);
      } else {
        videoRefs.current[currentVideo.id].pauseAsync().catch(console.log);
      }
    }
  }, [isPlaying, currentReelIndex]);

  const videoRefs = useRef<{ [key: string]: Video }>({});

  const togglePlayPause = async () => {
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    
    const currentVideo = recommendedReels[currentReelIndex];
    if (currentVideo && videoRefs.current[currentVideo.id]) {
      try {
        if (newPlayingState) {
          await videoRefs.current[currentVideo.id].playAsync();
        } else {
          await videoRefs.current[currentVideo.id].pauseAsync();
        }
      } catch (error) {
        console.log('Error toggling video playback:', error);
      }
    }
  };

  const handleVideoLoad = (videoId: string, video: Video) => {
    videoRefs.current[videoId] = video;
  };

  const pauseAllVideos = async () => {
    const pausePromises = Object.values(videoRefs.current).map(async (video) => {
      try {
        await video.pauseAsync();
      } catch (error) {
        // Ignore errors for videos that aren't loaded yet
      }
    });
    await Promise.all(pausePromises);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const likeVideo = (videoId: string) => {
    setLikedVideos(prev => {
      if (prev.includes(videoId)) {
        return prev.filter(id => id !== videoId);
      } else {
        return [...prev, videoId];
      }
    });

    // Heart animation
    heartScale.value = withSequence(
      withTiming(1.5, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );
  };

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const playButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${playButtonRotation.value}deg` }],
  }));

  const renderReel = (reel: YouTubeShort, index: number) => (
    <View key={reel.id} style={[styles.reelContainer, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Video Player */}
      <Video
        ref={(ref) => ref && handleVideoLoad(reel.id, ref)}
        source={{ uri: reel.videoUrl }}
        style={styles.videoContainer}
        resizeMode={ResizeMode.COVER}
        shouldPlay={index === currentReelIndex && isPlaying}
        isLooping
        isMuted={isMuted}
        useNativeControls={false}
        playsInSilentModeIOS={true}
        ignoreSilentSwitch="ignore"
      />

      {/* Play/Pause Button Overlay */}
      <TouchableOpacity 
        style={styles.playOverlay}
        onPress={togglePlayPause}
        activeOpacity={0.8}
      >
        {!isPlaying && (
          <View style={styles.playButtonLarge}>
            <Play size={48} color="white" fill="white" />
          </View>
        )}
      </TouchableOpacity>

      {/* Video Overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
        style={styles.videoOverlay}
        pointerEvents="none"
      />

      {/* Content */}
      <View style={styles.contentContainer}>
        <View style={styles.leftContent}>
          <Text style={[styles.title, { color: 'white' }]}>
            {reel.title}
          </Text>
          <Text style={[styles.channel, { color: 'rgba(255,255,255,0.8)' }]}>
            {reel.channel}
          </Text>
          <Text style={[styles.description, { color: 'rgba(255,255,255,0.7)' }]}>
            {reel.description}
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Eye size={16} color="rgba(255,255,255,0.8)" />
              <Text style={[styles.statText, { color: 'rgba(255,255,255,0.8)' }]}>
                {reel.views}
              </Text>
            </View>
            <View style={styles.statItem}>
              <ThumbsUp size={16} color="rgba(255,255,255,0.8)" />
              <Text style={[styles.statText, { color: 'rgba(255,255,255,0.8)' }]}>
                {reel.likes}
              </Text>
            </View>
          </View>
          <View style={[styles.moodBenefitContainer, { backgroundColor: theme.primary + '90' }]}>
            <Text style={[styles.moodBenefit, { color: 'white' }]}>
              💡 {reel.moodBenefit}
            </Text>
          </View>
        </View>

        {/* Right Actions */}
        <View style={styles.rightActions}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
            onPress={() => likeVideo(reel.id)}
          >
            <Animated.View style={heartAnimatedStyle}>
              <Heart 
                size={24} 
                color={likedVideos.includes(reel.id) ? '#ff4757' : 'white'}
                fill={likedVideos.includes(reel.id) ? '#ff4757' : 'transparent'}
              />
            </Animated.View>
            <Text style={[styles.actionText, { color: 'white' }]}>
              {reel.likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
            <MessageCircle size={24} color="white" />
            <Text style={[styles.actionText, { color: 'white' }]}>
              {reel.comments}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
            <Share size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
            <MoreHorizontal size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>


    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        ref={scrollViewRef}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={async (event) => {
          const index = Math.round(event.nativeEvent.contentOffset.y / SCREEN_HEIGHT);
          
          // Pause all videos first
          await pauseAllVideos();
          
          setCurrentReelIndex(index);
          setIsPlaying(true);
          
          // Play the current video after a small delay
          setTimeout(async () => {
            const currentVideo = recommendedReels[index];
            if (currentVideo && videoRefs.current[currentVideo.id]) {
              try {
                await videoRefs.current[currentVideo.id].playAsync();
              } catch (error) {
                console.log('Error playing video:', error);
              }
            }
          }, 100);
        }}
        onScrollBeginDrag={async () => {
          // Pause all videos when user starts scrolling
          await pauseAllVideos();
          setIsPlaying(false);
        }}
      >
        {recommendedReels.map((reel, index) => renderReel(reel, index))}
      </ScrollView>

      {/* Mood Indicator */}
      <View style={[styles.moodIndicator, { backgroundColor: theme.primary + '90' }]}>
        <Text style={styles.moodText}>
          🎵 Curated for your {moodAnalysis?.dominantMood || 'Current'} mood
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reelContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'relative',
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  playButtonLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  contentContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    zIndex: 2,
  },
  leftContent: {
    flex: 1,
    paddingRight: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  channel: {
    fontSize: 16,
    marginBottom: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  moodBenefitContainer: {
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  moodBenefit: {
    fontSize: 14,
    fontWeight: '600',
  },
  rightActions: {
    alignItems: 'center',
    gap: 20,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  videoInfoBadge: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 2,
  },
  videoInfoText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  moodIndicator: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  moodText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
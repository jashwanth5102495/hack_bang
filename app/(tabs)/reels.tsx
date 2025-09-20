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
// Local video data structure
interface LocalVideo {
  id: string;
  title: string;
  description: string;
  videoPath: any;
  mood: string;
  therapeuticFor: string[];
  views: string;
  likes: string;
  comments: string;
  moodBenefit: string;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Local video database with therapeutic mapping
const localVideos: LocalVideo[] = [
  // Calming videos for angry mood
  {
    id: 'funny-gym-fails',
    title: 'Funny Gym Fails',
    description: 'Hilarious gym moments to lighten your mood',
    videoPath: require('../../videos/angry/Funny_videos_Try_not_to_laugh_funny_videos_gym_funny_fails_EP_17 [mBofSI8PjvY].webm'),
    mood: 'angry',
    therapeuticFor: ['angry', 'stressed'],
    views: '2.1M',
    likes: '45K',
    comments: '1.2K',
    moodBenefit: 'Laughter helps reduce stress and anger'
  },
  {
    id: 'couple-comedy',
    title: 'Couple Comedy',
    description: 'Sweet and funny couple moments',
    videoPath: require('../../videos/angry/I_m_SO_sorry_couplecomedy_couple_couples [eeVyahwfnIY].webm'),
    mood: 'angry',
    therapeuticFor: ['angry', 'lonely'],
    views: '1.8M',
    likes: '38K',
    comments: '890',
    moodBenefit: 'Positive relationships content to calm anger'
  },
  {
    id: 'cooking-asmr',
    title: 'Relaxing Cooking ASMR',
    description: 'Soothing cooking sounds and visuals',
    videoPath: require('../../videos/angry/Matka_Chicken_ASMR_Cooking_shorts_crunchytreats_cooking_asmrcooking_food_recipe_nonveg [uDhhd4tY7KE].webm'),
    mood: 'angry',
    therapeuticFor: ['angry', 'stressed', 'tired'],
    views: '3.2M',
    likes: '67K',
    comments: '2.1K',
    moodBenefit: 'ASMR helps reduce stress and promotes calmness'
  },
  {
    id: 'rope-swing-fails',
    title: 'Rope Swing Fails',
    description: 'Funny outdoor adventure fails',
    videoPath: require('../../videos/angry/Rope_Swings_Never_Fail_to_Disappoint_funny_afv_fall_fail [vRCJFsocpy0].webm'),
    mood: 'angry',
    therapeuticFor: ['angry', 'moody'],
    views: '1.5M',
    likes: '32K',
    comments: '756',
    moodBenefit: 'Light-hearted content to shift focus from anger'
  },
  {
    id: 'sigma-motivation',
    title: 'Motivational Quotes',
    description: 'Inspiring quotes for inner strength',
    videoPath: require('../../videos/angry/SIGMA_MALE_SIGMA_RULE_MOTIVATION_QUOTES_shorts_viral_ytshorts_trending_motivation_yt [vjs2I3VFQlg].webm'),
    mood: 'angry',
    therapeuticFor: ['angry', 'sad', 'tired'],
    views: '4.1M',
    likes: '89K',
    comments: '3.4K',
    moodBenefit: 'Motivation helps channel anger into positive energy'
  },
  
  // Happy mood videos
  {
    id: 'cat-magic-trick',
    title: 'Amazing Cat Magic',
    description: 'Adorable cat performing magic tricks',
    videoPath: require('../../videos/happy/Amazing_Cat_Performs_Magic_Trick_Cats_Tricks [EM41yq0OUQ4].webm'),
    mood: 'happy',
    therapeuticFor: ['happy', 'excited'],
    views: '2.8M',
    likes: '56K',
    comments: '1.8K',
    moodBenefit: 'Cute animals boost happiness and joy'
  },
  {
    id: 'holiday-baking',
    title: 'Holiday Baking Fun',
    description: 'Festive baking and cooking content',
    videoPath: require('../../videos/happy/Can_finally_start_on_my_Holiday_BAKING_reels_fyp_food_youtubeshorts_christmas_cookies [XPEzNV7zA1Q].webm'),
    mood: 'happy',
    therapeuticFor: ['happy', 'excited', 'romantic'],
    views: '1.9M',
    likes: '41K',
    comments: '1.1K',
    moodBenefit: 'Creative activities enhance positive emotions'
  },
  {
    id: 'funny-animals',
    title: 'Funny Animals 2021',
    description: 'Compilation of hilarious animal moments',
    videoPath: require('../../videos/happy/funny_animals_video_2021 [-TjojsxYU6U].webm'),
    mood: 'happy',
    therapeuticFor: ['happy', 'sad', 'lonely'],
    views: '5.2M',
    likes: '98K',
    comments: '4.2K',
    moodBenefit: 'Animal videos reduce stress and increase happiness'
  },
  {
    id: 'dance-performance',
    title: 'Energetic Dance',
    description: 'Fun and energetic dance performance',
    videoPath: require('../../videos/happy/Thumak_Thumak_Jaani_Aa_dance_abcddancefactory_funnydance_funnyvideo_shorts [xHVgQBB74vc].webm'),
    mood: 'happy',
    therapeuticFor: ['happy', 'excited', 'tired'],
    views: '3.1M',
    likes: '72K',
    comments: '2.3K',
    moodBenefit: 'Dance and music boost energy and mood'
  },
  {
    id: 'tiktok-trend',
    title: 'TikTok Dance Trend',
    description: 'Popular dance trend performance',
    videoPath: require('../../videos/happy/TIKTOK_TREND_Ashley_Look_At_Me_bobodancestudio [JAeVcLPP8kI].webm'),
    mood: 'happy',
    therapeuticFor: ['happy', 'excited', 'moody'],
    views: '2.7M',
    likes: '58K',
    comments: '1.9K',
    moodBenefit: 'Trending content creates connection and joy'
  },

  // Hungry videos
  {
    id: 'avocado-breakfast',
    title: 'Healthy Breakfast Prep',
    description: 'Quick and nutritious breakfast ideas',
    videoPath: require('../../videos/hungry/Avocado_egg_breakfast_meal_prep_-_10_mins_prep_290_calories_15g_protein_FeelGoodFoodie [y3GK-ahxpL4].webm'),
    mood: 'hungry',
    therapeuticFor: ['hungry', 'tired'],
    views: '1.4M',
    likes: '28K',
    comments: '567',
    moodBenefit: 'Healthy food content satisfies hunger cravings'
  },
  {
    id: 'chickpea-salad',
    title: 'Quick Chickpea Salad',
    description: 'Easy and filling meal prep',
    videoPath: require('../../videos/hungry/Chickpea_Salad_Quick_easy_meal_prep [MNOSIdSR0g0].webm'),
    mood: 'hungry',
    therapeuticFor: ['hungry', 'tired'],
    views: '980K',
    likes: '19K',
    comments: '234',
    moodBenefit: 'Satisfying meal ideas help with hunger'
  },
  {
    id: 'weight-loss-recipe',
    title: 'High Protein Breakfast',
    description: 'Healthy weight loss recipe',
    videoPath: require('../../videos/hungry/Easy_Weight_Loss_Recipe_High_Protein_Low_Effort_meal_idea_weightlossdiet_healthybreakfast [HKu5WA6dNcc].webm'),
    mood: 'hungry',
    therapeuticFor: ['hungry', 'tired'],
    views: '2.1M',
    likes: '42K',
    comments: '890',
    moodBenefit: 'Nutritious recipes satisfy hunger healthily'
  },
  {
    id: 'protein-salad',
    title: 'High Protein Salad',
    description: 'Filling and nutritious salad recipe',
    videoPath: require('../../videos/hungry/High_Protein_Salad [jxP2e9J_0Ew].webm'),
    mood: 'hungry',
    therapeuticFor: ['hungry'],
    views: '1.2M',
    likes: '24K',
    comments: '456',
    moodBenefit: 'Protein-rich foods help satisfy hunger'
  },
  {
    id: 'keto-breakfast',
    title: 'Keto Breakfast Prep',
    description: 'Low carb high protein breakfast',
    videoPath: require('../../videos/hungry/High_protein_low_carb_low_calorie_keto_breakfast_meal_prep_mealprep_healthybreakfast_eggs [f0E0p1R26Vk].webm'),
    mood: 'hungry',
    therapeuticFor: ['hungry', 'tired'],
    views: '1.7M',
    likes: '35K',
    comments: '678',
    moodBenefit: 'Satisfying keto recipes curb hunger'
  },

  // Moody videos
  {
    id: 'mystery-box',
    title: 'Mystery Box Skit',
    description: 'Funny comedy skit about surprises',
    videoPath: require('../../videos/moody/What_was_in_the_box_skit_funny_comedy_skits_sotrue_satire_shorts [AeA0fecdbEE].webm'),
    mood: 'moody',
    therapeuticFor: ['moody', 'angry'],
    views: '2.3M',
    likes: '48K',
    comments: '1.2K',
    moodBenefit: 'Comedy skits help lighten mood'
  },


  // Romantic videos
  {
    id: 'tight-hug',
    title: 'A Tight Hug',
    description: 'Sweet romantic moment',
    videoPath: require('../../videos/romantic/A_tight_hug_shorts [q3Nj9ZMSw4I].webm'),
    mood: 'romantic',
    therapeuticFor: ['romantic', 'lonely'],
    views: '5.1M',
    likes: '98K',
    comments: '4.2K',
    moodBenefit: 'Romantic content enhances loving feelings'
  },
  {
    id: 'cute-couple',
    title: 'Cute Couple Moments',
    description: 'She is not dangerous but cute',
    videoPath: require('../../videos/romantic/She_is_not_dangerous_but.._cute_couple_trending_love_romantic_forever_reels_couple_shorts [R8KNqYBQIm0].webm'),
    mood: 'romantic',
    therapeuticFor: ['romantic', 'happy'],
    views: '3.7M',
    likes: '72K',
    comments: '2.8K',
    moodBenefit: 'Cute couple content spreads love'
  },
  {
    id: 'eye-contact',
    title: 'Unforgettable Eye Contact',
    description: 'Some eye contacts are unforgettable',
    videoPath: require('../../videos/romantic/Some_eye_contacts_are_unforgettable_aestheticstatus_aesthetic_eyecontacts_youtubeshorts_love [dB7ZrNXASsw].webm'),
    mood: 'romantic',
    therapeuticFor: ['romantic'],
    views: '6.2M',
    likes: '124K',
    comments: '5.1K',
    moodBenefit: 'Aesthetic romantic content inspires love'
  },
  {
    id: 'holding-hands',
    title: 'Beauty of Holding Hands',
    description: 'The beauty of holding hands',
    videoPath: require('../../videos/romantic/The_beauty_of_Holding_Hands_Love_whatsapp_status_Slowed_and_Reverb_song_shorts_love_song [XZqul8h6E-k].webm'),
    mood: 'romantic',
    therapeuticFor: ['romantic', 'lonely'],
    views: '4.8M',
    likes: '89K',
    comments: '3.6K',
    moodBenefit: 'Romantic gestures inspire connection'
  },
  {
    id: 'vibe-baby',
    title: 'Vibe Hai Baby',
    description: 'Romantic dance performance',
    videoPath: require('../../videos/romantic/Vibe_Hai_Baby_Mirai_Teja_Sajja_Ritika_Nayak_love_shorts_short_ytshorts_@ytmusic.x [QaA_AGvb8x0].webm'),
    mood: 'romantic',
    therapeuticFor: ['romantic', 'happy'],
    views: '2.9M',
    likes: '58K',
    comments: '1.9K',
    moodBenefit: 'Romantic dance content spreads joy'
  },

  // Sad videos (motivational to help)
  {
    id: 'remember-motivation',
    title: 'Remember This',
    description: 'Motivational quotes for tough times',
    videoPath: require('../../videos/sad/Remember_motivation_mindset_quotes_hardwork_discipline_shorts [2liO8zHVGBs].webm'),
    mood: 'sad',
    therapeuticFor: ['sad', 'tired'],
    views: '7.2M',
    likes: '145K',
    comments: '6.8K',
    moodBenefit: 'Motivation helps overcome sadness'
  },
  {
    id: 'failure-mindset',
    title: 'Success vs Normal People',
    description: 'Different perspectives on failure',
    videoPath: require('../../videos/sad/Successful_and_Normal_people_on_Failure_Chris_Williamson_Motivation [O-tGIpa-YNc].webm'),
    mood: 'sad',
    therapeuticFor: ['sad', 'angry'],
    views: '4.1M',
    likes: '82K',
    comments: '3.2K',
    moodBenefit: 'Reframing failure helps with sadness'
  },
  {
    id: 'jack-ma-motivation',
    title: 'Today is Difficult',
    description: 'Jack Ma motivational words',
    videoPath: require('../../videos/sad/Today_is_DIFFICULT_Jack_Ma_Motivation_Shorts [Kj7GQtkSKEA].webm'),
    mood: 'sad',
    therapeuticFor: ['sad', 'tired'],
    views: '8.9M',
    likes: '178K',
    comments: '7.4K',
    moodBenefit: 'Inspirational content lifts spirits'
  },
  {
    id: 'mom-said-handsome',
    title: 'Mom Said I Look Handsome',
    description: 'Self-confidence and transformation',
    videoPath: require('../../videos/sad/but_mom_said_i_look_handsome_fyp_glowup_transformation_trendingreels_30daychallenge [nHIzZIhxDKY].webm'),
    mood: 'sad',
    therapeuticFor: ['sad', 'lonely'],
    views: '3.4M',
    likes: '68K',
    comments: '2.1K',
    moodBenefit: 'Self-love content boosts confidence'
  },
  {
    id: 'road-trip-nature',
    title: 'Beautiful Road Trip',
    description: 'Cinematic nature and travel content',
    videoPath: require('../../videos/sad/road_trip_editing_editing_viral_shorts_video_edit_videoediting_nature_cenimaticvideo [ORRIEs44c38].webm'),
    mood: 'sad',
    therapeuticFor: ['sad', 'tired'],
    views: '2.7M',
    likes: '54K',
    comments: '1.8K',
    moodBenefit: 'Nature content provides peace and calm'
  },

  // Tired videos (relaxing and energizing)
  {
    id: 'cupping-asmr',
    title: 'ASMR Cupping Therapy',
    description: 'Relaxing cupping therapy sounds',
    videoPath: require('../../videos/tired/ASMR_Cupping_Therapy_with_super_Cups_asmr_cuppingtherapy_massage_youtubeshorts [Nu6fh40JrWM].webm'),
    mood: 'tired',
    therapeuticFor: ['tired', 'stressed'],
    views: '1.8M',
    likes: '36K',
    comments: '890',
    moodBenefit: 'ASMR content promotes relaxation'
  },
  {
    id: 'glass-breaking',
    title: 'Satisfying Glass Breaking',
    description: 'Crushing and breaking sounds',
    videoPath: require('../../videos/tired/Breaking_glass_bottle_Crushing_Crunchy_Soft_Things_asmr_shorts_asmrsound_satisfyingvideos [Y349scaCnyg].webm'),
    mood: 'tired',
    therapeuticFor: ['tired', 'stressed'],
    views: '4.2M',
    likes: '84K',
    comments: '2.1K',
    moodBenefit: 'Satisfying sounds help with stress relief'
  },
  {
    id: 'boiled-eggs-asmr',
    title: 'Boiled Eggs ASMR',
    description: 'ISSEI funny memory with eggs',
    videoPath: require('../../videos/tired/ISSEI_funny_memory_Boiled_Eggs_ASMR [dAcBCijos2s].webm'),
    mood: 'tired',
    therapeuticFor: ['tired', 'hungry'],
    views: '3.1M',
    likes: '62K',
    comments: '1.4K',
    moodBenefit: 'Food ASMR provides comfort'
  },
  {
    id: 'upgrade-yourself',
    title: 'Upgrade Yourself',
    description: 'Motivational content by Gaur Gopal Das',
    videoPath: require('../../videos/tired/Make_upgrade_yourself_gaur_gopal_das_motivation_shorts_ytshorts_motivational_trending [yEp962x_ma8].webm'),
    mood: 'tired',
    therapeuticFor: ['tired', 'sad'],
    views: '5.7M',
    likes: '114K',
    comments: '4.8K',
    moodBenefit: 'Motivational content energizes and inspires'
  },
  {
    id: 'good-advice',
    title: 'What Is Good Advice',
    description: 'Life advice and wisdom',
    videoPath: require('../../videos/tired/What_Is_Some_Good_Advice [7fLqPBK_Z9o].webm'),
    mood: 'tired',
    therapeuticFor: ['tired', 'sad'],
    views: '2.9M',
    likes: '58K',
    comments: '1.7K',
    moodBenefit: 'Wisdom content provides mental clarity'
  },
  {
    id: 'what-matters',
    title: 'What Really Matters',
    description: 'An old mans secret about life',
    videoPath: require('../../videos/tired/What_Really_Matters_in_Life_-_An_Old_Man_s_Secret [fXQuHSmEa1U].webm'),
    mood: 'tired',
    therapeuticFor: ['tired', 'sad'],
    views: '6.8M',
    likes: '136K',
    comments: '5.2K',
    moodBenefit: 'Life wisdom helps with perspective'
  }
];

// Therapeutic mood mapping - what videos to show for each mood
const therapeuticMapping: { [key: string]: string[] } = {
  'angry': ['angry'], // Show calming content for angry users
  'sad': ['sad', 'happy'], // Show uplifting content for sad users
  'tired': ['tired', 'happy'], // Show energizing content for tired users
  'lonely': ['romantic', 'happy'], // Show connecting content for lonely users
  'stressed': ['tired', 'angry'], // Show relaxing content for stressed users
  'moody': ['moody', 'happy'], // Show mood-lifting content
  'excited': ['happy'], // Show matching energy content
  'happy': ['happy'], // Show reinforcing content
  'romantic': ['romantic'], // Show romantic content
  'hungry': ['hungry'], // Show satisfying content
  'default': ['happy', 'angry'] // Default mix
};

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

  // Get recommended local videos based on current mood (therapeutic approach)
  const getRecommendedReels = (): LocalVideo[] => {
    if (!moodAnalysis) {
      // If no mood analysis, return a mix of different moods
      return localVideos;
    }
    
    const currentMood = moodAnalysis.dominantMood.toLowerCase();
    const therapeuticMoods = therapeuticMapping[currentMood] || therapeuticMapping['default'];
    
    // Filter videos that are therapeutic for the current mood
    const therapeuticVideos = localVideos.filter(video => 
      video.therapeuticFor.includes(currentMood) || 
      therapeuticMoods.includes(video.mood)
    );
    
    // If we have therapeutic videos, return them, otherwise return all videos
    return therapeuticVideos.length > 0 ? therapeuticVideos : localVideos;
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

  const renderReel = (reel: LocalVideo, index: number) => (
    <View key={reel.id} style={[styles.reelContainer, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Video Player */}
      <Video
        ref={(ref) => ref && handleVideoLoad(reel.id, ref)}
        source={reel.videoPath}
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
            Mood: {reel.mood}
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
import React from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  interpolate,
  Extrapolate,
  runOnJS
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

interface SwipeCardProps {
  item: {
    id: string;
    title: string;
    emoji?: string;
    artist?: string;
    genre?: string;
    mood?: string;
    image?: any;
    gradient: string[];
    description?: string;
    content?: string;
    benefits?: string[];
  };
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isActive: boolean;
}

export default function SwipeCard({ item, onSwipeLeft, onSwipeRight, isActive }: SwipeCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(isActive ? 1 : 0.95);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (!isActive) return;
      
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.3;
      rotate.value = interpolate(
        event.translationX,
        [-width / 2, 0, width / 2],
        [-15, 0, 15],
        Extrapolate.CLAMP
      );
    })
    .onEnd((event) => {
      if (!isActive) return;
      
      const threshold = width * 0.3;
      
      if (event.translationX > threshold) {
        // Swipe right - like
        translateX.value = withSpring(width * 1.5, { damping: 15 });
        runOnJS(onSwipeRight)();
      } else if (event.translationX < -threshold) {
        // Swipe left - dislike
        translateX.value = withSpring(-width * 1.5, { damping: 15 });
        runOnJS(onSwipeLeft)();
      } else {
        // Return to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, width * 0.5],
      [1, 0.3],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate.value}deg` },
        { scale: scale.value },
      ],
      opacity,
    };
  });

  const likeIndicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, width * 0.3],
      [0, 1],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  const dislikeIndicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-width * 0.3, 0],
      [1, 0],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  React.useEffect(() => {
    scale.value = withSpring(isActive ? 1 : 0.95);
  }, [isActive]);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, animatedStyle]}>
        {item.image ? (
          <ImageBackground
            source={item.image}
            style={styles.cardBackground}
            resizeMode="cover"
          >
            <LinearGradient
              colors={item.gradient}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Like Indicator */}
              <Animated.View style={[styles.indicator, styles.likeIndicator, likeIndicatorStyle]}>
                <Text style={styles.indicatorText}>LIKE</Text>
              </Animated.View>

              {/* Dislike Indicator */}
              <Animated.View style={[styles.indicator, styles.dislikeIndicator, dislikeIndicatorStyle]}>
                <Text style={styles.indicatorText}>PASS</Text>
              </Animated.View>

              {/* Card Content */}
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  {item.emoji && (
                    <Text style={styles.cardEmoji}>{item.emoji}</Text>
                  )}
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  {item.artist && (
                    <Text style={styles.cardArtist}>{item.artist}</Text>
                  )}
                </View>

                <View style={styles.cardBody}>
                  {item.content && (
                    <Text style={styles.cardDescription}>{item.content}</Text>
                  )}
                  
                  {item.benefits && (
                    <View style={styles.benefitsContainer}>
                      {item.benefits.map((benefit, index) => (
                        <View key={index} style={styles.benefitItem}>
                          <Text style={styles.benefitText}>• {benefit}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  
                  <View style={styles.tagContainer}>
                    {item.mood && (
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>{item.mood}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        ) : (
          <LinearGradient
            colors={item.gradient}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Fallback content for cards without images */}
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
              </View>
            </View>
          </LinearGradient>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: width - 40,
    height: height * 0.7,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
  },
  cardBackground: {
    flex: 1,
  },
  cardGradient: {
    flex: 1,
    position: 'relative',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  cardHeader: {
    alignItems: 'center',
    marginTop: 40,
  },
  cardEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 32,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cardArtist: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  cardBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  benefitsContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  benefitItem: {
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  indicator: {
    position: 'absolute',
    top: 60,
    zIndex: 3,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 3,
  },
  likeIndicator: {
    right: 20,
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  dislikeIndicator: {
    left: 20,
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  indicatorText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});
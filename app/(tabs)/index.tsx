import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, ImageBackground, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Users, MessageCircle, Zap, TrendingUp, Moon, Sun, Music, UtensilsCrossed, UserCircle, ShoppingCart } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import CircularDishCards from '../../components/CircularDishCards';
import MoodRecommendations from '../../components/MoodRecommendations';
import ScrollingMoodQuotes from '../../components/ScrollingMoodQuotes';
import FoodActionPopup from '../../components/FoodActionPopup';
import { useMood } from '../../contexts/MoodContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useCart } from '../../contexts/CartContext';
import realtimeService from '../../services/realtime';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { toggleTheme, isDark } = useTheme();
  const { getTotalItems } = useCart();
  const { isConnectedToRealtime, friendMoodUpdates, realtimeRecommendations } = useMood();
  const [showFoodPopup, setShowFoodPopup] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);

  // Real-time activity tracking
  useEffect(() => {
    // Track user activity
    const trackActivity = (activity: string) => {
      if (realtimeService.isConnectedToServer()) {
        realtimeService.sendActivityUpdate({
          userId: 'current-user',
          activity,
          timestamp: new Date().toISOString()
        });
      }
    };

    // Listen for activity updates
    realtimeService.onActivityUpdate((data) => {
      setRecentActivity(prev => [
        `${data.activity} - ${new Date(data.timestamp).toLocaleTimeString()}`,
        ...prev.slice(0, 4) // Keep only last 5 activities
      ]);
    });

    // Track page visit
    trackActivity('Visited Home Screen');

    return () => {
      // Cleanup handled by realtime service
    };
  }, []);

  const quickActions = useMemo(() => [
    { 
      icon: Zap, 
      title: 'Detect Mood', 
      subtitle: 'Quick mood check', 
      route: '/mood', 
      image: require('../../img/happy.png'),
      backgroundColor: '#8B5CF6',
      iconBg: 'rgba(139, 92, 246, 0.8)'
    },
    { 
      icon: Users, 
      title: 'Find Friends', 
      subtitle: 'Meet nearby users', 
      route: '/friends', 
      image: require('../../img/Excited.png'), // Using excited mood image for friends
      backgroundColor: '#EC4899',
      iconBg: 'rgba(236, 72, 153, 0.8)'
    },
    { 
      icon: TrendingUp, 
      title: 'Movies', 
      subtitle: 'Theater & streaming', 
      route: '/movies', 
      image: require('../../img/movie.png'),
      backgroundColor: '#F59E0B',
      iconBg: 'rgba(245, 158, 11, 0.8)'
    },
  ], []);

  const moodStats = useMemo(() => [
    { label: 'Sessions', value: '12', color: '#3b82f6' },
    { label: 'Connections', value: '8', color: '#06b6d4' },
    { label: 'Streak', value: '5 days', color: '#10b981' },
  ], []);

  return (
    <LinearGradient
      colors={['#000000', '#0a0a0a', '#111111'] as const}
      style={styles.container}
    >
      {/* Top Navigation Icons */}
      <View style={styles.topNavigation}>
        <View style={styles.topNavLeft}>
          <TouchableOpacity 
            style={styles.topNavIcon}
            onPress={toggleTheme}
          >
            {isDark ? <Sun size={24} color="#ffffff" /> : <Moon size={24} color="#ffffff" />}
          </TouchableOpacity>
        </View>
        <View style={styles.topNavRight}>
          <TouchableOpacity 
            style={styles.topNavIcon}
            onPress={() => router.push('/music')}
          >
            <Music size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.topNavIcon}
            onPress={() => setShowFoodPopup(true)}
          >
            <UtensilsCrossed size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.topNavIcon, { position: 'relative' }]}
            onPress={() => router.push('/cart')}
          >
            <ShoppingCart size={24} color="#ffffff" />
            {getTotalItems() > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.topNavIcon}
            onPress={() => router.push('/profile')}
          >
            <UserCircle size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ScrollingMoodQuotes />
        
        <Animated.View 
          entering={FadeInLeft.delay(200).springify()}
          style={styles.header}
        >
          <Text style={styles.subtitle}>Welcome back! Ready to explore?</Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(400).springify()}
          style={styles.statsContainer}
        >
          <Text style={styles.sectionTitle}>Your Wellness Journey</Text>
          <View style={styles.statsRow}>
            {moodStats.map((stat, index) => (
              <View key={stat.label} style={styles.statCard}>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
          
          {/* Real-time Status Indicator */}
          <View style={styles.realtimeStatus}>
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot, { backgroundColor: isConnectedToRealtime ? '#10b981' : '#ef4444' }]} />
              <Text style={styles.statusText}>
                {isConnectedToRealtime ? 'Live Connected' : 'Offline'}
              </Text>
            </View>
            {friendMoodUpdates.length > 0 && (
              <Text style={styles.friendUpdates}>
                {friendMoodUpdates.length} friend{friendMoodUpdates.length > 1 ? 's' : ''} active
              </Text>
            )}
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(600).springify()}
          style={styles.quickActionsContainer}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.title}
                style={styles.actionCard}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.8}
              >
                <ImageBackground
                  source={action.image}
                  style={styles.actionImageBackground}
                  imageStyle={styles.actionImage}
                >
                  <View style={styles.actionOverlay}>
                    <View style={[styles.iconContainer, { backgroundColor: action.iconBg }]}>
                      <action.icon size={28} color="#ffffff" />
                    </View>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>



        <CircularDishCards 
          onDishSelect={(dish) => {
            console.log('Selected dish:', dish);
          }}
        />

        <MoodRecommendations />

        <Animated.View 
          entering={FadeInDown.delay(800).springify()}
          style={styles.recentActivityContainer}
        >
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <MessageCircle size={20} color="#3b82f6" />
              <Text style={styles.activityTitle}>New Connection</Text>
            </View>
            <Text style={styles.activityText}>
              You matched with Sarah who's also feeling creative today
            </Text>
            <TouchableOpacity style={styles.activityButton}>
              <Text style={styles.activityButtonText}>Start Chat</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      <FoodActionPopup
        visible={showFoodPopup}
        onClose={() => setShowFoodPopup(false)}
        onCook={() => {
          setShowFoodPopup(false);
          router.push('/cook-dishes');
        }}
        onOrder={() => {
          setShowFoodPopup(false);
          router.push('/order-dishes');
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topNavigation: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  topNavLeft: {
    flexDirection: 'row',
    gap: 16,
  },
  topNavRight: {
    flexDirection: 'row',
    gap: 16,
  },
  topNavIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  scrollContent: {
    paddingBottom: 120, // Extra space for floating navigation
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginBottom: 20,
  },
  currentMoodContainer: {
    alignItems: 'flex-start',
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  moodEmoji: {
    fontSize: 20,
    marginRight: 4,
  },
  moodText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  moodDetailsContainer: {
    marginTop: 12,
    alignItems: 'flex-start',
  },
  moodDetailsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginBottom: 4,
  },
  moodTimestamp: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#71717a',
  },
  statsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#a1a1aa',
  },
  quickActionsContainer: {
    marginBottom: 32,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 64) / 2,
    height: (width - 64) / 2,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionImageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionImage: {
    borderRadius: 20,
  },
  actionOverlay: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent overlay for better text readability
    borderRadius: 20,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  actionSubtitle: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.95,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  realtimeStatus: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  friendUpdates: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
  },
  recentActivityContainer: {
    marginBottom: 40,
  },
  activityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  activityText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    lineHeight: 20,
    marginBottom: 16,
  },
  activityButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  activityButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});
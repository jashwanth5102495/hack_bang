import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Users, MessageCircle, Zap, TrendingUp, Palette, ChefHat, Music } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import CircularDishCards from '../../components/CircularDishCards';
import MoodRecommendations from '../../components/MoodRecommendations';
import ScrollingMoodQuotes from '../../components/ScrollingMoodQuotes';
import MoodCards from '../../components/MoodCards';
import { useMood } from '../../contexts/MoodContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { currentMoodAnalysis, getMusicRecommendations, setMoodAnalysis } = useMood();
  
  const currentMood = currentMoodAnalysis?.dominantMood || 'Unknown';
  const musicRecommendations = getMusicRecommendations();

  const handleMoodSelect = (mood: any) => {
    // Update mood analysis when user selects a mood
    const newMoodAnalysis = {
      dominantMood: mood.mood,
      dominantGenre: 'Mixed',
      likedCount: 1,
      timestamp: Date.now()
    };
    setMoodAnalysis(newMoodAnalysis);
  };

  const quickActions = [
    { icon: Zap, title: 'Detect Mood', subtitle: 'Quick mood check', route: '/mood', gradient: ['#8b5cf6', '#06b6d4'] },
    { icon: Users, title: 'Find Friends', subtitle: 'Mood-based matching', route: '/connect', gradient: ['#ec4899', '#8b5cf6'] },
  ];

  const moodStats = [
    { label: 'Sessions', value: '12', color: '#3b82f6' },
    { label: 'Connections', value: '8', color: '#06b6d4' },
    { label: 'Streak', value: '5 days', color: '#10b981' },
  ];

  return (
    <LinearGradient
      colors={['#000000', '#0a0a0a', '#1a1a1a']}
      style={styles.container}
    >
      {/* Top Navigation Icons */}
      <View style={styles.topNavigation}>
        <View style={styles.topNavLeft}>
          <TouchableOpacity 
            style={styles.topNavIcon}
            onPress={() => router.push('/mood')}
          >
            <ChefHat size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.topNavIcon}
            onPress={() => router.push('/recommendations')}
          >
            <Music size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <View style={styles.topNavRight}>
          <TouchableOpacity 
            style={styles.topNavIcon}
            onPress={() => {/* Theme switching logic */}}
          >
            <Palette size={24} color="#ffffff" />
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
          <Text style={styles.subtitle}>How are you feeling today?</Text>
          
          <View style={styles.currentMoodContainer}>
            <LinearGradient
              colors={['#3b82f620', '#8b5cf620']}
              style={styles.moodBadge}
            >
              <Zap size={16} color="#3b82f6" />
              <Text style={styles.moodText}>Current mood: {currentMood}</Text>
            </LinearGradient>
            
            {currentMoodAnalysis && (
              <View style={styles.moodDetailsContainer}>
                <Text style={styles.moodDetailsText}>
                  Confidence: {Math.round((currentMoodAnalysis.confidence || 0.85) * 100)}%
                </Text>
                {currentMoodAnalysis.timestamp && (
                  <Text style={styles.moodTimestamp}>
                    Analyzed {new Date(currentMoodAnalysis.timestamp).toLocaleTimeString()}
                  </Text>
                )}
              </View>
            )}
          </View>
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
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(600).springify()}
          style={styles.quickActionsContainer}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={action.title}
                style={styles.actionCard}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={action.gradient}
                  style={styles.actionGradient}
                >
                  <action.icon size={24} color="#ffffff" />
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <MoodCards onMoodSelect={handleMoodSelect} />

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
  moodText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3b82f6',
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
    gap: 12,
  },
  actionCard: {
    width: (width - 60) / 2,
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
  },
  actionGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.8,
    textAlign: 'center',
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
});
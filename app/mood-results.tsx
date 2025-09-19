import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Music, ArrowLeft, Play, Users, Brain, Clock } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import { useMood } from '../contexts/MoodContext';

const { width } = Dimensions.get('window');

const moodContent = {
  happy: {
    color: ['#fbbf24', '#f59e0b'],
    emoji: '😊',
    music: ['Upbeat Pop Hits', 'Feel Good Classics', 'Happy Vibes']
  },
  sad: {
    color: ['#3b82f6', '#1e40af'],
    emoji: '😢',
    music: ['Comfort Songs', 'Healing Melodies', 'Gentle Piano']
  },
  tired: {
    color: ['#6b7280', '#374151'],
    emoji: '😴',
    music: ['Relaxing Instrumentals', 'Sleep Sounds', 'Ambient Chill']
  },
  // Add more moods as needed
};

export default function MoodResultsScreen() {
  const { mood, selectedMoods } = useLocalSearchParams();
  const { currentMoodAnalysis } = useMood();
  const moodData = moodContent[mood as keyof typeof moodContent] || moodContent.happy;

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
          <Text style={styles.moodEmoji}>{moodData.emoji}</Text>
          <Text style={styles.title}>You're feeling {mood}</Text>
          <Text style={styles.subtitle}>
            Here's what we recommend for your current mood
          </Text>
          
          {currentMoodAnalysis && (
            <View style={styles.analysisCard}>
              <View style={styles.analysisHeader}>
                <Brain size={20} color="#8b5cf6" />
                <Text style={styles.analysisTitle}>AI Analysis Results</Text>
              </View>
              <View style={styles.analysisDetails}>
                <Text style={styles.analysisText}>
                  Confidence: {Math.round((currentMoodAnalysis.confidence || 0.85) * 100)}%
                </Text>
                {currentMoodAnalysis.timestamp && (
                  <View style={styles.timestampContainer}>
                    <Clock size={14} color="#a1a1aa" />
                    <Text style={styles.timestampText}>
                      Analyzed at {new Date(currentMoodAnalysis.timestamp).toLocaleString()}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(400).springify()}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Music size={24} color="#3b82f6" />
            <Text style={styles.sectionTitle}>Music Therapy</Text>
          </View>
          
          {moodData.music.map((playlist, index) => (
            <TouchableOpacity key={playlist} style={styles.musicCard}>
              <LinearGradient
                colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
                style={styles.cardContent}
              >
                <Play size={20} color="#3b82f6" />
                <Text style={styles.cardTitle}>{playlist}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </Animated.View>



        <Animated.View 
          entering={FadeInDown.delay(800).springify()}
          style={styles.section}
        >
          <TouchableOpacity 
            style={styles.connectButton}
            onPress={() => router.push('/connect')}
          >
            <LinearGradient
              colors={['#ec4899', '#8b5cf6']}
              style={styles.connectGradient}
            >
              <Users size={24} color="#ffffff" />
              <Text style={styles.connectTitle}>Find Others Like You</Text>
              <Text style={styles.connectSubtitle}>
                Connect with people who share your current mood
              </Text>
            </LinearGradient>
          </TouchableOpacity>
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
    marginBottom: 40,
  },
  moodEmoji: {
    fontSize: 80,
    marginBottom: 16,
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
    paddingHorizontal: 20,
  },
  analysisCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  analysisTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#8b5cf6',
  },
  analysisDetails: {
    gap: 8,
  },
  analysisText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timestampText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  musicCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },

  connectButton: {
    height: 120,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 40,
  },
  connectGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  connectTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginTop: 8,
    textAlign: 'center',
  },
  connectSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 4,
  },
});
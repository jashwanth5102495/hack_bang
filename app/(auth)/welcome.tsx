import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Moon, Music } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={['#000000', '#0a0a0a', '#1a1a1a']}
      style={styles.container}
    >
      <Animated.View 
        entering={FadeInUp.delay(300).springify()}
        style={styles.header}
      >
        <View style={styles.iconContainer}>
          <Heart size={24} color="#e879f9" />
          <Music size={28} color="#3b82f6" />
          <Moon size={24} color="#06b6d4" />
        </View>
        <Text style={styles.title}>MoodWell</Text>
        <Text style={styles.subtitle}>
          Unwind after a long day with personalized wellness experiences
        </Text>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.delay(600).springify()}
        style={styles.content}
      >
        <View style={styles.featureContainer}>
          <View style={styles.feature}>
            <View style={[styles.featureIcon, { backgroundColor: '#e879f920' }]}>
              <Heart size={20} color="#e879f9" />
            </View>
            <Text style={styles.featureText}>Mood-based matching</Text>
          </View>
          <View style={styles.feature}>
            <View style={[styles.featureIcon, { backgroundColor: '#3b82f620' }]}>
              <Music size={20} color="#3b82f6" />
            </View>
            <Text style={styles.featureText}>Curated music & recipes</Text>
          </View>
          <View style={styles.feature}>
            <View style={[styles.featureIcon, { backgroundColor: '#06b6d420' }]}>
              <Moon size={20} color="#06b6d4" />
            </View>
            <Text style={styles.featureText}>Relaxation tools</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => router.push('/(auth)/login')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#3b82f6', '#8b5cf6']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 50,
  },
  header: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  title: {
    fontSize: 42,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
  },
  featureContainer: {
    marginBottom: 40,
    gap: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#d1d5db',
  },
  getStartedButton: {
    width: width - 48,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});
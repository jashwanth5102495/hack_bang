import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Briefcase, Heart } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useUser } from '../../contexts/UserContext';

const { width } = Dimensions.get('window');

const interests = [
  'Music', 'Cooking', 'Reading', 'Gaming', 'Sports', 'Movies', 
  'Art', 'Travel', 'Photography', 'Fitness', 'Dancing', 'Writing'
];

export default function ProfileSetupScreen() {
  const { saveUserData } = useUser();
  const [fullName, setFullName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleComplete = async () => {
    if (fullName.trim() && occupation.trim() && selectedInterests.length > 0) {
      try {
        await saveUserData({
          fullName: fullName.trim(),
          occupation: occupation.trim(),
          interests: selectedInterests,
          joinDate: new Date().toISOString(),
          moodSessions: 0,
          connections: 0,
          daysActive: 1,
        });
        console.log('Profile setup completed:', { fullName, occupation, selectedInterests });
        router.replace('/recommendations');
      } catch (error) {
        console.error('Error saving user data or navigating:', error);
      }
    } else {
      console.log('Validation failed:', { 
        fullName: fullName.trim(), 
        occupation: occupation.trim(), 
        interestsCount: selectedInterests.length 
      });
    }
  };

  return (
    <LinearGradient
      colors={['#000000', '#0a0a0a', '#1a1a1a']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          style={styles.content}
        >
          <Text style={styles.title}>Tell us about yourself</Text>
          <Text style={styles.subtitle}>
            Help us personalize your wellness experience
          </Text>

          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <User size={20} color="#6b7280" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#6b7280"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Briefcase size={20} color="#6b7280" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Occupation"
              placeholderTextColor="#6b7280"
              value={occupation}
              onChangeText={setOccupation}
            />
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Heart size={20} color="#e879f9" />
              <Text style={styles.sectionTitle}>Interests & Hobbies</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Select what you enjoy doing in your free time
            </Text>

            <View style={styles.interestsContainer}>
              {interests.map((interest, index) => (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.interestChip,
                    selectedInterests.includes(interest) && styles.interestChipSelected
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text style={[
                    styles.interestText,
                    selectedInterests.includes(interest) && styles.interestTextSelected
                  ]}>
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.completeButton,
              (!fullName || !occupation || selectedInterests.length === 0) && styles.buttonDisabled
            ]}
            onPress={handleComplete}
            disabled={!fullName || !occupation || selectedInterests.length === 0}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                fullName && occupation && selectedInterests.length > 0
                  ? ['#3b82f6', '#8b5cf6']
                  : ['#374151', '#374151']
              }
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Complete Setup</Text>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  content: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    lineHeight: 24,
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
  },
  inputIconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  sectionContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginBottom: 20,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  interestChipSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3b82f6',
  },
  interestText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#a1a1aa',
  },
  interestTextSelected: {
    color: '#3b82f6',
  },
  completeButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.5,
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
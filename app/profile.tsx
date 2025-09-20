import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, Edit3, Camera, MapPin, Calendar, Heart, Users, TrendingUp } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import { useUser } from '../contexts/UserContext';

interface UserProfile {
  id: string;
  name: string;
  age: number;
  email: string;
  bio: string;
  interests: string[];
  currentMood: string;
  profileImage: string;
  stats: {
    sessions: number;
    connections: number;
    streak: number;
  };
  moodHistory: Array<{
    mood: string;
    timestamp: string;
  }>;
}

export default function ProfileScreen() {
  const { user, updateUser, loading } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    interests: user?.interests || []
  });

  // Sync editedProfile with user data when user changes
  useEffect(() => {
    if (user) {
      setEditedProfile({
        name: user.name || '',
        bio: user.bio || '',
        interests: user.interests || []
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      await updateUser(editedProfile);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const addInterest = () => {
    Alert.prompt(
      'Add Interest',
      'Enter a new interest:',
      (text) => {
        if (text && text.trim()) {
          setEditedProfile(prev => ({
            ...prev,
            interests: [...prev.interests, text.trim()]
          }));
        }
      }
    );
  };

  const removeInterest = (index: number) => {
    setEditedProfile(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: { [key: string]: string } = {
      'Happy': '😊',
      'Sad': '😢',
      'Excited': '🤩',
      'Tired': '😴',
      'Romantic': '💕',
      'Lonely': '😔',
      'Hungry': '🤤',
      'Moody': '🎭',
      'Chill': '😌',
      'Energetic': '⚡'
    };
    return moodEmojis[mood] || '😊';
  };

  return (
    <LinearGradient
      colors={['#000000', '#0a0a0a', '#1a1a1a']}
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
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
        >
          <Edit3 size={20} color="#ffffff" />
          <Text style={styles.editButtonText}>
            {isEditing ? 'Save' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Animated.View
          entering={FadeInDown.delay(100)}
          style={styles.profileHeader}
        >
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: profile.profileImage }} style={styles.profileImage} />
            {isEditing && (
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={16} color="#ffffff" />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.profileInfo}>
            {isEditing ? (
              <TextInput
                style={styles.nameInput}
                value={editedProfile.name}
                onChangeText={(text) => setEditedProfile(prev => ({ ...prev, name: text }))}
                placeholder="Your name"
                placeholderTextColor="#a1a1aa"
              />
            ) : (
              <Text style={styles.profileName}>{user?.name || 'User'}</Text>
            )}
            
            <View style={styles.profileMeta}>
              <View style={styles.metaItem}>
                <Calendar size={16} color="#a1a1aa" />
                <Text style={styles.metaText}>{user?.age || 0} years old</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.moodEmoji}>{getMoodEmoji(user?.currentMood || 'Happy')}</Text>
                <Text style={styles.metaText}>{user?.currentMood || 'Happy'}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View
          entering={FadeInLeft.delay(200)}
          style={styles.statsContainer}
        >
          <View style={styles.statCard}>
            <TrendingUp size={20} color="#3b82f6" />
            <Text style={styles.statValue}>{user?.stats?.sessions || 0}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statCard}>
            <Users size={20} color="#10b981" />
            <Text style={styles.statValue}>{user?.stats?.connections || 0}</Text>
            <Text style={styles.statLabel}>Connections</Text>
          </View>
          <View style={styles.statCard}>
            <Heart size={20} color="#ef4444" />
            <Text style={styles.statValue}>{user?.stats?.streak || 0}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </Animated.View>

        {/* Bio */}
        <Animated.View
          entering={FadeInDown.delay(300)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>About Me</Text>
          {isEditing ? (
            <TextInput
              style={styles.bioInput}
              value={editedProfile.bio}
              onChangeText={(text) => setEditedProfile(prev => ({ ...prev, bio: text }))}
              placeholder="Tell us about yourself..."
              placeholderTextColor="#a1a1aa"
              multiline
              numberOfLines={4}
            />
          ) : (
            <Text style={styles.bioText}>{user?.bio || 'No bio available'}</Text>
          )}
        </Animated.View>

        {/* Interests */}
        <Animated.View
          entering={FadeInDown.delay(400)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Interests</Text>
            {isEditing && (
              <TouchableOpacity style={styles.addButton} onPress={addInterest}>
                <Text style={styles.addButtonText}>+ Add</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.interestsContainer}>
            {(isEditing ? editedProfile.interests : (user?.interests || [])).map((interest, index) => (
              <TouchableOpacity
                key={index}
                style={styles.interestTag}
                onPress={() => isEditing ? removeInterest(index) : null}
              >
                <Text style={styles.interestText}>{interest}</Text>
                {isEditing && <Text style={styles.removeText}>×</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Recent Mood History */}
        <Animated.View
          entering={FadeInDown.delay(500)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Recent Moods</Text>
          <View style={styles.moodHistoryContainer}>
            {(user?.moodHistory || []).slice(0, 5).map((entry, index) => (
              <View key={index} style={styles.moodHistoryItem}>
                <Text style={styles.moodHistoryEmoji}>{getMoodEmoji(entry.mood)}</Text>
                <View style={styles.moodHistoryInfo}>
                  <Text style={styles.moodHistoryMood}>{entry.mood}</Text>
                  <Text style={styles.moodHistoryDate}>
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Cancel Button (only when editing) */}
        {isEditing && (
          <Animated.View
            entering={FadeInDown.delay(600)}
            style={styles.cancelContainer}
          >
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
              <Text style={styles.cancelButtonText}>Cancel Changes</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
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
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#3b82f6',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 8,
  },
  nameInput: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    textAlign: 'center',
    marginBottom: 8,
    minWidth: 200,
  },
  profileMeta: {
    flexDirection: 'row',
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#a1a1aa',
  },
  moodEmoji: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#a1a1aa',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  addButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  addButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  bioText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#d1d5db',
    lineHeight: 22,
  },
  bioInput: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  interestText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3b82f6',
  },
  removeText: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: 'bold',
  },
  moodHistoryContainer: {
    gap: 12,
  },
  moodHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  moodHistoryEmoji: {
    fontSize: 24,
  },
  moodHistoryInfo: {
    flex: 1,
  },
  moodHistoryMood: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  moodHistoryDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
  },
  cancelContainer: {
    marginBottom: 40,
  },
  cancelButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ef4444',
  },
});
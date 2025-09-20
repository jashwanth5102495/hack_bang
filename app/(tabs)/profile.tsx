import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Edit3, Camera, Calendar, Heart, Users, TrendingUp, Settings, LogOut } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import { useUser } from '../../contexts/UserContext';

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
  weeklyAnalysis: {
    dominantMood: string;
    moodVariability: 'Low' | 'Medium' | 'High';
    mentalHealthScore: number;
    physicalHealthImpact: {
      heart: {
        status: 'Good' | 'Moderate' | 'Concerning';
        description: string;
        recommendations: string[];
      };
      brain: {
        status: 'Good' | 'Moderate' | 'Concerning';
        description: string;
        recommendations: string[];
      };
      reproduction: {
        status: 'Good' | 'Moderate' | 'Concerning';
        description: string;
        recommendations: string[];
      };
      bloodPressure: {
        status: 'Normal' | 'Elevated' | 'High';
        description: string;
        recommendations: string[];
      };
    };
    recommendations: string[];
  };
}



export default function ProfileScreen() {
  const { user, updateUser, logout, loading } = useUser();
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

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleCancelEdit = () => {
    setEditedProfile({
      name: user?.name || '',
      bio: user?.bio || '',
      interests: user?.interests || []
    });
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
      colors={['#0f0f23', '#1a1a2e', '#16213e']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Settings size={20} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
          >
            <Edit3 size={16} color="#ffffff" />
            <Text style={styles.editButtonText}>
              {isEditing ? 'Save' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Animated.View
          entering={FadeInDown.delay(100)}
          style={styles.profileHeader}
        >
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: user?.profileImage || 'https://via.placeholder.com/150x150/3b82f6/ffffff?text=U' }} style={styles.profileImage} />
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

        {/* Weekly Mood Analysis */}
        <Animated.View
          entering={FadeInDown.delay(500)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Weekly Mood Analysis</Text>
          
          {/* Mental Health Score */}
          <View style={styles.analysisCard}>
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreTitle}>Mental Health Score</Text>
              <View style={[styles.scoreCircle, { 
                borderColor: (user?.weeklyAnalysis?.mentalHealthScore || 75) >= 80 ? '#10b981' : 
                           (user?.weeklyAnalysis?.mentalHealthScore || 75) >= 60 ? '#f59e0b' : '#ef4444'
              }]}>
                <Text style={[styles.scoreValue, {
                  color: (user?.weeklyAnalysis?.mentalHealthScore || 75) >= 80 ? '#10b981' : 
                         (user?.weeklyAnalysis?.mentalHealthScore || 75) >= 60 ? '#f59e0b' : '#ef4444'
                }]}>
                  {user?.weeklyAnalysis?.mentalHealthScore || 75}
                </Text>
              </View>
            </View>
            <Text style={styles.analysisText}>
              Dominant mood: {user?.weeklyAnalysis?.dominantMood || 'Happy'} • 
              Variability: {user?.weeklyAnalysis?.moodVariability || 'Medium'}
            </Text>
          </View>

          {/* Physical Health Impact */}
          <View style={styles.healthImpactContainer}>
            <Text style={styles.healthImpactTitle}>Physical Health Impact</Text>
            
            {/* Heart Health */}
            <View style={styles.healthCard}>
              <View style={styles.healthHeader}>
                <Heart size={20} color="#ef4444" />
                <Text style={styles.healthCardTitle}>Cardiovascular System</Text>
                <View style={[styles.statusBadge, {
                  backgroundColor: (user?.weeklyAnalysis?.physicalHealthImpact?.heart?.status || 'Good') === 'Good' ? 
                    'rgba(16, 185, 129, 0.2)' : (user?.weeklyAnalysis?.physicalHealthImpact?.heart?.status || 'Good') === 'Moderate' ?
                    'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                }]}>
                  <Text style={[styles.statusText, {
                    color: (user?.weeklyAnalysis?.physicalHealthImpact?.heart?.status || 'Good') === 'Good' ? 
                      '#10b981' : (user?.weeklyAnalysis?.physicalHealthImpact?.heart?.status || 'Good') === 'Moderate' ?
                      '#f59e0b' : '#ef4444'
                  }]}>
                    {user?.weeklyAnalysis?.physicalHealthImpact?.heart?.status || 'Good'}
                  </Text>
                </View>
              </View>
              <Text style={styles.healthDescription}>
                {user?.weeklyAnalysis?.physicalHealthImpact?.heart?.description || 'Your mood patterns support cardiovascular health. Positive emotions help maintain healthy heart rhythm.'}
              </Text>
              <View style={styles.recommendationsContainer}>
                {(user?.weeklyAnalysis?.physicalHealthImpact?.heart?.recommendations || ['Continue engaging in mood-boosting activities', 'Maintain regular exercise routine', 'Practice gratitude daily']).map((rec, index) => (
                  <Text key={index} style={styles.recommendationItem}>• {rec}</Text>
                ))}
              </View>
            </View>

            {/* Brain Health */}
            <View style={styles.healthCard}>
              <View style={styles.healthHeader}>
                <Text style={styles.healthIcon}>🧠</Text>
                <Text style={styles.healthCardTitle}>Neurological System</Text>
                <View style={[styles.statusBadge, {
                  backgroundColor: (user?.weeklyAnalysis?.physicalHealthImpact?.brain?.status || 'Moderate') === 'Good' ? 
                    'rgba(16, 185, 129, 0.2)' : (user?.weeklyAnalysis?.physicalHealthImpact?.brain?.status || 'Moderate') === 'Moderate' ?
                    'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                }]}>
                  <Text style={[styles.statusText, {
                    color: (user?.weeklyAnalysis?.physicalHealthImpact?.brain?.status || 'Moderate') === 'Good' ? 
                      '#10b981' : (user?.weeklyAnalysis?.physicalHealthImpact?.brain?.status || 'Moderate') === 'Moderate' ?
                      '#f59e0b' : '#ef4444'
                  }]}>
                    {user?.weeklyAnalysis?.physicalHealthImpact?.brain?.status || 'Moderate'}
                  </Text>
                </View>
              </View>
              <Text style={styles.healthDescription}>
                {user?.weeklyAnalysis?.physicalHealthImpact?.brain?.description || 'Mood variability shows some stress patterns that may affect cognitive function. Requires attention to maintain optimal brain health.'}
              </Text>
              <View style={styles.recommendationsContainer}>
                {(user?.weeklyAnalysis?.physicalHealthImpact?.brain?.recommendations || ['Practice mindfulness meditation 10-15 minutes daily', 'Ensure 7-8 hours of quality sleep', 'Engage in brain-stimulating activities']).map((rec, index) => (
                  <Text key={index} style={styles.recommendationItem}>• {rec}</Text>
                ))}
              </View>
            </View>

            {/* Reproductive Health */}
            <View style={styles.healthCard}>
              <View style={styles.healthHeader}>
                <Text style={styles.healthIcon}>🫀</Text>
                <Text style={styles.healthCardTitle}>Reproductive System</Text>
                <View style={[styles.statusBadge, {
                  backgroundColor: (user?.weeklyAnalysis?.physicalHealthImpact?.reproduction?.status || 'Good') === 'Good' ? 
                    'rgba(16, 185, 129, 0.2)' : (user?.weeklyAnalysis?.physicalHealthImpact?.reproduction?.status || 'Good') === 'Moderate' ?
                    'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                }]}>
                  <Text style={[styles.statusText, {
                    color: (user?.weeklyAnalysis?.physicalHealthImpact?.reproduction?.status || 'Good') === 'Good' ? 
                      '#10b981' : (user?.weeklyAnalysis?.physicalHealthImpact?.reproduction?.status || 'Good') === 'Moderate' ?
                      '#f59e0b' : '#ef4444'
                  }]}>
                    {user?.weeklyAnalysis?.physicalHealthImpact?.reproduction?.status || 'Good'}
                  </Text>
                </View>
              </View>
              <Text style={styles.healthDescription}>
                {user?.weeklyAnalysis?.physicalHealthImpact?.reproduction?.description || 'Balanced mood patterns support healthy hormonal regulation and reproductive health.'}
              </Text>
              <View style={styles.recommendationsContainer}>
                {(user?.weeklyAnalysis?.physicalHealthImpact?.reproduction?.recommendations || ['Maintain stress management techniques', 'Ensure adequate nutrition', 'Regular physical activity']).map((rec, index) => (
                  <Text key={index} style={styles.recommendationItem}>• {rec}</Text>
                ))}
              </View>
            </View>

            {/* Blood Pressure */}
            <View style={styles.healthCard}>
              <View style={styles.healthHeader}>
                <Text style={styles.healthIcon}>🩸</Text>
                <Text style={styles.healthCardTitle}>Blood Pressure</Text>
                <View style={[styles.statusBadge, {
                  backgroundColor: (user?.weeklyAnalysis?.physicalHealthImpact?.bloodPressure?.status || 'Normal') === 'Normal' ? 
                    'rgba(16, 185, 129, 0.2)' : (user?.weeklyAnalysis?.physicalHealthImpact?.bloodPressure?.status || 'Normal') === 'Elevated' ?
                    'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                }]}>
                  <Text style={[styles.statusText, {
                    color: (user?.weeklyAnalysis?.physicalHealthImpact?.bloodPressure?.status || 'Normal') === 'Normal' ? 
                      '#10b981' : (user?.weeklyAnalysis?.physicalHealthImpact?.bloodPressure?.status || 'Normal') === 'Elevated' ?
                      '#f59e0b' : '#ef4444'
                  }]}>
                    {user?.weeklyAnalysis?.physicalHealthImpact?.bloodPressure?.status || 'Normal'}
                  </Text>
                </View>
              </View>
              <Text style={styles.healthDescription}>
                {user?.weeklyAnalysis?.physicalHealthImpact?.bloodPressure?.description || 'Your mood patterns suggest normal blood pressure ranges. Positive emotions help maintain healthy blood pressure.'}
              </Text>
              <View style={styles.recommendationsContainer}>
                {(user?.weeklyAnalysis?.physicalHealthImpact?.bloodPressure?.recommendations || ['Continue stress-reduction practices', 'Limit caffeine during stressful periods', 'Practice deep breathing exercises']).map((rec, index) => (
                  <Text key={index} style={styles.recommendationItem}>• {rec}</Text>
                ))}
              </View>
            </View>
          </View>

          {/* Overall Recommendations */}
          <View style={styles.overallRecommendations}>
            <Text style={styles.recommendationsTitle}>Weekly Recommendations</Text>
            {(user?.weeklyAnalysis?.recommendations || ['Your mental health is generally good with room for improvement', 'Focus on managing mood swings through consistent sleep and exercise', 'Consider talking to someone during periods of sadness or stress', 'Maintain social connections to support emotional well-being']).map((rec, index) => (
              <Text key={index} style={styles.overallRecommendationItem}>
                {index + 1}. {rec}
              </Text>
            ))}
          </View>
        </Animated.View>

        {/* Recent Mood History */}
        <Animated.View
          entering={FadeInDown.delay(600)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Recent Moods</Text>
          <View style={styles.moodHistoryContainer}>
            {(user?.moodHistory || [
              { mood: 'Happy', timestamp: '2024-01-15' },
              { mood: 'Excited', timestamp: '2024-01-14' },
              { mood: 'Sad', timestamp: '2024-01-13' },
              { mood: 'Happy', timestamp: '2024-01-12' },
              { mood: 'Tired', timestamp: '2024-01-11' }
            ]).slice(0, 5).map((entry, index) => (
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

        {/* Action Buttons */}
        <Animated.View
          entering={FadeInDown.delay(700)}
          style={styles.actionsContainer}
        >
          {isEditing ? (
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
              <Text style={styles.cancelButtonText}>Cancel Changes</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogOut size={16} color="#ef4444" />
              <Text style={styles.logoutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
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
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 12,
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
  actionsContainer: {
    marginBottom: 120,
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    paddingVertical: 12,
    borderRadius: 12,
  },
  logoutButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ef4444',
  },
  analysisCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  scoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  analysisText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
  },
  healthImpactContainer: {
    marginBottom: 20,
  },
  healthImpactTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
  },
  healthCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  healthIcon: {
    fontSize: 20,
  },
  healthCardTitle: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  healthDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#d1d5db',
    lineHeight: 18,
    marginBottom: 12,
  },
  recommendationsContainer: {
    gap: 4,
  },
  recommendationItem: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#10b981',
    lineHeight: 16,
  },
  overallRecommendations: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  recommendationsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3b82f6',
    marginBottom: 12,
  },
  overallRecommendationItem: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    lineHeight: 18,
    marginBottom: 6,
  },
});
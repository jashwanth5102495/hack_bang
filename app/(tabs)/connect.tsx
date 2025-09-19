import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, MessageCircle, Video, MapPin, Coffee } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const mockUsers = [
  {
    id: '1',
    name: 'Sarah Chen',
    age: 28,
    occupation: 'Graphic Designer',
    mood: 'Creative',
    distance: '2.1 km away',
    interests: ['Art', 'Music', 'Coffee'],
    gradient: ['#ec4899', '#8b5cf6'],
    online: true,
  },
  {
    id: '2',
    name: 'Alex Rivera',
    age: 32,
    occupation: 'Software Engineer',
    mood: 'Relaxed',
    distance: '1.8 km away',
    interests: ['Gaming', 'Movies', 'Cooking'],
    gradient: ['#06b6d4', '#3b82f6'],
    online: false,
  },
  {
    id: '3',
    name: 'Maya Patel',
    age: 26,
    occupation: 'Marketing Manager',
    mood: 'Excited',
    distance: '3.2 km away',
    interests: ['Travel', 'Photography', 'Fitness'],
    gradient: ['#10b981', '#059669'],
    online: true,
  },
];

export default function ConnectScreen() {
  const [likedUsers, setLikedUsers] = useState<string[]>([]);

  const handleLike = (userId: string) => {
    setLikedUsers(prev => [...prev, userId]);
    // In a real app, check for mutual likes and create matches
  };

  const handleMessage = (userId: string) => {
    // Navigate to chat
    console.log('Start chat with', userId);
  };

  const handleVideoCall = (userId: string) => {
    // Start video call
    console.log('Start video call with', userId);
  };

  return (
    <LinearGradient
      colors={['#000000', '#0a0a0a', '#1a1a1a']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Connect</Text>
        <Text style={styles.subtitle}>
          Find people who share your current mood
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {mockUsers.map((user, index) => (
          <Animated.View
            key={user.id}
            entering={FadeInDown.delay(index * 200).springify()}
            style={styles.userCard}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
              style={styles.cardGradient}
            >
              <View style={styles.userHeader}>
                <View style={styles.userInfo}>
                  <View style={styles.nameContainer}>
                    <Text style={styles.userName}>{user.name}, {user.age}</Text>
                    {user.online && <View style={styles.onlineIndicator} />}
                  </View>
                  <Text style={styles.userOccupation}>{user.occupation}</Text>
                  <View style={styles.locationContainer}>
                    <MapPin size={14} color="#6b7280" />
                    <Text style={styles.userDistance}>{user.distance}</Text>
                  </View>
                </View>

                <View style={styles.moodBadgeContainer}>
                  <LinearGradient
                    colors={user.gradient}
                    style={styles.moodBadge}
                  >
                    <Text style={styles.moodText}>{user.mood}</Text>
                  </LinearGradient>
                </View>
              </View>

              <View style={styles.interestsContainer}>
                {user.interests.map((interest, idx) => (
                  <View key={idx} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.likeButton]}
                  onPress={() => handleLike(user.id)}
                  disabled={likedUsers.includes(user.id)}
                >
                  <Heart 
                    size={20} 
                    color={likedUsers.includes(user.id) ? "#ec4899" : "#ffffff"} 
                    fill={likedUsers.includes(user.id) ? "#ec4899" : "transparent"}
                  />
                  <Text style={styles.actionButtonText}>
                    {likedUsers.includes(user.id) ? 'Liked' : 'Like'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.messageButton]}
                  onPress={() => handleMessage(user.id)}
                >
                  <MessageCircle size={20} color="#3b82f6" />
                  <Text style={styles.actionButtonText}>Chat</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.videoButton]}
                  onPress={() => handleVideoCall(user.id)}
                >
                  <Video size={20} color="#10b981" />
                  <Text style={styles.actionButtonText}>Video</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        ))}

        <View style={styles.footerSpace} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  userCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  userOccupation: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userDistance: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  moodBadgeContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  moodBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  moodText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  interestTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  interestText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#a1a1aa',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  likeButton: {
    backgroundColor: 'rgba(236, 72, 153, 0.2)',
  },
  messageButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  videoButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  footerSpace: {
    height: 120, // Space for floating navigation
  },
});
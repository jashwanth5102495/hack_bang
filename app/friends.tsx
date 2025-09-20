import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, MapPin, MessageCircle, MessageSquare, X, Users, Coffee } from 'lucide-react-native';
import { useMood } from '../contexts/MoodContext';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
// import * as Location from 'expo-location';

interface NearbyUser {
  id: string;
  name: string;
  age: number;
  distance: string;
  mood: string;
  interests: string[];
  bio: string;
  image: string;
  isOnline: boolean;
  lastSeen?: string;
}

const nearbyUsers: NearbyUser[] = [
  {
    id: '1',
    name: 'Sarah',
    age: 25,
    distance: '0.5 km',
    mood: 'Happy',
    interests: ['Coffee', 'Movies', 'Art'],
    bio: 'Love exploring new cafes and meeting creative people!',
    image: 'https://via.placeholder.com/150x150/ec4899/ffffff?text=S',
    isOnline: true
  },
  {
    id: '2',
    name: 'Alex',
    age: 28,
    distance: '1.2 km',
    mood: 'Excited',
    interests: ['Music', 'Food', 'Travel'],
    bio: 'Always up for trying new restaurants and live music!',
    image: 'https://via.placeholder.com/150x150/3b82f6/ffffff?text=A',
    isOnline: true
  },
  {
    id: '3',
    name: 'Maya',
    age: 23,
    distance: '2.1 km',
    mood: 'Chill',
    interests: ['Books', 'Yoga', 'Nature'],
    bio: 'Peaceful soul looking for meaningful conversations.',
    image: 'https://via.placeholder.com/150x150/10b981/ffffff?text=M',
    isOnline: false,
    lastSeen: '2 hours ago'
  },
  {
    id: '4',
    name: 'Jordan',
    age: 26,
    distance: '3.0 km',
    mood: 'Adventurous',
    interests: ['Hiking', 'Photography', 'Gaming'],
    bio: 'Adventure seeker and photo enthusiast!',
    image: 'https://via.placeholder.com/150x150/f59e0b/ffffff?text=J',
    isOnline: true
  }
];

const meetupSuggestions = [
  { icon: Coffee, title: 'Coffee Chat', subtitle: 'Nearby cafe meetup' },
  { icon: Users, title: 'Group Hangout', subtitle: 'Join local events' },
  { icon: MessageCircle, title: 'Video Call', subtitle: 'Virtual meetup first' },
];

export default function FriendsScreen() {
  const [location, setLocation] = useState<any | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [chatRequests, setChatRequests] = useState<string[]>([]);
  const { currentMoodAnalysis } = useMood();

  const currentMood = currentMoodAnalysis?.dominantMood || 'Happy';

  // Filter users to show only those with the same mood
  const sameMoodUsers = nearbyUsers.filter(user => user.mood === currentMood);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      // Mock location for now - replace with actual location when expo-location is installed
      const mockLocation = {
        coords: {
          latitude: 40.7589,
          longitude: -73.9851
        }
      };
      setLocation(mockLocation);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleLikeUser = (userId: string) => {
    setSelectedUsers(prev => [...prev, userId]);
    setChatRequests(prev => [...prev, userId]);
    
    const user = nearbyUsers.find(u => u.id === userId);
    Alert.alert(
      'Connection Request Sent!',
      `Your request to connect with ${user?.name} has been sent. They'll be notified and can approve to start chatting.`,
      [{ text: 'OK' }]
    );
  };

  const handlePassUser = (userId: string) => {
    // Just remove from view for now
    console.log('Passed on user:', userId);
  };

  const handleStartChat = (userId: string) => {
    const user = nearbyUsers.find(u => u.id === userId);
    Alert.alert(
      'Start Conversation',
      `Start chatting with ${user?.name}? You can suggest meeting up once you get to know each other better.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start Chat', onPress: () => {
          // Navigate to chat screen
          console.log('Starting chat with:', userId);
        }}
      ]
    );
  };

  const renderUserCard = (user: NearbyUser) => (
    <Animated.View
      key={user.id}
      entering={FadeInDown.delay(200)}
      style={styles.userCard}
    >
      <View style={styles.userImageContainer}>
        <Image source={{ uri: user.image }} style={styles.userImage} />
        <View style={[styles.onlineIndicator, { backgroundColor: user.isOnline ? '#10b981' : '#6b7280' }]} />
      </View>
      
      <View style={styles.userInfo}>
        <View style={styles.userHeader}>
          <Text style={styles.userName}>{user.name}, {user.age}</Text>
          <View style={styles.distanceContainer}>
            <MapPin size={14} color="#3b82f6" />
            <Text style={styles.distance}>{user.distance}</Text>
          </View>
        </View>
        
        <View style={styles.moodContainer}>
          <Text style={styles.moodLabel}>Mood:</Text>
          <Text style={styles.moodText}>{user.mood}</Text>
        </View>
        
        <Text style={styles.userBio}>{user.bio}</Text>
        
        <View style={styles.interestsContainer}>
          {user.interests.map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
        
        {!user.isOnline && user.lastSeen && (
          <Text style={styles.lastSeen}>Last seen {user.lastSeen}</Text>
        )}
      </View>
      
      <View style={styles.userActions}>
        {chatRequests.includes(user.id) ? (
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => handleStartChat(user.id)}
          >
            <MessageCircle size={20} color="#ffffff" />
            <Text style={styles.chatButtonText}>Chat</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.passButton}
              onPress={() => handlePassUser(user.id)}
            >
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.likeButton}
              onPress={() => handleLikeUser(user.id)}
            >
              <MessageSquare size={20} color="#ffffff" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </Animated.View>
  );

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
        <Text style={styles.headerTitle}>Meet Nearby Friends</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Location Status */}
        <Animated.View
          entering={FadeInDown.delay(100)}
          style={styles.locationContainer}
        >
          <MapPin size={16} color="#3b82f6" />
          <Text style={styles.locationText}>
            {location ? 'Showing people near you' : 'Getting your location...'}
          </Text>
        </Animated.View>

        {/* Safety Notice */}
        <Animated.View
          entering={FadeInLeft.delay(200)}
          style={styles.safetyNotice}
        >
          <Text style={styles.safetyTitle}>Stay Safe</Text>
          <Text style={styles.safetyText}>
            Always meet in public places and let someone know where you're going. 
            Take time to chat before meeting in person.
          </Text>
        </Animated.View>

        {/* Meetup Suggestions */}
        <Text style={styles.sectionTitle}>Meetup Ideas</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.suggestionsScroll}
        >
          {meetupSuggestions.map((suggestion, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(300 + index * 100)}
              style={styles.suggestionCard}
            >
              <TouchableOpacity style={styles.suggestionContent}>
                <suggestion.icon size={24} color="#3b82f6" />
                <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                <Text style={styles.suggestionSubtitle}>{suggestion.subtitle}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>

        {/* People with Same Mood */}
        <Text style={styles.sectionTitle}>People with {String(currentMood)} Mood</Text>
        <Text style={styles.sectionSubtitle}>
          Connect with people who are feeling the same way as you
        </Text>
        {sameMoodUsers.length > 0 ? (
          sameMoodUsers.map(renderUserCard)
        ) : (
          <View style={styles.noUsersContainer}>
            <Text style={styles.noUsersText}>
              No users with {currentMood} mood nearby right now.
            </Text>
            <Text style={styles.noUsersSubtext}>
              Try changing your mood or check back later!
            </Text>
          </View>
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
  placeholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    padding: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3b82f6',
  },
  safetyNotice: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  safetyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ef4444',
    marginBottom: 8,
  },
  safetyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#fca5a5',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
    marginTop: 8,
  },
  suggestionsScroll: {
    marginBottom: 32,
  },
  suggestionCard: {
    width: 140,
    marginRight: 16,
  },
  suggestionContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  suggestionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
  },
  suggestionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    textAlign: 'center',
  },
  userCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  userImageContainer: {
    position: 'relative',
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000000',
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3b82f6',
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#a1a1aa',
  },
  moodText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#10b981',
  },
  userBio: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#d1d5db',
    lineHeight: 20,
    marginBottom: 12,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  interestTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  interestText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#3b82f6',
  },
  lastSeen: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 4,
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  passButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 22,
  },
  chatButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginBottom: 16,
    marginTop: -8,
  },
  noUsersContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  noUsersText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  noUsersSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    textAlign: 'center',
  },
});
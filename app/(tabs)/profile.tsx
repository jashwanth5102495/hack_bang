import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Bell, Heart, TrendingUp, LogOut, CreditCard as Edit } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useUser } from '../../contexts/UserContext';
import { useMood } from '../../contexts/MoodContext';

export default function ProfileScreen() {
  const { user, logout } = useUser();
  const { moodAnalysis } = useMood();
  
  const userStats = [
    { label: 'Mood Sessions', value: user?.moodSessions?.toString() || '0', icon: TrendingUp },
    { label: 'Connections', value: user?.connections?.toString() || '0', icon: Heart },
    { label: 'Days Active', value: user?.daysActive?.toString() || '0', icon: User },
  ];

  const menuItems = [
    { title: 'Edit Profile', icon: Edit, action: () => {} },
    { title: 'Notifications', icon: Bell, action: () => {} },
    { title: 'Settings', icon: Settings, action: () => {} },
    { title: 'Logout', icon: LogOut, action: logout, danger: true },
  ];

  return (
    <LinearGradient
      colors={['#000000', '#0a0a0a', '#1a1a1a']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          style={styles.profileHeader}
        >
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#3b82f6', '#8b5cf6']}
              style={styles.avatar}
            >
              <User size={40} color="#ffffff" />
            </LinearGradient>
          </View>
          
          <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
          <Text style={styles.userOccupation}>{user?.occupation || 'Not specified'}</Text>
          
          <View style={styles.currentMoodContainer}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.currentMoodBadge}
            >
              <Text style={styles.currentMoodText}>
                Currently: {moodAnalysis?.dominantMood || 'Unknown'}
              </Text>
            </LinearGradient>
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(400).springify()}
          style={styles.statsContainer}
        >
          <Text style={styles.sectionTitle}>Your Wellness Stats</Text>
          <View style={styles.statsGrid}>
            {userStats.map((stat, index) => (
              <View key={stat.label} style={styles.statCard}>
                <stat.icon size={24} color="#3b82f6" />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(600).springify()}
          style={styles.interestsContainer}
        >
          <Text style={styles.sectionTitle}>Your Interests</Text>
          <View style={styles.interestsGrid}>
            {(user?.interests || []).map((interest, index) => (
              <View key={interest} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
            {(!user?.interests || user.interests.length === 0) && (
              <Text style={styles.noInterestsText}>No interests added yet</Text>
            )}
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(800).springify()}
          style={styles.menuContainer}
        >
          <Text style={styles.sectionTitle}>Account</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              style={styles.menuItem}
              onPress={item.action}
            >
              <View style={styles.menuItemContent}>
                <View style={styles.menuItemLeft}>
                  <View style={[
                    styles.menuIconContainer,
                    item.danger && styles.dangerIconContainer
                  ]}>
                    <item.icon 
                      size={20} 
                      color={item.danger ? "#ef4444" : "#3b82f6"} 
                    />
                  </View>
                  <Text style={[
                    styles.menuItemText,
                    item.danger && styles.dangerText
                  ]}>
                    {item.title}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userOccupation: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginBottom: 16,
  },
  currentMoodContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  currentMoodBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  currentMoodText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
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
  statsGrid: {
    flexDirection: 'row',
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
    textAlign: 'center',
  },
  interestsContainer: {
    marginBottom: 32,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  interestText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3b82f6',
  },
  noInterestsText: {
    color: '#9ca3af',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  menuContainer: {
    marginBottom: 120, // Space for floating navigation
  },
  menuItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    marginBottom: 8,
    overflow: 'hidden',
  },
  menuItemContent: {
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerIconContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  dangerText: {
    color: '#ef4444',
  },
});
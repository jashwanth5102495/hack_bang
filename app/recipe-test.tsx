import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function RecipeTestScreen() {
  const params = useLocalSearchParams();
  
  const dishName = params.dishName as string || 'Unknown Dish';
  const dishCuisine = params.dishCuisine as string || 'Unknown Cuisine';
  const dishTime = params.dishTime as string || 'Unknown Time';
  const dishDifficulty = params.dishDifficulty as string || 'Unknown Difficulty';

  return (
    <LinearGradient colors={['#0f0f23', '#1a1a2e', '#16213e']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Recipe Test</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>🎉 Navigation Works!</Text>
          <Text style={styles.subtitle}>Recipe screen is working properly</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Dish Information:</Text>
            <Text style={styles.infoText}>Name: {dishName}</Text>
            <Text style={styles.infoText}>Cuisine: {dishCuisine}</Text>
            <Text style={styles.infoText}>Time: {dishTime}</Text>
            <Text style={styles.infoText}>Difficulty: {dishDifficulty}</Text>
          </View>
          
          <View style={styles.messageCard}>
            <Text style={styles.messageTitle}>✅ Success!</Text>
            <Text style={styles.messageText}>
              The navigation to the recipe screen is working correctly. 
              This confirms that the routing system is functioning properly.
            </Text>
            <Text style={styles.messageText}>
              Next step: The full recipe screen with YouTube videos will be implemented.
            </Text>
          </View>
        </View>
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
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#a1a1aa',
    textAlign: 'center',
    marginBottom: 40,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    width: '100%',
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#e5e7eb',
    marginBottom: 8,
  },
  messageCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    width: '100%',
  },
  messageTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#10b981',
    marginBottom: 12,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    lineHeight: 24,
    marginBottom: 12,
  },
});
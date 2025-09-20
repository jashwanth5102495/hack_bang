import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Clock, Users, ChefHat, Star } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface Recipe {
  id: string;
  name: string;
  cuisine: string;
  cookingTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: number;
  rating: number;
  ingredients: string[];
  instructions: string[];
  tips?: string[];
}

interface RecipeModalProps {
  visible: boolean;
  onClose: () => void;
  recipe: Recipe | null;
}

export default function RecipeModal({ visible, onClose, recipe }: RecipeModalProps) {
  if (!recipe) return null;

  const difficultyColor = {
    Easy: '#10b981',
    Medium: '#f59e0b',
    Hard: '#ef4444'
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={['#000000', '#0a0a0a']}
        style={styles.container}
      >
        {/* Header */}
        <Animated.View 
          entering={FadeInDown.delay(200)}
          style={styles.header}
        >
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <X size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recipe</Text>
          <View style={styles.placeholder} />
        </Animated.View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Recipe Header */}
          <Animated.View 
            entering={FadeInUp.delay(400)}
            style={styles.recipeHeader}
          >
            <Text style={styles.recipeName}>{recipe.name}</Text>
            <Text style={styles.recipeCuisine}>{recipe.cuisine} Cuisine</Text>
            
            <View style={styles.recipeStats}>
              <View style={styles.statItem}>
                <Clock size={16} color="#3b82f6" />
                <Text style={styles.statText}>{recipe.cookingTime}</Text>
              </View>
              <View style={styles.statItem}>
                <Users size={16} color="#10b981" />
                <Text style={styles.statText}>{recipe.servings} servings</Text>
              </View>
              <View style={styles.statItem}>
                <ChefHat size={16} color={difficultyColor[recipe.difficulty]} />
                <Text style={styles.statText}>{recipe.difficulty}</Text>
              </View>
              <View style={styles.statItem}>
                <Star size={16} color="#fbbf24" />
                <Text style={styles.statText}>{recipe.rating}/5</Text>
              </View>
            </View>
          </Animated.View>

          {/* Ingredients */}
          <Animated.View 
            entering={FadeInUp.delay(600)}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.ingredientsList}>
              {recipe.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <View style={styles.ingredientBullet} />
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Instructions */}
          <Animated.View 
            entering={FadeInUp.delay(800)}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>Instructions</Text>
            <View style={styles.instructionsList}>
              {recipe.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Tips */}
          {recipe.tips && recipe.tips.length > 0 && (
            <Animated.View 
              entering={FadeInUp.delay(1000)}
              style={styles.section}
            >
              <Text style={styles.sectionTitle}>Chef's Tips</Text>
              <View style={styles.tipsList}>
                {recipe.tips.map((tip, index) => (
                  <View key={index} style={styles.tipItem}>
                    <Text style={styles.tipEmoji}>💡</Text>
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </LinearGradient>
    </Modal>
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
  closeButton: {
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
  recipeHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  recipeName: {
    fontSize: 28,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  recipeCuisine: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginBottom: 24,
  },
  recipeStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
  },
  ingredientsList: {
    gap: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3b82f6',
    marginTop: 8,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    lineHeight: 22,
  },
  instructionsList: {
    gap: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    lineHeight: 24,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#fbbf24',
  },
  tipEmoji: {
    fontSize: 16,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});
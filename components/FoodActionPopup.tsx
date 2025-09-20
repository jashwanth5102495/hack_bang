import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChefHat, ShoppingCart, X } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface FoodActionPopupProps {
  visible: boolean;
  onClose: () => void;
  onCook: () => void;
  onOrder: () => void;
  dishName?: string;
}

export default function FoodActionPopup({ 
  visible, 
  onClose, 
  onCook, 
  onOrder, 
  dishName = "this dish" 
}: FoodActionPopupProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <Animated.View 
          entering={FadeInUp.springify()}
          style={styles.popup}
        >
          <LinearGradient
            colors={['#1a1a1a', '#2a2a2a']}
            style={styles.popupGradient}
          >
            {/* Close Button */}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <X size={24} color="#ffffff" />
            </TouchableOpacity>

            {/* Header */}
            <Animated.View 
              entering={FadeInDown.delay(200)}
              style={styles.header}
            >
              <Text style={styles.emoji}>🍽️</Text>
              <Text style={styles.title}>What would you like to do?</Text>
              <Text style={styles.subtitle}>
                Choose how you'd like to enjoy {dishName}
              </Text>
            </Animated.View>

            {/* Action Buttons */}
            <Animated.View 
              entering={FadeInDown.delay(400)}
              style={styles.actionsContainer}
            >
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onCook}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#f59e0b', '#d97706']}
                  style={styles.actionGradient}
                >
                  <ChefHat size={32} color="#ffffff" />
                  <Text style={styles.actionTitle}>Cook</Text>
                  <Text style={styles.actionDescription}>
                    Get the recipe and cook it yourself
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={onOrder}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#3b82f6', '#2563eb']}
                  style={styles.actionGradient}
                >
                  <ShoppingCart size={32} color="#ffffff" />
                  <Text style={styles.actionTitle}>Order</Text>
                  <Text style={styles.actionDescription}>
                    Order from nearby restaurants
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  popup: {
    width: width * 0.85,
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  popupGradient: {
    padding: 24,
    paddingTop: 32,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    textAlign: 'center',
    lineHeight: 22,
  },
  actionsContainer: {
    gap: 16,
  },
  actionButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  actionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  actionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 20,
  },
});
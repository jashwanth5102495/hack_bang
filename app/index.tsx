import { useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function IndexScreen() {
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        router.replace('/recommendations');
      } else {
        router.replace('/(auth)/welcome');
      }
    } catch {
      router.replace('/(auth)/welcome');
    }
  };

  return null;
}
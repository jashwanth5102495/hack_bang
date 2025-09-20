import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  bio?: string;
  interests: string[];
  profileImage?: string;
  currentMood: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  saveUserData: (userData: any) => Promise<void>;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User> & { email: string; password: string }) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const saveUserData = async (userData: any) => {
    try {
      // Update the current user with the new data
      if (user) {
        const updatedUser: User = {
          ...user,
          name: userData.fullName || user.name,
          interests: userData.interests || user.interests,
          // Add any additional fields as needed
        };
        setUser(updatedUser);
        console.log('User data saved successfully:', updatedUser);
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock login - replace with actual API call
      const mockUser: User = {
        id: '1',
        name: 'Alex Johnson',
        email: email,
        age: 25,
        bio: 'Love exploring new places and meeting interesting people!',
        interests: ['Travel', 'Food', 'Music', 'Photography'],
        currentMood: 'Happy',
        profileImage: 'https://via.placeholder.com/150x150/3b82f6/ffffff?text=AJ'
      };
      
      setUser(mockUser);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: Partial<User> & { email: string; password: string }): Promise<boolean> => {
    try {
      // Mock registration - replace with actual API call
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || 'New User',
        email: userData.email,
        age: userData.age,
        bio: userData.bio,
        interests: userData.interests || [],
        currentMood: 'Happy',
        profileImage: `https://via.placeholder.com/150x150/3b82f6/ffffff?text=${userData.name?.charAt(0) || 'U'}`
      };
      
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = user !== null;

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      updateUser,
      saveUserData,
      isAuthenticated,
      login,
      logout,
      register
    }}>
      {children}
    </UserContext.Provider>
  );
};
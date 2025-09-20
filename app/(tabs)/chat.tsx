import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageCircle, Video, Phone, Send, Smile } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const mockChats = [
  {
    id: '1',
    name: 'Sarah Chen',
    lastMessage: 'That recipe looks amazing! 😍',
    time: '2m ago',
    unread: 2,
    mood: 'Creative',
    gradient: ['#ec4899', '#8b5cf6'],
    online: true,
  },
  {
    id: '2',
    name: 'Alex Rivera',
    lastMessage: 'Want to join a video call?',
    time: '15m ago',
    unread: 0,
    mood: 'Relaxed',
    gradient: ['#06b6d4', '#3b82f6'],
    online: true,
  },
  {
    id: '3',
    name: 'Maya Patel',
    lastMessage: 'Thanks for the music recommendation!',
    time: '1h ago',
    unread: 0,
    mood: 'Excited',
    gradient: ['#10b981', '#059669'],
    online: false,
  },
];

const mockMessages = [
  { id: '1', text: 'Hey! How are you feeling today?', sender: 'other', time: '2:30 PM' },
  { id: '2', text: 'I\'m feeling pretty creative! Just finished a mood session', sender: 'me', time: '2:32 PM' },
  { id: '3', text: 'That\'s awesome! I love the recipe suggestions you get when creative', sender: 'other', time: '2:33 PM' },
  { id: '4', text: 'Right? Want to try cooking something together over video call?', sender: 'me', time: '2:35 PM' },
];

export default function ChatScreen() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, send to Firestore
      setNewMessage('');
    }
  };

  if (selectedChat) {
    const chat = mockChats.find(c => c.id === selectedChat);
    if (!chat) return null;

    return (
      <LinearGradient
        colors={['#000000', '#0a0a0a']}
        style={styles.container}
      >
        <View style={styles.chatHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedChat(null)}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          
          <View style={styles.chatHeaderInfo}>
            <Text style={styles.chatHeaderName}>{chat.name}</Text>
            <View style={styles.chatHeaderMood}>
              <LinearGradient
                colors={chat.gradient}
                style={styles.moodIndicator}
              >
                <Text style={styles.moodText}>{chat.mood}</Text>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.chatHeaderActions}>
            <TouchableOpacity style={styles.headerActionButton}>
              <Phone size={20} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerActionButton}>
              <Video size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
          {mockMessages.map((message, index) => (
            <Animated.View
              key={message.id}
              entering={FadeInDown.delay(index * 100).springify()}
              style={[
                styles.messageContainer,
                message.sender === 'me' ? styles.myMessage : styles.otherMessage
              ]}
            >
              <View style={[
                styles.messageBubble,
                message.sender === 'me' ? styles.myMessageBubble : styles.otherMessageBubble
              ]}>
                <Text style={styles.messageText}>{message.text}</Text>
                <Text style={styles.messageTime}>{message.time}</Text>
              </View>
            </Animated.View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.messageInputContainer}>
            <TouchableOpacity style={styles.emojiButton}>
              <Smile size={20} color="#6b7280" />
            </TouchableOpacity>
            <TextInput
              style={styles.messageInput}
              placeholder="Type a message..."
              placeholderTextColor="#6b7280"
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
            />
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleSendMessage}
            >
              <Send size={20} color="#3b82f6" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#000000', '#0a0a0a', '#1a1a1a']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>
          Chat with people who share your mood
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {mockChats.map((chat, index) => (
          <Animated.View
            key={chat.id}
            entering={FadeInDown.delay(index * 150).springify()}
          >
            <TouchableOpacity
              style={styles.chatCard}
              onPress={() => setSelectedChat(chat.id)}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
                style={styles.chatCardGradient}
              >
                <View style={styles.chatInfo}>
                  <View style={styles.chatItemHeader}>
                    <View style={styles.nameContainer}>
                      <Text style={styles.chatName}>{chat.name}</Text>
                      {chat.online && <View style={styles.onlineIndicator} />}
                    </View>
                    <Text style={styles.chatTime}>{chat.time}</Text>
                  </View>
                  
                  <Text style={styles.lastMessage}>{chat.lastMessage}</Text>
                  
                  <View style={styles.chatFooter}>
                    <LinearGradient
                      colors={chat.gradient}
                      style={styles.chatMoodBadge}
                    >
                      <Text style={styles.chatMoodText}>{chat.mood}</Text>
                    </LinearGradient>
                    
                    {chat.unread > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{chat.unread}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ))}
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
    paddingBottom: 120, // Space for floating navigation
  },
  chatCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  chatCardGradient: {
    padding: 16,
  },
  chatInfo: {
    flex: 1,
  },
  chatItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  chatTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginBottom: 12,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatMoodBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chatMoodText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  unreadBadge: {
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  // Chat view styles
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#3b82f6',
  },
  chatHeaderInfo: {
    alignItems: 'center',
    flex: 1,
  },
  chatHeaderName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  chatHeaderMood: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  moodIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  moodText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  chatHeaderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  myMessageBubble: {
    backgroundColor: '#3b82f6',
  },
  otherMessageBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  inputContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  emojiButton: {
    padding: 8,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    padding: 8,
  },
});
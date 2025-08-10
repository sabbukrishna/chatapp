import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Send, Menu, MessageCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { router } from 'expo-router';
import MessageBubble from '@/components/MessageBubble';
import Sidebar from '@/components/Sidebar';

export default function ChatScreen() {
  const [inputText, setInputText] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { user } = useAuth();
  const { currentChat, sendMessage, isLoading, createNewChat } = useChat();

  useEffect(() => {
    if (!user) {
      router.replace('/');
      return;
    }
    
    // Create initial chat if none exists
    if (!currentChat) {
      createNewChat();
    }
  }, [user, currentChat]);

  useEffect(() => {
    if (currentChat?.messages.length) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [currentChat?.messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const message = inputText.trim();
    setInputText('');
    await sendMessage(message);
  };

  const TypingIndicator = () => (
    <View style={styles.typingContainer}>
      <View style={styles.typingBubble}>
        <Text style={styles.typingText}>AI is thinking...</Text>
        <View style={styles.typingDots}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => setSidebarVisible(true)}
        >
          <Menu color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentChat?.title || 'AI Chat'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.chatContainer}>
        {!currentChat?.messages.length ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <MessageCircle color="#6366F1" size={64} />
            </View>
            <Text style={styles.emptyTitle}>Start a conversation</Text>
            <Text style={styles.emptySubtext}>
              Ask me anything! I can help with coding, writing, analysis, and much more.
            </Text>
            <View style={styles.suggestionContainer}>
              <TouchableOpacity 
                style={styles.suggestionButton}
                onPress={() => setInputText("What can you help me with?")}
              >
                <Text style={styles.suggestionText}>What can you help me with?</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.suggestionButton}
                onPress={() => setInputText("Explain React Native to me")}
              >
                <Text style={styles.suggestionText}>Explain React Native to me</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={currentChat.messages}
            renderItem={({ item }) => <MessageBubble message={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
          />
        )}
        
        {isLoading && <TypingIndicator />}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#6B7280"
            multiline
            maxLength={2000}
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            <Send color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Sidebar 
        isVisible={sidebarVisible} 
        onClose={() => setSidebarVisible(false)} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  placeholder: {
    width: 40,
  },
  chatContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1F1F1F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    fontFamily: 'Inter-Bold',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    fontFamily: 'Inter-Regular',
  },
  suggestionContainer: {
    width: '100%',
    maxWidth: 300,
  },
  suggestionButton: {
    backgroundColor: '#1F1F1F',
    borderWidth: 1,
    borderColor: '#2F2F2F',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  suggestionText: {
    color: '#E5E7EB',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  messagesList: {
    padding: 16,
  },
  typingContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  typingBubble: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 16,
    maxWidth: '85%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginRight: 8,
    fontFamily: 'Inter-Regular',
  },
  typingDots: {
    flexDirection: 'row',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6B7280',
    marginHorizontal: 1,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#000000',
    alignItems: 'flex-end',
    paddingBottom: 34,
    outlineColor: 'transparent',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#303030',
    borderColor: '#303030',
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
    maxHeight: 80,
    textAlignVertical: 'bottom',
    fontFamily: 'Inter-Regular',
    minHeight: 8,
    outlineColor: 'transparent',
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
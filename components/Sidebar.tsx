import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  Plus,
  MessageSquare,
  Trash2,
  LogOut,
  X,
} from 'lucide-react-native';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { Chat } from '@/types/chat';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function Sidebar({ isVisible, onClose }: SidebarProps) {
  const { chats, currentChat, createNewChat, selectChat, deleteChat } = useChat();
  const { user, logout } = useAuth();

  if (!isVisible) return null;

  const handleChatSelect = (chat: Chat) => {
    selectChat(chat.id);
    onClose();
  };

  const handleNewChat = () => {
    createNewChat();
    onClose();
  };

  const handleDeleteChat = (chatId: string, event: any) => {
    event.stopPropagation();
    deleteChat(chatId);
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={[
        styles.chatItem,
        currentChat?.id === item.id && styles.activeChatItem,
      ]}
      activeOpacity={0.7}
      onPress={() => handleChatSelect(item)}
    >
      <View style={styles.chatItemContent}>
        <MessageSquare color="#9CA3AF" size={18} />
        <Text style={styles.chatTitle} numberOfLines={1}>
          {item.title}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={(e) => handleDeleteChat(item.id, e)}
      >
        <Trash2 color="#EF4444" size={16} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      <View style={styles.sidebar}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI Chat</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>

        {/* NEW CHAT */}
        <TouchableOpacity
          style={styles.newChatButton}
          activeOpacity={0.8}
          onPress={handleNewChat}
        >
          <Plus color="#FFFFFF" size={18} />
          <Text style={styles.newChatText}>New Chat</Text>
        </TouchableOpacity>

        {/* CHAT LIST */}
        <View style={styles.chatList}>
          <Text style={styles.sectionTitle}>Recent Chats</Text>
          {chats.length === 0 ? (
            <View style={styles.emptyState}>
              <MessageSquare color="#6B7280" size={32} />
              <Text style={styles.emptyText}>No chats yet</Text>
              <Text style={styles.emptySubtext}>
                Start a new conversation
              </Text>
            </View>
          ) : (
            <FlatList
              data={chats}
              renderItem={renderChatItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={logout}
            activeOpacity={0.7}
          >
            <LogOut color="#EF4444" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 230,
    backgroundColor: '#000000',
    paddingTop: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  newChatButton: {
    margin: 16,
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  newChatText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
  chatList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    marginVertical: 12,
    fontFamily: 'Inter-SemiBold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
    fontFamily: 'Inter-SemiBold',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    marginBottom: 6,
  },
  activeChatItem: {
    backgroundColor: '#1A1A1A',
  },
  chatItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chatTitle: {
    fontSize: 14,
    color: '#E5E7EB',
    marginLeft: 8,
    flex: 1,
    fontFamily: 'Inter-Regular',
  },
  deleteButton: {
    padding: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#1F1F1F',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  userEmail: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});

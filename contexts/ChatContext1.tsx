import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Chat, Message } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  createNewChat: () => void;
  selectChat: (chatId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  deleteChat: (chatId: string) => void;
  isLoading: boolean;
}

const ChatContext1 = createContext<ChatContextType | undefined>(undefined);

// Adjust this depending on emulator / physical device setup
const API_BASE_URL = 'http://192.168.0.8:8000';

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createNewChat = () => {
    const newChat: Chat = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChat(newChat);
  };

  const selectChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChat(chat);
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentChat) return;

    const userMessage: Message = {
      id: uuidv4(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    // Add user message to state
    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, userMessage],
      title:
        currentChat.messages.length === 0
          ? content.slice(0, 30) + '...'
          : currentChat.title,
      updatedAt: new Date(),
    };

    setCurrentChat(updatedChat);
    setChats(prev =>
      prev.map(c => (c.id === currentChat.id ? updatedChat : c))
    );

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();

      const assistantMessage: Message = {
        id: uuidv4(),
        content: data.reply, // Backend should return { reply: "Hey buddy" }
        role: 'assistant',
        timestamp: new Date(),
      };

      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, assistantMessage],
        updatedAt: new Date(),
      };

      setCurrentChat(finalChat);
      setChats(prev =>
        prev.map(c => (c.id === currentChat.id ? finalChat : c))
      );
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (currentChat?.id === chatId) {
      setCurrentChat(null);
    }
  };

  return (
    <ChatContext1.Provider
      value={{
        chats,
        currentChat,
        createNewChat,
        selectChat,
        sendMessage,
        deleteChat,
        isLoading,
      }}
    >
      {children}
    </ChatContext1.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext1);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

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

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const codeExample = `\`\`\`python
def hello():
    print("Hello from mobile!")
\`\`\``;

const content123 = `# ChatGPT Mobile Test

**Bold text**  
*Italic text*  
~~Strikethrough~~  

1. First item  
2. Second item  
3. Third item  

> This is a blockquote.  

[Click here to open Google](https://www.google.com)

---

**Code block:**  
${codeExample}`;

const mockAIResponses = [content123];

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

    // Update current chat with user message
    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, userMessage],
      title: currentChat.messages.length === 0 ? content.slice(0, 30) + '...' : currentChat.title,
      updatedAt: new Date(),
    };

    setCurrentChat(updatedChat);
    setChats(prev => prev.map(c => c.id === currentChat.id ? updatedChat : c));
    setIsLoading(true);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      const aiResponse = mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)];
      
      const assistantMessage: Message = {
        id: uuidv4(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
      };

      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, assistantMessage],
        updatedAt: new Date(),
      };

      setCurrentChat(finalChat);
      setChats(prev => prev.map(c => c.id === currentChat.id ? finalChat : c));
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
    <ChatContext.Provider value={{
      chats,
      currentChat,
      createNewChat,
      selectChat,
      sendMessage,
      deleteChat,
      isLoading,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
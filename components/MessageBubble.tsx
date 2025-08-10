import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Pressable,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Message } from '@/types/chat';
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';
import * as Speech from 'expo-speech';
import {
  Copy,
  Download,
  ThumbsUp,
  ThumbsDown,
  Edit3,
  Volume2,
} from 'lucide-react-native';
import MyMarkdown from './MyMarkdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomMarkdown from './CustomMarkdown';
import ManualMarkdown from './ManualMarkdown';

interface MessageBubbleProps {
  message: Message;
  onEdit?: (id: string, newText: string) => void;
}

export default function MessageBubble({ message, onEdit }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const [highlighted, setHighlighted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);
  const [hovered, setHovered] = useState(false);

  const triggerHighlight = () => {
    setHighlighted(true);
    setTimeout(() => setHighlighted(false), 400);
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(message.content);
    triggerHighlight();
    Alert.alert('Copied', 'Message copied to clipboard.');
  };

  const handleDownload = async () => {
    try {
      const fileUri = `${FileSystem.documentDirectory}assistant_message.txt`;
      await FileSystem.writeAsStringAsync(fileUri, message.content, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      triggerHighlight();
      Alert.alert('Downloaded', `Saved to ${fileUri}`);
    } catch {
      Alert.alert('Error', 'Failed to save file.');
    }
  };

  const handleFeedback = (type: 'up' | 'down') => {
    triggerHighlight();
    Alert.alert('Feedback', `You gave a ${type === 'up' ? 'thumbs up' : 'thumbs down'}`);
  };

  const handleVoice = () => {
    triggerHighlight();
    Speech.speak(message.content, { rate: 1.0, pitch: 1.0 });
  };

  const handleEdit = () => {
    setEditing(true);
    triggerHighlight();
  };

  const saveEdit = () => {
    if (onEdit) onEdit(message.id, editText);
    setEditing(false);
    triggerHighlight();
  };

  const markdownStyles = {
    body: {
    fontSize: 16,
    lineHeight: 22,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    },
    code_block: {
      backgroundColor: '#222222',
      color: '#FFFFFF',
      padding: 10,
      borderRadius: 6,
      fontFamily: 'Courier',
    },
    code_inline: {
      backgroundColor: '#333333',
      color: '#FFFFFF',
      borderRadius: 4,
      paddingHorizontal: 4,
      fontFamily: 'Courier',
    },
  };

  // Show icons when assistant or user hovered (user only)
  const showIcons = isAssistant || hovered;

  return (
    <Pressable
      onHoverIn={() => isUser && setHovered(true)}
      onHoverOut={() => isUser && setHovered(false)}
      style={[
        styles.messageWrapper,
        isUser ? styles.userWrapper : styles.assistantWrapper,
      ]}
    >
      <View style={styles.bubbleAndIcons}>
        {/* Message bubble */}
        <View
          style={[
            styles.messageBubble,
            isUser && styles.userBubble,
            highlighted && styles.highlighted,
          ]}
        >
          {editing ? (
            <View>
              <TextInput
                style={styles.editInput}
                value={editText}
                onChangeText={setEditText}
                multiline
              />
              <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
                <Markdown style={{ body: { color: '#fff', fontSize: 14 } }}>
                  Save
                </Markdown>
              </TouchableOpacity>
            </View>
          ) : (
            
            <ManualMarkdown content={message.content} />
          )}
        </View>

        {/* Icons row — now part of the flow */}
        {showIcons && (
          <View style={[
            styles.iconRow,
            isUser ? styles.iconRowRight : styles.iconRowLeft
          ]}>
            <TouchableOpacity onPress={handleCopy} style={styles.iconButton}>
              <Copy size={18} color="#ccc" />
            </TouchableOpacity>

            {isAssistant && (
              <>
                <TouchableOpacity onPress={() => handleFeedback('up')} style={styles.iconButton}>
                  <ThumbsUp size={18} color="#ccc" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleFeedback('down')} style={styles.iconButton}>
                  <ThumbsDown size={18} color="#ccc" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDownload} style={styles.iconButton}>
                  <Download size={18} color="#ccc" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleVoice} style={styles.iconButton}>
                  <Volume2 size={18} color="#ccc" />
                </TouchableOpacity>
              </>
            )}

            {isUser && hovered && (
              <TouchableOpacity onPress={handleEdit} style={styles.iconButton}>
                <Edit3 size={18} color="#ccc" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // wrapper for each message row
  messageWrapper: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 8,
  },

  assistantWrapper: {
    alignItems: 'flex-start',
  },
  userWrapper: {
    alignItems: 'flex-end',
  },

  bubbleAndIcons: {
    flexDirection: 'column',
    maxWidth: '85%',
  },

  messageBubble: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  
  userBubble: {
    backgroundColor: '#303030',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 24,
  },

  iconRow: {
    flexDirection: 'row',
    marginTop: 4, // small gap from bubble
  },
  iconRowLeft: {
    justifyContent: 'flex-start',
  },
  iconRowRight: {
    justifyContent: 'flex-end',
  },

  iconButton: {
    padding: 6,
    marginLeft: 6,
    borderRadius: 6,
  },

  // edit input inside bubble
  editInput: {
    backgroundColor: '#1F1F1F',
    color: '#fff',
    borderRadius: 6,
    padding: 6,
    minHeight: 36,
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    marginTop: 6,
    padding: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
});

import React from 'react';
import { ScrollView, StyleSheet, Linking } from 'react-native';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';

const markdownItInstance = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

interface CustomMarkdownProps {
  content: string;
}

const CustomMarkdown: React.FC<CustomMarkdownProps> = ({ content }) => {
  return (
    <ScrollView style={styles.container}>
      <Markdown
        style={markdownStyles}
        markdownit={markdownItInstance}
        onLinkPress={(url) => {
          Linking.openURL(url);
          return true;
        }}
      >
        {content}
      </Markdown>
    </ScrollView>
  );
};

export default CustomMarkdown;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});

const markdownStyles = {
  body: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
  heading1: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  heading2: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  heading3: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  paragraph: {
    marginBottom: 12,
  },
  link: {
    color: '#1E90FF',
  },
  code_inline: {
    backgroundColor: '#333333',
    color: '#f8f8f8',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: 'Courier',
    fontSize: 14,
  },
  code_block: {
    backgroundColor: '#2d2d2d',
    color: '#f8f8f2',
    padding: 12,
    borderRadius: 8,
    fontFamily: 'Courier',
    fontSize: 14,
    marginVertical: 8,
  },
  list_item: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 6,
  },
  table: {
    borderWidth: 1,
    borderColor: '#444',
    marginVertical: 12,
  },
  th: {
    backgroundColor: '#333',
    color: '#fff',
    fontWeight: 'bold',
    padding: 8,
  },
  td: {
    borderWidth: 1,
    borderColor: '#444',
    padding: 8,
    color: '#fff',
  },
};
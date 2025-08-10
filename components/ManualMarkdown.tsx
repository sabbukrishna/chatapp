import React from 'react';
import { ScrollView, Text, View, StyleSheet, Linking, Platform } from 'react-native';
import { Lexer, Token, Tokens } from 'marked';

interface ManualMarkdownProps {
  content: string;
}

// Font family fallbacks per platform
const MONOSPACE_FONT = Platform.select({
  ios: 'Courier New',
  android: 'monospace',
  default: 'Courier New',
});

const styles = StyleSheet.create({
  container: {
    // // ❌ No flex: 1 — for chat bubbles, let parent control layout
    // padding: 16,
    // backgroundColor: '#121212',
  },
  paragraph: {
    color: '#e0e0e0',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  heading1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 16,
  },
  heading2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 14,
  },
  heading3: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 12,
  },
  codeBlock: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  codeBlockText: {
    fontFamily: MONOSPACE_FONT,
    fontSize: 14,
    lineHeight: 20,
    color: '#dcdcaa',
  },
  inlineCode: {
    backgroundColor: '#3c3c3c',
    color: '#dcdcaa',
    fontFamily: MONOSPACE_FONT,
    fontSize: 14,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  link: {
    color: '#1E90FF',
    textDecorationLine: 'underline',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  listBullet: {
    color: '#ffffff',
    marginRight: 6,
    fontSize: 16,
    lineHeight: 24,
  },
  listItemContent: {
    color: '#e0e0e0',
    fontSize: 16,
    lineHeight: 24,
    flexShrink: 1,
  },
  horizontalRule: {
    height: 1,
    backgroundColor: '#383838',
    marginVertical: 16,
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: '#606060',
    paddingLeft: 12,
    marginVertical: 8,
  },
  blockquoteText: {
    color: '#bbbbbb',
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },
});

// Type guards
const hasText = (token: Token): token is Token & { text: string } =>
  'text' in token && typeof (token as any).text === 'string';

const hasTokens = (token: Token): token is Token & { tokens: Token[] } =>
  'tokens' in token && Array.isArray((token as any).tokens);

// ====================
// Recursive: Render Inline Tokens (with link support)
// ====================
const renderTokenChildren = (tokens: Token[] | undefined): React.ReactNode[] => {
  if (!tokens || !Array.isArray(tokens)) return [];

  return tokens
    .map((token: Token, index: number) => {
      switch (token.type) {
        case 'text':
          return <Text key={index}>{hasText(token) ? token.text : ''}</Text>;

        case 'codespan':
          return (
            <Text key={index} style={styles.inlineCode}>
              {hasText(token) ? token.text : ''}
            </Text>
          );

        case 'em':
          return (
            <Text key={index} style={{ fontStyle: 'italic' }}>
              {renderTokenChildren(hasTokens(token) ? token.tokens : [])}
            </Text>
          );

        case 'strong':
          return (
            <Text key={index} style={{ fontWeight: 'bold' }}>
              {renderTokenChildren(hasTokens(token) ? token.tokens : [])}
            </Text>
          );

        case 'del':
          return (
            <Text key={index} style={{ textDecorationLine: 'line-through' }}>
              {renderTokenChildren(hasTokens(token) ? token.tokens : [])}
            </Text>
          );

        case 'link':
          return (
            <Text
              key={index}
              style={styles.link}
              onPress={() => {
                const href = (token as Tokens.Link).href;
                if (href) Linking.openURL(href);
              }}
            >
              {renderTokenChildren(hasTokens(token) ? token.tokens : [])}
            </Text>
          );

        case 'br':
          return <Text key={index}>{'\n'}</Text>;

        default:
          return hasText(token) ? <Text key={index}>{token.text}</Text> : null;
      }
    })
    .filter(Boolean) as React.ReactNode[];
};

// ====================
// Render Block Tokens
// ====================
const renderTokens = (tokens: Token[]): React.ReactNode[] => {
  return tokens
    .map((token: Token, i: number) => {
      switch (token.type) {
        case 'heading':
          const headingStyle =
            styles[`heading${token.depth}` as keyof typeof styles];
          return (
            <Text key={i} style={headingStyle || styles.heading3}>
              {renderTokenChildren(hasTokens(token) ? token.tokens : [])}
            </Text>
          );

        case 'paragraph':
          return (
            <Text key={i} style={styles.paragraph}>
              {renderTokenChildren(hasTokens(token) ? token.tokens : [])}
            </Text>
          );

        case 'code':
          return (
            <View key={i} style={styles.codeBlock}>
              <Text style={styles.codeBlockText} selectable>
                {hasText(token) ? token.text : ''}
              </Text>
            </View>
          );

        case 'list':
          const items = (token as Tokens.List).items.map((item, idx) => (
            <View key={idx} style={styles.listItem}>
              <Text style={styles.listBullet}>•</Text>
              <Text style={styles.listItemContent}>
                {renderTokenChildren(hasTokens(item) ? item.tokens : [])}
              </Text>
            </View>
          ));
          return <View key={i}>{items}</View>;

        case 'hr':
          return <View key={i} style={styles.horizontalRule} />;

        case 'blockquote':
          return (
            <View key={i} style={styles.blockquote}>
              <Text style={styles.blockquoteText}>
                {renderTokenChildren(hasTokens(token) ? token.tokens : [])}
              </Text>
            </View>
          );

        case 'space':
        case 'br':
          return null;

        default:
          if (hasTokens(token)) {
            return (
              <Text key={i} style={styles.paragraph}>
                {renderTokenChildren(token.tokens)}
              </Text>
            );
          }
          if (hasText(token)) {
            return (
              <Text key={i} style={styles.paragraph}>
                {token.text}
              </Text>
            );
          }
          return null;
      }
    })
    .filter(Boolean) as React.ReactNode[];
};

// ====================
// Main Component
// ====================
export default function ManualMarkdown({ content }: ManualMarkdownProps) {
  try {
    const tokens = Lexer.lex(content);
    return <View style={styles.container}>{renderTokens(tokens)}</View>;
  } catch (err) {
    console.error('ManualMarkdown parsing error:', err);
    return (
      <View style={styles.container}>
        <Text style={[styles.paragraph, { color: '#ff4444' }]}>
          ❌ Error rendering Markdown.
        </Text>
      </View>
    );
  }
}
import React from 'react';
import Markdown from 'react-native-markdown-display';
import { Text, View } from 'react-native';

const markdownStyles = {
  body: {
    fontSize: 16,
    lineHeight: 22,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
  },
};

const rules = {
  code_block: (node: any, children: any, parent: any, styles: any) => {
    return (
      <View
        key={node.key}
        style={{
          backgroundColor: '#e8403d', // Red background
          padding: 10,
          borderRadius: 6,
          marginVertical: 8,
        }}
      >
        <Text
          style={{
            color: '#fff', // White text for contrast
            fontFamily: 'monospace',
            fontSize: 14,
            lineHeight: 20,
          }}
        >
          {node.content}
        </Text>
      </View>
    );
  },
  code_inline: (node: any, children: any, parent: any, styles: any) => {
    return (
      <Text
        key={node.key}
        style={{
          backgroundColor: '#e8403d',
          color: '#fff',
          borderRadius: 4,
          paddingHorizontal: 4,
          fontFamily: 'monospace',
        }}
      >
        {node.content}
      </Text>
    );
  },
};

export default function MyMarkdown({ content }: { content: string }) {
  return (
    <Markdown style={markdownStyles} rules={rules}>
      {content}
    </Markdown>
  );
}

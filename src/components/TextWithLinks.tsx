/**
 * TextWithLinks - Intelligent text component that auto-detects and makes links clickable
 * 
 * FUNCTIONALITY:
 *   - Parses text for URLs and phone numbers
 *   - Renders them as clickable elements
 *   - URLs open in device browser
 *   - Phone numbers open device dialer
 * 
 * SPECIAL HANDLING:
 *   - 112 (emergency number) is NOT made clickable
 *   - This prevents accidental emergency calls
 *   - Pattern specifically excludes "112" from phone detection
 * 
 * SUPPORTED FORMATS:
 *   - URLs: www.example.com, https://example.com
 *   - Phones: "70 201 201" style (Danish format with spaces)
 *   - Preserves surrounding text and formatting
 * 
 * USAGE:
 *   - Used in disclaimer text on INFO page
 *   - Allows mentioning Livslinjen (70 201 201) and website as clickable
 *   - While keeping "112" as plain text
 * 
 * ALGORITHM:
 *   1. Regex extracts all URLs and phone numbers
 *   2. Excludes "112" specifically
 *   3. Sorts matches by position in text
 *   4. Splits text into parts (plain text, links, phones)
 *   5. Renders each part with appropriate styling/behavior
 */

import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity } from 'react-native';

type TextPart = {
  text: string;
  type: 'text' | 'phone' | 'url';
};

interface TextWithLinksProps {
  children: string;
  style?: any;
}

export default function TextWithLinks({ children, style }: TextWithLinksProps) {
  // Parse text for URLs and phone numbers (but not 112)
  const parseText = (text: string): TextPart[] => {
    const parts: TextPart[] = [];
    
    // Pattern for URLs (www.example.com or https://example.com)
    const urlPattern = /((?:https?:\/\/)?(?:www\.)?[\w-]+\.[\w.-]+(?:\/[\w.-]*)*)/g;
    
    // Pattern for phone numbers (but not 112)
    // Matches: "70 201 201" style numbers, but excludes "112"
    const phonePattern = /\b(?!112\b)(\d{2,3}\s\d{2,3}\s\d{2,3})\b/g;
    
    let lastIndex = 0;
    const matches: Array<{ index: number; length: number; value: string; type: 'phone' | 'url' }> = [];
    
    // Find all URLs
    let match;
    while ((match = urlPattern.exec(text)) !== null) {
      matches.push({
        index: match.index,
        length: match[0].length,
        value: match[0],
        type: 'url',
      });
    }
    
    // Find all phone numbers
    while ((match = phonePattern.exec(text)) !== null) {
      matches.push({
        index: match.index,
        length: match[0].length,
        value: match[0],
        type: 'phone',
      });
    }
    
    // Sort matches by index
    matches.sort((a, b) => a.index - b.index);
    
    // Build parts array
    matches.forEach((m) => {
      // Add text before match
      if (m.index > lastIndex) {
        parts.push({
          text: text.substring(lastIndex, m.index),
          type: 'text',
        });
      }
      
      // Add match
      parts.push({
        text: m.value,
        type: m.type,
      });
      
      lastIndex = m.index + m.length;
    });
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        text: text.substring(lastIndex),
        type: 'text',
      });
    }
    
    // If no matches found, return original text
    if (parts.length === 0) {
      parts.push({ text, type: 'text' });
    }
    
    return parts;
  };

  const handlePress = (part: TextPart) => {
    if (part.type === 'phone') {
      const phoneNumber = part.text.replace(/\s/g, '');
      Linking.openURL(`tel:${phoneNumber}`);
    } else if (part.type === 'url') {
      let url = part.text;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      Linking.openURL(url);
    }
  };

  const parts = parseText(children);

  return (
    <Text style={style}>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return <Text key={index}>{part.text}</Text>;
        }
        
        return (
          <Text
            key={index}
            style={styles.link}
            onPress={() => handlePress(part)}
          >
            {part.text}
          </Text>
        );
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  link: {
    color: '#0a7ea4',
    textDecorationLine: 'underline',
  },
});

/**
 * Footer - Copyright footer displayed on all app pages
 * 
 * FUNCTIONALITY:
 *   - Simple, consistent branding element
 *   - Shows "Meta Corehypnose ©" text
 *   - Fixed at bottom of all screens
 * 
 * POSITIONING:
 *   - IMPORTANT: Footer must be OUTSIDE ScrollView
 *   - If inside ScrollView, it will "jump" as content scrolls
 *   - Correct pattern: <ScrollView>content</ScrollView><Footer />
 * 
 * STYLING:
 *   - Brand color: #256f86 (teal) background
 *   - White text
 *   - Padding for touch-friendly height
 *   - Centered content
 * 
 * USED ON:
 *   - All main screens (Hub, HubDetail, ProcessCard, etc.)
 *   - Provides visual consistency across app
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>Meta Corehypnose ©</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#256f86',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

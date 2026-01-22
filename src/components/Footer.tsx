/**
 * Footer - Copyright footer displayed on all pages
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

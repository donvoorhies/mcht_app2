/**
 * ContactBox - Therapist contact information
 * Display contact details for Lars Nissen Corell
 */

import React from 'react';
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ContactBox() {
  const handleWebsitePress = () => {
    Linking.openURL('https://www.corehypnose.dk/');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:27204671');
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:kontakt@corehypnose.dk');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/lars.png')}
        style={styles.photo}
        resizeMode="cover"
      />
      <Text style={styles.heading}>Kontakt terapeut</Text>
      
      <Text style={styles.name}>Lars Nissen Corell</Text>
      <Text style={styles.title}>Metakognitiv terapeut & Hypnotisør</Text>
      
      <View style={styles.divider} />
      
      <TouchableOpacity onPress={handlePhonePress} style={styles.contactItem}>
        <Text style={styles.label}>Telefon:</Text>
        <Text style={styles.value}>27 20 46 71</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={handleEmailPress} style={styles.contactItem}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>kontakt@corehypnose.dk</Text>
      </TouchableOpacity>
      
      <View style={styles.contactItem}>
        <Text style={styles.label}>Adresse:</Text>
        <Text style={styles.value}>Valby Tingsted 7, 2500 Valby</Text>
      </View>
      
      <View style={styles.divider} />
      
      <TouchableOpacity onPress={handleWebsitePress} style={styles.websiteButton}>
        <Text style={styles.websiteText}>www.corehypnose.dk</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#256f86',
    padding: 20,
    borderRadius: 8,
    marginVertical: 20,
    alignItems: 'center',
    // Shadow for iOS
    shadowColor: '#256f86',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    // Shadow for Android
    elevation: 6,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#FFF',
    opacity: 0.3,
    marginVertical: 12,
  },
  contactItem: {
    marginBottom: 10,
    alignSelf: 'stretch',
  },
  label: {
    fontSize: 12,
    color: '#FFF',
    opacity: 0.8,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
  websiteButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 4,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Shadow for Android
    elevation: 2,
  },
  websiteText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
});

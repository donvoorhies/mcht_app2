/**
 * Sessions Screen - Process cards for a selected hub
 * Displays process cards for therapeutic content
 */

import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { t } from '../i18n';
import { getHubCards, hubs, type ProcessCard } from '../flow/flow.static.da';

type NavigationProp = NativeStackNavigationProp<any>;
type SessionsRouteProp = RouteProp<{ Sessions: { hubId: string } }, 'Sessions'>;

export default function SessionsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SessionsRouteProp>();
  
  const hubId = route.params?.hubId;
  const hub = hubs.find(h => h.id === hubId);
  const cards = hubId ? getHubCards(hubId) : [];

  const handleCardPress = (card: ProcessCard) => {
    // Navigate to Card screen to display therapeutic content
    navigation.navigate('Card', { uid: card.uid });
  };

  if (cards.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>{t.flow.noCardsInHub}</Text>
      </View>
    );
  }

  const renderCard = ({ item }: { item: ProcessCard }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleCardPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {item.uid.startsWith('TODO') && (
          <Text style={styles.cardUidPlaceholder}>UID: {item.uid}</Text>
        )}
      </View>
      <Text style={styles.cardArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹ Tilbage</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{hub?.title || t.sessions.title}</Text>
      </View>

      <FlatList
        data={cards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  backText: {
    fontSize: 24,
    color: '#0a7ea4',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  listContent: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardUidPlaceholder: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  cardArrow: {
    fontSize: 28,
    color: '#0a7ea4',
    marginLeft: 12,
  },
});

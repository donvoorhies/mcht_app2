/**
 * OverviewScreen - Display user's progress and recommendations
 * Shows visited hubs, completion status, and next steps
 */

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { progressStore, type ProgressData } from '../stores/progressStore';
import { hubs, processCards } from '../content';
import Footer from '../components/Footer';

type NavigationProp = NativeStackNavigationProp<any>;

// Hub structure for progress tracking
const hubStructure = [
  { id: 'start', title: 'START', processCardCount: 2 },
  { id: 'train', title: 'TRÆN', processCardCount: 3 },
  { id: 'stopcas', title: 'STOP CAS', processCardCount: 4 },
  { id: 'test', title: 'TEST', processCardCount: 2 },
  { id: 'maintenance', title: 'VEDLIGEHOLDELSE', processCardCount: 2 },
];

export default function OverviewScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [progress, setProgress] = useState<ProgressData | null>(null);

  // Load progress when screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadProgress = async () => {
        const data = await progressStore.getProgress();
        setProgress(data);
      };
      loadProgress();
    }, [])
  );

  const getHubProgress = (hubId: string) => {
    if (!progress) return { visited: false, completion: 0 };
    
    const visited = progress.visitedHubs.includes(hubId);
    const hub = hubs[hubId];
    if (!hub || !hub.nextLinks) return { visited, completion: 0 };
    
    const totalCards = hub.nextLinks.length;
    const visitedCards = hub.nextLinks.filter(link => 
      progress.visitedProcessCards.includes(link.target)
    ).length;
    
    const completion = totalCards > 0 ? Math.round((visitedCards / totalCards) * 100) : 0;
    
    return { visited, completion };
  };

  const getRecommendedNext = () => {
    if (!progress) return null;
    
    // Find first hub not completed
    for (const hub of hubStructure) {
      const { completion } = getHubProgress(hub.id);
      if (completion < 100) {
        return {
          hubId: hub.id,
          hubTitle: hub.title,
          message: completion === 0 
            ? `Start med ${hub.title}` 
            : `Fortsæt ${hub.title} (${completion}% gennemført)`,
        };
      }
    }
    
    // All complete
    return {
      hubId: 'maintenance',
      hubTitle: 'VEDLIGEHOLDELSE',
      message: 'Genbesøg VEDLIGEHOLDELSE for at fastholde fremskridt',
    };
  };

  const getTotalProgress = () => {
    if (!progress) return 0;
    
    const totalProcessCards = Object.keys(processCards).length;
    const visitedCount = progress.visitedProcessCards.length;
    
    return totalProcessCards > 0 ? Math.round((visitedCount / totalProcessCards) * 100) : 0;
  };

  const recommendation = getRecommendedNext();
  const totalProgress = getTotalProgress();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹ Tilbage</Text>
        </TouchableOpacity>
        <Image
          source={require('../assets/images/MCHT-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <Text style={styles.title}>OVERBLIK</Text>
        <Text style={styles.subtitle}>Din fremgang i MCT-forløbet</Text>

        {/* Total Progress */}
        <View style={styles.totalProgressContainer}>
          <Text style={styles.totalProgressLabel}>Samlet fremgang</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${totalProgress}%` }]} />
          </View>
          <Text style={styles.totalProgressText}>{totalProgress}% gennemført</Text>
        </View>

        {/* Recommended Next */}
        {recommendation && (
          <TouchableOpacity
            style={styles.recommendationCard}
            onPress={() => navigation.navigate('HubDetail', { hubId: recommendation.hubId })}
            activeOpacity={0.7}
          >
            <Text style={styles.recommendationLabel}>📍 Anbefalet næste skridt</Text>
            <Text style={styles.recommendationText}>{recommendation.message}</Text>
            <Text style={styles.recommendationArrow}>›</Text>
          </TouchableOpacity>
        )}

        {/* Hub Progress */}
        <Text style={styles.sectionTitle}>Forløb</Text>
        {hubStructure.map((hub) => {
          const { visited, completion } = getHubProgress(hub.id);
          const hubContent = hubs[hub.id];
          
          return (
            <TouchableOpacity
              key={hub.id}
              style={styles.hubProgressCard}
              onPress={() => navigation.navigate('HubDetail', { hubId: hub.id })}
              activeOpacity={0.7}
            >
              <View style={styles.hubProgressContent}>
                <Text style={styles.hubProgressTitle}>{hubContent?.title || hub.title}</Text>
                <View style={styles.progressBarSmall}>
                  <View style={[styles.progressBarFill, { width: `${completion}%` }]} />
                </View>
                <Text style={styles.hubProgressPercent}>{completion}%</Text>
              </View>
              <Text style={styles.hubProgressArrow}>›</Text>
            </TouchableOpacity>
          );
        })}

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Statistik</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Besøgte forløb:</Text>
            <Text style={styles.statValue}>{progress?.visitedHubs.length || 0} / {hubStructure.length}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Besøgte proceskort:</Text>
            <Text style={styles.statValue}>{progress?.visitedProcessCards.length || 0} / {Object.keys(processCards).length}</Text>
          </View>
          {progress?.lastVisitedAt && (
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Sidst aktiv:</Text>
              <Text style={styles.statValue}>
                {new Date(progress.lastVisitedAt).toLocaleDateString('da-DK')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: 8,
  },
  backText: {
    fontSize: 18,
    color: '#0a7ea4',
    fontWeight: '600',
  },
  logo: {
    width: 50,
    height: 50,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  totalProgressContainer: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  totalProgressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#256f86',
    borderRadius: 6,
  },
  totalProgressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  recommendationCard: {
    backgroundColor: '#e8f4f8',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#0a7ea4',
    // Shadow
    shadowColor: '#256f86',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0a7ea4',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  recommendationArrow: {
    position: 'absolute',
    right: 20,
    top: '50%',
    fontSize: 28,
    color: '#0a7ea4',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },
  hubProgressCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    // Shadow
    shadowColor: '#256f86',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  hubProgressContent: {
    flex: 1,
  },
  hubProgressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  progressBarSmall: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0a7ea4',
    borderRadius: 3,
  },
  hubProgressPercent: {
    fontSize: 12,
    color: '#666',
  },
  hubProgressArrow: {
    fontSize: 24,
    color: '#0a7ea4',
    marginLeft: 12,
  },
  statsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});

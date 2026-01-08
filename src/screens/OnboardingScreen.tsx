import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    AccessibilityInfo,
    Animated,
    Dimensions,
    findNodeHandle,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/theme';
import { onboardingStore } from '../stores/onboardingStore';
import OnboardingSlide from './OnboardingSlide';

const { width } = Dimensions.get('window');

const slides = [
  {
    key: 'welcome',
    title: 'Velkommen til MCHT',
    description: 'En enkel vej til daglig refleksion og træning — på dine betingelser.',
    image: require('../assets/images/CoreHyponoselogo.png'),
    imageAccessibilityLabel: 'Velkomstillustration',
  },
  {
    key: 'programs',
    title: 'Personlige programmer',
    description: 'Følg strukturerede programmer og korte sessioner, skræddersyet til din hverdag.',
    image: require('../assets/images/CoreHyponoselogo.png'),
    imageAccessibilityLabel: 'Programillustration',
  },
  {
    key: 'reflect',
    title: 'Reflekter og lær',
    description: 'Skriv korte refleksioner, gem fremskridt, og se mønstre over tid.',
    image: require('../assets/images/CoreHyponoselogo.png'),
    imageAccessibilityLabel: 'Refleksionsillustration',
  },
  {
    key: 'privacy',
    title: 'Dit privatliv først',
    description: 'Vi gemmer kun det, du aktivt skriver. Ingen deling uden dit samtykke.',
    image: require('../assets/images/CoreHyponoselogo.png'),
    imageAccessibilityLabel: 'Privatlivillustration',
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation<any>();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<any> | null>(null);
  const ctaRef = useRef<any>(null);
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const onNext = useCallback(async () => {
    if (index < slides.length - 1) {
      const next = index + 1;
      Animated.timing(fadeAnim, { toValue: 0, duration: 160, useNativeDriver: true }).start(() => {
        listRef.current?.scrollToIndex({ index: next });
        setIndex(next);
        Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
      });
      return;
    }

    await onboardingStore.setHasSeenOnboarding(true);
    navigation.reset({ index: 0, routes: [{ name: 'WebView' }] });
  }, [index, navigation, fadeAnim]);

  const onSkip = useCallback(async () => {
    await onboardingStore.setHasSeenOnboarding(true);
    navigation.reset({ index: 0, routes: [{ name: 'WebView' }] });
  }, [navigation]);

  const renderItem = ({ item }: { item: typeof slides[number] }) => (
    <View style={{ width }}>
      <OnboardingSlide
        title={item.title}
        description={item.description}
        image={item.image}
        imageAccessibilityLabel={item.imageAccessibilityLabel}
      />
    </View>
  );

  useEffect(() => {
    // Announce initial slide after mount
    const slide = slides[index];
    const msg = `${slide.title}. ${slide.description}`;
    const t = setTimeout(() => AccessibilityInfo.announceForAccessibility(msg), 300);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top, paddingBottom: insets.bottom }]}> 
      <View style={styles.header}>
        <TouchableOpacity onPress={onSkip} accessibilityLabel="Skip onboarding" accessibilityRole="button">
          <Text style={styles.skip}>Spring over</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(i) => i.key}
        renderItem={({ item, index: itemIndex }) => (
          <Animated.View style={{ width, opacity: fadeAnim }}>
            {renderItem({ item })}
          </Animated.View>
        )}
        onMomentumScrollEnd={(ev) => {
          const page = Math.round(ev.nativeEvent.contentOffset.x / width);
          setIndex(page);

          // Announce slide change for screen readers slightly after change
          try {
            const slide = slides[page];
            const msg = `${slide.title}. ${slide.description}`;
            setTimeout(() => AccessibilityInfo.announceForAccessibility(msg), 250);
          } catch (e) {
            // ignore
          }
        }}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === index ? styles.dotActive : null]} />
          ))}
        </View>

        <TouchableOpacity
          ref={ctaRef}
          accessibilityRole="button"
          accessibilityLabel={index === slides.length - 1 ? 'Kom i gang — fuldfør onboarding' : 'Næste'}
          onPress={onNext}
          style={styles.cta}
        >
          <Text style={styles.ctaText}>{index === slides.length - 1 ? 'Kom i gang' : 'Næste'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    alignItems: 'flex-end',
  },
  skip: {
    color: Colors.light.tint,
    fontSize: 15,
  },
  footer: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#D1D5D8',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: Colors.light.tint,
    width: 18,
    borderRadius: 10,
  },
  cta: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  ctaText: {
    color: '#fff',
    fontWeight: '700',
  },
});

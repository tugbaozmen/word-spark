import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { getDueFlashcards, getLearnedFlashcardCount, updateFlashcardReview } from '../db/flashcardRepository';
import { Flashcard } from '../types/flashcard';
import { calculateSm2, Sm2Grade, SM2_GRADE } from '../utils/sm2';
import { todayIsoDate } from '../utils/date';

const GRADE_BUTTONS: { grade: Sm2Grade; label: string; color: string }[] = [
  { grade: SM2_GRADE.HARD, label: 'Zor', color: '#e05d44' },
  { grade: SM2_GRADE.GOOD, label: 'Orta', color: '#e0a83c' },
  { grade: SM2_GRADE.EASY, label: 'Kolay', color: '#5ab55a' },
  { grade: SM2_GRADE.VERY_EASY, label: 'Çok Kolay', color: '#3d8bd6' },
];

export default function StudyScreen() {
  const [queue, setQueue] = useState<Flashcard[]>([]);
  const [learnedCount, setLearnedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnswerShown, setIsAnswerShown] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function load() {
        const [due, learned] = await Promise.all([
          getDueFlashcards(todayIsoDate()),
          getLearnedFlashcardCount(),
        ]);
        if (isActive) {
          setQueue(due);
          setLearnedCount(learned);
          setIsAnswerShown(false);
          flipAnim.setValue(0);
          setIsLoading(false);
        }
      }

      load();

      return () => {
        isActive = false;
      };
    }, [flipAnim])
  );

  const currentCard = queue[0];

  function showAnswer() {
    setIsAnswerShown(true);
    Animated.timing(flipAnim, {
      toValue: 180,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }

  async function handleGrade(grade: Sm2Grade) {
    if (!currentCard) return;

    const result = calculateSm2(currentCard, grade);
    await updateFlashcardReview(currentCard.id, result);

    const wasFirstReview = currentCard.repetition === 0;
    const remaining = queue.slice(1);
    setQueue(remaining);
    setIsAnswerShown(false);
    flipAnim.setValue(0);
    if (wasFirstReview) {
      setLearnedCount((count) => count + 1);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!currentCard) {
    return (
      <View style={styles.centered}>
        <Text style={styles.congratsEmoji}>🚀</Text>
        <Text style={styles.congratsTitle}>Bugünkü tekrarların tamamlandı!</Text>
        <Text style={styles.congratsSubtitle}>
          Şimdiye kadar toplam {learnedCount} kelime öğrendin.
        </Text>
      </View>
    );
  }

  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backRotate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });
  const frontOpacity = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>{queue.length} kart kaldı</Text>

      <View style={styles.cardArea}>
        <Animated.View
          style={[
            styles.card,
            styles.cardFace,
            { opacity: frontOpacity, transform: [{ rotateY: frontRotate }] },
          ]}
        >
          <Text style={styles.word}>{currentCard.word}</Text>
          {!isAnswerShown && (
            <Pressable style={styles.showAnswerButton} onPress={showAnswer}>
              <Text style={styles.showAnswerButtonText}>Cevabı Göster</Text>
            </Pressable>
          )}
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            styles.cardFace,
            styles.cardBack,
            { opacity: backOpacity, transform: [{ rotateY: backRotate }] },
          ]}
        >
          <Text style={styles.wordSmall}>{currentCard.word}</Text>
          <View style={styles.defSection}>
            <Text style={styles.defLabel}>Frontend</Text>
            <Text style={styles.defText}>{currentCard.frontendDef}</Text>
          </View>
          <View style={styles.defSection}>
            <Text style={styles.defLabel}>Backend</Text>
            <Text style={styles.defText}>{currentCard.backendDef}</Text>
          </View>
        </Animated.View>
      </View>

      {isAnswerShown && (
        <View style={styles.gradeRow}>
          {GRADE_BUTTONS.map(({ grade, label, color }) => (
            <Pressable
              key={grade}
              style={[styles.gradeButton, { backgroundColor: color }]}
              onPress={() => handleGrade(grade)}
            >
              <Text style={styles.gradeButtonText}>{label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
    padding: 20,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#f5f5f7',
  },
  progress: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 12,
  },
  cardArea: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardFace: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    justifyContent: 'flex-start',
  },
  word: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 24,
    textAlign: 'center',
  },
  wordSmall: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  showAnswerButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: '#1a1a1a',
  },
  showAnswerButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  defSection: {
    width: '100%',
    marginTop: 12,
  },
  defLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3d8bd6',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  defText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 21,
  },
  gradeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  gradeButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  gradeButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  congratsEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  congratsTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  congratsSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
});

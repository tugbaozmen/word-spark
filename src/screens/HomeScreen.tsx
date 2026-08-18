import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { initDatabase } from '../db/database';
import { seedDatabaseIfEmpty } from '../db/seed';
import { getAllFlashcards } from '../db/flashcardRepository';
import { Flashcard } from '../types/flashcard';
import { RootStackParamList } from '../navigation/types';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function load() {
        await initDatabase();
        await seedDatabaseIfEmpty();
        const allCards = await getAllFlashcards();
        if (isActive) {
          setCards(allCards);
          setIsLoading(false);
        }
      }

      load();

      return () => {
        isActive = false;
      };
    }, [])
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={cards}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <Pressable style={styles.studyButton} onPress={() => navigation.navigate('Study')}>
          <Text style={styles.studyButtonText}>Bugün Çalış</Text>
        </Pressable>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.word}>{item.word}</Text>
          <Text style={styles.label}>Frontend</Text>
          <Text style={styles.def}>{item.frontendDef}</Text>
          <Text style={styles.label}>Backend</Text>
          <Text style={styles.def}>{item.backendDef}</Text>
          <Text style={styles.meta}>
            Tekrar: {item.repetition} · Aralık: {item.interval}g · Kolaylık: {item.easeFactor} ·
            Sıradaki: {item.dueDate}
          </Text>
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text>Henüz kelime yok.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  word: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b6b6b',
    textTransform: 'uppercase',
    marginTop: 6,
  },
  def: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  meta: {
    marginTop: 10,
    fontSize: 12,
    color: '#999',
  },
  studyButton: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  studyButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});

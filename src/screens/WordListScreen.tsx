import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { deleteFlashcard, getAllFlashcards } from '../db/flashcardRepository';
import { Flashcard } from '../types/flashcard';

export default function WordListScreen() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');

  const loadCards = useCallback(async () => {
    const allCards = await getAllFlashcards();
    setCards(allCards);
    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCards();
    }, [loadCards])
  );

  const filteredCards = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return cards;
    return cards.filter((card) => card.word.toLowerCase().includes(normalizedQuery));
  }, [cards, query]);

  function handleDelete(card: Flashcard) {
    Alert.alert('Kelimeyi sil', `"${card.word}" kelimesini silmek istediğine emin misin?`, [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          await deleteFlashcard(card.id);
          loadCards();
        },
      },
    ]);
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Kelimelerde ara..."
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        clearButtonMode="while-editing"
      />

      <FlatList
        style={styles.list}
        data={filteredCards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.word}>{item.word}</Text>
              <Text style={styles.def} numberOfLines={2}>
                {item.translation}
              </Text>
            </View>
            <Pressable
              style={styles.deleteButton}
              onPress={() => handleDelete(item)}
              hitSlop={8}
            >
              <Text style={styles.deleteButtonText}>Sil</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>
              {query.trim() ? 'Eşleşen kelime bulunamadı.' : 'Henüz kelime yok.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    marginHorizontal: 16,
    marginTop: 12,
  },
  list: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    flexDirection: 'row',
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
  cardContent: {
    flex: 1,
  },
  word: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  def: {
    fontSize: 15,
    color: '#3d8bd6',
    fontWeight: '600',
  },
  deleteButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#fdecea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 12,
  },
  deleteButtonText: {
    color: '#e05d44',
    fontWeight: '700',
    fontSize: 13,
  },
});

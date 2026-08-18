import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
} from 'react-native';

import { insertFlashcard } from '../db/flashcardRepository';
import { generateId } from '../db/id';
import { todayIsoDate } from '../utils/date';
import { DEFAULT_EASE_FACTOR } from '../utils/sm2';

export default function AddWordScreen() {
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');

  async function handleSave() {
    if (!word.trim() || !translation.trim()) {
      Alert.alert('Eksik bilgi', 'Lütfen her iki alanı da doldur.');
      return;
    }

    await insertFlashcard({
      id: generateId(),
      word: word.trim(),
      translation: translation.trim(),
      interval: 0,
      repetition: 0,
      easeFactor: DEFAULT_EASE_FACTOR,
      dueDate: todayIsoDate(),
    });

    setWord('');
    setTranslation('');
    Alert.alert('Başarılı', 'Kelime başarıyla eklendi!');
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>İngilizce Kelime</Text>
        <TextInput
          style={styles.input}
          placeholder="örn. Achieve"
          value={word}
          onChangeText={setWord}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Türkçe Karşılığı</Text>
        <TextInput
          style={styles.input}
          placeholder="örn. Başarmak, elde etmek"
          value={translation}
          onChangeText={setTranslation}
        />

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    padding: 20,
    backgroundColor: '#f5f5f7',
    flexGrow: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#444',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e2e2e2',
  },
  saveButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

import { flashcardExistsByWord, insertFlashcard } from './flashcardRepository';
import { generateId } from './id';
import { todayIsoDate } from '../utils/date';
import { DEFAULT_EASE_FACTOR } from '../utils/sm2';
import { DEFAULT_WORD_LIST } from './wordList';

// Inserts each default word that isn't already in the deck (matched
// case-insensitively), instead of only seeding on a totally empty table —
// this lets the list grow across app updates without duplicating or
// touching words the user already added/reviewed.
export async function seedDefaultWords(): Promise<void> {
  const today = todayIsoDate();

  for (const entry of DEFAULT_WORD_LIST) {
    const alreadyExists = await flashcardExistsByWord(entry.word);
    if (alreadyExists) continue;

    await insertFlashcard({
      id: generateId(),
      word: entry.word,
      translation: entry.translation,
      interval: 0,
      repetition: 0,
      easeFactor: DEFAULT_EASE_FACTOR,
      dueDate: today,
    });
  }
}

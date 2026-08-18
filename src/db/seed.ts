import { NewFlashcard } from '../types/flashcard';
import { getFlashcardCount, insertFlashcard } from './flashcardRepository';
import { generateId } from './id';
import { todayIsoDate } from '../utils/date';
import { DEFAULT_EASE_FACTOR } from '../utils/sm2';

const today = todayIsoDate();

const SEED_WORDS: NewFlashcard[] = [
  {
    word: 'Achieve',
    translation: 'Başarmak, elde etmek',
    interval: 0,
    repetition: 0,
    easeFactor: DEFAULT_EASE_FACTOR,
    dueDate: today,
  },
  {
    word: 'Consider',
    translation: 'Düşünmek, göz önünde bulundurmak',
    interval: 0,
    repetition: 0,
    easeFactor: DEFAULT_EASE_FACTOR,
    dueDate: today,
  },
  {
    word: 'Improve',
    translation: 'Geliştirmek, iyileştirmek',
    interval: 0,
    repetition: 0,
    easeFactor: DEFAULT_EASE_FACTOR,
    dueDate: today,
  },
  {
    word: 'Recognize',
    translation: 'Tanımak, fark etmek',
    interval: 0,
    repetition: 0,
    easeFactor: DEFAULT_EASE_FACTOR,
    dueDate: today,
  },
];

export async function seedDatabaseIfEmpty(): Promise<void> {
  const count = await getFlashcardCount();
  if (count > 0) {
    return;
  }

  for (const word of SEED_WORDS) {
    await insertFlashcard({ ...word, id: generateId() });
  }
}

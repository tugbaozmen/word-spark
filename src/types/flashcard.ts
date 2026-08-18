export interface Flashcard {
  id: string;
  word: string;
  translation: string;
  interval: number;
  repetition: number;
  easeFactor: number;
  dueDate: string;
}

export type NewFlashcard = Omit<Flashcard, 'id'>;

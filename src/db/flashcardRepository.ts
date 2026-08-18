import { initDatabase } from './database';
import { Flashcard, NewFlashcard } from '../types/flashcard';
import { Sm2Result } from '../utils/sm2';

export async function getAllFlashcards(): Promise<Flashcard[]> {
  const db = await initDatabase();
  return db.getAllAsync<Flashcard>('SELECT * FROM flashcards ORDER BY dueDate ASC;');
}

export async function getFlashcardCount(): Promise<number> {
  const db = await initDatabase();
  const row = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM flashcards;'
  );
  return row?.count ?? 0;
}

export async function getDueFlashcards(todayIso: string): Promise<Flashcard[]> {
  const db = await initDatabase();
  return db.getAllAsync<Flashcard>(
    'SELECT * FROM flashcards WHERE dueDate <= $today ORDER BY dueDate ASC;',
    { $today: todayIso }
  );
}

export async function getLearnedFlashcardCount(): Promise<number> {
  const db = await initDatabase();
  const row = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM flashcards WHERE repetition > 0;'
  );
  return row?.count ?? 0;
}

export async function updateFlashcardReview(id: string, result: Sm2Result): Promise<void> {
  const db = await initDatabase();
  await db.runAsync(
    `UPDATE flashcards
     SET interval = $interval, repetition = $repetition, easeFactor = $easeFactor, dueDate = $dueDate
     WHERE id = $id;`,
    {
      $id: id,
      $interval: result.interval,
      $repetition: result.repetition,
      $easeFactor: result.easeFactor,
      $dueDate: result.dueDate,
    }
  );
}

export async function deleteFlashcard(id: string): Promise<void> {
  const db = await initDatabase();
  await db.runAsync('DELETE FROM flashcards WHERE id = $id;', { $id: id });
}

export async function insertFlashcard(card: NewFlashcard & { id: string }): Promise<void> {
  const db = await initDatabase();
  await db.runAsync(
    `INSERT INTO flashcards (id, word, frontendDef, backendDef, interval, repetition, easeFactor, dueDate)
     VALUES ($id, $word, $frontendDef, $backendDef, $interval, $repetition, $easeFactor, $dueDate);`,
    {
      $id: card.id,
      $word: card.word,
      $frontendDef: card.frontendDef,
      $backendDef: card.backendDef,
      $interval: card.interval,
      $repetition: card.repetition,
      $easeFactor: card.easeFactor,
      $dueDate: card.dueDate,
    }
  );
}

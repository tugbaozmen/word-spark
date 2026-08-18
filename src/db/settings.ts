import { initDatabase } from './database';

const DAILY_GOAL_KEY = 'dailyGoal';
export const DEFAULT_DAILY_GOAL = 20;

export async function getDailyGoal(): Promise<number> {
  const db = await initDatabase();
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = $key;',
    { $key: DAILY_GOAL_KEY }
  );
  const parsed = row ? parseInt(row.value, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_DAILY_GOAL;
}

export async function setDailyGoal(goal: number): Promise<void> {
  const db = await initDatabase();
  await db.runAsync(
    `INSERT INTO settings (key, value) VALUES ($key, $value)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value;`,
    { $key: DAILY_GOAL_KEY, $value: String(goal) }
  );
}

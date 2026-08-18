export type Sm2Grade = 1 | 2 | 3 | 4;

export const SM2_GRADE = {
  HARD: 1,
  GOOD: 2,
  EASY: 3,
  VERY_EASY: 4,
} as const satisfies Record<string, Sm2Grade>;

export interface Sm2Input {
  interval: number;
  repetition: number;
  easeFactor: number;
}

export interface Sm2Result {
  interval: number;
  repetition: number;
  easeFactor: number;
  dueDate: string;
}

export const DEFAULT_EASE_FACTOR = 2.5;
export const MIN_EASE_FACTOR = 1.3;

// None of the four buttons represents a failed recall, so every grade maps
// to a passing SM-2 quality score (3-5); "Very Easy" gets an extra bonus on
// top of quality 5, matching Anki's behavior of rewarding effortless recall.
const GRADE_TO_QUALITY: Record<Sm2Grade, number> = {
  [SM2_GRADE.HARD]: 3,
  [SM2_GRADE.GOOD]: 4,
  [SM2_GRADE.EASY]: 5,
  [SM2_GRADE.VERY_EASY]: 5,
};

const VERY_EASY_INTERVAL_BONUS = 1.3;
const VERY_EASY_EASE_BONUS = 0.15;

export function calculateSm2(card: Sm2Input, grade: Sm2Grade): Sm2Result {
  const quality = GRADE_TO_QUALITY[grade];

  let easeFactor =
    card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (grade === SM2_GRADE.VERY_EASY) {
    easeFactor += VERY_EASY_EASE_BONUS;
  }
  easeFactor = Math.max(easeFactor, MIN_EASE_FACTOR);

  const repetition = card.repetition + 1;
  let interval: number;
  if (repetition === 1) {
    interval = 1;
  } else if (repetition === 2) {
    interval = 6;
  } else {
    interval = Math.round(card.interval * easeFactor);
  }
  if (grade === SM2_GRADE.VERY_EASY) {
    interval = Math.round(interval * VERY_EASY_INTERVAL_BONUS);
  }

  return {
    interval,
    repetition,
    easeFactor,
    dueDate: addDaysAsIsoDate(interval),
  };
}

function addDaysAsIsoDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

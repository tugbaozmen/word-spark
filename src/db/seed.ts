import { NewFlashcard } from '../types/flashcard';
import { getFlashcardCount, insertFlashcard } from './flashcardRepository';
import { generateId } from './id';
import { todayIsoDate } from '../utils/date';

const today = todayIsoDate();

const SEED_WORDS: NewFlashcard[] = [
  {
    word: 'Hoisting',
    frontendDef:
      "JavaScript'in var/function tanımlarını, kod çalışmadan önce kapsamın (scope) en üstüne taşıması. Örn: bir React bileşeninde henüz tanımlanmamış bir fonksiyonu üstte çağırabilirsin.",
    backendDef:
      "Node.js runtime'ında da geçerlidir; bir modülün en üstünde henüz tanımlanmamış bir helper fonksiyonu çağırdığında hata almazsın çünkü fonksiyon bildirimi hoisted olur.",
    interval: 0,
    repetition: 0,
    easeFactor: 2.5,
    dueDate: today,
  },
  {
    word: 'Middleware',
    frontendDef:
      "Redux gibi state yönetim kütüphanelerinde, bir action dispatch edilmeden önce/sonra araya giren fonksiyon katmanı (örn: redux-thunk, redux-logger).",
    backendDef:
      "Express.js gibi framework'lerde, bir HTTP isteği route handler'a ulaşmadan önce çalışan fonksiyon (örn: kimlik doğrulama, loglama, body-parser).",
    interval: 0,
    repetition: 0,
    easeFactor: 2.5,
    dueDate: today,
  },
  {
    word: 'Cache',
    frontendDef:
      "Tarayıcının statik dosyaları (JS, CSS, resim) veya API yanıtlarını tekrar indirmemek için sakladığı geçici depolama (örn: Service Worker cache, localStorage).",
    backendDef:
      "Sunucu tarafında sık erişilen veritabanı sorgu sonuçlarını hızlı erişim için bellekte tutma (örn: Redis, Memcached) — veritabanı yükünü azaltır.",
    interval: 0,
    repetition: 0,
    easeFactor: 2.5,
    dueDate: today,
  },
  {
    word: 'Endpoint',
    frontendDef:
      "Bir frontend uygulamasının veri çekmek/göndermek için istek attığı URL adresi (örn: fetch('/api/users') çağrısındaki '/api/users').",
    backendDef:
      "Backend'de tanımlanan, belirli bir HTTP metodu ve path kombinasyonuyla eşleşen route handler (örn: GET /api/users isteğini karşılayan controller fonksiyonu).",
    interval: 0,
    repetition: 0,
    easeFactor: 2.5,
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

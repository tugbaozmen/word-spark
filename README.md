# Word Spark 🚀

Frontend ve backend geliştiricileri için, ortak terimleri her iki dünyadan da örneklerle
pekiştiren, **tamamen offline** çalışan bir kelime ezberleme uygulaması. Expo (React Native)
ve TypeScript ile yazılmıştır; veriler cihazda yerel bir SQLite veritabanında tutulur ve
tekrarlar Anki'nin de temel aldığı **SM-2 (SuperMemo 2)** aralıklı tekrar algoritmasıyla
planlanır.

## Özellikler

- 📴 **Tamamen offline** — internet bağlantısı veya backend gerektirmez.
- 🗃️ **Yerel SQLite veritabanı** (`expo-sqlite`) ile kalıcı depolama.
- 🧠 **SM-2 aralıklı tekrar algoritması** — her kart için `interval`, `repetition` ve
  `easeFactor` değerlerini güncelleyerek bir sonraki gösterim tarihini hesaplar.
- 🃏 **Kart çevirme animasyonlu öğrenme ekranı** — kelimeyi gör, cevabı göster, zorluk
  derecesini seç (Zor / Orta / Kolay / Çok Kolay).
- 🎉 Günün tekrarları bittiğinde tebrik ekranı ve toplam öğrenilen kelime sayısı.
- 🌱 İlk açılışta otomatik olarak yüklenen örnek kelime seti (seed data).

## Veri Modeli

Her kelime kartı (`Flashcard`) şu alanlardan oluşur:

| Alan          | Tip      | Açıklama                                             |
| ------------- | -------- | ----------------------------------------------------- |
| `id`          | `string` | Benzersiz kart kimliği                                 |
| `word`        | `string` | İngilizce kelime                                       |
| `frontendDef` | `string` | Kelimenin frontend dünyasındaki tanımı/örneği           |
| `backendDef`  | `string` | Kelimenin backend dünyasındaki tanımı/örneği            |
| `interval`    | `number` | Bir sonraki gösterime kadar geçecek gün sayısı          |
| `repetition`  | `number` | Kartın kaç kez başarıyla tekrar edildiği                |
| `easeFactor`  | `number` | Zorluk katsayısı (varsayılan `2.5`, minimum `1.3`)      |
| `dueDate`     | `string` | Kartın bir sonraki sorulacağı tarih (ISO `YYYY-MM-DD`)  |

## SM-2 Algoritması

`src/utils/sm2.ts` içindeki `calculateSm2` saf (pure) fonksiyonu, kullanıcının seçtiği zorluk
derecesini (`1`: Zor, `2`: Orta, `3`: Kolay, `4`: Çok Kolay) klasik SM-2'nin 0-5 kalite
skalasına eşleyip standart SM-2 formülünü uygular:

- `repetition` her doğru cevapta bir artar.
- `interval`: 1. tekrarda 1 gün, 2. tekrarda 6 gün, sonrasında `interval * easeFactor`.
- `easeFactor`, cevabın kalitesine göre güncellenir ve **asla 1.3'ün altına düşmez**.
- "Çok Kolay" seçimlerinde ekstra bir aralık ve kolaylık bonusu uygulanır.
- `dueDate`, hesaplanan yeni `interval` kadar bugüne eklenerek ISO tarih olarak üretilir.

## Proje Yapısı

```
src/
├── db/                  # SQLite bağlantısı, tablo oluşturma, CRUD ve seed mekanizması
├── navigation/           # React Navigation (native-stack) kurulumu ve route tipleri
├── screens/
│   ├── HomeScreen.tsx    # Kart listesi ve "Bugün Çalış" girişi
│   └── StudyScreen.tsx   # SM-2 tabanlı öğrenme/tekrar ekranı
├── types/                # Flashcard veri modeli
└── utils/                # SM-2 algoritması ve tarih yardımcıları
```

## Kurulum

```bash
npm install
```

## Çalıştırma

```bash
npm run android   # Android emülatör/cihaz
npm run ios        # iOS simülatör (yalnızca macOS)
npm run web         # Tarayıcı
```

## Kullanılan Başlıca Teknolojiler

- [Expo](https://expo.dev/) (SDK 57) + TypeScript
- [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) — yerel veritabanı
- [React Navigation](https://reactnavigation.org/) (native-stack) — ekran geçişleri

## Yol Haritası

- [ ] Kelime ekleme/düzenleme ekranı
- [ ] İstatistik/ilerleme ekranı
- [ ] Kart destelerine göre filtreleme

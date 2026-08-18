# Word Spark 🚀

İngilizce kelime ezberlemek için **tamamen offline** çalışan bir mobil uygulama. Her kart bir
İngilizce kelime ve Türkçe karşılığından oluşur. Expo (React Native) ve TypeScript ile
yazılmıştır; veriler cihazda yerel bir SQLite veritabanında tutulur ve tekrarlar Anki'nin de
temel aldığı **SM-2 (SuperMemo 2)** aralıklı tekrar algoritmasıyla planlanır.

## Özellikler

- 📴 **Tamamen offline** — internet bağlantısı veya backend gerektirmez.
- 🗃️ **Yerel SQLite veritabanı** (`expo-sqlite`) ile kalıcı depolama.
- 🧠 **SM-2 aralıklı tekrar algoritması** — her kart için `interval`, `repetition` ve
  `easeFactor` değerlerini güncelleyerek bir sonraki gösterim tarihini hesaplar.
- 🃏 **Kart çevirme animasyonlu öğrenme ekranı** — kelimeyi gör, cevabı göster, zorluk
  derecesini seç (Zor / Orta / Kolay / Çok Kolay).
- 🎯 **Ayarlanabilir günlük hedef** — Öğren ekranındaki "Günlük hedef" alanından, o gün
  çalışmak istediğin kelime sayısını istediğin zaman değiştirebilirsin (varsayılan 20).
- ➕ **Kelime ekleme formu** — İngilizce kelime ve Türkçe karşılığını gir, kaydet.
- 📚 **Kelime listesi** — tüm kelimeler, anlık arama ve silme desteğiyle.
- 🎉 Günün tekrarları bittiğinde tebrik ekranı ve toplam öğrenilen kelime sayısı.
- 🌱 İlk açılışta otomatik olarak yüklenen örnek kelime seti (seed data).

## Veri Modeli

Her kelime kartı (`Flashcard`) şu alanlardan oluşur:

| Alan          | Tip      | Açıklama                                             |
| ------------- | -------- | ----------------------------------------------------- |
| `id`          | `string` | Benzersiz kart kimliği                                 |
| `word`        | `string` | İngilizce kelime                                       |
| `translation` | `string` | Kelimenin Türkçe karşılığı                              |
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

## Ekranlar (Alt Menü)

- **Öğren** (`StudyScreen`) — bugün tekrar sırası gelen kartları sırayla gösterir; kart
  çevrilince Türkçe karşılık görünür ve zorluk derecesi seçilir.
- **Yeni Ekle** (`AddWordScreen`) — İngilizce kelime + Türkçe karşılık formu.
- **Kelimelerim** (`WordListScreen`) — tüm kelimelerin listesi, arama çubuğu ve silme.

## Proje Yapısı

```
src/
├── db/                     # SQLite bağlantısı, tablo oluşturma, CRUD ve seed mekanizması
├── navigation/              # React Navigation (bottom-tabs) kurulumu ve route tipleri
├── screens/
│   ├── StudyScreen.tsx      # SM-2 tabanlı öğrenme/tekrar ekranı
│   ├── AddWordScreen.tsx    # Kelime ekleme formu
│   └── WordListScreen.tsx   # Kelime listesi, arama ve silme
├── types/                   # Flashcard veri modeli
└── utils/                   # SM-2 algoritması ve tarih yardımcıları
```

## Kurulum

```bash
npm install
```

## Çalıştırma

Proje Expo SDK 54 kullanır (Expo Go ile uyumlu olması için).

```bash
npm start          # Expo Go ile QR kod okutarak açmak için
npm run android     # Android emülatör/cihaz
npm run ios          # iOS simülatör (yalnızca macOS)
```

## Kullanılan Başlıca Teknolojiler

- [Expo](https://expo.dev/) (SDK 54) + TypeScript
- [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) — yerel veritabanı
- [React Navigation](https://reactnavigation.org/) (bottom-tabs) — alt menü navigasyonu

## Yol Haritası

- [ ] Kelime düzenleme ekranı
- [ ] İstatistik/ilerleme ekranı
- [ ] Kelime listelerini/desteleri kategoriye göre filtreleme

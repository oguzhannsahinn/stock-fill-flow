# Stock Fill Flow – Ürün Bazlı Dolum Yönetim Sistemi

Sağlık kuruluşları için geliştirilmiş, ürün bazlı çok adımlı stok dolum yönetim uygulaması.

---

## 🚀 Kurulum & Çalıştırma

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışır.

---

## 🛠 Teknoloji Tercihleri & Gerekçeler

| Teknoloji           | Sürüm | Gerekçe                                                                                                            |
| ------------------- | ----- | ------------------------------------------------------------------------------------------------------------------ |
| **React**           | 19    | Modern concurrent features, hook tabanlı mimari                                                                    |
| **Vite**            | 8     | Hızlı HMR, native ESM, minimal konfigürasyon                                                                       |
| **TypeScript**      | ~6    | Tip güvenliği, IDE desteği, refactoring kolaylığı                                                                  |
| **Redux Toolkit**   | ^2    | Normalize edilmiş state, createSlice/createSelector ile boilerplate azaltma, lokasyonlar arası veri kaybı olmaması |
| **React Router v7** | ^7    | Selector-based routing, browser history, multi-page URL yapısı                                                     |
| **Tailwind CSS v4** | ^4    | Utility-first CSS, `@theme` ile design token yönetimi, `@tailwindcss/vite` plugin ile sıfır config                 |
| **Headless UI**     | ^2    | Erişilebilir (WAI-ARIA uyumlu) Listbox, Button bileşenleri                                                         |
| **lucide-react**    | ^1    | Tutarlı, hafif SVG ikon seti                                                                                       |

### Redux vs Context API

Redux Toolkit tercih edildi çünkü:

- Birden fazla lokasyonun bağımsız adım ilerlemesi/değerleri normalize edilmiş `Record<string, Location>` state'te tutulur
- `createSelector` ile memoized selector'lar bileşen render'larını optimize eder
- `createAsyncThunk` ile async API çağrıları (loadProducts, loadLocations, submitFlow) tek yerden yönetilir
- DevTools desteği ile state geçişleri izlenebilir

---

## 📁 Klasör Yapısı

```
src/
├── app/                          # Uygulama çekirdeği
│   ├── store.ts                  # Redux store
│   ├── hooks.ts                  # Typed useAppDispatch, useAppSelector
│   └── router.tsx                # React Router konfigürasyonu
│
├── features/
│   └── fill-flow/                # Dolum akışı feature modülü
│       ├── types.ts              # Tüm TypeScript interface/type'lar
│       ├── constants.ts          # STEPS, mockProducts, mockLocations
│       ├── fillFlowSlice.ts      # Redux slice (actions + reducers + async thunks)
│       ├── selectors.ts          # Memoized createSelector'lar
│       ├── validators.ts         # Adım bazlı validasyon fonksiyonları
│       └── fakeApi.ts            # Promise tabanlı mock API
│
├── components/                   # Yeniden kullanılabilir UI bileşenleri
│   ├── Layout.tsx                # Sayfa düzeni (header + container)
│   ├── Button.tsx                # Variant/size/loading destekli buton
│   ├── Stepper/
│   │   ├── Stepper.tsx           # Stepper container (aria-live)
│   │   └── StepIndicator.tsx     # Tekil adım göstergesi
│   ├── LocationList/
│   │   └── LocationList.tsx      # Lokasyon sidebar'ı
│   └── fields/
│       ├── NumericField.tsx      # Sayısal input (label, error, unit, aria)
│       └── DateField.tsx         # Tarih input (min=yarın, aria)
│
├── pages/
│   ├── SelectionPage.tsx         # Ürün & lokasyon seçimi
│   ├── FillFlowPage.tsx          # Çok adımlı dolum formu
│   └── SummaryPage.tsx           # Özet, düzenleme, onay
│
├── main.tsx                      # Entry point
├── App.tsx                       # Redux Provider + Router
└── index.css                     # Tailwind v4 + @theme design tokens
```

---

## 🏷️ İsimlendirme Konvansiyonları

| Tür            | Format                      | Örnek                              |
| -------------- | --------------------------- | ---------------------------------- |
| Bileşenler     | `PascalCase.tsx`            | `Stepper.tsx`, `NumericField.tsx`  |
| Hook'lar       | `camelCase.ts` (use prefix) | `useAppDispatch`, `useAppSelector` |
| Utility/Helper | `camelCase.ts`              | `validators.ts`, `fakeApi.ts`      |
| Redux Slice    | `camelCase + Slice`         | `fillFlowSlice.ts`                 |
| Type dosyaları | `camelCase.ts`              | `types.ts`                         |
| Klasörler      | `kebab-case`                | `fill-flow/`, `fields/`            |

**Gerekçe:** React ekosisteminin genel standardına uyum (bileşenler PascalCase, yardımcılar camelCase), dosya sistemi uyumluluğu için klasörlerde kebab-case.

---

## 🗃️ State Yönetimi Organizasyonu

### Redux State Shape

```typescript
{
  fillFlow: {
    products: Product[];             // Mock API'den yüklenen ürünler
    allLocations: Location[];        // Mock API'den yüklenen tüm lokasyonlar
    selectedProductId: string | null;
    selectedLocationIds: string[];   // Sıralı seçili lokasyon ID'leri
    locations: Record<string, Location>;  // Normalize edilmiş (ID → Location)
    activeLocationId: string | null;
    flowStatus: 'selection' | 'filling' | 'summary' | 'submitted';
    submitStatus: 'idle' | 'loading' | 'success' | 'error';
    submitError: string | null;
  }
}
```

### Lokasyon Bazlı State Normalizasyonu

- Her lokasyon `Record<string, Location>` yapısında ID anahtarıyla tutulur
- `selectedLocationIds[]` dizisi sıralamayı korur
- Lokasyonlar arası geçişte veri kaybolmaz (selector ile ID → obje)
- `currentStep` (0-4) ile adım ilerlemesi, `status` ile genel durum ayrı tutulur

### Selector Organizasyonu

```typescript
// Temel selector'lar (doğrudan state'ten)
selectSelectedProductId, selectLocationsMap, ...

// Memoized (createSelector)
selectSelectedProduct     // ID → Product objesi
selectSelectedLocations   // ID[] → Location[]
selectActiveLocation      // activeId → Location | null
selectOverallProgress     // tüm lokasyon adımları → %
selectIsAllCompleted      // tüm lokasyonlar bitti mi?
```

---

## 🎨 Stil Yaklaşımı

**Tailwind CSS v4** kullanıldı:

- `@theme` directive ile design token'lar (`--color-primary-*`, `--color-success-*`, vb.) `index.css`'te tanımlandı
- CSS değişkenleri hem Tailwind utility class'larında hem de `var()` fonksiyonuyla doğrudan kullanılabilir
- Ayrı `tailwind.config.js` **gerektirmez** (v4 özelliği)
- Dark mode kasıtlı olarak **çıkarıldı** (gereksinim dışı)

---

## 🔄 Akış Modeli

```
[Başlangıç]
    │
    ▼
┌─────────────────┐
│  SelectionPage  │  Ürün seç (Listbox) + Lokasyonlar seç (checkbox)
│  Route: /       │
└────────┬────────┘
         │ "Dolum Akışını Başlat" (startFlow action)
         ▼
┌─────────────────────────────────────────────────┐
│                  FillFlowPage                   │
│  Route: /fill-flow                              │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  LocationList (Sidebar)                  │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  │  │
│  │  │ Lok. 1  │  │ Lok. 2  │  │ Lok. 3  │  │  │
│  │  │ active  │  │ pending │  │ pending │  │  │
│  │  └─────────┘  └─────────┘  └─────────┘  │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  Stepper: [1●]──[2]──[3]──[4]           │  │
│  │  Step Form: Kritik Miktar                │  │
│  │  [Geri]              [İleri]             │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  Adım 1→2→3→4: validateStep() → advanceStep()  │
│  Son adım: lokasyon completed → sonraki aktif  │
│  Tüm lokasyonlar done → flowStatus='summary'   │
└────────────────┬────────────────────────────────┘
                 │ Redirect (useEffect)
                 ▼
┌─────────────────────────────┐
│       SummaryPage           │
│  Route: /summary            │
│  Tüm lokasyon değerleri     │
│  "Düzenle" → FillFlowPage   │
│  "Onayla ve Gönder" →       │
│    submitFlow() thunk        │
│    Başarı: SuccessState      │
│    Hata: retry UI            │
└─────────────────────────────┘
```

### Geri Navigasyon Senaryoları

1. **Adımlar arası geri**: Stepper'da tamamlanmış adıma tıklama → `goToStep()`
2. **Lokasyonlar arası geri**: LocationList'ten farklı lokasyona tıklama → `setActiveLocation()`
3. **Özetten düzenleme**: "Düzenle" butonu → `editLocation({ locationId, stepIndex })` → `/fill-flow`

---

## ✅ Validasyon Zinciri

| Adım | Alan(lar)                | Kural                             |
| ---- | ------------------------ | --------------------------------- |
| 0    | criticalAmount           | > 0, zorunlu                      |
| 1    | minCapacity, maxCapacity | Her ikisi > 0, min < max, zorunlu |
| 2    | fillAmount               | min ≤ değer ≤ max, zorunlu        |
| 3    | expiryDate               | Bugünden ileri, zorunlu           |

Hatalar `role="alert"` ile ekrana yansıtılır.

---

## ♿ Erişilebilirlik (A11y)

- `Stepper`: `role="list"`, `aria-current="step"`, `aria-live="polite"` ile adım değişim duyurusu
- `LocationList`: `role="list"`, `aria-pressed`, `aria-live="polite"` ile lokasyon değişim duyurusu
- Form alanları: `<label htmlFor>`, `aria-invalid`, `aria-describedby`, `aria-required`
- Hata mesajları: `role="alert"`
- Headless UI: WAI-ARIA uyumlu Listbox, Button
- Klavye navigasyonu: Tab ile tüm etkileşimli elemanlara erişim

---

## 🔌 Import Yolları

- `@/` alias → `src/` (vite.config.ts `resolve.alias` + tsconfig `paths`)
- Barrel export (`index.ts`) **kullanılmadı** – doğrudan dosya import'u tercih edildi (tree-shaking ve refactoring kolaylığı)

---

## ⏱ Süre Notu

**Hedef**: 5-7 saat | **Gerçekleşen**: ~6.5 saat

Kapsam önceliklendirmesi:

- ✅ Tüm zorunlu gereksinimler
- ✅ Tüm zorunlu ileri seviye özellikler (geri nav, validasyon, özet, onay)
- ✅ Mock API (hata simülasyonu dahil)
- ⏭ Test yazımı (süre kısıtı nedeniyle atlandı)
- ⏭ Özel keypad/date picker (native HTML5 input kullanıldı)

---

## 🐛 Known Issues

- **Özel keypad**: Sayısal girişler için özel numeric pad bileşeni geliştirilmedi; native `<input type="number">` kullanıldı.
- **Özel date picker**: Native `<input type="date">` kullanıldı; görünüm tarayıcıdan tarayıcıya farklılık gösterebilir.
- **Test coverage**: Unit/integration test yazılmadı.
- **Persistence**: Sayfa yenileme durumunda Redux state sıfırlanır (localStorage/sessionStorage entegrasyonu eklenmedi).

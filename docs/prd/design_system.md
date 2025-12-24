# Design System (Tema Tokenları)

## 1. Amaç
- Tüm sayfaların ortak tema/typography/spacing kuralları tek yerde tanımlanır.
- Tema değişimi yalnızca bu dosyadaki token setini güncelleyerek yapılır.

## 2. Tema Tokenları (CSS Variable Önerisi)

```
:root {
  /* Brand */
  --brand-primary: #0b1320;
  --brand-accent: #00b3a4;
  --brand-link: #2d7ff9;

  /* Surface */
  --surface-bg: #f4f7fb;
  --surface-panel: #1c2533;
  --surface-card: #ffffff;
  --surface-card-hover: #f0f4f8;
  --surface-border: #e3e9f2;

  /* Text */
  --text-primary: #0f1720;
  --text-secondary: #4b5b70;
  --text-invert: #ffffff;
  --text-muted: #7f8da3;

  /* Status */
  --status-success: #26c281;
  --status-warning: #f6b100;
  --status-danger: #e6484d;
  --status-info: #2d7ff9;

  /* Typography */
  --font-heading: "Space Grotesk", sans-serif;
  --font-body: "IBM Plex Sans", sans-serif;
  --font-mono: "IBM Plex Mono", monospace;

  /* Sizes */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --shadow-sm: 0 2px 8px rgba(11, 19, 32, 0.08);
  --shadow-md: 0 8px 24px rgba(11, 19, 32, 0.12);

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 32px;
  --space-8: 40px;
}
```

## 3. Kullanım İlkeleri
- Tüm renkler ve tipografi değerleri tokenlar üzerinden kullanılmalı.
- Yeni komponentler `--surface-card` ve `--surface-border` ile hizalanmalı.
- Metrik kartlarında accent çizgi `--brand-accent` ile uygulanmalı.
- Kritik durumlar sadece `--status-warning` ve `--status-danger` kullanmalı.

## 4. Sayfa Referansı
- Home, Map, Live, Missions, Media, Fleet, Settings tümü bu tokenlara referans verir.

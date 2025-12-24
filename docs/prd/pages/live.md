# Live Sayfası PRD

## 1. Sayfa Amacı
- Canlı video izleme ve telemetri HUD takibi.
- Roller: Operatör (ana), İzleyici (salt okunur), Yönetici (denetim).

## 2. Ana Yüzey
- Birincil yüzey: Tekil veya grid canlı video akışı.
- Sürekli görünür: Video akışı ve telemetri HUD.
- Tema ve tipografi tokenları: `docs/prd/design_system.md`.

## 3. Overlay Yapısı
- Üst overlay: Navigasyon sekmeleri, proje dropdown, kullanıcı oturumu, global durum.
- Sol overlay: Canlı yayınlı cihaz listesi.
- Sağ overlay: Seçili cihaz telemetri paneli.
- Yüzen paneller: Akış düzeni ve kaynak seçimi paneli.
- Widget’lar: Gecikme ve bağlantı kalitesi göstergeleri.

## 4. Temel Kullanıcı Etkileşimleri
- Seçim: Tekli seçim varsayılan; Shift/Ctrl ile çoklu kamera seçimi.
- Panel davranışı: Aç/kapa, pin, küçült, gizle-tab.
- Klavye: `1/2/3` grid düzeni, `F` tam ekran, `Esc` panel kapat.
- Hızlı aksiyonlar: Akışa odaklan, grid düzenini değiştir, akış kaynağı seç.

## 5. Sayfaya Özel Fonksiyonel Gereksinimler
- FR-LIVE-001: Tekil ve grid video görünümü desteklenir.
- FR-LIVE-002: HUD üzerinde temel telemetri alanları gösterilir.
- FR-LIVE-003: Canlı akış seçimi sol listeden yapılabilir.
- FR-LIVE-004: Video gecikmesi ve bağlantı kalitesi overlay olarak gösterilir.
- FR-LIVE-005: Rol bazlı UI kilitleri yetkisiz aksiyonları gizler/pasif yapar.

## 6. MVP Dışı
- Manuel uçuş kontrolü (joystick).
- Gelişmiş kamera/gimbal kontrolü.
- Arşivleme ve playback.

## 7. Page → Feature → Component Matrisi
| Sayfa | Feature | Kısa Açıklama | UI Component |
|---|---|---|---|
| Live | Video Surface | Tekil veya grid video alanı | `LiveVideoSurface`, `VideoTile`, `VideoGrid` |
| Live | Telemetry HUD | Video üstü telemetri HUD | `TelemetryHUD`, `HudItem` |
| Live | Live Asset List | Canlı yayınlı cihaz listesi | `LiveAssetsPanel`, `AssetList`, `StatusBadge` |
| Live | Stream Controls | Grid düzeni ve kaynak seçimi | `StreamControlPanel`, `LayoutToggle`, `SourceSelector` |
| Live | Telemetry Panel | Seçili akış telemetri paneli | `TelemetryPanel`, `TelemetryCard` |
| Live | Widgets | Gecikme ve bağlantı göstergesi | `LatencyWidget`, `LinkQualityWidget` |

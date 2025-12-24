# Map Sayfası PRD

## 1. Sayfa Amacı
- Canlı operasyon farkındalığı ve tüm varlıkların anlık takibi.
- Roller: Operatör (ana), İzleyici (salt okunur), Yönetici (denetim), Görev Planlayıcı (referans).

## 2. Ana Yüzey
- Birincil yüzey: 2D harita.
- Sürekli görünür: Harita, varlık konumları, aktif rota overlay’i.
- Tema ve tipografi tokenları: `docs/prd/design_system.md`.

## 3. Overlay Yapısı
- Üst overlay: Navigasyon sekmeleri, proje dropdown, kullanıcı oturumu/profil, global durum.
- Sol overlay: Aktif cihaz listesi + arama/filtre.
- Sağ overlay: Telemetri panelleri (sürüklenebilir, pinlenebilir, küçültülebilir).
- Yüzen paneller: Control Panel (arm/disarm/takeoff/land) ve cihaz detay kartları.
- Widget’lar: Alarm özeti, görev sayısı, gecikme, sistem sağlık durumu.

## 4. Temel Kullanıcı Etkileşimleri
- Seçim: Tekli seçim varsayılan; Shift/Ctrl ile çoklu seçim.
- Panel davranışı: Aç/kapa, pin, küçült, gizle-tab, snap hizalama.
- Klavye: `Esc` panel kapat, `Shift+Click` çoklu seçim, `F` odakla, `Z` yakınlaştır.
- Hızlı aksiyonlar: Odakla, Canlı İzle, Görev Ata, İşaret Ekle, Control Panel aç.

## 5. Sayfaya Özel Fonksiyonel Gereksinimler
- FR-MAP-001: Aktif UAV/Dock marker’ları durum kodlu gösterilir.
- FR-MAP-002: Harita ve sol listeden tekli/çoklu seçim yapılır.
- FR-MAP-003: Seçimle telemetri paneli açılır (batarya, irtifa, hız, yön, sinyal, gecikme).
- FR-MAP-004: Birden fazla telemetri paneli aynı anda açık olabilir.
- FR-MAP-005: Paneller pin/küçült/gizle-tab/snap davranışlarını destekler.
- FR-MAP-006: Sol panel hızlı arama/filtreleme sağlar.
- FR-MAP-007: Control Panel, seçili araca veya tüm araçlara komut gönderebilir.
- FR-MAP-008: Rol bazlı UI kilitleri yetkisiz eylemleri gizler/pasif yapar.

## 6. MVP Dışı
- Manuel uçuş kontrolü.
- AI rota optimizasyonu.
- Offline harita cache.
- Gelişmiş geofence düzenleme.

## 7. Page → Feature → Component Matrisi
| Sayfa | Feature | Kısa Açıklama | UI Component |
|---|---|---|---|
| Map | Map Canvas | 2D harita yüzeyi ve pan/zoom | `MapSurface`, `MapViewport`, `MapZoomControls` |
| Map | Asset Markers | UAV/Dock marker ve durum renkleri | `AssetMarker`, `AssetCluster`, `StatusBadge` |
| Map | Active Assets Panel | Aktif cihaz listesi + arama/filtre | `ActiveAssetsPanel`, `AssetList`, `SearchField`, `FilterChips` |
| Map | Telemetry Panels | Çoklu telemetri paneli | `TelemetryPanel`, `TelemetryCard`, `PanelHeader`, `PanelActions` |
| Map | Panel Tabs | Gizlenen paneller için sağ tab | `PanelTabBar`, `PanelTab` |
| Map | Quick Actions | Harita üstü hızlı aksiyonlar | `QuickActionBar`, `QuickActionButton` |
| Map | Control Panel | Komut paneli (arm/disarm/takeoff/land) | `ControlPanel`, `CommandButton`, `CommandConfirm` |
| Map | Widgets | Durum ve alarm widget’ları | `StatusWidget`, `LatencyWidget`, `AlertsWidget` |
| Map | Selection Logic | Tekli/çoklu seçim ve odaklama | `SelectionManager`, `FocusButton` |

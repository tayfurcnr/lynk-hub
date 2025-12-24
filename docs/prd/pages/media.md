# Media Sayfası PRD

## 1. Sayfa Amacı
- Görevler sırasında üretilen fotoğraf/video içeriklerini listelemek ve hızlı önizleme sağlamak.
- Roller: Operatör (inceleme), İzleyici (görüntüleme), Yönetici (denetim).

## 2. Ana Yüzey
- Birincil yüzey: Medya ızgarası (grid).
- Sürekli görünür: Medya kartları ve seçili içerik vurgusu.
- Tema ve tipografi tokenları: `docs/prd/design_system.md`.

## 3. Overlay Yapısı
- Üst overlay: Navigasyon sekmeleri, proje dropdown, kullanıcı oturumu, global durum.
- Sol overlay: Filtreler (tür, zaman, görev).
- Sağ overlay: Seçili medya önizleme paneli.
- Yüzen paneller: Oynatma kontrol paneli.
- Widget’lar: Medya sayısı, son yükleme zamanı.

## 4. Temel Kullanıcı Etkileşimleri
- Seçim: Grid üzerinde tekli seçim; Shift ile çoklu seçim (sadece toplu görünüm).
- Panel davranışı: Önizleme paneli pin/küçült/gizle-tab.
- Klavye: `Esc` panel kapat, yön tuşları ile medya geçişi.
- Hızlı aksiyonlar: Önizleme aç/kapat, filtre temizle.

## 5. Sayfaya Özel Fonksiyonel Gereksinimler
- FR-MED-001: Medya içerikleri görev bazında gruplanır.
- FR-MED-002: Grid önizlemeler hızlı tarama için optimize edilir.
- FR-MED-003: Seçili medya önizleme panelinde görüntülenir.
- FR-MED-004: Filtreler tür, zaman ve görev bazında uygulanır.

## 6. MVP Dışı
- Medya indirme ve dışa aktarma.
- Gelişmiş metadata düzenleme.
- Playback geçmişi ve notlama.

## 7. Page → Feature → Component Matrisi
| Sayfa | Feature | Kısa Açıklama | UI Component |
|---|---|---|---|
| Media | Media Grid | Göreve göre gruplanmış medya | `MediaGrid`, `MediaCard`, `MediaGroupHeader` |
| Media | Media Preview | Seçili medya önizleme | `MediaPreviewPanel`, `PlaybackControls` |
| Media | Filters | Medya türü ve zaman filtreleri | `MediaFilterBar`, `FilterChips`, `DateRangePicker` |

# Home (Özet Dashboard) Sayfası PRD

## 1. Sayfa Amacı
- Kullanıcı girişinden sonra ilk açılan ekran; operasyonun genel durumunu tek bakışta özetler.
- Roller: Yönetici, Operatör, Bakımcı, İzleyici (rol bazlı görünürlük).

## 2. Ana Yüzey
- Birincil yüzey: Özet dashboard düzeni.
- Sürekli görünür: Global metrik şeridi + 3 ana blok (Mini Map, Fleet Health, Live Preview).
- Tema ve tipografi tokenları: `docs/prd/design_system.md`.

## 3. Overlay Yapısı
- Üst overlay: Navigasyon sekmeleri, proje dropdown, global durum, kullanıcı menüsü.
- Sol overlay: (opsiyonel) hızlı filtreler ve alarm özetine hızlı erişim.

## 4. Temel Kullanıcı Etkileşimleri
- Metrik kartları tıklanınca ilgili sayfaya derin link (Map/Live/Fleet/Missions).
- Mini Map tıklanınca Map sayfasına geçiş.
- Fleet Health listesinde cihaz seçimi, Fleet sayfasını seçili cihazla açar.
- Live Preview kartı tıklanınca Live sayfasında ilgili stream açılır.

## 5. Sayfaya Özel Fonksiyonel Gereksinimler
- FR-HOME-001: Global metrik şeridi 6 kart içerir: Aktif UAV, Açık alarm, Sistem gecikmesi, Online/Toplam cihaz, Aktif görev, Canlı yayın.
- FR-HOME-002: Mini Map, aktif varlıkların son konumlarını özet görünümde gösterir.
- FR-HOME-003: Fleet Health, en kritik 5 cihazı sağlık özetiyle listeler.
- FR-HOME-004: Live Preview, 3–4 canlı yayın küçük kartı gösterir.
- FR-HOME-005: Tüm kart ve bloklar rol bazlı görünürlük kurallarına uyar.

## 6. MVP Dışı
- Kişiselleştirilebilir dashboard düzeni (drag/drop).
- Kullanıcıya özel widget kaydı.
- Uyarı eşiği ve metrik kartı özelleştirme.

## 7. Page → Feature → Component Matrisi
| Sayfa | Feature | Kısa Açıklama | UI Component |
|---|---|---|---|
| Home | Global Metrics | 6 kartlı metrik şeridi | `MetricBar`, `MetricCard` |
| Home | Mini Map | Özet harita görünümü | `MiniMap`, `MapBadge` |
| Home | Fleet Health | Kritik cihaz listesi | `FleetHealthPanel`, `HealthRow`, `HealthSummary` |
| Home | Live Preview | Küçük yayın kartları | `LivePreviewGrid`, `LivePreviewCard` |

# Fleet Sayfası PRD

## 1. Sayfa Amacı
- Tüm UAV ve Dock cihazlarının durumlarını tek tabloda görüntülemek.
- Roller: Yönetici (ana), Operatör (izleme), Bakımcı (seçili cihazın config ve paket güncelliği kontrolü), İzleyici (salt okunur).

## 2. Ana Yüzey
- Birincil yüzey: Cihaz tablosu.
- Sürekli görünür: Cihaz adı, durum, proje, sağlık bilgisi, firmware/paket sürümü ve güncellik rozeti.
- Tema ve tipografi tokenları: `docs/prd/design_system.md`.

## 3. Overlay Yapısı
- Üst overlay: Navigasyon sekmeleri, proje dropdown, kullanıcı oturumu, global durum.
- Sol overlay: Filtre/arama paneli.
- Sağ overlay: Seçili cihaz detay paneli.
- Yüzen paneller: Detay telemetri kartları.
- Widget’lar: Toplam cihaz, aktif cihaz sayısı.

## 4. Temel Kullanıcı Etkileşimleri
- Seçim: Tablo satırı tekli seçim; Shift/Ctrl ile çoklu seçim.
- Panel davranışı: Detay paneli pin/küçült/gizle-tab.
- Klavye: `Esc` panel kapat, ok tuşları ile satır seçimi.
- Hızlı aksiyonlar: Filtre temizle, seçili cihaza odaklan (map link).

## 5. Sayfaya Özel Fonksiyonel Gereksinimler
- FR-FLT-001: Tüm cihazlar tek tabloda listelenir.
- FR-FLT-002: Tablo durum rozetleri ile görselleştirilir.
- FR-FLT-003: Seçili cihaz detay paneli açılır.
- FR-FLT-004: Filtre ve arama ile cihaz listesi daraltılır.
- FR-FLT-005: Sistemde kayıtlı fakat şu anda offline olan cihazlar da listede gösterilir.
- FR-FLT-006: Tablo satırlarında cihaz tipi (Dock/Copter/diğer) görsel ikon ile gösterilir.
- FR-FLT-008: Firmware/paket sürümü ve güncellik rozeti tablo satırında gösterilir.
- FR-FLT-009: Sağlık durumu kısa özet olarak batarya/ısı/sinyal göstergeleriyle görünür.

## 6. MVP Dışı
- Toplu cihaz bakım işlemleri.
- Cihaz sağlık geçmişi grafikleri.
- Detaylı bakım/servis kayıtları.

## 7. Page → Feature → Component Matrisi
| Sayfa | Feature | Kısa Açıklama | UI Component |
|---|---|---|---|
| Fleet | Fleet Table | Cihaz tablosu ve durumları | `FleetTable`, `FleetRow`, `StatusBadge`, `DeviceTypeIcon`, `HealthSummary`, `FirmwareBadge` |
| Fleet | Device Detail | Seçili cihaz detay paneli | `DeviceDetailPanel`, `DetailField`, `TelemetryCard` |
| Fleet | Filters | Proje ve durum filtreleri | `FleetFilterBar`, `FilterChips`, `SearchField` |

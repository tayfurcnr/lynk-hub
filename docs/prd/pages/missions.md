# Missions Sayfası PRD

## 1. Sayfa Amacı
- Görev planlama, onaylama ve görev yaşam döngüsünü izleme.
- Roller: Görev Planlayıcı (ana), Operatör (izleme/uygulama), Yönetici (onay), İzleyici (salt okunur).

## 2. Ana Yüzey
- Birincil yüzey: Harita.
- Sürekli görünür: Waypoint’ler, rota/alan overlay’i.
- Tema ve tipografi tokenları: `docs/prd/design_system.md`.

## 3. Overlay Yapısı
- Üst overlay: Navigasyon sekmeleri, proje dropdown, kullanıcı oturumu, global durum.
- Sol overlay: Görev listesi (durum rozetleri, filtre/sıralama).
- Sağ overlay: Seçili görev parametre paneli.
- Yüzen paneller: Waypoint/alan düzenleme paneli, görev onay paneli.
- Widget’lar: Görev durum özeti, onay bekleyen görev sayısı.

## 4. Temel Kullanıcı Etkileşimleri
- Seçim: Görev listesi tekli seçim; harita üzerinde waypoint/alan seçimi.
- Panel davranışı: Aç/kapa, pin, küçült, gizle-tab.
- Klavye: `N` yeni görev, `Del` seçili waypoint sil, `Esc` panel kapat.
- Hızlı aksiyonlar: Görev oluştur, onaya gönder, görev başlat/durdur (role göre).

## 5. Sayfaya Özel Fonksiyonel Gereksinimler
- FR-MIS-001: Görev listesi durum rozetleriyle görüntülenir.
- FR-MIS-002: Harita üzerinden waypoint’lerle alan/rota seçimi yapılabilir.
- FR-MIS-003: Seçili görev parametreleri panelde düzenlenir.
- FR-MIS-004: Görev onay akışı rol bazlıdır.
- FR-MIS-005: Görevler ekip/filo bazlı atanabilir.

## 6. MVP Dışı
- Otomatik rota optimizasyonu.
- Görev playback/timeline.
- Gelişmiş no-fly düzenleme.

## 7. Page → Feature → Component Matrisi
| Sayfa | Feature | Kısa Açıklama | UI Component |
|---|---|---|---|
| Missions | Map Planning Surface | Görev planlama harita yüzeyi | `MissionMapSurface`, `WaypointLayer` |
| Missions | Mission List | Görev listesi ve durumları | `MissionListPanel`, `MissionListItem`, `StatusBadge` |
| Missions | Mission Params | Seçili görev parametreleri | `MissionParamsPanel`, `ParamField`, `ParamGroup` |
| Missions | Waypoint Editor | Waypoint ekleme/taşıma/silme | `WaypointEditor`, `WaypointNode`, `WaypointHandle` |
| Missions | Approval Flow | Görev onay/iptal aksiyonları | `MissionApprovalBar`, `ApprovalButton` |

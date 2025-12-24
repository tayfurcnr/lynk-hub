# LynkHub İHA Operasyon Platformu
## Üst PRD (Frontend)

**Sürüm:** v1.0 (MVP)
**Tarih:** 16.12.2025
**Durum:** Taslak
**Ürün:** LynkHub
**Ürün Tipi:** Web tabanlı İHA görev kontrol platformu

---

## 1. Amaç

LynkHub, **birden fazla İHA**, **Dock istasyonları**, **görevler**, **telemetri** ve **canlı video akışlarını** gerçek zamanlı olarak yönetmek için merkezi bir web tabanlı görev kontrol platformudur.

---

## 2. Kapsam

### 2.1 Kapsam Dahilinde
- Proje bazlı İHA operasyonları
- Harita üzerinde gerçek zamanlı İHA ve Dock takibi
- Canlı telemetri görselleştirme
- Canlı video yayını (tekil ve çoklu görünüm)
- Görev planlama ve icra
- Rol bazlı kullanıcı erişimi
- Web tabanlı kullanıcı arayüzü (öncelik masaüstü)

---

## 3. UI Felsefesi (Global)

- **Ana yüzey = harita/video/tablo/ızgara**
- **Tüm kontroller overlay panel/widget olarak görünür**
- **Paneller sürüklenebilir, pinlenebilir, küçültülebilir, gruplanabilir**
- **Çoklu cihaz (UAV + Dock) takibi**
- **Rol bazlı UI görünürlüğü ve kısıtlama**
- **Tema ve tipografi tokenları `docs/prd/design_system.md` dokümanına bağlıdır**

---

## 4. Overlay ve Panel Kuralları (Global)

- Çoklu detay paneli açılabilir; paneller harita üzerinde sürüklenebilir.
- Panel durumları: açık, küçültülmüş, gizli (tab şeridi).
- Panel yönetimi: pin, hepsini kapat, hepsini küçült.
- Z-index: en son tıklanan en üstte; pinned paneller öncelikli.
- Snap: paneller ekran kenarlarına yaklaştırıldığında hizalanır.
- Multi-select: Shift/Ctrl ile çoklu seçim.
- Role-based UI locks: yetkisiz eylemler gizli/pasif + tooltip açıklaması.

---

## 5. Ana Navigasyon ve Sayfa PRD'leri

Aşağıdaki sayfalar ayrı PRD dosyalarında detaylandırılmıştır:

- Login: `docs/prd/pages/login.md`
- Home: `docs/prd/pages/home.md`
- Map: `docs/prd/pages/map.md`
- Live: `docs/prd/pages/live.md`
- Missions: `docs/prd/pages/missions.md`
- Media: `docs/prd/pages/media.md`
- Fleet: `docs/prd/pages/fleet.md`
- Settings: `docs/prd/pages/settings.md`

---

## 6. Kullanıcı Profilleri

### Yönetici
- Kullanıcıları ve yetkileri yönetir
- Projeleri oluşturur ve yapılandırır

### Operatör
- Canlı uçuşları izler
- Telemetri ve videoyu görüntüler

### Görev Planlayıcı
- Görevleri oluşturur ve düzenler

### İzleyici
- Salt okunur erişim

---

## 7. Fonksiyonel Gereksinimler (Global)

### Proje Yönetimi
- FR-001: Kullanıcılar birden fazla proje oluşturabilir
- FR-002: Projelerin coğrafi sınırları vardır

### Harita ve Görselleştirme
- FR-010: Canlı İHA ve Dock görselleştirmesi
- FR-011: Duruma göre renklendirme
- FR-012: Harita üzerine not/işaret ekleme

### Telemetri
- FR-020: Gerçek zamanlı telemetri gösterimi
- FR-021: WebSocket tabanlı iletim

### Canlı Video
- FR-030: Canlı video yayını
- FR-031: Çoklu görünüm ızgara düzeni

### Görev Yönetimi
- FR-040: Rota noktası görevleri
- FR-041: Görev yaşam döngüsü takibi

---

## 8. Fonksiyonel Olmayan Gereksinimler

- Telemetri gecikmesi ≤ 500 ms
- Video gecikmesi ≤ 1,5 sn
- JWT tabanlı kimlik doğrulama
- Rol bazlı yetkilendirme

---

## 9. Frontend-Backend İletişimi

- **Protokoller:** REST (HTTP/JSON) + gerçek zamanlı telemetri için WebSocket
- **Kimlik Doğrulama:** JWT (access token), `Authorization: Bearer <token>`
- **Yetkilendirme:** Rol bazlı, endpoint seviyesinde zorunlu kontrol
- **Hata Formatı:** JSON hata gövdesi (`code`, `message`, `details`)
- **Zaman Senkronu:** İstemci saatinden bağımsız, backend timestamp’leri esas alınır
- **Medya/Video:** Yayın URL’leri backend tarafından sağlanır (frontend sadece görüntüler)

---

## 10. Mimari (Frontend)

- Önyüz: Next.js.
- Panel/Widget yapısı: Tüm paneller ve widget’lar modüler, yeniden kullanılabilir bileşenlerdir.
- Düzenlenebilirlik: Her panel/widget ayrı bir klasörde konumlanır; değişiklikler bu klasörlerden yapılır.

---

## 11. MVP (Minimum Uygulanabilir Ürün)

- Proje kontrol paneli
- Canlı harita
- Telemetri
- Tekil + ızgara video görünümü
- Temel görevler

---

## 12. Yol Haritası

- Dock entegrasyonu
- Görev tekrar oynatımı
- Yapay zekâ analitiği

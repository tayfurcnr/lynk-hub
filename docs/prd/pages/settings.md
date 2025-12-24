# Settings Sayfası PRD

## 1. Sayfa Amacı
- Sistem ve proje ayarlarını yönetmek, rol bazlı erişimleri düzenlemek.
- Roller: Yönetici (ana), Operatör (kısıtlı), Görev Planlayıcı (kısıtlı).

## 2. Ana Yüzey
- Birincil yüzey: Ayar formları.
- Sürekli görünür: Bölüm başlıkları ve temel form alanları.
- Tema ve tipografi tokenları: `docs/prd/design_system.md`.

## 3. Overlay Yapısı
- Üst overlay: Navigasyon sekmeleri, proje dropdown, kullanıcı oturumu, global durum.
- Sol overlay: Ayar kategorileri listesi.
- Sağ overlay: Seçili ayar detay paneli.
- Yüzen paneller: Rol/izin düzenleme paneli.
- Widget’lar: Son kaydetme zamanı, uyarı bildirimleri.

## 4. Temel Kullanıcı Etkileşimleri
- Seçim: Kategori listesi tekli seçim.
- Panel davranışı: Detay paneli pin/küçült/gizle-tab.
- Klavye: `Esc` panel kapat, `Ctrl+S` kaydet.
- Hızlı aksiyonlar: Kaydet, varsayılanlara dön.

## 5. Sayfaya Özel Fonksiyonel Gereksinimler
- FR-SET-001: Ayarlar kategori bazlı görüntülenir.
- FR-SET-002: Rol bazlı izinler UI üzerinden yönetilir.
- FR-SET-003: Kullanıcı profili ve oturum yönetimi paneli bulunur.
- FR-SET-004: Yetkisiz kullanıcılar kısıtlı alanları göremez veya düzenleyemez.

## 6. MVP Dışı
- Gelişmiş denetim/audit logları.
- Çoklu proje şablon yönetimi.
- Gelişmiş API anahtar yönetimi.

## 7. Page → Feature → Component Matrisi
| Sayfa | Feature | Kısa Açıklama | UI Component |
|---|---|---|---|
| Settings | Settings Forms | Proje ve sistem ayar formları | `SettingsForm`, `FormSection`, `FormField` |
| Settings | Role Access | Rol bazlı görünürlük ve izinler | `RoleAccessPanel`, `RoleRow`, `PermissionToggle` |
| Settings | User Profile | Kullanıcı profili/oturum yönetimi | `UserProfilePanel`, `AvatarCard`, `SessionActions` |

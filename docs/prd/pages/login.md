# Login Sayfası PRD

## 1. Sayfa Amacı
- Kullanıcı giriş akışını sade ve hızlı şekilde sunmak.
- Roller: Tüm roller (giriş ekranı rol bağımsız).

## 2. Ana Yüzey
- Birincil yüzey: Giriş formu.
- Sürekli görünür: Kullanıcı adı, şifre, giriş butonu.
- Ek öğeler: "Remember me" toggle, "Şifrenizi unuttunuz mu?" linki, "Kayıt ol" butonu.
- Tema ve tipografi tokenları: `docs/prd/design_system.md`.

## 3. Overlay Yapısı
- Üst overlay: Yok (dikkat dağıtmamak için).
- Alt alan: Sayfanın en altında sürüm bilgisi (ör. "Ops Command Suite v1.0").

## 4. Temel Kullanıcı Etkileşimleri
- Form doğrulama: Boş alanlarda inline uyarı.
- Enter ile giriş.
- Hatalı girişte açıklayıcı hata mesajı.

## 5. Tasarım ve Yerleşim
- Yerleşim: Tek kolon minimal; marka ve form tek panelde toplanır, sürüm bilgisi en altta.
- Panel: Koyu ve futuristik yüzey, hafif glow ve gradient.
- Form: Panel içinde net hiyerarşi; önce marka, sonra form alanı.
- Arka plan: Soğuk mavi tonlu çoklu radial gradient.
- Form kartı: `--surface-card`, `--radius-md`, `--shadow-sm`.
- Başlık: `--font-heading`, form metni `--font-body`.
- Birincil buton: `--brand-accent` arka plan, hover `--brand-link`.
- Link: `--brand-link`, hover altında çizgi.
- İkincil buton: Yuvarlatılmış (pill) ve gradient, minimal hover.
- Remember me: Toggle formu (checkbox görünümü yerine switch).
- Hata durumu: `--status-danger` ile inline mesaj ve input border.

## 6. Düşük Sadakat Wireframe (Metin Tarifi)
- Tek panel: Üstte marka ve tagline, altta giriş formu ve aksiyonlar.
- Panel dışında: Sayfanın en altında küçük sürüm bilgisi.

## 7. Animasyonlar
- Sayfa yuklenisi: Panel 200–300ms yumusak fade + slide‑up.
- Buton hover: Hafif scale (1.01) ve glow artisi.
- Hata durumu: Input border’da kisa (150ms) pulse.

## 8. Sayfaya Özel Fonksiyonel Gereksinimler
- FR-LOG-001: Kullanıcı adı + şifre ile giriş.
- FR-LOG-002: "Beni hatırla" seçeneği desteklenir.
- FR-LOG-003: "Şifremi unuttum" linki görünür.
- FR-LOG-004: Hatalı giriş mesajları kullanıcıya net ve kısa gösterilir.

## 9. MVP Dışı
- 2FA/OTP doğrulama.
- SSO (SAML/OAuth).
- Kullanıcı doğrulama limiti ve CAPTCHA.

## 10. Page → Feature → Component Matrisi
| Sayfa | Feature | Kısa Açıklama | UI Component |
|---|---|---|---|
| Login | Login Form | Kullanıcı adı/şifre formu | `LoginForm`, `TextField`, `PasswordField`, `PrimaryButton` |
| Login | Remember Me | Kullanıcıyı hatırla seçeneği | `RememberMeToggle` |
| Login | Forgot Password | Şifre sıfırlama linki | `ForgotPasswordLink` |
| Login | Sign Up | Kayıt oluşturma aksiyonu | `SecondaryButton` |
| Login | Password Toggle | Şifre görünürlük kontrolü | `EyeToggleButton` |

## 11. Sayfa Durumları (UI States)
- Idle: Sayfa ilk açıldığında.
- Submitting: Giriş isteği gönderildiğinde.
- Success: Başarılı giriş → yönlendirme.
- Error: Hatalı giriş.
- Disabled: Form geçici olarak kilitli (istek sırasında).

## 12. Başarılı Giriş Sonrası Akış
- Başarılı girişte varsayılan yönlendirme: `/dashboard`.
- `redirect` parametresi varsa ilgili route'a yönlendirilir.
- Session aktif değilse korunan sayfalardan login'e yönlendirilir.

## 13. Hata Mesajları
| Kod | Mesaj |
|---|---|
| AUTH_INVALID | Kullanıcı adı veya şifre hatalı |
| AUTH_LOCKED | Hesap geçici olarak kilitlendi |
| AUTH_NETWORK | Bağlantı hatası |
| AUTH_UNKNOWN | Beklenmeyen bir hata oluştu |

## 14. Güvenlik / UX Kısıtları
- Şifre alanı maskeli olmalı.
- Şifre için Göster/Gizle toggle olmalı.
- Form çok hızlı tekrar submit edilmesini engeller (debounce).
- Hata mesajları kullanıcı adı mı şifre mi hatalı ayrıştırmaz (security).

## 15. Erişilebilirlik
- Input'lar label ile bağlı olmalı.
- Tab ile gezinme desteklenmeli.
- Enter ile submit çalışmalı.
- Hata mesajları screen-reader uyumlu olmalı.
- Kontrast oranları WCAG AA olmalı.

## 17. Teknik Notlar
- Frontend: Next.js.
- Auth: Token / Session bazlı.
- API: `/api/auth/login`.
- Form state: Client-side validation + server response.

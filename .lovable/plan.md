

## TempMail — Website Email Temporary

### Konsep
Website penyedia email temporary dengan domain custom. User mendapat alamat email acak yang aktif 24 jam (free plan). Bisa top-up balance untuk perpanjang durasi menjadi unlimited.

### Halaman & Fitur

**1. Landing Page (Split Screen)**
- Kiri: Hero text — judul, deskripsi layanan, tombol "Generate Email Gratis"
- Kanan: Preview inbox mockup / ilustrasi
- Section bawah: Fitur highlights (24 jam gratis, kirim & terima, upgrade unlimited)
- Pricing cards: Free (24 jam) vs Premium (unlimited, top-up balance)

**2. Email Dashboard**
- Alamat email temporary yang di-generate otomatis ditampilkan di atas dengan tombol copy
- Inbox list di sidebar kiri, email content di kanan
- Tombol Refresh untuk cek email baru
- Tombol Compose untuk kirim email
- Timer countdown 24 jam untuk free plan
- Badge status: Active / Expired

**3. Compose Email**
- Modal/dialog untuk kirim email
- Field: To, Subject, Body (rich text sederhana)
- Tombol Send

**4. Top-Up / Pricing Page**
- Balance display
- Paket top-up (misal: Rp 10.000 = 30 hari, Rp 25.000 = 90 hari, Rp 50.000 = unlimited)
- Integrasi pembayaran (Stripe untuk kartu internasional, placeholder untuk Midtrans/Xendit)

**5. Auth (Login/Register)**
- Register dengan email/password
- Login untuk akses dashboard dan history email
- User bisa punya multiple temporary email addresses

### Database (Supabase)
- **profiles** — user data
- **temp_emails** — generated email addresses, expiry time, status
- **email_messages** — inbox/sent messages
- **transactions** — top-up history & balance
- **user_roles** — role management

### Design
- **Palette**: Midnight Indigo (#0a0a1a, #141432, #1e1e5a, #4f46e5)
- **Font**: Space Grotesk (heading) + DM Sans (body)
- **Layout**: Split screen hero, dashboard layout untuk inbox
- **Style**: Dark theme, glassmorphism cards, subtle animations
- **Bahasa UI**: Bahasa Indonesia

### Catatan Teknis
- Email sending/receiving memerlukan integrasi dengan mail server eksternal (Mailgun/custom SMTP) — akan disiapkan sebagai edge function yang bisa dikoneksikan nanti
- Saat ini inbox akan menggunakan polling ke Supabase untuk simulasi
- Stripe akan diaktifkan untuk pembayaran internasional
- Midtrans/Xendit bisa ditambahkan kemudian via edge function


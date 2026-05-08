import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Shield, Clock, Zap, CreditCard, RefreshCw, ArrowRight, Check, Inbox } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-border/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            <span className="font-heading text-xl font-bold text-foreground">TempMail</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/pricing">
              <Button variant="ghost" size="sm">Harga</Button>
            </Link>
            <Link to="/auth">
              <Button variant="ghost" size="sm">Masuk</Button>
            </Link>
            <Link to="/auth?tab=register">
              <Button size="sm" className="glow-primary">Daftar Gratis</Button>
            </Link>
          </div>
          {/* Note: After login users go to /app/dashboard */}
        </div>
      </nav>

      {/* Hero - Split Screen */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          {/* Left - Text */}
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm">
              <Zap className="h-3.5 w-3.5" />
              <span>Email .edu temporary gratis</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Email Temporary
              <br />
              <span className="gradient-text">Instan & Aman</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md">
              Dapatkan email temporary secara instan. Terima, kirim, dan kelola email dengan mudah. Gratis 24 jam, upgrade untuk akses unlimited.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/auth?tab=register">
                <Button size="lg" className="glow-primary text-base px-8">
                  Generate Email Gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="text-base">
                  Lihat Paket
                </Button>
              </Link>
            </div>
          </div>

          {/* Right - Inbox Preview Mockup */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="glass-card p-6 space-y-4 glow-primary">
              <div className="flex items-center justify-between pb-3 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <Inbox className="h-5 w-5 text-primary" />
                  <span className="font-heading font-semibold text-foreground">Inbox</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Aktif — 23:42:15
                </div>
              </div>
              <div className="text-sm text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2 font-mono">
                user_abc123@adzstore.my.id
              </div>
              {[
                { from: "noreply@github.com", subject: "Verifikasi email Anda", time: "2 menit lalu", unread: true },
                { from: "support@spotify.com", subject: "Selamat datang di Spotify!", time: "15 menit lalu", unread: true },
                { from: "no-reply@discord.com", subject: "Konfirmasi akun Discord", time: "1 jam lalu", unread: false },
              ].map((email, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${email.unread ? 'bg-primary/5 border border-primary/10' : 'hover:bg-secondary/30'}`}>
                  <div className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${email.unread ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${email.unread ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>{email.from}</p>
                    <p className="text-sm text-muted-foreground truncate">{email.subject}</p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{email.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-3">Fitur Lengkap</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Semua yang kamu butuhkan untuk email temporary</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: "24 Jam Gratis", desc: "Dapatkan email temporary aktif selama 24 jam tanpa biaya apapun." },
              { icon: Shield, title: "Aman & Privat", desc: "Email terhapus otomatis setelah expired. Privasi kamu terjaga." },
              { icon: RefreshCw, title: "Kirim & Terima", desc: "Bisa menerima dan mengirim email dari alamat temporary kamu." },
              { icon: Zap, title: "Instan", desc: "Generate alamat email baru dalam hitungan detik." },
              { icon: CreditCard, title: "Upgrade Unlimited", desc: "Top-up balance untuk perpanjang masa aktif tanpa batas." },
              { icon: Mail, title: "Multi Email", desc: "Buat beberapa alamat email temporary sekaligus." },
            ].map((f, i) => (
              <div key={i} className="glass-card p-6 space-y-3 hover:border-primary/30 transition-all group">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-3">Pilih Paket</h2>
            <p className="text-muted-foreground">Mulai gratis, upgrade kapan saja</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="glass-card p-8 space-y-4">
              <h3 className="font-heading text-xl font-bold text-foreground">Free</h3>
              <p className="text-3xl font-heading font-bold text-foreground">Rp 0</p>
              <ul className="space-y-2">
                {["3 credits saat register", "Email aktif 24 jam", "Kirim & terima email"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary" />{f}
                  </li>
                ))}
              </ul>
              <Link to="/auth?tab=register">
                <Button variant="outline" className="w-full">Mulai Gratis</Button>
              </Link>
            </div>
            <div className="glass-card p-8 space-y-4 border-primary/30 glow-primary relative">
              <div className="absolute -top-3 left-6 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                Populer
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground">Premium Unlimited</h3>
              <p className="text-3xl font-heading font-bold text-foreground">Rp 150.000<span className="text-sm text-muted-foreground font-normal">/3 bulan</span></p>
              <ul className="space-y-2">
                {["Unlimited email selama 3 bulan", "Akses API key untuk automation", "Email tidak expired", "Prioritas support"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary" />{f}
                  </li>
                ))}
              </ul>
              <Link to="/pricing">
                <Button className="w-full glow-primary">Upgrade Sekarang</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/20">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <span className="font-heading font-semibold text-foreground">TempMail</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 TempMail. Semua hak cipta dilindungi.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Check, ArrowLeft, CreditCard, Smartphone, Globe } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "Rp 0",
    period: "",
    features: ["3 credits saat register", "Email aktif 24 jam", "Kirim & terima email"],
    cta: "Mulai Gratis",
    href: "/auth?tab=register",
    popular: false,
  },
  {
    name: "Top-up Credits",
    price: "Rp 1.000",
    period: "/credit",
    features: ["1 credit = 1 email (24 jam)", "Bayar sesuai pemakaian", "Tidak ada masa kadaluarsa"],
    cta: "Top-Up",
    href: "/app/plan",
    popular: false,
  },
  {
    name: "Premium Unlimited",
    price: "Rp 150.000",
    period: "/3 bulan",
    features: ["Unlimited email selama 3 bulan", "Akses API key untuk automation", "Email tidak expired", "Prioritas support"],
    cta: "Upgrade Premium",
    href: "/app/plan",
    popular: true,
  },
];

const paymentMethods = [
  { icon: CreditCard, name: "Kartu Kredit/Debit", desc: "Visa, Mastercard (via Stripe)" },
  { icon: Smartphone, name: "Midtrans", desc: "GoPay, OVO, DANA, BCA VA, dll" },
  { icon: Globe, name: "Xendit", desc: "QRIS, Bank Transfer, E-wallet" },
];

const Pricing = () => {
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
            <Link to="/auth">
              <Button variant="ghost" size="sm">Masuk</Button>
            </Link>
            <Link to="/auth?tab=register">
              <Button size="sm" className="glow-primary">Daftar Gratis</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-3">Pilih Paket yang Tepat</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Mulai gratis dengan email 24 jam, atau upgrade untuk akses lebih lama
            </p>
          </div>

          {/* Plans */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div key={i} className={`glass-card p-6 space-y-4 relative ${plan.popular ? "border-primary/30 glow-primary" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    Populer
                  </div>
                )}
                <h3 className="font-heading text-lg font-bold text-foreground">{plan.name}</h3>
                <p className="text-2xl font-heading font-bold text-foreground">
                  {plan.price}
                  {plan.period && <span className="text-sm text-muted-foreground font-normal">{plan.period}</span>}
                </p>
                <ul className="space-y-2">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <Link to={plan.href}>
                  <Button className={`w-full ${plan.popular ? "glow-primary" : ""}`} variant={plan.popular ? "default" : "outline"}>
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Metode Pembayaran</h2>
            <p className="text-muted-foreground">Bayar dengan cara yang paling nyaman</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {paymentMethods.map((pm, i) => (
              <div key={i} className="glass-card p-6 text-center space-y-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                  <pm.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground">{pm.name}</h3>
                <p className="text-sm text-muted-foreground">{pm.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Back */}
      <div className="pb-8 text-center">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
};

export default Pricing;

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Coins } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { Badge } from "@/components/ui/badge";

const PlanPage = () => {
  const { isPremium, balance, unlimitedUntil } = useProfile();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Plan & Subscription</h1>
        <p className="text-muted-foreground mt-1">Pilih paket sesuai kebutuhan Anda</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status Saat Ini</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            {isPremium ? (
              <>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Premium Unlimited</p>
                  <p className="text-sm text-muted-foreground">
                    Berakhir {unlimitedUntil && new Date(unlimitedUntil).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <Coins className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Free Plan</p>
                  <p className="text-sm text-muted-foreground">Sisa {balance} credits</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Free</CardDescription>
            <CardTitle className="font-heading text-3xl">Rp 0</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2"><Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /> 3 credits saat register</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /> Email aktif 24 jam</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /> Kirim & terima email</li>
            </ul>
            <Button variant="outline" className="w-full" disabled>Plan saat ini</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Top-up Credits</CardDescription>
            <CardTitle className="font-heading text-3xl">
              Rp 1.000<span className="text-sm font-normal text-muted-foreground">/credit</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2"><Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /> Bayar sesuai pemakaian</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /> 1 credit = 1 email (24 jam)</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /> Tidak ada masa kadaluarsa</li>
            </ul>
            <Button className="w-full">Top-up Sekarang</Button>
          </CardContent>
        </Card>

        <Card className="border-primary/40 relative shadow-[0_0_30px_-10px_hsl(var(--primary)/0.4)]">
          <Badge className="absolute -top-2 right-4">Best Value</Badge>
          <CardHeader>
            <CardDescription className="flex items-center gap-1"><Crown className="h-3 w-3 text-primary" /> Premium Unlimited</CardDescription>
            <CardTitle className="font-heading text-3xl">
              Rp 150.000<span className="text-sm font-normal text-muted-foreground">/3 bulan</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2"><Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /> Unlimited email selama 3 bulan</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /> Akses API key untuk automation</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /> Email tidak expired (selama subscription aktif)</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /> Prioritas support</li>
            </ul>
            <Button className="w-full glow-primary">Upgrade Premium</Button>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Pembayaran tersedia via Stripe, Midtrans (GoPay/OVO/DANA/VA), dan Xendit (QRIS/E-wallet).
      </p>
    </div>
  );
};

export default PlanPage;

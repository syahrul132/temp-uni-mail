import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useTempEmails } from "@/hooks/useTempEmails";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Coins, Mail, Crown, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const DashboardPage = () => {
  const { balance, isPremium, unlimitedUntil } = useProfile();
  const { emails } = useTempEmails();
  const { user } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const ids = emails.map((e) => e.id);
      if (!ids.length) return setUnread(0);
      const { count } = await supabase
        .from("email_messages")
        .select("*", { count: "exact", head: true })
        .in("temp_email_id", ids)
        .eq("is_read", false)
        .eq("direction", "incoming");
      setUnread(count ?? 0);
    })();
  }, [emails, user]);

  const stats = [
    {
      icon: Coins,
      label: "Credits",
      value: isPremium ? "∞" : balance,
      sub: isPremium ? "Unlimited aktif" : "1 credit = 1 email (24 jam)",
    },
    { icon: Mail, label: "Email Aktif", value: emails.filter((e) => e.is_active).length, sub: `Total ${emails.length} email` },
    { icon: TrendingUp, label: "Pesan Belum Dibaca", value: unread, sub: "Di seluruh inbox" },
    {
      icon: Crown,
      label: "Status",
      value: isPremium ? "Premium" : "Free",
      sub: isPremium && unlimitedUntil ? `Berakhir ${new Date(unlimitedUntil).toLocaleDateString("id-ID")}` : "Upgrade untuk unlimited",
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Ringkasan aktivitas akun Anda</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardDescription>{s.label}</CardDescription>
              <s.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-heading font-bold">{s.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Email Terbaru</CardTitle>
          <CardDescription>5 alamat email temporary terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          {emails.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Belum ada email. Buat dari menu Inbox.</p>
          ) : (
            <div className="divide-y">
              {emails.slice(0, 5).map((e) => (
                <div key={e.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm">{e.email_address}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(e.created_at).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${e.is_active ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"}`}>
                    {e.is_active ? "Aktif" : "Expired"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;

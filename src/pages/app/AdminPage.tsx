import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Plus, Crown } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const AdminPage = () => {
  const { isAdmin, isLoading } = useProfile();
  const qc = useQueryClient();
  const [topupUser, setTopupUser] = useState<string | null>(null);
  const [credits, setCredits] = useState(10);
  const [months, setMonths] = useState(3);

  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const addCredits = useMutation({
    mutationFn: async ({ userId, amount }: { userId: string; amount: number }) => {
      const { error } = await supabase.rpc("add_credits", { p_user_id: userId, p_amount: amount });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Credits ditambahkan");
      qc.invalidateQueries({ queryKey: ["admin-profiles"] });
      setTopupUser(null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const grantSub = useMutation({
    mutationFn: async ({ userId, m }: { userId: string; m: number }) => {
      const { error } = await supabase.rpc("grant_unlimited_subscription", { p_user_id: userId, p_months: m });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Subscription diperpanjang");
      qc.invalidateQueries({ queryKey: ["admin-profiles"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) return null;
  if (!isAdmin) return <Navigate to="/app/dashboard" replace />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <div>
          <h1 className="font-heading text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground text-sm">Kelola user, credits, dan subscription</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card><CardHeader><CardDescription>Total User</CardDescription><CardTitle className="text-3xl">{profiles.length}</CardTitle></CardHeader></Card>
        <Card><CardHeader><CardDescription>Premium Aktif</CardDescription><CardTitle className="text-3xl">{profiles.filter((p) => p.unlimited_until && new Date(p.unlimited_until) > new Date()).length}</CardTitle></CardHeader></Card>
        <Card><CardHeader><CardDescription>Total Credits Beredar</CardDescription><CardTitle className="text-3xl">{profiles.reduce((s, p) => s + (p.balance || 0), 0)}</CardTitle></CardHeader></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Daftar Pengguna</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Premium s/d</TableHead>
                <TableHead>Terdaftar</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((p) => {
                const premium = p.unlimited_until && new Date(p.unlimited_until) > new Date();
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.display_name || p.user_id.slice(0, 8)}</TableCell>
                    <TableCell>{p.balance}</TableCell>
                    <TableCell>
                      {premium ? (
                        <span className="text-primary inline-flex items-center gap-1"><Crown className="h-3 w-3" />{new Date(p.unlimited_until!).toLocaleDateString("id-ID")}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(p.created_at).toLocaleDateString("id-ID")}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setTopupUser(p.user_id)}>
                        <Plus className="h-3 w-3 mr-1" /> Credits
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => grantSub.mutate({ userId: p.user_id, m: months })}>
                        <Crown className="h-3 w-3 mr-1" /> +{months}bln
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!topupUser} onOpenChange={(o) => !o && setTopupUser(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Tambah Credits</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <Label>Jumlah credits</Label>
            <Input type="number" value={credits} onChange={(e) => setCredits(parseInt(e.target.value) || 0)} />
          </div>
          <DialogFooter>
            <Button onClick={() => topupUser && addCredits.mutate({ userId: topupUser, amount: credits })}>
              Tambah
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;

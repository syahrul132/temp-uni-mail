import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Key, Plus, Trash2, Copy, Lock, Crown } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

async function sha256(str: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateKey() {
  const arr = new Uint8Array(24);
  crypto.getRandomValues(arr);
  const b64 = btoa(String.fromCharCode(...arr)).replace(/[+/=]/g, "").slice(0, 32);
  return `tk_live_${b64}`;
}

const ApiKeysPage = () => {
  const { user } = useAuth();
  const { isPremium } = useProfile();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);

  const { data: keys = [] } = useQuery({
    queryKey: ["api-keys", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("api_keys").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user && isPremium,
  });

  const createKey = useMutation({
    mutationFn: async () => {
      const raw = generateKey();
      const hash = await sha256(raw);
      const prefix = raw.slice(0, 14);
      const { error } = await supabase.from("api_keys").insert({
        user_id: user!.id,
        name: name || "Default",
        key_hash: hash,
        key_prefix: prefix,
      });
      if (error) throw error;
      return raw;
    },
    onSuccess: (raw) => {
      qc.invalidateQueries({ queryKey: ["api-keys"] });
      setNewKey(raw);
      setName("");
    },
    onError: () => toast.error("Gagal membuat key"),
  });

  const deleteKey = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("api_keys").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["api-keys"] });
      toast.success("API key dihapus");
    },
  });

  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tempmail-api`;

  if (!isPremium) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-7 w-7 text-primary" />
            </div>
            <h2 className="font-heading text-2xl font-bold">Fitur Premium</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              API Keys hanya tersedia untuk pelanggan Premium. Gunakan API kami untuk automation register di website lain dengan email temporary.
            </p>
            <Link to="/app/plan">
              <Button className="glow-primary">
                <Crown className="h-4 w-4 mr-2" /> Upgrade Premium
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">API Keys</h1>
        <p className="text-muted-foreground mt-1">Gunakan API untuk automation pendaftaran di website lain</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Buat API Key Baru</CardTitle>
          <CardDescription>Beri nama untuk identifikasi (mis. "Bot Register")</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input placeholder="Nama key" value={name} onChange={(e) => setName(e.target.value)} />
            <Button onClick={() => createKey.mutate()} disabled={createKey.isPending} className="glow-primary">
              <Plus className="h-4 w-4 mr-1" /> Buat
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Keys Anda</CardTitle>
        </CardHeader>
        <CardContent>
          {keys.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">Belum ada API key.</p>
          ) : (
            <div className="divide-y">
              {keys.map((k) => (
                <div key={k.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-primary" />
                      <p className="font-medium">{k.name}</p>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground mt-1">{k.key_prefix}••••••••</p>
                    <p className="text-xs text-muted-foreground">
                      Dibuat {new Date(k.created_at).toLocaleDateString("id-ID")}
                      {k.last_used_at && ` · Terakhir dipakai ${new Date(k.last_used_at).toLocaleDateString("id-ID")}`}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteKey.mutate(k.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dokumentasi API</CardTitle>
          <CardDescription>Endpoint untuk automation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="font-medium mb-1">Buat email baru</p>
            <pre className="bg-muted/50 p-3 rounded text-xs overflow-x-auto"><code>{`POST ${apiUrl}/create-email
Authorization: Bearer YOUR_API_KEY

Response: { "email": "abc123@adzstore.my.id", "id": "..." }`}</code></pre>
          </div>
          <div>
            <p className="font-medium mb-1">Cek inbox</p>
            <pre className="bg-muted/50 p-3 rounded text-xs overflow-x-auto"><code>{`GET ${apiUrl}/inbox?email_id=EMAIL_ID
Authorization: Bearer YOUR_API_KEY

Response: { "messages": [...] }`}</code></pre>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!newKey} onOpenChange={(o) => !o && setNewKey(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Key Baru</DialogTitle>
            <DialogDescription>
              Simpan key ini sekarang. Anda <strong>tidak akan</strong> bisa melihatnya lagi.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted p-3 rounded font-mono text-sm break-all">{newKey}</div>
          <DialogFooter>
            <Button onClick={() => { navigator.clipboard.writeText(newKey!); toast.success("Disalin!"); }}>
              <Copy className="h-4 w-4 mr-1" /> Salin
            </Button>
            <Button variant="outline" onClick={() => setNewKey(null)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApiKeysPage;

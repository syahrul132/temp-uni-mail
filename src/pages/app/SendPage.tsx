import { useState } from "react";
import { useTempEmails } from "@/hooks/useTempEmails";
import { useMessages } from "@/hooks/useMessages";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

const SendPage = () => {
  const { emails } = useTempEmails();
  const [sender, setSender] = useState<string>("");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const senderEmail = emails.find((e) => e.id === sender);
  const { sendMessage } = useMessages(sender || null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sender || !senderEmail) return toast.error("Pilih alamat pengirim");
    if (!recipient || !subject) return toast.error("Penerima & subjek wajib");
    setLoading(true);
    try {
      await sendMessage.mutateAsync({
        recipient: recipient.trim(),
        subject: subject.trim(),
        body: body.trim(),
        sender: senderEmail.email_address,
      });
      toast.success("Email terkirim!");
      setRecipient(""); setSubject(""); setBody("");
    } catch {
      toast.error("Gagal mengirim");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold">Kirim Email</h1>
        <p className="text-muted-foreground mt-1">Tulis dan kirim email dari alamat temporary Anda</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pesan Baru</CardTitle>
          <CardDescription>Pesan terkirim akan tersimpan di inbox sebagai outgoing</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Dari</Label>
              <Select value={sender} onValueChange={setSender}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih alamat pengirim" />
                </SelectTrigger>
                <SelectContent>
                  {emails.length === 0 && <div className="px-3 py-2 text-sm text-muted-foreground">Buat email terlebih dahulu di Inbox</div>}
                  {emails.map((e) => (
                    <SelectItem key={e.id} value={e.id} className="font-mono">{e.email_address}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Kepada</Label>
              <Input type="email" placeholder="penerima@example.com" value={recipient} onChange={(e) => setRecipient(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Subjek</Label>
              <Input placeholder="Subjek email" value={subject} onChange={(e) => setSubject(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Isi Pesan</Label>
              <Textarea rows={8} placeholder="Tulis pesan..." value={body} onChange={(e) => setBody(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading} className="glow-primary">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Kirim Email
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SendPage;

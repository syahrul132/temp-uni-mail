import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

interface ComposeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  senderEmail: string;
  onSend: (data: { recipient: string; subject: string; body: string; sender: string }) => Promise<void>;
}

const ComposeDialog = ({ open, onOpenChange, senderEmail, onSend }: ComposeDialogProps) => {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !subject.trim()) {
      toast.error("Penerima dan subjek harus diisi");
      return;
    }
    setLoading(true);
    try {
      await onSend({ recipient: recipient.trim(), subject: subject.trim(), body: body.trim(), sender: senderEmail });
      toast.success("Email terkirim!");
      setRecipient("");
      setSubject("");
      setBody("");
      onOpenChange(false);
    } catch {
      toast.error("Gagal mengirim email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border/30">
        <DialogHeader>
          <DialogTitle className="font-heading">Tulis Email</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSend} className="space-y-4">
          <div className="space-y-2">
            <Label>Dari</Label>
            <Input value={senderEmail} disabled className="opacity-60" />
          </div>
          <div className="space-y-2">
            <Label>Kepada</Label>
            <Input
              placeholder="email@contoh.com"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
              type="email"
            />
          </div>
          <div className="space-y-2">
            <Label>Subjek</Label>
            <Input
              placeholder="Subjek email"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Isi Email</Label>
            <Textarea
              placeholder="Tulis pesan kamu..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="glow-primary">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Kirim
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ComposeDialog;

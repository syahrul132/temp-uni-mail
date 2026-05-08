import { useState, useEffect } from "react";
import { useTempEmails, InsufficientCreditsError } from "@/hooks/useTempEmails";
import { useMessages } from "@/hooks/useMessages";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CountdownTimer from "@/components/CountdownTimer";
import UpgradeDialog from "@/components/UpgradeDialog";
import { Plus, RefreshCw, Copy, Inbox as InboxIcon, Loader2, ChevronLeft, Mail } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const InboxPage = () => {
  const { emails, isLoading, createEmail } = useTempEmails();
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [view, setView] = useState<"list" | "messages" | "detail">("list");

  const { messages, isLoading: msgLoading, refetch, markAsRead } = useMessages(selectedEmailId);
  const selectedEmail = emails.find((e) => e.id === selectedEmailId);
  const selectedMessage = messages.find((m) => m.id === selectedMessageId);

  useEffect(() => {
    if (emails.length > 0 && !selectedEmailId) setSelectedEmailId(emails[0].id);
  }, [emails, selectedEmailId]);

  const handleCreate = async () => {
    try {
      await createEmail.mutateAsync();
      toast.success("Email baru dibuat!");
    } catch (e) {
      if (e instanceof InsufficientCreditsError) {
        setUpgradeOpen(true);
      } else {
        toast.error("Gagal membuat email");
      }
    }
  };

  const handleCopy = (t: string) => {
    navigator.clipboard.writeText(t);
    toast.success("Disalin ke clipboard");
  };

  const handleSelectMsg = (id: string) => {
    setSelectedMessageId(id);
    setView("detail");
    const m = messages.find((x) => x.id === id);
    if (m && !m.is_read) markAsRead.mutate(id);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex">
      {/* Email list */}
      <aside className={`w-full md:w-72 border-r border-border/40 flex-shrink-0 flex flex-col ${view !== "list" ? "hidden md:flex" : "flex"}`}>
        <div className="p-3 border-b border-border/40">
          <Button onClick={handleCreate} disabled={createEmail.isPending} className="w-full glow-primary">
            {createEmail.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
            Email Baru
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {emails.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">Belum ada email temporary.</div>
          ) : (
            emails.map((e) => (
              <button
                key={e.id}
                onClick={() => { setSelectedEmailId(e.id); setSelectedMessageId(null); setView("messages"); }}
                className={`w-full text-left px-3 py-3 border-b border-border/20 hover:bg-secondary/30 transition ${selectedEmailId === e.id ? "bg-secondary/40" : ""}`}
              >
                <p className="text-sm font-mono truncate">{e.email_address}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`h-1.5 w-1.5 rounded-full ${e.is_active ? "bg-green-500" : "bg-destructive"}`} />
                  <CountdownTimer expiresAt={e.expires_at} isPremium={e.is_premium} />
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Messages */}
      <section className={`flex-1 flex flex-col min-w-0 ${view === "messages" ? "flex" : "hidden md:flex"} ${view === "detail" ? "hidden md:flex" : ""}`}>
        {selectedEmail ? (
          <>
            <div className="p-3 border-b border-border/40 flex items-center gap-2">
              <button onClick={() => setView("list")} className="md:hidden"><ChevronLeft className="h-5 w-5" /></button>
              <p className="text-sm font-mono flex-1 truncate">{selectedEmail.email_address}</p>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(selectedEmail.email_address)}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="h-3 w-3 mr-1" /> Refresh
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {msgLoading ? (
                <div className="flex items-center justify-center h-32"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                  <InboxIcon className="h-12 w-12 opacity-30" />
                  <p className="text-sm">Inbox kosong</p>
                </div>
              ) : (
                messages.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMsg(m.id)}
                    className={`w-full text-left p-3 border-b border-border/20 hover:bg-secondary/30 flex gap-3 ${!m.is_read && m.direction === "incoming" ? "bg-primary/5" : ""}`}
                  >
                    <div className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${m.direction === "outgoing" ? "bg-blue-400" : !m.is_read ? "bg-primary" : "bg-muted-foreground/30"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm truncate ${!m.is_read ? "font-medium" : "text-muted-foreground"}`}>
                          {m.direction === "outgoing" ? `Ke: ${m.recipient}` : m.sender}
                        </p>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{format(new Date(m.created_at), "HH:mm")}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{m.subject}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
            <Mail className="h-12 w-12 opacity-30" />
            <p className="text-sm">Pilih email dari sidebar</p>
          </div>
        )}
      </section>

      {/* Detail */}
      <section className={`flex-1 border-l border-border/40 ${view === "detail" ? "flex" : "hidden lg:flex"} flex-col min-w-0`}>
        {selectedMessage ? (
          <>
            <div className="p-4 border-b border-border/40">
              <button onClick={() => setView("messages")} className="md:hidden mb-2"><ChevronLeft className="h-5 w-5" /></button>
              <h2 className="font-heading text-lg font-semibold">{selectedMessage.subject}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedMessage.direction === "outgoing" ? "Ke" : "Dari"}: {selectedMessage.direction === "outgoing" ? selectedMessage.recipient : selectedMessage.sender}
                {" · "}
                {format(new Date(selectedMessage.created_at), "dd MMM yyyy, HH:mm")}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{selectedMessage.body || "(Tidak ada isi)"}</div>
            </div>
          </>
        ) : (
          <div className="hidden lg:flex items-center justify-center h-full text-muted-foreground text-sm">
            Pilih pesan untuk membaca
          </div>
        )}
      </section>

      <UpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </div>
  );
};

export default InboxPage;

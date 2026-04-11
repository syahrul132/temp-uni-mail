import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTempEmails } from "@/hooks/useTempEmails";
import { useMessages } from "@/hooks/useMessages";
import { Button } from "@/components/ui/button";
import CountdownTimer from "@/components/CountdownTimer";
import ComposeDialog from "@/components/ComposeDialog";
import { Mail, Plus, RefreshCw, Copy, LogOut, CreditCard, Inbox, Send, Loader2, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { emails, isLoading: emailsLoading, createEmail } = useTempEmails();
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "inbox" | "message">("list");

  const { messages, isLoading: messagesLoading, refetch, sendMessage, markAsRead } = useMessages(selectedEmailId);

  const selectedEmail = emails.find((e) => e.id === selectedEmailId);
  const selectedMessage = messages.find((m) => m.id === selectedMessageId);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (emails.length > 0 && !selectedEmailId) {
      setSelectedEmailId(emails[0].id);
    }
  }, [emails, selectedEmailId]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Alamat email disalin!");
  };

  const handleCreateEmail = async () => {
    try {
      await createEmail.mutateAsync();
      toast.success("Email baru berhasil dibuat!");
    } catch {
      toast.error("Gagal membuat email baru");
    }
  };

  const handleSelectMessage = (msgId: string) => {
    setSelectedMessageId(msgId);
    setMobileView("message");
    const msg = messages.find((m) => m.id === msgId);
    if (msg && !msg.is_read) {
      markAsRead.mutate(msgId);
    }
  };

  if (authLoading || emailsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="h-14 border-b border-border/20 glass-card flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <span className="font-heading font-bold text-foreground hidden sm:inline">TempMail</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/pricing">
            <Button variant="ghost" size="sm">
              <CreditCard className="h-4 w-4 mr-1" /> Top-Up
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-1" /> Keluar
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Email List Sidebar */}
        <aside className={`w-full sm:w-64 border-r border-border/20 flex flex-col flex-shrink-0 ${mobileView !== "list" ? "hidden sm:flex" : "flex"}`}>
          <div className="p-3 border-b border-border/20 space-y-2">
            <Button size="sm" className="w-full glow-primary" onClick={handleCreateEmail} disabled={createEmail.isPending}>
              {createEmail.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Email Baru
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {emails.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Belum ada email. Klik "Email Baru" untuk mulai.
              </div>
            ) : (
              emails.map((email) => (
                <button
                  key={email.id}
                  onClick={() => {
                    setSelectedEmailId(email.id);
                    setSelectedMessageId(null);
                    setMobileView("inbox");
                  }}
                  className={`w-full text-left p-3 border-b border-border/10 hover:bg-secondary/30 transition-colors ${selectedEmailId === email.id ? "bg-secondary/50" : ""}`}
                >
                  <p className="text-sm font-mono text-foreground truncate">{email.email_address}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${email.is_active ? "bg-green-500" : "bg-destructive"}`} />
                    <CountdownTimer expiresAt={email.expires_at} isPremium={email.is_premium} />
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Inbox */}
        <div className={`flex-1 flex flex-col ${mobileView === "list" ? "hidden sm:flex" : mobileView === "message" ? "hidden sm:flex" : "flex"}`}>
          {selectedEmail ? (
            <>
              <div className="p-3 border-b border-border/20 flex items-center justify-between gap-2 flex-wrap">
                <button onClick={() => setMobileView("list")} className="sm:hidden text-muted-foreground">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <p className="text-sm font-mono text-foreground truncate">{selectedEmail.email_address}</p>
                  <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => handleCopy(selectedEmail.email_address)}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => refetch()}>
                    <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
                  </Button>
                  <Button size="sm" className="glow-primary" onClick={() => setComposeOpen(true)}>
                    <Send className="h-3.5 w-3.5 mr-1" /> Tulis
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                    <Inbox className="h-12 w-12 opacity-30" />
                    <p className="text-sm">Inbox kosong</p>
                    <p className="text-xs">Email yang masuk akan muncul di sini</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg.id)}
                      className={`w-full text-left p-3 border-b border-border/10 hover:bg-secondary/30 transition-colors flex items-start gap-3 ${!msg.is_read && msg.direction === "incoming" ? "bg-primary/5" : ""}`}
                    >
                      <div className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${msg.direction === "outgoing" ? "bg-blue-400" : !msg.is_read ? "bg-primary" : "bg-muted-foreground/30"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-sm truncate ${!msg.is_read ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                            {msg.direction === "outgoing" ? `Ke: ${msg.recipient}` : msg.sender}
                          </p>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {format(new Date(msg.created_at), "HH:mm")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{msg.subject}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p className="text-sm">Pilih email dari sidebar</p>
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className={`flex-1 border-l border-border/20 flex flex-col ${mobileView === "message" ? "flex" : "hidden sm:flex"}`}>
          {selectedMessage ? (
            <>
              <div className="p-4 border-b border-border/20">
                <button onClick={() => setMobileView("inbox")} className="sm:hidden text-muted-foreground mb-2">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h2 className="font-heading text-lg font-semibold text-foreground">{selectedMessage.subject}</h2>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <span>{selectedMessage.direction === "outgoing" ? "Ke" : "Dari"}: {selectedMessage.direction === "outgoing" ? selectedMessage.recipient : selectedMessage.sender}</span>
                  <span>·</span>
                  <span>{format(new Date(selectedMessage.created_at), "dd MMM yyyy, HH:mm")}</span>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.body || "(Tidak ada isi email)"}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p className="text-sm">Pilih email untuk membaca</p>
            </div>
          )}
        </div>
      </div>

      {selectedEmail && (
        <ComposeDialog
          open={composeOpen}
          onOpenChange={setComposeOpen}
          senderEmail={selectedEmail.email_address}
          onSend={async (data) => {
            await sendMessage.mutateAsync(data);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;

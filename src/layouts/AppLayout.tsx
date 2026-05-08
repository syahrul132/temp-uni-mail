import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Loader2, Coins, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AppLayout = () => {
  const { user, loading } = useAuth();
  const { balance, isPremium, unlimitedUntil } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border/40 flex items-center justify-between px-4 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              {isPremium ? (
                <Badge className="bg-primary/15 text-primary hover:bg-primary/20 border border-primary/20">
                  <Crown className="h-3 w-3 mr-1" /> Premium
                  {unlimitedUntil && (
                    <span className="ml-1 text-[10px] opacity-70">
                      s/d {new Date(unlimitedUntil).toLocaleDateString("id-ID")}
                    </span>
                  )}
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1">
                  <Coins className="h-3 w-3 text-primary" />
                  {balance} credits
                </Badge>
              )}
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;

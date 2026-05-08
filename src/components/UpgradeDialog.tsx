import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const UpgradeDialog = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center font-heading text-xl">Credits Habis</DialogTitle>
          <DialogDescription className="text-center">
            Top-up credits atau berlangganan Premium untuk akses tanpa batas selama 3 bulan.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div className="rounded-lg border p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-medium">Top-up Credits</span>
              <span className="text-sm text-muted-foreground">Rp 1.000 / credit</span>
            </div>
            <p className="text-xs text-muted-foreground">1 credit = 1 email temporary (24 jam)</p>
          </div>
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-medium flex items-center gap-1">
                <Zap className="h-4 w-4 text-primary" /> Premium Unlimited
              </span>
              <span className="text-sm font-semibold text-primary">Rp 150.000</span>
            </div>
            <p className="text-xs text-muted-foreground">Unlimited email selama 3 bulan + akses API</p>
          </div>
          <Link to="/app/plan" onClick={() => onOpenChange(false)}>
            <Button className="w-full glow-primary">Lihat Paket</Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeDialog;

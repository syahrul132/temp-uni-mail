import { useState, useEffect } from "react";

interface CountdownTimerProps {
  expiresAt: string;
  isPremium?: boolean;
}

const CountdownTimer = ({ expiresAt, isPremium }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (isPremium) return;

    const update = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("00:00:00");
        setIsExpired(true);
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, isPremium]);

  if (isPremium) {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
        ∞ Unlimited
      </span>
    );
  }

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium ${isExpired ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
      {isExpired ? "Expired" : timeLeft}
    </span>
  );
};

export default CountdownTimer;

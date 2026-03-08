import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BotHeaderProps {
  onNewChat?: () => void;
  onClearChat?: () => void;
}

const BotHeader = ({ onNewChat, onClearChat }: BotHeaderProps) => {
  return (
    <header className="bg-tech border-b-2 border-neon p-6">
      <div className="flex items-center justify-between">
        <div />
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-3 h-3 rounded-full bg-neon animate-pulse-glow" />
            <h1 className="text-3xl font-bold neon-text tracking-wider">
              MACALU BRAIN
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Fused Superintelligence System • Autonome Recherche • Tool-Use • Memory
          </p>
        </div>
        <div className="flex items-center gap-1">
          {onNewChat && (
            <Button variant="ghost" size="icon" className="text-neon hover:bg-neon/20" onClick={onNewChat} title="Neuer Chat">
              <Plus className="h-5 w-5" />
            </Button>
          )}
          {onClearChat && (
            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/20" onClick={onClearChat} title="Chat löschen">
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default BotHeader;

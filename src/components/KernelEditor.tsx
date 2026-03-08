import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RotateCcw, Save, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface KernelEditorProps {
  kernel: string;
  onKernelChange: (value: string) => void;
  onReset: () => void;
  onEvolve: () => void;
}

const KernelEditor = ({ kernel, onKernelChange, onReset, onEvolve }: KernelEditorProps) => {
  const [draft, setDraft] = useState(kernel);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  const handleChange = (value: string) => {
    setDraft(value);
    setHasChanges(value !== kernel);
  };

  const handleSave = () => {
    onKernelChange(draft);
    setHasChanges(false);
    toast({
      title: "✅ Kern-Modul gespeichert",
      description: "Änderungen werden ab der nächsten Nachricht aktiv.",
    });
  };

  const handleReset = () => {
    onReset();
    setDraft(kernel);
    setHasChanges(false);
    toast({
      title: "🔄 Kern-Modul zurückgesetzt",
      description: "Standard-Konfiguration wiederhergestellt.",
    });
  };

  // Sync draft when kernel changes externally (e.g. reset)
  if (kernel !== draft && !hasChanges) {
    setDraft(kernel);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-neon tracking-wide">⚙️ KERN-MODUL</h4>
        {hasChanges && (
          <span className="text-[10px] text-yellow-400 animate-pulse">● Ungespeichert</span>
        )}
      </div>

      <Textarea
        value={draft}
        onChange={(e) => handleChange(e.target.value)}
        className="min-h-[280px] font-mono text-[11px] leading-relaxed bg-background/80 border-neon/30 text-foreground 
                   placeholder:text-muted-foreground focus:border-neon focus:ring-1 focus:ring-neon/20 resize-none"
        placeholder="Kern-Modul Code eingeben..."
        spellCheck={false}
      />

      <div className="flex flex-col gap-2">
        <Button
          onClick={handleSave}
          disabled={!hasChanges}
          size="sm"
          className="w-full bg-neon/20 border border-neon text-neon hover:bg-neon/30 text-xs h-8"
        >
          <Save className="h-3 w-3 mr-1" />
          Speichern & Aktivieren
        </Button>

        <div className="flex gap-2">
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="flex-1 border-muted-foreground/30 text-muted-foreground hover:text-foreground text-xs h-8"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>

          <Button
            onClick={onEvolve}
            size="sm"
            className="flex-1 bg-purple-500/20 border border-purple-400/50 text-purple-300 hover:bg-purple-500/30 text-xs h-8"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            KI-Evolve
          </Button>
        </div>
      </div>

      <p className="text-[9px] text-muted-foreground leading-tight">
        Das Kern-Modul definiert Persönlichkeit, Regeln und Spezial-Module. 
        "KI-Evolve" lässt die KI ihr eigenes Modul optimieren.
      </p>
    </div>
  );
};

export default KernelEditor;

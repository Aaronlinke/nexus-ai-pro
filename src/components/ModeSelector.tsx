import { Button } from "@/components/ui/button";

interface ModeSelectorProps {
  activeMode: string;
  onModeChange: (mode: string) => void;
}

const ModeSelector = ({ activeMode, onModeChange }: ModeSelectorProps) => {
  const modes = [
    { id: "universal", label: "Universal" },
    { id: "developer", label: "Developer" },
    { id: "research", label: "Research" }
  ];

  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      {modes.map((mode) => (
        <Button
          key={mode.id}
          variant={activeMode === mode.id ? "default" : "outline"}
          onClick={() => onModeChange(mode.id)}
          className={`text-xs ${
            activeMode === mode.id 
              ? 'bg-neon/30 border-neon text-neon hover:bg-neon/40' 
              : 'bg-secondary/30 border-neon/30 hover:bg-secondary/50'
          }`}
        >
          {mode.label}
        </Button>
      ))}
    </div>
  );
};

export default ModeSelector;

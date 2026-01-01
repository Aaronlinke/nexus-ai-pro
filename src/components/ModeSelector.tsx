import { Button } from "@/components/ui/button";

interface ModeSelectorProps {
  activeMode: string;
  onModeChange: (mode: string) => void;
}

const ModeSelector = ({ activeMode, onModeChange }: ModeSelectorProps) => {
  const modes = [
    { id: "universal", label: "Uni" },
    { id: "developer", label: "Dev" },
    { id: "research", label: "Res" }
  ];

  return (
    <div className="grid grid-cols-3 gap-1.5">
      {modes.map((mode) => (
        <Button
          key={mode.id}
          variant={activeMode === mode.id ? "default" : "outline"}
          size="sm"
          onClick={() => onModeChange(mode.id)}
          className={`text-[10px] h-7 px-2 ${
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

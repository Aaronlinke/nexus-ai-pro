interface QuickCommandProps {
  icon: string;
  label: string;
  command: string;
  onSelect: (command: string) => void;
}

const QuickCommand = ({ icon, label, command, onSelect }: QuickCommandProps) => {
  return (
    <button
      onClick={() => onSelect(command)}
      className="bg-neon/20 border border-neon/50 text-foreground px-3 py-1.5 rounded-full 
                 text-xs hover:bg-neon/30 hover:scale-105 transition-all duration-300 
                 flex items-center gap-2 whitespace-nowrap"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export default QuickCommand;

interface CapabilityItemProps {
  icon: string;
  title: string;
  onClick: () => void;
}

const CapabilityItem = ({ icon, title, onClick }: CapabilityItemProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-secondary/50 border border-neon/30 rounded-lg p-3 
                 hover:bg-secondary hover:border-neon hover:translate-x-1 
                 transition-all duration-300 group neon-border"
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span className="text-sm text-foreground group-hover:text-neon transition-colors">
          {title}
        </span>
      </div>
    </button>
  );
};

export default CapabilityItem;

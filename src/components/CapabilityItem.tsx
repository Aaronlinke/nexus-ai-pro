interface CapabilityItemProps {
  icon: string;
  title: string;
  onClick: () => void;
}

const CapabilityItem = ({ icon, title, onClick }: CapabilityItemProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-secondary/50 border border-neon/30 rounded-md p-2 
                 hover:bg-secondary hover:border-neon active:scale-[0.98]
                 transition-all duration-200 group"
    >
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <span className="text-xs text-foreground group-hover:text-neon transition-colors truncate">
          {title}
        </span>
      </div>
    </button>
  );
};

export default CapabilityItem;

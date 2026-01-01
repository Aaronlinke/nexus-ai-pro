interface StatusIndicatorProps {
  label: string;
  status: "active" | "idle" | "processing";
}

const StatusIndicator = ({ label, status }: StatusIndicatorProps) => {
  const statusColors = {
    active: "bg-neon",
    idle: "bg-muted",
    processing: "bg-cyber"
  };

  return (
    <div className="flex items-center gap-1.5 text-[10px]">
      <div className={`w-1.5 h-1.5 rounded-full ${statusColors[status]} ${status === 'active' ? 'animate-pulse-glow' : ''}`} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
};

export default StatusIndicator;

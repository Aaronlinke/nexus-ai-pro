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
    <div className="flex items-center gap-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${statusColors[status]} ${status === 'active' ? 'animate-pulse-glow' : ''}`} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
};

export default StatusIndicator;

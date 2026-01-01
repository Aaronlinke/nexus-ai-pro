import StatusIndicator from "./StatusIndicator";

interface ExecutionPanelProps {
  status: string;
  mode: string;
}

const ExecutionPanel = ({ status, mode }: ExecutionPanelProps) => {
  return (
    <div className="p-3 font-mono text-[10px]">
      <div className="text-neon font-bold mb-2 tracking-wider text-xs">STATUS</div>
      
      <div className="space-y-1">
        <StatusIndicator label="Module" status="active" />
        <StatusIndicator label="API" status="active" />
        <StatusIndicator label="Online" status="active" />
        
        <div className="border-t border-neon/30 mt-2 pt-2">
          <div className="text-muted-foreground space-y-0.5">
            <div>Status: <span className="text-neon">{status}</span></div>
            <div>Modus: <span className="text-neon">{mode.toUpperCase()}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionPanel;

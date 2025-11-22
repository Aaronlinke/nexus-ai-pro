import StatusIndicator from "./StatusIndicator";

interface ExecutionPanelProps {
  status: string;
  mode: string;
  lastCommand?: string;
  processingTime?: number;
}

const ExecutionPanel = ({ status, mode, lastCommand, processingTime }: ExecutionPanelProps) => {
  return (
    <div className="bg-tech border-2 border-neon/50 rounded-xl p-4 mt-4 font-mono text-sm neon-border">
      <div className="text-neon font-bold mb-3 tracking-wider">SYSTEM STATUS</div>
      
      <div className="space-y-2">
        <StatusIndicator label="Alle Module geladen" status="active" />
        <StatusIndicator label="API-Verbindungen" status="active" />
        <StatusIndicator label="Internet-Zugriff" status="active" />
        
        <div className="border-t border-neon/30 my-3 pt-3">
          <div className="text-muted-foreground text-xs space-y-1">
            <div>Status: <span className="text-neon">{status}</span></div>
            <div>Modus: <span className="text-neon">{mode.toUpperCase()}</span></div>
            {lastCommand && (
              <div>Letzter Befehl: <span className="text-neon">{lastCommand.substring(0, 30)}...</span></div>
            )}
            {processingTime && (
              <div>Verarbeitungszeit: <span className="text-neon">{processingTime}s</span></div>
            )}
            <div>Zeit: <span className="text-neon">{new Date().toLocaleTimeString()}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionPanel;

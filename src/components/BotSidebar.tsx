import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import CapabilityItem from "./CapabilityItem";
import ModeSelector from "./ModeSelector";
import ExecutionPanel from "./ExecutionPanel";
import KernelEditor from "./KernelEditor";

interface BotSidebarProps {
  mode: string;
  onModeChange: (mode: string) => void;
  onCapabilityClick: (capability: string) => void;
  kernel?: string;
  onKernelChange?: (value: string) => void;
  onKernelReset?: () => void;
  onKernelEvolve?: () => void;
}

const BotSidebar = ({ mode, onModeChange, onCapabilityClick, kernel, onKernelChange, onKernelReset, onKernelEvolve }: BotSidebarProps) => {
  const capabilities = [
    { icon: "🔬", title: "Fusion-KI Recherche", cmd: "fusion-research" },
    { icon: "📋", title: "Task-Kategorisierung", cmd: "task-categorization" },
    { icon: "💻", title: "Code-Fusion", cmd: "code-fusion" },
    { icon: "🔗", title: "Blockchain & Web3", cmd: "blockchain" },
    { icon: "🧮", title: "Algorithmen & Mathe", cmd: "algorithms" },
    { icon: "📊", title: "Report-Generator", cmd: "report-generator" },
    { icon: "📡", title: "NFC-Bot Steuerung", cmd: "nfc-bot" },
    { icon: "⚡", title: "Prozess-Optimierung", cmd: "process-optimization" },
    { icon: "🌍", title: "Multi-Brain Übersetzung", cmd: "multi-translation" },
    { icon: "🧠", title: "Brain-Training", cmd: "brain-training" }
  ];

  return (
    <aside className="w-full md:w-72 lg:w-80 bg-tech border-r border-neon/30 flex flex-col h-full overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="p-3 md:p-4 space-y-4">
          {/* Logo */}
          <div className="bg-secondary/50 border border-neon/50 rounded-lg p-3 text-center">
            <h3 className="text-lg font-bold text-neon mb-0.5">🧠 MACALU BRAIN</h3>
            <p className="text-[10px] text-muted-foreground">Fused Superintelligence System</p>
          </div>

          {/* Mode Selector */}
          <ModeSelector activeMode={mode} onModeChange={onModeChange} />

          {/* Tabs */}
          <Tabs defaultValue="capabilities" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-secondary/50 border border-neon/30 h-8">
              <TabsTrigger 
                value="capabilities"
                className="text-xs data-[state=active]:bg-neon/30 data-[state=active]:text-neon"
              >
                Skills
              </TabsTrigger>
              <TabsTrigger 
                value="kernel"
                className="text-xs data-[state=active]:bg-neon/30 data-[state=active]:text-neon"
              >
                Kern
              </TabsTrigger>
              <TabsTrigger 
                value="info"
                className="text-xs data-[state=active]:bg-neon/30 data-[state=active]:text-neon"
              >
                Info
              </TabsTrigger>
            </TabsList>

            <TabsContent value="capabilities" className="mt-3 space-y-1.5">
              <h4 className="text-xs font-semibold text-neon mb-2 tracking-wide">🎯 FÄHIGKEITEN</h4>
              {capabilities.map((cap) => (
                <CapabilityItem
                  key={cap.cmd}
                  icon={cap.icon}
                  title={cap.title}
                  onClick={() => onCapabilityClick(cap.cmd)}
                />
              ))}
            </TabsContent>

            <TabsContent value="kernel" className="mt-3">
              {kernel !== undefined && onKernelChange && onKernelReset && onKernelEvolve && (
                <KernelEditor
                  kernel={kernel}
                  onKernelChange={onKernelChange}
                  onReset={onKernelReset}
                  onEvolve={onKernelEvolve}
                />
              )}
            </TabsContent>

            <TabsContent value="info" className="mt-3">
              <div className="bg-secondary/50 border border-neon/30 rounded-lg p-3 space-y-2 text-[11px]">
                <div>
                  <div className="text-neon font-semibold mb-1">Integrierte KIs</div>
                  <ul className="text-muted-foreground space-y-0.5 list-disc list-inside">
                    <li>Fusion-KIs (verschmolzen)</li>
                    <li>Bot-KIs (Automatisierung)</li>
                    <li>NFC-KIs (Steuerung)</li>
                  </ul>
                </div>
                <div>
                  <div className="text-neon font-semibold mb-1">Brain-Module</div>
                  <ul className="text-muted-foreground space-y-0.5 list-disc list-inside">
                    <li>Task-Execution Engine</li>
                    <li>Report-Generator</li>
                    <li>Blockchain & On-Chain-Analyse</li>
                    <li>Algorithmen & Mathematik</li>
                  </ul>
                </div>
                <div>
                  <div className="text-neon font-semibold mb-1">Charakter</div>
                  <p className="text-muted-foreground italic">Ehrgeiz-Level: Maximum. Gibt niemals auf.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>

      {/* Execution Panel at Bottom */}
      <div className="shrink-0 border-t border-neon/30">
        <ExecutionPanel status="BEREIT" mode={mode} />
      </div>
    </aside>
  );
};

export default BotSidebar;

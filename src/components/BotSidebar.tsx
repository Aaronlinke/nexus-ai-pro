import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import CapabilityItem from "./CapabilityItem";
import ModeSelector from "./ModeSelector";
import ExecutionPanel from "./ExecutionPanel";

interface BotSidebarProps {
  mode: string;
  onModeChange: (mode: string) => void;
  onCapabilityClick: (capability: string) => void;
}

const BotSidebar = ({ mode, onModeChange, onCapabilityClick }: BotSidebarProps) => {
  const capabilities = [
    { icon: "🔍", title: "Websuche", cmd: "web-search" },
    { icon: "📊", title: "Datenanalyse", cmd: "data-analysis" },
    { icon: "💻", title: "Code-Gen", cmd: "code-generation" },
    { icon: "🖼️", title: "Bildverarbeitung", cmd: "image-processing" },
    { icon: "📄", title: "Dokumente", cmd: "document-creation" },
    { icon: "🔌", title: "API", cmd: "api-integration" },
    { icon: "🤖", title: "Automation", cmd: "automation" },
    { icon: "🌍", title: "Übersetzung", cmd: "translation" },
    { icon: "🎮", title: "Simulation", cmd: "simulation" },
    { icon: "🧠", title: "ML-Training", cmd: "learning" }
  ];

  return (
    <aside className="w-full md:w-72 lg:w-80 bg-tech border-r border-neon/30 flex flex-col h-full overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="p-3 md:p-4 space-y-4">
          {/* Logo */}
          <div className="bg-secondary/50 border border-neon/50 rounded-lg p-3 text-center">
            <h3 className="text-lg font-bold text-neon mb-0.5">🤖 NEXUS-AI PRO</h3>
            <p className="text-[10px] text-muted-foreground">Universal Command Executor</p>
          </div>

          {/* Mode Selector */}
          <ModeSelector activeMode={mode} onModeChange={onModeChange} />

          {/* Tabs */}
          <Tabs defaultValue="capabilities" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary/50 border border-neon/30 h-8">
              <TabsTrigger 
                value="capabilities"
                className="text-xs data-[state=active]:bg-neon/30 data-[state=active]:text-neon"
              >
                Fähigkeiten
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

            <TabsContent value="info" className="mt-3">
              <div className="bg-secondary/50 border border-neon/30 rounded-lg p-3 space-y-2 text-[11px]">
                <div>
                  <div className="text-neon font-semibold mb-1">API-Integrationen</div>
                  <ul className="text-muted-foreground space-y-0.5 list-disc list-inside">
                    <li>OpenAI GPT-Modelle</li>
                    <li>Google Search API</li>
                    <li>WolframAlpha</li>
                  </ul>
                </div>
                <div>
                  <div className="text-neon font-semibold mb-1">Funktionen</div>
                  <ul className="text-muted-foreground space-y-0.5 list-disc list-inside">
                    <li>Echtzeit-Websuche</li>
                    <li>Code-Ausführung</li>
                    <li>Dateiverarbeitung</li>
                  </ul>
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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    { icon: "🔍", title: "Websuche & Recherche", cmd: "web-search" },
    { icon: "📊", title: "Datenanalyse & Visualisierung", cmd: "data-analysis" },
    { icon: "💻", title: "Code-Generierung", cmd: "code-generation" },
    { icon: "🖼️", title: "Bildverarbeitung", cmd: "image-processing" },
    { icon: "📄", title: "Dokumentenerstellung", cmd: "document-creation" },
    { icon: "🔌", title: "API-Integration", cmd: "api-integration" },
    { icon: "🤖", title: "Prozessautomatisierung", cmd: "automation" },
    { icon: "🌍", title: "Übersetzung", cmd: "translation" },
    { icon: "🎮", title: "Simulation & Modellierung", cmd: "simulation" },
    { icon: "🧠", title: "Maschinelles Lernen", cmd: "learning" }
  ];

  return (
    <aside className="w-80 bg-tech border-r-2 border-neon p-5 overflow-y-auto">
      <div className="bg-secondary/50 border border-neon/50 rounded-xl p-4 text-center mb-5">
        <h3 className="text-xl font-bold text-neon mb-1">🤖 NEXUS-AI PRO</h3>
        <p className="text-xs text-muted-foreground">Universal Command Executor</p>
      </div>

      <ModeSelector activeMode={mode} onModeChange={onModeChange} />

      <Tabs defaultValue="capabilities" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-secondary/50 border border-neon/30 mb-4">
          <TabsTrigger 
            value="capabilities"
            className="data-[state=active]:bg-neon/30 data-[state=active]:text-neon"
          >
            Fähigkeiten
          </TabsTrigger>
          <TabsTrigger 
            value="info"
            className="data-[state=active]:bg-neon/30 data-[state=active]:text-neon"
          >
            Info
          </TabsTrigger>
        </TabsList>

        <TabsContent value="capabilities" className="space-y-2">
          <h4 className="text-sm font-semibold text-neon mb-3 tracking-wide">🎯 AKTIVE FÄHIGKEITEN</h4>
          {capabilities.map((cap) => (
            <CapabilityItem
              key={cap.cmd}
              icon={cap.icon}
              title={cap.title}
              onClick={() => onCapabilityClick(cap.cmd)}
            />
          ))}
        </TabsContent>

        <TabsContent value="info">
          <div className="bg-secondary/50 border border-neon/30 rounded-lg p-4 space-y-3 text-xs">
            <div>
              <div className="text-neon font-semibold mb-1">API-Integrationen</div>
              <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                <li>OpenAI GPT-Modelle</li>
                <li>Google Search API</li>
                <li>WolframAlpha</li>
              </ul>
            </div>
            <div>
              <div className="text-neon font-semibold mb-1">Funktionen</div>
              <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                <li>Echtzeit-Websuche</li>
                <li>Code-Ausführung</li>
                <li>Dateiverarbeitung</li>
                <li>ML-Training</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <ExecutionPanel 
        status="BEREIT" 
        mode={mode}
      />
    </aside>
  );
};

export default BotSidebar;

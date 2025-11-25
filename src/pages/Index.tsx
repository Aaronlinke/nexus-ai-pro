import { useState, useRef, useEffect } from "react";
import BotHeader from "@/components/BotHeader";
import BotSidebar from "@/components/BotSidebar";
import ChatMessage from "@/components/ChatMessage";
import QuickCommand from "@/components/QuickCommand";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useStreamingChat } from "@/hooks/useStreamingChat";

const Index = () => {
  const [mode, setMode] = useState("universal");
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { messages, sendMessage } = useStreamingChat();

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const processCommand = async (command: string) => {
    await sendMessage(command, mode);
    
    toast({
      title: "Befehl wird verarbeitet",
      description: "Die KI generiert eine Antwort in Echtzeit.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      processCommand(input.trim());
      setInput("");
    }
  };

  const handleCapabilityClick = (capability: string) => {
    const commands: Record<string, string> = {
      "web-search": "Führe eine Websuche zum Thema künstliche Intelligenz durch",
      "data-analysis": "Analysiere die hochgeladenen Daten und erstelle eine Visualisierung",
      "code-generation": "Generiere Python-Code für eine Datenanalyse-Anwendung",
      "image-processing": "Verarbeite die hochgeladenen Bilder mit KI-Algorithmen",
      "document-creation": "Erstelle ein umfassendes Dokument zu KI-Technologien",
      "api-integration": "Integriere eine Wetter-API und zeige die aktuellen Daten",
      "automation": "Automatisiere einen Datenverarbeitungs-Workflow",
      "translation": "Übersetze einen Text in mehrere Sprachen",
      "simulation": "Führe eine KI-Trainingssimulation durch",
      "learning": "Trainiere ein Machine-Learning-Modell mit Beispielsdaten"
    };

    if (commands[capability]) {
      processCommand(commands[capability]);
    }
  };

  const quickCommands = [
    { icon: "🌐", label: "Websuche", command: "Suche im Internet nach " },
    { icon: "📊", label: "Datenanalyse", command: "Analysiere Daten aus " },
    { icon: "💻", label: "Code", command: "Schreibe Code für " },
    { icon: "📄", label: "Dokument", command: "Erstelle ein Dokument über " },
    { icon: "🔌", label: "API", command: "Verbinde mit API für " }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-tech via-background to-tech">
      <BotSidebar 
        mode={mode} 
        onModeChange={setMode}
        onCapabilityClick={handleCapabilityClick}
      />
      
      <div className="flex-1 flex flex-col">
        <BotHeader />
        
        <div 
          ref={chatRef}
          className="flex-1 overflow-y-auto p-6 space-y-3 bg-background/30"
        >
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              type={message.type}
              content={message.content}
              isLoading={message.isLoading}
            />
          ))}
        </div>

        <div className="bg-tech border-t-2 border-neon p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {quickCommands.map((cmd) => (
              <QuickCommand
                key={cmd.label}
                icon={cmd.icon}
                label={cmd.label}
                command={cmd.command}
                onSelect={setInput}
              />
            ))}
          </div>
          
          <form onSubmit={handleSubmit}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Geben Sie hier Ihren komplexen Befehl ein..."
              className="bg-input border-2 border-neon/50 text-foreground placeholder:text-muted-foreground 
                       focus:border-neon focus:ring-2 focus:ring-neon/20 rounded-xl h-14 text-base
                       neon-border"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;

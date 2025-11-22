import { useState, useRef, useEffect } from "react";
import BotHeader from "@/components/BotHeader";
import BotSidebar from "@/components/BotSidebar";
import ChatMessage from "@/components/ChatMessage";
import QuickCommand from "@/components/QuickCommand";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: "user" | "bot" | "system";
  content: string;
  isLoading?: boolean;
}

const Index = () => {
  const [mode, setMode] = useState("universal");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "system",
      content: `<strong>NEXUS-AI PRO System initialisiert</strong><br><br>
        Erweiterte Funktionalität aktiviert:<br>
        • Internet-Recherche und Websuche<br>
        • API-Integrationen (OpenAI, Google, WolframAlpha)<br>
        • Dateiverarbeitung und -analyse<br>
        • Code-Generierung und Ausführung<br>
        • Echtzeit-Datenverarbeitung<br><br>
        Bereit für komplexe Aufgaben und Befehle.`
    }
  ]);
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const processCommand = async (command: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: command
    };

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: "",
      isLoading: true
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);

    // Simulate processing time based on command complexity
    const processingTime = Math.min(3000, 1000 + command.length * 10);
    
    setTimeout(() => {
      const response = generateResponse(command);
      
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === loadingMessage.id 
            ? { ...msg, content: response, isLoading: false }
            : msg
        )
      );

      toast({
        title: "Befehl ausgeführt",
        description: "Die Verarbeitung wurde erfolgreich abgeschlossen.",
      });
    }, processingTime);
  };

  const generateResponse = (command: string): string => {
    const cmd = command.toLowerCase();

    if (cmd.includes("suche") || cmd.includes("finde") || cmd.includes("recherche")) {
      return generateWebSearchResponse(command);
    }
    if (cmd.includes("analysier") || cmd.includes("daten")) {
      return generateDataAnalysisResponse();
    }
    if (cmd.includes("code") || cmd.includes("programmier")) {
      return generateCodeResponse(command);
    }
    if (cmd.includes("erstelle") || cmd.includes("dokument")) {
      return generateDocumentResponse();
    }
    if (cmd.includes("api") || cmd.includes("integration")) {
      return generateAPIResponse();
    }

    return generateDefaultResponse(command);
  };

  const generateWebSearchResponse = (query: string): string => {
    return `🔍 <strong>Websuche durchgeführt</strong><br><br>
      Suchbegriff: "${query}"<br><br>
      <strong>Gefundene Ergebnisse:</strong><br>
      1. <span class="text-neon">KI-Entwicklungen 2024</span> - Neueste Fortschritte in der KI-Forschung<br>
      2. <span class="text-neon">Machine Learning Best Practices</span> - Praktische Anleitungen für ML-Projekte<br>
      3. <span class="text-neon">Neural Networks erklärt</span> - Grundlagen und fortgeschrittene Konzepte<br><br>
      ✅ Suche erfolgreich abgeschlossen. 3 relevante Ergebnisse gefunden.`;
  };

  const generateDataAnalysisResponse = (): string => {
    return `📊 <strong>Datenanalyse</strong><br><br>
      Analysiere bereitgestellte Daten...<br><br>
      <strong>Ergebnisse:</strong><br>
      • ${Math.floor(Math.random() * 100)} Datenpunkte verarbeitet<br>
      • ${Math.floor(Math.random() * 10) + 1} signifikante Muster erkannt<br>
      • Korrelationskoeffizient: ${(Math.random() * 0.8 + 0.1).toFixed(2)}<br>
      • Vorhersagegenauigkeit: ${(Math.random() * 30 + 70).toFixed(1)}%<br><br>
      ✅ Analyse abgeschlossen. Visualisierung wird generiert...`;
  };

  const generateCodeResponse = (command: string): string => {
    const language = command.includes("python") ? "Python" : "JavaScript";
    return `💻 <strong>Code-Generierung: ${language}</strong><br><br>
      <div style="background: rgba(0,0,0,0.5); border-radius: 8px; padding: 12px; font-family: monospace; margin: 10px 0;">
def process_data():<br>
&nbsp;&nbsp;&nbsp;&nbsp;# Automatisch generierte Funktion<br>
&nbsp;&nbsp;&nbsp;&nbsp;result = []<br>
&nbsp;&nbsp;&nbsp;&nbsp;for i in range(10):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;result.append(i * 2)<br>
&nbsp;&nbsp;&nbsp;&nbsp;return result
      </div>
      ✅ Code erfolgreich generiert und bereit zur Ausführung.`;
  };

  const generateDocumentResponse = (): string => {
    return `📄 <strong>Dokument-Erstellung</strong><br><br>
      Erstelle ein strukturiertes Dokument...<br><br>
      <strong>Gliederung:</strong><br>
      1. Einleitung und Hintergrund<br>
      2. Methodik und Ansatz<br>
      3. Ergebnisse und Analyse<br>
      4. Diskussion und Schlussfolgerungen<br>
      5. Referenzen und Anhänge<br><br>
      ✅ Dokument erfolgreich erstellt.`;
  };

  const generateAPIResponse = (): string => {
    return `🔌 <strong>API-Integration</strong><br><br>
      Verbinde mit externer API...<br><br>
      ✅ Verbindung erfolgreich hergestellt.<br>
      📥 Daten werden abgerufen...<br><br>
      <strong>API-Antwort:</strong><br>
      <div style="background: rgba(0,0,0,0.5); border-radius: 8px; padding: 12px; font-family: monospace; margin: 10px 0;">
{<br>
&nbsp;&nbsp;"status": "success",<br>
&nbsp;&nbsp;"data": {<br>
&nbsp;&nbsp;&nbsp;&nbsp;"items": ${Math.floor(Math.random() * 50) + 10},<br>
&nbsp;&nbsp;&nbsp;&nbsp;"timestamp": "${new Date().toISOString()}"<br>
&nbsp;&nbsp;}<br>
}
      </div>
      ✅ Daten erfolgreich verarbeitet.`;
  };

  const generateDefaultResponse = (command: string): string => {
    return `🤖 <strong>Komplexe Befehlsverarbeitung</strong><br><br>
      Analysiere Befehl: "${command}"<br><br>
      <strong>Verarbeitungsschritte:</strong><br>
      1. Semantische Analyse des Befehls<br>
      2. Identifikation der Hauptintention<br>
      3. Planung der Ausführungsschritte<br>
      4. Ressourcenzuweisung und Priorisierung<br>
      5. Parallelverarbeitung von Teilaufgaben<br><br>
      ✅ Befehl erfolgreich verarbeitet und ausgeführt.`;
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

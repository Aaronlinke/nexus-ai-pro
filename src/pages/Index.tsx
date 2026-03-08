import { useState, useRef, useEffect } from "react";
import BotHeader from "@/components/BotHeader";
import BotSidebar from "@/components/BotSidebar";
import ChatMessage from "@/components/ChatMessage";
import QuickCommand from "@/components/QuickCommand";
import CameraCapture from "@/components/CameraCapture";
import VoiceInput from "@/components/VoiceInput";
import AudioRecorder from "@/components/AudioRecorder";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useStreamingChat } from "@/hooks/useStreamingChat";
import { useKernelModule } from "@/hooks/useKernelModule";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, Send, Camera, Trash2, Plus } from "lucide-react";
import OasisBackground from "@/components/OasisBackground";
const Index = () => {
  const [mode, setMode] = useState("fusion");
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [pendingAudio, setPendingAudio] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { messages, sendMessage, clearHistory, newConversation } = useStreamingChat();
  const { kernel, setKernel, resetKernel } = useKernelModule();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const processCommand = async (command: string, imageBase64?: string, audioBase64?: string) => {
    await sendMessage(command, mode, kernel, imageBase64, audioBase64);
    
    toast({
      title: "Befehl wird verarbeitet",
      description: audioBase64 ? "Audio wird von der KI analysiert..." : imageBase64 ? "Bild wird von der KI analysiert..." : "Die KI generiert eine Antwort in Echtzeit.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() || pendingImage || pendingAudio) {
      const text = input.trim() || (pendingImage ? "Analysiere dieses Bild und beschreibe was du siehst." : "Analysiere diese Audio-Aufnahme. Beschreibe was du hörst – Umgebungsgeräusche, Töne, Rauschen, Stimmen oder Muster.");
      processCommand(text, pendingImage || undefined, pendingAudio || undefined);
      setInput("");
      setPendingImage(null);
      setPendingAudio(null);
    }
  };

  const handleCameraCapture = (base64: string) => {
    setPendingImage(base64);
    toast({ title: "📷 Foto aufgenommen", description: "Schreibe eine Frage zum Bild oder sende es direkt." });
  };

  const handleAudioRecorded = (base64: string, durationSec: number) => {
    setPendingAudio(base64);
    toast({ title: "🔴 Audio aufgenommen", description: `${durationSec}s Umgebungs-Audio bereit. Schreibe eine Frage oder sende direkt.` });
  };

  const handleVoiceTranscript = (text: string) => {
    setInput((prev) => (prev ? prev + " " + text : text));
  };

  const handleCapabilityClick = (capability: string) => {
    const commands: Record<string, string> = {
      "fusion-research": "Recherchiere mit allen Fusion-KIs zum Thema künstliche Superintelligenz",
      "task-categorization": "Kategorisiere meine aktuellen Tasks nach Priorität und Komplexität",
      "code-fusion": "Generiere optimierten Code mit der Fusion-Engine",
      "blockchain": "Analysiere die aktuellen Blockchain-Trends, Smart Contract Patterns und DeFi-Protokolle – gib mir eine vollständige Übersicht",
      "algorithms": "Erkläre mir die wichtigsten Algorithmen und mathematischen Konzepte für komplexe Optimierungsprobleme – mit Beispielen und Laufzeitanalyse",
      "report-generator": "Generiere einen umfassenden Report über aktuelle Prozesse",
      "nfc-bot": "Steuere den NFC-Bot und zeige den aktuellen Status",
      "process-optimization": "Optimiere den aktuellen Workflow-Prozess",
      "multi-translation": "Übersetze mit Multi-Brain in mehrere Sprachen gleichzeitig",
      "brain-training": "Trainiere das Brain-Netzwerk mit neuen Daten"
    };

    if (commands[capability]) {
      processCommand(commands[capability]);
      setSidebarOpen(false);
    }
  };

  const quickCommands = [
    { icon: "📋", label: "Task", command: "Kategorisiere Task: " },
    { icon: "⚡", label: "Optimieren", command: "Optimiere Prozess: " },
    { icon: "📊", label: "Report", command: "Generiere Report: " },
    { icon: "🔍", label: "Recherche", command: "Recherchiere gründlich zum Thema: " },
  ];

  const handleKernelEvolve = () => {
    processCommand("Analysiere mein aktuelles Kern-Modul und schlage eine verbesserte Version vor. Zeige den kompletten neuen Kern-Modul-Code, den ich direkt übernehmen kann. Optimiere für maximale Effizienz, Ehrgeiz und Problemlösungsfähigkeit. Hier ist mein aktuelles Kern-Modul:\n\n" + kernel);
  };

  const SidebarContent = (
    <BotSidebar 
      mode={mode} 
      onModeChange={setMode}
      onCapabilityClick={handleCapabilityClick}
      kernel={kernel}
      onKernelChange={setKernel}
      onKernelReset={resetKernel}
      onKernelEvolve={handleKernelEvolve}
    />
  );

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-gradient-to-br from-tech via-background to-tech">
      {/* Desktop Sidebar */}
      {!isMobile && SidebarContent}
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header with Menu */}
        {isMobile ? (
          <header className="bg-tech border-b border-neon/50 p-3 flex items-center gap-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 text-neon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[280px] bg-tech border-r border-neon">
                {SidebarContent}
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-2 h-2 rounded-full bg-neon animate-pulse-glow shrink-0" />
              <h1 className="text-base font-bold neon-text truncate">MACALU BRAIN</h1>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-neon" onClick={newConversation} title="Neuer Chat">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={clearHistory} title="Chat löschen">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </header>
        ) : (
          <BotHeader onNewChat={newConversation} onClearChat={clearHistory} />
        )}
        
        {/* Chat Area */}
        <div 
          ref={chatRef}
          className="flex-1 overflow-y-auto p-3 md:p-6 space-y-2 md:space-y-3 bg-background/30"
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

        {/* Pending Image Preview */}
        {pendingImage && (
          <div className="bg-tech border-t border-neon/30 px-3 md:px-6 py-2 flex items-center gap-3">
            <img src={pendingImage} alt="Vorschau" className="h-12 w-16 object-cover rounded border border-neon/50" />
            <span className="text-xs text-muted-foreground">📷 Bild bereit – schreibe eine Frage oder sende direkt</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPendingImage(null)}
              className="text-destructive text-xs ml-auto"
            >
              ✕
            </Button>
          </div>
        )}

        {/* Pending Audio Preview */}
        {pendingAudio && (
          <div className="bg-tech border-t border-neon/30 px-3 md:px-6 py-2 flex items-center gap-3">
            <span className="text-lg">🔴</span>
            <span className="text-xs text-muted-foreground">Audio bereit – schreibe eine Frage oder sende direkt</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPendingAudio(null)}
              className="text-destructive text-xs ml-auto"
            >
              ✕
            </Button>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-tech border-t border-neon/50 p-3 md:p-6">
          {/* Quick Commands - Hidden on very small screens */}
          <div className="hidden sm:flex flex-wrap gap-2 mb-3">
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
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Button
              type="button"
              size="icon"
              onClick={() => setCameraOpen(true)}
              className="h-10 w-10 md:h-12 md:w-12 bg-neon/20 border border-neon/50 text-neon hover:bg-neon/30 shrink-0"
              title="Kamera öffnen"
            >
              <Camera className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <VoiceInput onTranscript={handleVoiceTranscript} />
            <AudioRecorder onRecorded={handleAudioRecorded} />
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={pendingAudio ? "Frage zum Audio eingeben..." : pendingImage ? "Frage zum Bild eingeben..." : "Nachricht eingeben..."}
              className="flex-1 bg-input border border-neon/30 text-foreground placeholder:text-muted-foreground 
                       focus:border-neon focus:ring-1 focus:ring-neon/20 rounded-lg h-10 md:h-12 text-sm md:text-base"
            />
            <Button 
              type="submit" 
              size="icon"
              className="h-10 w-10 md:h-12 md:w-12 bg-neon/20 border border-neon text-neon hover:bg-neon/30 shrink-0"
            >
              <Send className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </form>
        </div>
      </div>

      {/* Camera Overlay */}
      {cameraOpen && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setCameraOpen(false)}
        />
      )}
    </div>
  );
};

export default Index;

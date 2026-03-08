import { useState, useRef, useEffect } from "react";
import BotHeader from "@/components/BotHeader";
import BotSidebar from "@/components/BotSidebar";
import ChatMessage from "@/components/ChatMessage";
import QuickCommand from "@/components/QuickCommand";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useStreamingChat } from "@/hooks/useStreamingChat";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, Send } from "lucide-react";

const Index = () => {
  const [mode, setMode] = useState("fusion");
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { messages, sendMessage } = useStreamingChat();
  const isMobile = useIsMobile();

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
  ];

  const SidebarContent = (
    <BotSidebar 
      mode={mode} 
      onModeChange={setMode}
      onCapabilityClick={handleCapabilityClick}
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
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2 h-2 rounded-full bg-neon animate-pulse-glow shrink-0" />
              <h1 className="text-base font-bold neon-text truncate">MACALU BRAIN</h1>
            </div>
          </header>
        ) : (
          <BotHeader />
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
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nachricht eingeben..."
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
    </div>
  );
};

export default Index;

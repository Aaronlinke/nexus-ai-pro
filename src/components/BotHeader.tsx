const BotHeader = () => {
  return (
    <header className="bg-tech border-b-2 border-neon p-6 text-center">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="w-3 h-3 rounded-full bg-neon animate-pulse-glow" />
        <h1 className="text-3xl font-bold neon-text tracking-wider">
          NEXUS-AI PRO
        </h1>
      </div>
      <p className="text-muted-foreground text-sm">
        Universal Bot System • Internet-Zugriff • API-Integration • Erweiterte KI-Funktionen
      </p>
    </header>
  );
};

export default BotHeader;

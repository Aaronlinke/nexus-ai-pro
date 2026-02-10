const BotHeader = () => {
  return (
    <header className="bg-tech border-b-2 border-neon p-6 text-center">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="w-3 h-3 rounded-full bg-neon animate-pulse-glow" />
        <h1 className="text-3xl font-bold neon-text tracking-wider">
          MACALU BRAIN
        </h1>
      </div>
      <p className="text-muted-foreground text-sm">
        Fused Superintelligence System • Fusion-KIs • NFC-Bot • Task-Execution
      </p>
    </header>
  );
};

export default BotHeader;

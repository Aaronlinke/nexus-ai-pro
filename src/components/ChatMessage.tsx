interface ChatMessageProps {
  type: "user" | "bot" | "system";
  content: string;
  isLoading?: boolean;
}

const ChatMessage = ({ type, content, isLoading }: ChatMessageProps) => {
  const styles = {
    user: "bg-cyber/20 border-l-4 border-cyber ml-8",
    bot: "bg-neon/10 border-l-4 border-neon mr-8",
    system: "bg-secondary/50 border-l-4 border-muted italic"
  };

  return (
    <div className={`${styles[type]} p-4 rounded-lg animate-slide-in mb-3`}>
      {isLoading ? (
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-neon/30 border-t-neon rounded-full animate-spin-loader" />
          <span className="text-sm text-muted-foreground">Verarbeite Befehl...</span>
        </div>
      ) : (
        <div 
          className="text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
};

export default ChatMessage;

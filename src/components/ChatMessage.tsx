interface ChatMessageProps {
  type: "user" | "bot" | "system";
  content: string;
  isLoading?: boolean;
}

const ChatMessage = ({ type, content, isLoading }: ChatMessageProps) => {
  const styles = {
    user: "bg-cyber/20 border-l-2 md:border-l-4 border-cyber ml-4 md:ml-8",
    bot: "bg-neon/10 border-l-2 md:border-l-4 border-neon mr-4 md:mr-8",
    system: "bg-secondary/50 border-l-2 md:border-l-4 border-muted italic text-xs"
  };

  return (
    <div className={`${styles[type]} p-2.5 md:p-4 rounded-lg animate-slide-in mb-2 md:mb-3`}>
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-neon/30 border-t-neon rounded-full animate-spin-loader" />
          <span className="text-xs text-muted-foreground">Verarbeite...</span>
        </div>
      ) : (
        <div 
          className="text-xs md:text-sm leading-relaxed break-words"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
};

export default ChatMessage;

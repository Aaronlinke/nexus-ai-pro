import { useState } from "react";

interface Message {
  id: string;
  type: "user" | "bot" | "system";
  content: string;
  isLoading?: boolean;
}

export const useStreamingChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "system",
      content: `<strong>🧠 MACALU BRAIN initialisiert</strong><br><br>
        Verschmolzenes Superintelligenz-System aktiv:<br>
        • Fusion-KIs, Bot-KIs & NFC-KIs integriert<br>
        • Task-Execution & Kategorisierung<br>
        • Report-Generator & Prozess-Optimierung<br>
        • Echtzeit-Streaming mit Brain-Netzwerk<br><br>
        Alle Systeme bereit. Awaiting commands.`
    }
  ]);

  const sendMessage = async (input: string, mode: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: "",
      isLoading: true
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          messages: messages
            .filter(m => m.type !== "system")
            .map(m => ({
              role: m.type === "user" ? "user" : "assistant",
              content: m.content.replace(/<[^>]*>/g, '') // Strip HTML for AI
            }))
            .concat([{ role: "user", content: input }]),
          mode 
        }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || "Fehler bei der Kommunikation mit der KI");
      }

      if (!resp.body) {
        throw new Error("Keine Antwort vom Server");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;
      let accumulatedContent = "";

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            
            if (content) {
              accumulatedContent += content;
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === assistantMessage.id
                    ? { ...msg, content: accumulatedContent, isLoading: false }
                    : msg
                )
              );
            }
          } catch (e) {
            // Incomplete JSON, put it back
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw || raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              accumulatedContent += content;
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === assistantMessage.id
                    ? { ...msg, content: accumulatedContent, isLoading: false }
                    : msg
                )
              );
            }
          } catch { /* ignore */ }
        }
      }

      // Mark as complete
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessage.id
            ? { ...msg, isLoading: false }
            : msg
        )
      );

    } catch (error) {
      console.error("Chat error:", error);
      
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessage.id
            ? { 
                ...msg, 
                content: `❌ <strong>Fehler:</strong> ${error instanceof Error ? error.message : "Unbekannter Fehler"}`,
                isLoading: false 
              }
            : msg
        )
      );
    }
  };

  return { messages, sendMessage };
};
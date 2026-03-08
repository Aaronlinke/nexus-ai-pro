import { useState, useEffect, useCallback } from "react";

interface Message {
  id: string;
  type: "user" | "bot" | "system";
  content: string;
  isLoading?: boolean;
}

const STORAGE_KEY = "macalu-brain-chat-history";

const systemMessage: Message = {
  id: "1",
  type: "system",
  content: `<strong>🧠 MACALU BRAIN initialisiert</strong><br><br>
    Verschmolzenes Superintelligenz-System aktiv:<br>
    • Fusion-KIs, Bot-KIs & NFC-KIs integriert<br>
    • Task-Execution & Kategorisierung<br>
    • Report-Generator & Prozess-Optimierung<br>
    • 🔗 Blockchain, Smart Contracts & On-Chain-Analyse<br>
    • 🧮 Algorithmen, Mathematik & Kryptographie<br>
    • Echtzeit-Streaming mit Brain-Netzwerk<br><br>
    <em>Ehrgeiz-Level: Maximum. Ich finde IMMER einen Weg.</em><br>
    Alle Systeme bereit. Awaiting commands.`
};

const loadMessages = (): Message[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Message[];
      // Filter out any loading messages from a previous session
      return [systemMessage, ...parsed.filter(m => m.type !== "system" && !m.isLoading)];
    }
  } catch { /* ignore */ }
  return [systemMessage];
};

const saveMessages = (messages: Message[]) => {
  try {
    // Only save non-system, non-loading messages
    const toSave = messages.filter(m => m.type !== "system" && !m.isLoading);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch { /* ignore */ }
};

export const useStreamingChat = () => {
  const [messages, setMessages] = useState<Message[]>(loadMessages);

  // Persist whenever messages change (but skip loading states)
  useEffect(() => {
    const hasLoading = messages.some(m => m.isLoading);
    if (!hasLoading) {
      saveMessages(messages);
    }
  }, [messages]);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([systemMessage]);
  }, []);

  const sendMessage = async (input: string, mode: string, customKernel?: string, imageBase64?: string, audioBase64?: string) => {
    let displayContent = input;
    if (imageBase64) displayContent = `📷 [Bild angehängt]\n${input}`;
    else if (audioBase64) displayContent = `🔴 [Audio angehängt]\n${input}`;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: displayContent
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

      // Build the new user message content (multimodal if image/audio)
      let newUserContent: any = input;
      if (imageBase64) {
        newUserContent = [
          { type: "image_url", image_url: { url: imageBase64 } },
          { type: "text", text: input },
        ];
      } else if (audioBase64) {
        newUserContent = [
          { type: "input_audio", input_audio: { data: audioBase64.split(",")[1] || audioBase64, format: "webm" } },
          { type: "text", text: input },
        ];
      }
      
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
              content: m.content.replace(/<[^>]*>/g, '')
            }))
            .concat([{ role: "user", content: newUserContent }]),
          mode,
          customKernel,
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

  return { messages, sendMessage, clearHistory };
};

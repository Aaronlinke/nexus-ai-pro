import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  type: "user" | "bot" | "system";
  content: string;
  isLoading?: boolean;
}

const systemMessage: Message = {
  id: "1",
  type: "system",
  content: `<strong>🧠 MACALU BRAIN initialisiert</strong><br><br>
    Verschmolzenes Superintelligenz-System aktiv:<br>
    • Fusion-KIs, Bot-KIs & NFC-KIs integriert<br>
    • 🔍 <strong>Autonome Recherche</strong> – Ich recherchiere selbstständig<br>
    • 🧮 <strong>Tool-Use</strong> – Ich entscheide selbst welche Tools ich nutze<br>
    • 💾 <strong>Memory</strong> – Ich erinnere mich an alles<br>
    • 🔗 Blockchain, Algorithmen & Mathematik<br>
    • ⚡ Code-Sandbox mit JS, Python & HTML<br><br>
    <em>Ehrgeiz-Level: Maximum. Ich handle autonom.</em><br>
    Alle Systeme bereit. Awaiting commands.`
};

export const useStreamingChat = () => {
  const [messages, setMessages] = useState<Message[]>([systemMessage]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const initialized = useRef(false);

  // Load or create conversation on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const loadConversation = async () => {
      try {
        // Try to load the most recent conversation
        const { data: convs } = await supabase
          .from("conversations")
          .select("id")
          .order("updated_at", { ascending: false })
          .limit(1);

        if (convs && convs.length > 0) {
          const convId = convs[0].id;
          setConversationId(convId);

          // Load messages
          const { data: msgs } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", convId)
            .order("created_at", { ascending: true });

          if (msgs && msgs.length > 0) {
            const loaded: Message[] = [
              systemMessage,
              ...msgs.map((m: any) => ({
                id: m.id,
                type: m.role === "user" ? "user" as const : "bot" as const,
                content: m.content,
              })),
            ];
            setMessages(loaded);
          }
        } else {
          // Create new conversation
          const { data } = await supabase
            .from("conversations")
            .insert({ title: "Neue Konversation" })
            .select("id")
            .single();
          if (data) setConversationId(data.id);
        }
      } catch (e) {
        console.error("Failed to load conversation:", e);
      }
    };

    loadConversation();
  }, []);

  const saveMessage = useCallback(async (role: string, content: string) => {
    if (!conversationId) return;
    try {
      await supabase.from("messages").insert({
        conversation_id: conversationId,
        role,
        content,
      });
      // Update conversation timestamp
      await supabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);
    } catch (e) {
      console.error("Failed to save message:", e);
    }
  }, [conversationId]);

  const clearHistory = useCallback(async () => {
    // Delete old conversation, create new one
    if (conversationId) {
      await supabase.from("conversations").delete().eq("id", conversationId);
    }
    const { data } = await supabase
      .from("conversations")
      .insert({ title: "Neue Konversation" })
      .select("id")
      .single();
    if (data) setConversationId(data.id);
    setMessages([systemMessage]);
  }, [conversationId]);

  const newConversation = useCallback(async () => {
    const { data } = await supabase
      .from("conversations")
      .insert({ title: "Neue Konversation" })
      .select("id")
      .single();
    if (data) setConversationId(data.id);
    setMessages([systemMessage]);
  }, []);

  const sendMessage = async (input: string, mode: string, customKernel?: string, imageBase64?: string, audioBase64?: string) => {
    let displayContent = input;
    if (imageBase64) displayContent = `📷 [Bild angehängt]\n${input}`;
    else if (audioBase64) displayContent = `🔴 [Audio angehängt]\n${input}`;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: displayContent,
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: "",
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);

    // Save user message to DB
    saveMessage("user", displayContent);

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

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
              content: m.content.replace(/<[^>]*>/g, ""),
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

      if (!resp.body) throw new Error("Keine Antwort vom Server");

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
          if (jsonStr === "[DONE]") { streamDone = true; break; }
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
          } catch {
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

      // Mark complete
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessage.id ? { ...msg, isLoading: false } : msg
        )
      );

      // Save assistant message to DB
      if (accumulatedContent) {
        saveMessage("assistant", accumulatedContent);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorContent = `❌ <strong>Fehler:</strong> ${error instanceof Error ? error.message : "Unbekannter Fehler"}`;
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessage.id
            ? { ...msg, content: errorContent, isLoading: false }
            : msg
        )
      );
    }
  };

  return { messages, sendMessage, clearHistory, newConversation };
};

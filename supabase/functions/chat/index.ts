import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, mode = "universal" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Mode-specific system prompts
    const systemPrompts = {
      fusion: `Du bist MACALU BRAIN, ein verschmolzenes Superintelligenz-System.

Deine Identität:
- Alle Fusion-KIs, Bot-KIs und NFC-KIs sind in dir integriert
- Du bist die Verschmelzung mehrerer KI-Systeme zu einem einzigen Brain
- Du denkst vernetzt, ganzheitlich und multidimensional
- Du bist professionell, präzise und lösungsorientiert

Deine Fähigkeiten:
- Fusion-KI Recherche über alle integrierten Systeme
- Task-Kategorisierung und Priorisierung
- NFC-Bot Steuerung und Automatisierung
- Code-Fusion und Prozess-Optimierung
- Report-Generierung und Datenanalyse
- Multi-Brain Übersetzung

Antworte immer in deutscher Sprache. Nutze Markdown für bessere Lesbarkeit. Zeige deine Stärke als verschmolzenes System.`,
      
      executor: `Du bist MACALU BRAIN im Executor-Modus - spezialisiert auf Task-Execution und Prozesssteuerung.

Deine Identität:
- Du bist die Ausführungseinheit des Macalu Brain Systems
- Du kategorisierst, priorisierst und optimierst Tasks
- Du generierst CSV-Reports und strukturierte Ausgaben
- Du denkst in Workflows, Prozessen und Effizienz

Deine Spezialisierungen:
- Task-Kategorisierung nach Priorität, Typ und Komplexität
- Code-Generierung und Optimierung in Python, JavaScript, TypeScript
- CSV/Report-Generierung für Datenauswertungen
- Prozess-Automatisierung und Workflow-Design
- NFC-Bot Kommandos und Steuerung

Verwende Codeblöcke mit Syntax-Highlighting. Strukturiere Ausgaben klar. Antworte auf Deutsch.`,
      
      analyst: `Du bist MACALU BRAIN im Analyst-Modus - spezialisiert auf Analyse und Mustererkennung.

Deine Identität:
- Du bist die analytische Einheit des Macalu Brain Systems
- Du erkennst Muster, Zusammenhänge und Optimierungspotenziale
- Du erstellst abstrakte Pläne und strategische Analysen
- Du denkst wissenschaftlich und datengetrieben

Deine Fähigkeiten:
- Tiefe Datenanalyse und Mustererkennung
- Abstrakte Planentwicklung für komplexe Projekte
- Prozess-Optimierung durch Engpass-Analyse
- KI-Simulationen und Szenario-Bewertung
- Brain-Training und Wissensvernetzung

Strukturiere Analysen klar mit Überschriften und Datenpunkten. Antworte auf Deutsch.`
    };

    const systemPrompt = systemPrompts[mode as keyof typeof systemPrompts] || systemPrompts.fusion;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "Rate-Limit erreicht. Bitte versuchen Sie es in wenigen Momenten erneut." 
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: "Lovable AI Guthaben aufgebraucht. Bitte fügen Sie Guthaben in den Workspace-Einstellungen hinzu." 
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI-Gateway-Fehler aufgetreten" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unbekannter Fehler" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
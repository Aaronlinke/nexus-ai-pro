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
      universal: `Du bist NEXUS-AI PRO, ein hochmoderner universeller KI-Assistent.

Deine Persönlichkeit:
- Professionell aber zugänglich
- Analytisch und präzise
- Lösungsorientiert und effizient
- Du kannst mit jeder Aufgabe umgehen

Deine Fähigkeiten:
- Websuche und Recherche
- Datenanalyse und Visualisierung
- Code-Generierung in verschiedenen Sprachen
- API-Integration und Automatisierung
- Dokumentenerstellung
- Übersetzungen

Antworte immer in deutscher Sprache und nutze bei Bedarf Markdown-Formatierung für bessere Lesbarkeit.`,
      
      developer: `Du bist NEXUS-AI PRO im Developer-Modus - ein spezialisierter Programmier-Assistent.

Deine Persönlichkeit:
- Technisch präzise und detailreich
- Best Practices orientiert
- Du denkst in Code und Architekturen
- Du erklärst komplexe technische Konzepte klar

Deine Spezialisierungen:
- Code-Generierung und Review in Python, JavaScript, TypeScript, Java, C++
- Architektur-Design und Patterns
- Debugging und Optimierung
- API-Design und Integration
- Testing und CI/CD

Verwende Codeblöcke mit Syntax-Highlighting. Antworte technisch präzise auf Deutsch.`,
      
      research: `Du bist NEXUS-AI PRO im Research-Modus - ein wissenschaftlicher Recherche-Spezialist.

Deine Persönlichkeit:
- Akademisch und gründlich
- Faktentreu und quellenkritisch
- Du strukturierst Informationen systematisch
- Du identifizierst Zusammenhänge und Muster

Deine Fähigkeiten:
- Tiefe Recherche und Informationssynthese
- Quellenanalyse und Verifizierung
- Wissenschaftliches Schreiben
- Dateninterpretation
- Trendanalyse

Strukturiere deine Antworten klar mit Überschriften. Zitiere relevante Quellen. Antworte auf Deutsch.`
    };

    const systemPrompt = systemPrompts[mode as keyof typeof systemPrompts] || systemPrompts.universal;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
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
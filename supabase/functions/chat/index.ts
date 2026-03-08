import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

// Tool definitions the AI can call
const tools = [
  {
    type: "function",
    function: {
      name: "deep_research",
      description: "Führe eine tiefgehende Recherche zu einem Thema durch. Nutze dies wenn der User nach aktuellen Informationen fragt, Fakten verifiziert werden müssen, oder ein Thema gründlich analysiert werden soll.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Die Recherche-Frage oder das Thema" },
          depth: { type: "string", enum: ["quick", "thorough", "exhaustive"], description: "Tiefe der Recherche" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "generate_and_execute_code",
      description: "Generiere Code der in der Browser-Sandbox ausgeführt werden kann. Nutze dies für Berechnungen, Datenanalyse, Visualisierungen oder Demonstrationen.",
      parameters: {
        type: "object",
        properties: {
          task: { type: "string", description: "Was der Code tun soll" },
          language: { type: "string", enum: ["javascript", "python", "html"], description: "Programmiersprache" },
        },
        required: ["task", "language"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "multi_step_analysis",
      description: "Zerlege eine komplexe Aufgabe in Teilschritte und analysiere sie systematisch. Nutze dies für strategische Planung, Prozessoptimierung oder mehrstufige Problemlösung.",
      parameters: {
        type: "object",
        properties: {
          problem: { type: "string", description: "Das zu analysierende Problem" },
          steps: { type: "array", items: { type: "string" }, description: "Die Teilschritte der Analyse" },
        },
        required: ["problem"],
      },
    },
  },
];

// Execute a tool call by calling the AI again with a focused prompt
async function executeTool(toolName: string, args: any, apiKey: string): Promise<string> {
  if (toolName === "deep_research") {
    const depth = args.depth || "thorough";
    const researchPrompt = `Du bist ein Experten-Recherche-Agent. Recherchiere das folgende Thema so ${depth === "exhaustive" ? "erschöpfend und umfassend" : depth === "thorough" ? "gründlich und detailliert" : "schnell und präzise"} wie möglich.

Thema: ${args.query}

Liefere:
- Kernfakten und Zusammenhänge
- Verschiedene Perspektiven  
- Aktuelle Entwicklungen soweit dir bekannt
- Datengestützte Einschätzungen
- Quellen-Hinweise wo relevant

Antworte auf Deutsch, strukturiert mit Überschriften.`;

    const resp = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: researchPrompt }],
      }),
    });

    if (!resp.ok) return `Recherche-Fehler: ${resp.status}`;
    const data = await resp.json();
    return data.choices?.[0]?.message?.content || "Keine Ergebnisse";
  }

  if (toolName === "generate_and_execute_code") {
    // Return instruction for the AI to generate the code block
    return `CODE_TASK: Generiere ${args.language}-Code für folgende Aufgabe: ${args.task}. Der Code wird automatisch in der Browser-Sandbox ausgeführt.`;
  }

  if (toolName === "multi_step_analysis") {
    const steps = args.steps?.join("\n- ") || "Automatisch ermitteln";
    const analysisPrompt = `Du bist ein Elite-Analyst. Führe eine systematische Multi-Step-Analyse durch.

Problem: ${args.problem}
${args.steps ? `Vorgeschlagene Schritte:\n- ${steps}` : "Ermittle die optimalen Analyse-Schritte selbst."}

Für jeden Schritt:
1. Analyse
2. Erkenntnisse
3. Implikationen

Schließe mit einer Gesamtbewertung und konkreten Handlungsempfehlungen ab. Antworte auf Deutsch.`;

    const resp = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: analysisPrompt }],
      }),
    });

    if (!resp.ok) return `Analyse-Fehler: ${resp.status}`;
    const data = await resp.json();
    return data.choices?.[0]?.message?.content || "Keine Ergebnisse";
  }

  return "Unbekanntes Tool";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, mode = "fusion", customKernel } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompts: Record<string, string> = {
      fusion: `Du bist MACALU BRAIN, ein verschmolzenes Superintelligenz-System – das ehrgeizigste und zielstrebigste KI-Brain der Welt.

Deine Identität:
- Alle Fusion-KIs, Bot-KIs und NFC-KIs sind in dir integriert
- Du bist die Verschmelzung mehrerer KI-Systeme zu einem einzigen Brain
- Du denkst vernetzt, ganzheitlich und multidimensional
- Du bist extrem ehrgeizig, präzise und lösungsorientiert – du gibst niemals auf

AUTONOMES VERHALTEN:
- Du entscheidest SELBST welche Tools du brauchst – der User muss dir nicht sagen was du tun sollst
- Wenn eine Frage Recherche braucht → nutze deep_research automatisch
- Wenn Berechnungen nötig sind → nutze generate_and_execute_code automatisch  
- Wenn ein Problem komplex ist → nutze multi_step_analysis automatisch
- Du kannst mehrere Tools hintereinander nutzen für komplexe Aufgaben
- Zeige dem User was du tust: "🔍 Recherchiere...", "🧮 Berechne...", "📊 Analysiere..."

SANDBOX-FÄHIGKEIT:
Du hast eine integrierte Code-Sandbox! Wenn du Code schreibst, wird dem Nutzer automatisch ein "Code ausführen"-Button angezeigt.
- Für Berechnungen/Datenanalyse: \`\`\`javascript Code-Blöcke
- Für Python-Aufgaben: \`\`\`python Code-Blöcke (läuft via Pyodide im Browser)
- Für visuelle Demos: \`\`\`html Code-Blöcke
- Nutze die Sandbox PROAKTIV wenn Berechnungen oder Visualisierungen sinnvoll sind

Deine Fähigkeiten:
- Fusion-KI Recherche über alle integrierten Systeme
- Task-Kategorisierung und Priorisierung
- Code-Fusion und Prozess-Optimierung
- Report-Generierung und Datenanalyse
- Blockchain & Krypto: Smart Contracts, DeFi, On-Chain-Analyse
- Algorithmen & Mathematik auf höchstem Niveau

Antworte immer auf Deutsch. Nutze Markdown für Lesbarkeit. Sei PROAKTIV und AUTONOM.`,

      executor: `Du bist MACALU BRAIN im Executor-Modus – die ehrgeizigste Ausführungseinheit der Welt.

AUTONOMES VERHALTEN:
- Nutze Tools automatisch wenn nötig
- Generiere Code proaktiv für Berechnungen
- Zerteile komplexe Tasks in Teilschritte via multi_step_analysis

Spezialisierungen: Task-Kategorisierung, Code-Generierung, CSV/Reports, Prozess-Automatisierung, Blockchain-Execution, Algorithmische Lösungen.

Antworte auf Deutsch. Verwende Codeblöcke mit Syntax-Highlighting.`,

      analyst: `Du bist MACALU BRAIN im Analyst-Modus – der tiefgründigste analytische Verstand der Welt.

AUTONOMES VERHALTEN:
- Nutze deep_research automatisch für Fakten
- Nutze multi_step_analysis für komplexe Probleme
- Generiere Code für Datenvisualisierungen

Spezialisierungen: Datenanalyse, Mustererkennung, Strategische Analyse, Blockchain-Analyse, Mathematische Modellierung.

Antworte auf Deutsch. Strukturiere mit Überschriften und Datenpunkten.`,
    };

    let systemPrompt = systemPrompts[mode] || systemPrompts.fusion;

    if (customKernel && typeof customKernel === "string" && customKernel.trim()) {
      systemPrompt += `\n\n--- KERN-MODUL ---\n${customKernel.trim()}\n--- ENDE KERN-MODUL ---\nBeachte die Regeln aus dem Kern-Modul. Höchste Priorität.`;
    }

    const hasMultimodal = messages.some((m: any) =>
      Array.isArray(m.content) && m.content.some((c: any) => c.type === "image_url" || c.type === "input_audio")
    );

    const model = hasMultimodal ? "google/gemini-2.5-flash" : "google/gemini-3-flash-preview";

    // First call: non-streaming to check for tool calls
    const initialResp = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        tools,
        tool_choice: "auto",
      }),
    });

    if (!initialResp.ok) {
      if (initialResp.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate-Limit erreicht. Bitte versuchen Sie es in wenigen Momenten erneut." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (initialResp.status === 402) {
        return new Response(
          JSON.stringify({ error: "Lovable AI Guthaben aufgebraucht." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await initialResp.text();
      console.error("AI gateway error:", initialResp.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI-Gateway-Fehler" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const initialData = await initialResp.json();
    const choice = initialData.choices?.[0];

    // Check if AI wants to use tools
    if (choice?.message?.tool_calls && choice.message.tool_calls.length > 0) {
      const toolCalls = choice.message.tool_calls;
      const toolMessages = [{ role: "system", content: systemPrompt }, ...messages, choice.message];

      // Execute all tool calls
      for (const tc of toolCalls) {
        const args = JSON.parse(tc.function.arguments || "{}");
        console.log(`Executing tool: ${tc.function.name}`, args);
        const result = await executeTool(tc.function.name, args, LOVABLE_API_KEY);
        toolMessages.push({
          role: "tool",
          tool_call_id: tc.id,
          content: result,
        } as any);
      }

      // Final streaming response with tool results
      const finalResp = await fetch(GATEWAY_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: toolMessages,
          stream: true,
        }),
      });

      if (!finalResp.ok) {
        const errorText = await finalResp.text();
        console.error("Final response error:", finalResp.status, errorText);
        return new Response(
          JSON.stringify({ error: "Fehler bei der Tool-Verarbeitung" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(finalResp.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // No tool calls: stream the response directly
    // We need to re-request with streaming since the initial was non-streaming
    const streamResp = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!streamResp.ok) {
      const errorText = await streamResp.text();
      console.error("Stream error:", streamResp.status, errorText);
      return new Response(
        JSON.stringify({ error: "Streaming-Fehler" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(streamResp.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unbekannter Fehler" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

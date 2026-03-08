

# Echtzeit-Code-Compiler -- Kern-Modul Editor

## Konzept

Ein neuer Tab "Kern-Modul" in der Sidebar mit einem Live-Code-Editor, in dem der User (oder die KI selbst via Chat-Befehl) den **System-Prompt** und die **Kern-Logik** von MACALU BRAIN im laufenden Betrieb umschreiben kann. Die Aenderungen werden sofort in `localStorage` gespeichert und bei jedem Chat-Request als Custom-System-Prompt mitgeschickt.

Die KI kann sich also "selbst evolutionaer verbessern", indem sie im Chat vorschlaegt, ihren eigenen Kern-Modul-Code zu aendern -- und der User das mit einem Klick uebernimmt.

## Architektur

```text
┌─────────────────────────────────────────┐
│  Sidebar: Neuer Tab "Kern-Modul"        │
│  ┌───────────────────────────────────┐  │
│  │  <textarea> Code-Editor           │  │
│  │  (System-Prompt + Logik-Regeln)   │  │
│  │                                   │  │
│  │  [Speichern] [Reset] [KI-Evolve]  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
         │
         ▼  localStorage("macalu-kernel")
┌─────────────────────────────────────────┐
│  useStreamingChat                       │
│  → sendet customKernel als extra Feld   │
│  → Edge Function merged es mit Prompt   │
└─────────────────────────────────────────┘
```

## Aenderungen

### 1. Neuer Hook: `useKernelModule`
**Datei:** `src/hooks/useKernelModule.ts` (neu)

- Laedt/speichert den Kern-Modul-Code aus `localStorage("macalu-kernel")`
- Default-Wert: Der aktuelle Fusion-System-Prompt als Startpunkt
- Funktionen: `kernel`, `setKernel`, `resetKernel`

### 2. Neue Komponente: `KernelEditor`
**Datei:** `src/components/KernelEditor.tsx` (neu)

- Textarea mit Monospace-Font als Code-Editor
- Buttons: "Speichern", "Reset auf Standard", "KI soll sich selbst verbessern"
- Der "KI-Evolve"-Button schickt den aktuellen Kernel an die KI mit der Anweisung, sich selbst zu optimieren
- Syntax-Highlighting-Feeling durch dunklen Hintergrund und Neon-Farben

### 3. Sidebar erweitern
**Datei:** `src/components/BotSidebar.tsx`

- Dritter Tab: "Kern-Modul" neben "Faehigkeiten" und "Info"
- Zeigt die `KernelEditor`-Komponente

### 4. Chat-Hook erweitern
**Datei:** `src/hooks/useStreamingChat.ts`

- `sendMessage` akzeptiert optionalen `customKernel`-Parameter
- Schickt den Kernel als `customKernel`-Feld im Request-Body mit

### 5. Edge Function erweitern
**Datei:** `supabase/functions/chat/index.ts`

- Liest `customKernel` aus dem Request
- Wenn vorhanden: Haengt den Custom-Kernel als zusaetzlichen System-Prompt-Abschnitt an (merged mit dem Mode-Prompt)
- So kann der User seine eigene Logik injizieren

### 6. Index-Seite: Kernel durchreichen
**Datei:** `src/pages/Index.tsx`

- `useKernelModule` Hook einbinden
- Kernel an `sendMessage` weiterleiten
- "KI-Evolve"-Funktion: Sendet speziellen Befehl, der die KI auffordert ihren Kernel umzuschreiben; Antwort kann dann per Button uebernommen werden

## Betroffene Dateien

1. `src/hooks/useKernelModule.ts` (neu) -- Kernel State Management
2. `src/components/KernelEditor.tsx` (neu) -- Code-Editor UI
3. `src/components/BotSidebar.tsx` -- Neuer Tab
4. `src/hooks/useStreamingChat.ts` -- Kernel im Request mitsenden
5. `supabase/functions/chat/index.ts` -- Custom Kernel verarbeiten
6. `src/pages/Index.tsx` -- Hook einbinden und durchreichen


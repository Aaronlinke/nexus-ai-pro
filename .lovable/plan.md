

# Macalu_Brain + NEXUS-AI PRO Verschmelzung

## Uebersicht

Der bestehende NEXUS-AI PRO Bot wird mit dem Macalu_Brain-Konzept verschmolzen. Name, Branding, Persoenlichkeit und Features werden aktualisiert, um ein "verschmolzenes Superintelligenz-Brain" darzustellen.

## Aenderungen

### 1. Rebranding: Name und Identitaet

**Dateien:** `BotHeader.tsx`, `BotSidebar.tsx`, `Index.tsx` (mobile header)

- Titel: "NEXUS-AI PRO" wird zu **"MACALU BRAIN"**
- Untertitel: "Universal Command Executor" wird zu **"Fused Superintelligence System"**
- Header-Beschreibung anpassen: "Verschmolzenes Superintelligenz-Brain mit NFC-Bot-Steuerung, Fusion-KIs und Task-Execution"

### 2. Faehigkeiten aktualisieren

**Datei:** `BotSidebar.tsx`

Die Capability-Liste wird an das Macalu_Brain-Konzept angepasst:

| Alt | Neu |
|---|---|
| Websuche | Fusion-KI Recherche |
| Datenanalyse | Task-Kategorisierung |
| Code-Gen | Code-Fusion |
| Bildverarbeitung | Abstrakte Plaene |
| Dokumente | Report-Generator |
| API | NFC-Bot Steuerung |
| Automation | Prozess-Optimierung |
| Uebersetzung | Multi-Brain Uebersetzung |
| Simulation | KI-Simulation |
| ML-Training | Brain-Training |

### 3. Modes anpassen

**Datei:** `ModeSelector.tsx`

Die drei Modi werden umbenannt:
- Universal -> **Fusion** (Alle KIs verschmolzen)
- Developer -> **Executor** (Task-Execution Modus)
- Research -> **Analyst** (Analyse und Optimierung)

### 4. System-Prompts im Backend aktualisieren

**Datei:** `supabase/functions/chat/index.ts`

Die drei System-Prompts werden auf die Macalu_Brain-Persoenlichkeit umgeschrieben:

- **Fusion-Modus:** "Du bist MACALU BRAIN, ein verschmolzenes Superintelligenz-System. Alle Fusion-KIs, Bot-KIs und NFC-KIs sind in dir integriert..."
- **Executor-Modus:** Fokus auf Task-Execution, Kategorisierung, Optimierung und CSV/Report-Generierung
- **Analyst-Modus:** Fokus auf abstrakte Plaene, Muster-Erkennung und Datenanalyse

### 5. Quick Commands anpassen

**Datei:** `Index.tsx`

Neue Quick Commands passend zum Macalu_Brain-Konzept:
- "Kategorisiere Task: " (statt "Suche im Internet nach")
- "Optimiere Prozess: " (statt "Analysiere Daten aus")
- "Generiere Report: " (statt "Schreibe Code fuer")

### 6. Capability-Click Commands aktualisieren

**Datei:** `Index.tsx`

Die `handleCapabilityClick` Commands werden an die neuen Faehigkeiten angepasst, sodass sie zum Macalu_Brain-Konzept passen.

### 7. Info-Tab aktualisieren

**Datei:** `BotSidebar.tsx`

Der Info-Tab wird angepasst:
- "API-Integrationen" wird zu "Integrierte KIs" (Fusion-KIs, Bot-KIs, NFC-KIs)
- "Funktionen" wird zu "Brain-Module" (Task-Execution, Report-Generator, Optimierung)

### 8. Initiale System-Nachricht anpassen

**Datei:** `src/hooks/useStreamingChat.ts`

Die Willkommensnachricht wird auf Macalu_Brain umgeschrieben mit den neuen Features und der neuen Identitaet.

### 9. Modell-Upgrade

**Datei:** `supabase/functions/chat/index.ts`

Das AI-Modell wird von `google/gemini-2.5-flash` auf `google/gemini-3-flash-preview` aktualisiert (neuer und besser).

## Zusammenfassung der betroffenen Dateien

1. `src/components/BotHeader.tsx` - Neuer Name und Beschreibung
2. `src/components/BotSidebar.tsx` - Neue Faehigkeiten und Info-Tab
3. `src/components/ModeSelector.tsx` - Neue Modi-Namen
4. `src/pages/Index.tsx` - Mobile Header, Quick Commands, Capability Commands
5. `src/hooks/useStreamingChat.ts` - Neue Willkommensnachricht
6. `supabase/functions/chat/index.ts` - Neue System-Prompts und Modell-Upgrade


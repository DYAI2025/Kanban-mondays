# Kanban Mondays – Studio

Dieses Repository enthält ein Vite/React-Frontend für das Workshop Product Studio (Build Studio + Asset Studio) und ist für direktes Deployment auf Railway vorbereitet.

## 1) Lokale Entwicklung

### Voraussetzungen
- Node.js 20+
- npm 10+

### Setup
1. Abhängigkeiten installieren:
   ```bash
   npm install
   ```
2. Umgebungsvariablen anlegen:
   ```bash
   cp .env.example .env.local
   ```
3. `VITE_GEMINI_API_KEY` in `.env.local` setzen.
4. Dev-Server starten:
   ```bash
   npm run dev
   ```

---

## 2) Railway Deployment (produktiv)

Das Repo enthält bereits:
- `railway.json` mit Build- und Start-Commands
- `server.mjs` für das Serven von `dist/` inkl. SPA-Fallback

### Schritte
1. Repo bei Railway importieren.
2. In Railway → **Variables** setzen:
   - `VITE_GEMINI_API_KEY=...`
3. Deploy starten.

Railway verwendet:
- Build: `npm ci && npm run build`
- Start: `npm run start`

---

## 3) Genaue Anleitung: Studio Tool verwenden

### A. Build Studio (Struktur aufbauen)
1. Auf **Home** gehen und **New Workshop** erstellen (oder einen Draft öffnen).
2. Zu **Build Studio** wechseln.
3. Links die Kapitel nacheinander bearbeiten:
   - Identity
   - Day-3 Outcome
   - Audience Fit
   - Scope
   - Format
   - Agenda
   - Methods
   - Deliverables
   - Pre-Work
   - AI Layer
   - Follow-On Logic
   - Review
4. Nach relevanten Änderungen **Save Board** klicken.
5. Rechts **Ask Architecture AI** verwenden, um pro Kapitel konkrete Verbesserungsvorschläge zu erhalten.

### B. Neue Usability-Verbesserung im Studio (implementiert)
Im Build Studio gibt es jetzt die Sektion **„Studio Tool Verbesserung“**:
1. Rohtext einfügen (z. B. Briefing, Interview-Notizen, Discovery-Protokoll).
2. **Dokument zusammenfassen** klicken.
3. Mit **In Workshop Summary übernehmen** wird die generierte Zusammenfassung direkt in die Workshop-Summary übertragen.

Nutzen: schneller Transfer von unstrukturierten Inputs in verwertbare Studio-Daten.

### C. Asset Studio (direkt im Frontend nutzbar)
1. Zu **Asset Studio** wechseln.
2. Asset-Typ wählen: Infosheet, Proposal Text, Delivery Brief.
3. **Build Asset** klicken.
4. Ergebnis weiterverwenden:
   - **Copy**: kopiert den Inhalt in die Zwischenablage.
   - **.md**: lädt den Inhalt als Markdown-Datei herunter.
   - **Summary**: erstellt eine Kurzfassung.

---

## 4) Wichtige Hinweise

- API-Key-Sicherheit: Da das Tool „direkt im Frontend“ genutzt wird, liegt der Key im Frontend-Kontext (`VITE_...`). Für strengere Security sollte mittelfristig ein Backend-Proxy für Gemini-Aufrufe ergänzt werden.
- Produktionsstart läuft über `server.mjs`, nicht über `vite preview`.

---

## 5) Nützliche Commands

```bash
npm run dev        # lokale Entwicklung
npm run build      # Produktions-Build
npm run start      # dist/ über Express ausliefern
npm run lint       # TypeScript-Check
```

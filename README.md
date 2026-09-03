# iobroker.vis-mywidgets — MyWidgets

Ein eigenständiges, modernes, dunkles Widget-Set für **ioBroker VIS (vis-2)**: Button, Toggle, Value Card, Energy Card, Battery Card, Slider, Weather Card, Navigation Button und Wallbox Card — alle über ein gemeinsames, per CSS-Variablen austauschbares Design-System gestylt, damit sie sich nahtlos in ein bestehendes dunkles Dashboard einfügen.

![Widget set icon](widgets/mywidgets/img/mywidgets.svg)

## Inhalt

1. [Architektur-Entscheidung](#architektur-entscheidung)
2. [Voraussetzungen](#voraussetzungen)
3. [Installation](#installation)
4. [Entwicklung](#entwicklung)
5. [Build](#build)
6. [Installation in ioBroker](#installation-in-iobroker)
7. [Verwendung in VIS](#verwendung-in-vis)
8. [Widget-Referenz](#widget-referenz)
9. [Design-System / Theme anpassen](#design-system--theme-anpassen)
10. [State-IDs & Datentypen](#state-ids--datentypen)
11. [Eigene Widgets hinzufügen](#eigene-widgets-hinzufügen)
12. [Tests](#tests)
13. [Bekannte Einschränkungen dieser Auslieferung](#bekannte-einschränkungen-dieser-auslieferung)

## Architektur-Entscheidung

Die Aufgabenstellung schlug eine Projektstruktur mit `widgets/mywidgets.html` + `css/mywidgets.css` vor (klassisches vis-1-Widget-Set, jQuery-basiert). Vor dem Anlegen der Dateien wurde das bewusst geprüft statt blind übernommen:

- Der klassische Adapter **`ioBroker.vis`** ("vis 1") ist laut eigenem README **eingestellt** ("*development of this version is stopped, please migrate to vis-2*"). Neue Widget-Sets dafür zu bauen wäre ein totes Ende.
- **`vis-2`** ist der aktuelle, aktiv weiterentwickelte Adapter. Eigene Widgets werden dort als **React-Komponenten** über eine `RxWidget`-Basisklasse (`window.visRxWidget`) gebaut und per **Module Federation** (Vite) als `customWidgets.js` ausgeliefert — das ist das offizielle, von ioBroker selbst gepflegte Muster (`ioBroker/ioBroker.vis-2-widgets-react-template`).
- Ein Test der klassischen jQuery-Widget-Sets *in* vis-2 (Community-Forum, u. a. "VIS/VIS-2 Übersicht Widgetkompatibilität") zeigt: die Kompatibilitätsschicht ist unvollständig und fehlerbehaftet, selbst für als "kompatibel" gelistete Sets. Für ein **neues** Projekt ist das keine tragfähige Basis.

**Konsequenz:** MyWidgets ist ein natives **vis-2-Widget-Set** (React + TypeScript, kein jQuery, kein Legacy-`vis`). Wo React/JSX für die eigentliche Optik nicht nötig ist, bleibt der Code bewusst so "vanilla" wie möglich — keine UI-Bibliothek (kein Material-UI, kein Bootstrap), nur eigene, schlanke Komponenten und reines CSS, damit die Widgets *nicht* wie Standard-VIS/Standard-Material aussehen (siehe Anforderung 32).

Die vom Auftrag vorgeschlagene Struktur wurde entsprechend an das angepasst, was vis-2 tatsächlich erwartet (siehe [Projektstruktur](#projektstruktur) unten) — u. a. `src-widgets/` für die React/TS-Quellen und ein generiertes `widgets/mywidgets/customWidgets.js` statt einer einzelnen `mywidgets.html`.

### Projektstruktur

```
iobroker.vis-mywidgets/
├── io-package.json          # Adapter-/Widget-Set-Registrierung (visWidgets)
├── package.json             # Root-Scripts (build/test/lint), keine Laufzeit-Logik
├── admin/                    # Info-Tab in der ioBroker-Admin-Oberfläche
│   ├── jsonConfig.json
│   ├── vis-mywidgets.svg
│   └── i18n/{de,en}/translations.json
├── src-widgets/              # eigentliche Widget-Quellen (TypeScript + React)
│   ├── vite.config.ts        # Module-Federation-Build -> customWidgets.js
│   ├── src/
│   │   ├── global.d.ts       # Typ für window.visRxWidget
│   │   ├── translations.ts   # alle Editor-Feld-Übersetzungen (de/en, ...)
│   │   ├── theme/theme.css   # zentrales Design-System (CSS-Variablen)
│   │   ├── common/           # BaseWidget, Icon-Set, Formatierung, MiniChart, ...
│   │   └── widgets/           # ein Ordner-Paar (Component.tsx + Component.css) je Widget
├── widgets/mywidgets/         # Build-Output + statische Assets (img/), von VIS geladen
├── tasks/build.js             # Build-Orchestrierung (npm run build)
└── test/                      # Unit-/Struktur-Tests (node:test, siehe "Tests")
```

## Voraussetzungen

- Node.js ≥ 18 (getestet mit Node 22)
- Ein laufendes ioBroker-System mit installiertem **`vis-2`**-Adapter (nicht das alte `vis`)
- Für die Entwicklung mit Live-Reload: Netzwerkzugriff auf diese ioBroker-Instanz (siehe [Entwicklung](#entwicklung))

## Installation

```bash
git clone https://github.com/ErikDevelopment/iobroker.vis-mywidgets.git
cd iobroker.vis-mywidgets
npm run npm      # installiert Root- UND src-widgets/-Abhängigkeiten
npm run build
```

`npm run npm` ist ein kleiner Komfort-Alias für `npm install && cd src-widgets && npm install` (zwei `package.json`, weil die Widget-Quellen ihren eigenen, von der Adapter-Metaebene getrennten Abhängigkeitsbaum haben — exakt wie im offiziellen ioBroker-Template).

### Ohne lokales Node.js/npm: Build über GitHub Actions

Kein Node.js/npm installiert? `.github/workflows/build.yml` baut das Projekt bei jedem Push auf `main` automatisch in der GitHub-Cloud und committet `widgets/mywidgets/customWidgets.js` zurück ins Repo — danach ist die Installation in ioBroker (Abschnitt weiter unten) identisch, egal ob lokal oder per Actions gebaut wurde. Ablauf:

1. Leeres Repo auf GitHub anlegen, den entpackten Projektordner hochladen (Web-Oberfläche: auf der leeren Repo-Seite auf **„uploading an existing file“** klicken und den ganzen Ordnerinhalt reinziehen — GitHub übernimmt dabei auch verschachtelte Unterordner; alternativ `git push`, falls Git vorhanden ist).
2. Im Repo einmal auf den Reiter **Actions** gehen — GitHub erkennt `.github/workflows/build.yml` automatisch und bietet an, den Workflow zu aktivieren.
3. Den Workflow einmal manuell anstoßen: **Actions → „Build widgets“ → „Run workflow“** (oder einfach eine Kleinigkeit committen, z. B. die README bearbeiten — jeder Push auf `main` löst ihn ebenfalls aus).
4. Nach ca. 1–2 Minuten grüner Haken: der Workflow hat installiert, getestet, gebaut und `widgets/mywidgets/customWidgets.js` automatisch zurückcommittet.
5. Ab jetzt in ioBroker ganz normal per `iobroker url https://github.com/<dein-user>/iobroker.vis-mywidgets/archive/refs/heads/main.tar.gz` bzw. über Admin → „Eigenen Adapter installieren“ mit der GitHub-URL installieren.

## Entwicklung

```bash
npm run dev
```

Startet den Vite-Dev-Server (`src-widgets`, Port 4173) mit Hot-Reload. Der Dev-Server proxyt `/vis-2`, `/_socket`, `/adapter`, `/web` etc. auf `http://localhost:8082` (siehe `src-widgets/vite.config.ts`) — dafür muss lokal (oder per SSH-Tunnel) eine echte ioBroker-Instanz mit `web`-Adapter auf Port 8082 erreichbar sein. Anschließend in der Admin-Instanz von `vis-mywidgets` die Widget-Set-URL testweise auf `http://localhost:4173/customWidgets.js` zeigen lassen (`system.adapter.vis-mywidgets.0` → `common.visWidgets.mywidgets.url`), dann lädt der VIS-Editor die Widgets mit Live-Reload direkt aus dem Dev-Server. Diesen Workflow beschreibt das offizielle Template identisch — er wurde hier bewusst 1:1 übernommen statt neu erfunden.

```bash
npm run typecheck   # tsc --noEmit in src-widgets/
npm run lint        # eslint in src-widgets/
npm test            # Unit-/Struktur-Tests, siehe unten
```

## Build

```bash
npm run build
```

Das Root-Script `tasks/build.js`:

1. installiert `src-widgets/node_modules`, falls nötig,
2. führt in `src-widgets/` `tsc --noEmit && vite build` aus (Type-Check + Module-Federation-Bundle),
3. kopiert das Ergebnis (`src-widgets/build/*`) nach `widgets/mywidgets/`.

Ergebnis: `widgets/mywidgets/customWidgets.js` — genau die Datei, auf die `io-package.json` (`common.visWidgets.mywidgets.url`) zeigt.

> **Hinweis zu dieser Auslieferung:** Die Sandbox, in der dieses Projekt erstellt wurde, hat **keinen Zugriff auf die npm-Registry** (rein netzwerkseitig blockiert) und keine laufende ioBroker/vis-2-Instanz. `npm run build` konnte hier deshalb nicht end-to-end ausgeführt werden. Stattdessen wurde der komplette Quellcode gegen lokal nachgebaute, aus den echten, öffentlich abrufbaren `@iobroker/types-vis-2`-Typdefinitionen rekonstruierte Typen mit `tsc --noEmit` **fehlerfrei** typgeprüft (0 Fehler) — siehe [Bekannte Einschränkungen](#bekannte-einschränkungen-dieser-auslieferung). Bitte nach `git clone` einmal `npm run npm && npm run build` ausführen und mir Fehlermeldungen zurückmelden, falls beim echten `npm install` gegen die reale Registry doch noch etwas abweicht (z. B. eine seither veröffentlichte Breaking-Change-Version von `@iobroker/types-vis-2`).

## Installation in ioBroker

Nach dem Build steht ein normal installierbarer ioBroker-Adapter bereit:

```bash
# lokal aus dem geklonten/gebauten Ordner:
cd /opt/iobroker
npm install /pfad/zu/iobroker.vis-mywidgets --production
iobroker upload vis-mywidgets
iobroker restart vis-2
```

Oder über den ioBroker-Admin: **Adapter → benutzerdefiniert installieren** → lokalen Pfad bzw. Git-URL angeben. Da `type: "visualization-widgets"` und `mode: "none"` gesetzt sind, wird **keine eigene Adapter-Instanz** benötigt/gestartet — das Set registriert sich beim `vis-2`-Adapter, sobald es installiert ist (`restartAdapters: ["vis-2"]` in `io-package.json` sorgt dafür, dass `vis-2` danach automatisch neu lädt).

## Verwendung in VIS

Im VIS-Editor erscheint im Widget-Katalog eine neue Gruppe **„MyWidgets“** mit allen neun Widgets (Palette-Icon: `widgets/mywidgets/img/mywidgets.svg`). Widget per Drag&Drop auf eine View ziehen, rechts im Attribute-Panel unter **DATEN / DESIGN / ANZEIGE / VERHALTEN** konfigurieren (siehe [Widget-Referenz](#widget-referenz)).

## Widget-Referenz

Alle Widgets teilen sich, wo sinnvoll, dieselben Gruppen:

- **DATEN** — Objekt-ID(s), Titel/Untertitel
- **DESIGN** — Icon, Akzentfarbe, Hintergrund, Eckenradius
- **ANZEIGE** — Einheit, Nachkommastellen, Präfix/Suffix, Sichtbarkeits-Toggles
- **VERHALTEN** — Klick-Aktion (falls zutreffend), Animation an/aus

| Widget | Zweck | wichtigste State-IDs |
|---|---|---|
| **Button** | Momentan-/Aktions-Button mit Icon, Titel, Untertitel, Status-Punkt | `oid` (bool/number/string) |
| **Toggle** | Ein/Aus-Zeile mit eigenem, nicht-nativem Schalter | `oid` (boolean) |
| **Value Card** | Beliebiger Wert (Temperatur, Feuchte, ...) inkl. Einheit/Formatierung | `oid` (number/string) |
| **Energy Card** | Aktuelle Leistung / Tages- / Wochen- / Monatsenergie + Mini-Chart | `oidPower`, `oidToday`, `oidWeek`, `oidMonth` |
| **Battery Card** | Lade-/Entladeleistung (signiert, grün/blau), optional SoC-Badge + Mini-Chart | `oidPower`, `oidToday`, `oidSoc` |
| **Slider** | Touch-/Maus-Slider mit min/max/step (Helligkeit, Lautstärke, Rollladen, Ladeleistung, ...) | `oid` (number) |
| **Weather Card** | Temperatur, gefühlte Temperatur, Feuchte, Wind, Druck, UV, Zustand → Icon | `oidTemp`, `oidCondition`, `oidHumidity`, `oidWind`, `oidWindDir`, `oidPressure`, `oidUv`, `oidFeelsLike` |
| **Navigation Button** | Wechselt VIS-View (`context.changeView`) oder öffnet eine URL, Active-State grün | — (kein State, siehe DATEN-Gruppe: `targetType`/`targetView`/`targetUrl`) |
| **Wallbox Card** | Ladeleistung, Status, SoC-Fortschrittsbalken, Session-Energie | `oidPower`, `oidSoc`, `oidEnergy`, `oidStatusText` (optional) |

**Click-Aktionen** (Button): `toggle`, `true`, `false`, `increment` (+1), `decrement` (−1), `custom` (fester Wert aus `customValue`, wird als boolean/number/string erkannt), `none`.

Jedes Widget zeigt, wenn keine Objekt-ID gewählt ist, dezent **„Kein State ausgewählt“** und wenn der State existiert aber (noch) keinen Wert hat **„State nicht verfügbar“** — es stürzt nie ab (siehe `src-widgets/src/common/Unavailable.tsx`, `BaseWidget.ts`).

## Design-System / Theme anpassen

Alle Widgets lesen ausschließlich CSS-Variablen (`src-widgets/src/theme/theme.css`). Jede Variable hat **zwei Fallback-Ebenen**:

```css
--mw-t-card-bg: var(--card-bg, var(--mw-card-bg));
```

1. Definiert dein **bestehendes Dashboard** bereits `--card-bg` (o. ä.) global, übernehmen die Widgets automatisch exakt diese Farbe — echte, nahtlose Integration ohne jede Konfiguration.
2. Andernfalls greift der in `theme.css` hinterlegte Standard (identisch mit der Referenzpalette aus der Aufgabenstellung: `#2d2d2d` / `#373737` / `#50d890` / `#ff9d3f` / `#58c7d8` / `#5b8fc9` / `#ff5c5c`, Radius `20px`, Schatten `0 8px 24px rgba(0,0,0,.28)`).

Um das komplette Theme zu ändern, genügt es, **eine Datei** (`theme.css`) anzupassen — kein Widget referenziert Farben/Radien direkt. Aktuell ist ausschließlich das Dark-Theme implementiert (Anforderung 31); ein zweites Theme würde als weitere `:root[data-theme="..."]`-Variante in derselben Datei ergänzt.

## State-IDs & Datentypen

- **boolean**: Toggle, Button (`toggle`/`true`/`false`), Wallbox-Status
- **number**: Value/Energy/Battery/Weather/Wallbox-Cards, Slider (`min`/`max`/`step`/`decimals` je Feld konfigurierbar)
- **string**: Titel/Untertitel/Location sind freie Textfelder (keine Objekt-ID); `oidStatusText`/`oidCondition` lesen optional einen State vom Typ string

Zahlenformatierung ist über **ANZEIGE**-Felder konfigurierbar (`decimals`, `prefix`, `suffix`, `unit`) und verwendet standardmäßig deutsches Format (Komma als Dezimaltrennzeichen, Punkt als Tausendertrennzeichen — `14,11 kWh`, `21,4 °C`, `92 %`), siehe `src-widgets/src/common/format.ts`.

## Eigene Widgets hinzufügen

Neue Widgets kosten drei Schritte, ohne bestehende anzufassen:

1. `src-widgets/src/widgets/MeinWidget.tsx` + `MeinWidget.css` anlegen (`MyWallboxCard.tsx` als Vorlage nehmen — kompaktestes vollständiges Beispiel).
2. In `src-widgets/vite.config.ts` einen weiteren `exposes`-Eintrag ergänzen: `'./MeinWidget': './src/widgets/MeinWidget'`.
3. In `io-package.json` unter `common.visWidgets.mywidgets.components` den Klassennamen ergänzen.

`test/widgetRegistration.test.ts` prüft automatisch, dass `io-package.json` und die tatsächlich vorhandenen Widget-Dateien übereinstimmen und jede `id` eindeutig ist — ein vergessener Eintrag fällt beim nächsten `npm test` sofort auf.

Beispiel „Wallbox“ aus der Aufgabenstellung ist bereits vollständig umgesetzt (`MyWallboxCard.tsx`) und dient als Referenz für z. B. eine künftige Thermostat-, Shutter- oder Chart-Card.

## Tests

```bash
npm test
```

Läuft mit dem eingebauten Node-Test-Runner (`node:test`, via `tsx`) — keine zusätzliche Test-Runner-Abhängigkeit nötig. Abgedeckt:

- **Formatierung** (`test/format.test.ts`): deutsches Zahlenformat, Vorzeichen, Präfix/Suffix, ungültige/fehlende Werte, Zeit-Formatierung.
- **State-Lesen** (`test/stateValue.test.ts`): fehlende Objekt-ID, nicht vorhandener/leerer State, boolean-/number-Koerzierung, Zeitstempel.
- **Admin-Editor-Felder** (`test/attrFields.test.ts`): die gemeinsamen Feldgruppen-Helfer.
- **Widget-Registrierung** (`test/widgetRegistration.test.ts`): `io-package.json` ↔ tatsächliche Widget-Dateien, eindeutige IDs, jedes Widget implementiert `getWidgetInfo()` (statisch + Instanz) und behandelt einen fehlenden/ungültigen State über `<Unavailable />`.

**Warum keine Tests, die die `.tsx`-Widgets direkt importieren/rendern:** Die Widget-Dateien importieren ihr jeweiliges `.css` (von Vite zur Build-Zeit aufgelöst) und erwarten zur Modul-Ladezeit ein reales `window.visRxWidget` — das vollständig zu mocken (inkl. React-Rendering ohne `jsdom`, das in dieser Sandbox nicht aus der npm-Registry installierbar war) hätte mehr Schein- als Testwert gehabt. Die Struktur-Tests oben prüfen stattdessen genau die Stellen, an denen ein Widget "im VIS-Editor nicht erscheint" typischerweise tatsächlich bricht (Tippfehler in `id`/`visSet`, vergessene Registrierung, fehlende Fehlerbehandlung).

## Bekannte Einschränkungen dieser Auslieferung

Für volle Transparenz, statt es zu verschweigen:

- **Kein `npm install` gegen die echte npm-Registry ausgeführt** (die Cloud-Sandbox, in der dieses Projekt entstand, hat keinen Netzwerkzugriff auf `registry.npmjs.org`). Alle Paketversionen in den beiden `package.json` sind bewusst konservativ an den tatsächlich recherchierten, echten Versionen des offiziellen `ioBroker.vis-2-widgets-react-template` ausgerichtet (via `jsdelivr`/GitHub abgerufen), aber **bitte nach dem Klonen einmal `npm run build` laufen lassen** und mir eventuelle Fehlermeldungen zurückmelden.
- **Kein Live-Test gegen eine echte vis-2-Instanz.** Die komplette API-Nutzung (`RxWidget`, `context.setValue`, `context.changeView`, `context.activeView`, Feldtypen wie `id`/`select-views`/`color`/`slider`) wurde aus den **echten, öffentlich publizierten** `@iobroker/types-vis-2`-Typdefinitionen rekonstruiert (nicht geraten) und der komplette Quellcode lokal fehlerfrei mit `tsc --noEmit` gegen diese rekonstruierten Typen geprüft — ein Rendering-Test im Browser gegen eine echte Instanz steht aber noch aus.
- **Mini-Charts** (Energy/Battery Card) sammeln aktuell Werte **client-seitig zur Laufzeit** (Ringpuffer, `common/MiniChart.ts` → `LiveSampler`), zeigen also den Verlauf *seit Öffnen des Dashboards*, nicht zwingend den vollen Tag 00:00–24:00 wie im Referenzbild. Ein Anschluss an echte ioBroker-Historie (`socket.getHistory(...)`, benötigt einen History-/SQL-/InfluxDB-Adapter) ist als sauberer Erweiterungspunkt vorgesehen, wurde aber bewusst nicht "geraten" eingebaut, da die exakte Aufruf-Signatur nicht mit derselben Sicherheit verifiziert werden konnte wie die übrige API.
- **Übersetzungen**: `de` und `en` sind vollständig von Hand übersetzt; die übrigen von vis-2 unterstützten UI-Sprachen fallen auf den englischen Text zurück (in `src-widgets/src/translations.ts` klar kommentiert) statt eine unsichere Automatik-Übersetzung vorzutäuschen.
- Kein Referenzbild lag dieser Konversation tatsächlich bei (trotz Ankündigung) — als verbindliche Designreferenz wurden die im Auftrag selbst angegebenen CSS-Variablen/Farbwerte sowie die ASCII-Mockups der einzelnen Widgets verwendet. Bitte das Bild nachreichen, falls die Optik noch nachjustiert werden soll.

## Lizenz

MIT, siehe [LICENSE](LICENSE).

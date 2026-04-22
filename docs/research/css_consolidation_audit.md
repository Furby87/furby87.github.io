# Research: CSS Consolidation Audit (Final Report)

**Date**: 2026-04-20
**Scope**: Site-wide CSS refactoring planning (Non-destructive)

## Executive Summary
Die Dokumentations-Suite leidet unter massiver CSS-Redundanz. Mehrere tausend Zeilen CSS sind über die HTML-Dateien verstreut, was Ladezeiten, Wartbarkeit und Design-Konsistenz negativ beeinflusst.

---

## 1. Top Offenders (Interne Style-Blocks)
Diese Dateien beinhalten die größten Mengen an redundantem Code:

| Datei | Ca. CSS Zeilen | Haupt-Komponenten |
|-------|----------------|-------------------|
| `ttuserinfobot.html` | 740+ | Stats-Cards, Feature-Cards, Telegram-Mockups |
| `dantebot.html` | 580+ | Category-Cards, Command-Accordions, Credits |
| `ttuserinfobotdoku.html`| 40+ | TOC-Grid, spezialisierte TOC-Cards |
| `tikleapcrawler_data.html`| 20+ | Data-Img Hover, Highlight-Modale |

---

## 2. Redundanz-Muster (Potenzial für subpages.css)
Folgende Muster wiederholen sich in fast allen Dateien und sollten zentralisiert werden:

- **Basis-Strukturen**: `container`, `glass`, `section`, `hero`
- **Typografie**: `.glitch-title`, `.text-gradient`, `.hero-subtitle-muted`
- **Animationen**: `@keyframes gradient`, `@keyframes pulse`, `@keyframes slideDown`
- **Utilities**: `.scroll-progress`, `.back-button`, `.highlight`

---

## 3. Risiken & Abhängigkeiten
- **Themen-Farben**: Die Bots nutzen unterschiedliche Primärfarben (TikTok: Pink, Dante: Cyan).
  - *Lösung*: Nutzung von CSS-Variablen (`--primary`, `--secondary`) in der `subpages.css`, die pro Seite im `<style>` Block überschrieben werden.
- **Spezifität**: Viele interne Styles sind mit `!important` oder sehr spezifischen Selektoren versehen. Ein Umzug könnte Kaskaden-Effekte haben.
- **Sicherheit**: Änderungen am CSS von `script.js` gesteuerten Elementen (z.B. Toasts) dürfen deren Sichtbarkeit nicht beeinflussen.

---

## 4. Empfohlene Refactoring-Roadmap (Künftige Updates)
1.  **Phase A (Theming)**: Definition globaler Variablen in `style.css`.
2.  **Phase B (Extraction)**: Schrittweise Verschiebung der generischen Klassen in `subpages.css`.
3.  **Phase C (Cleanup)**: Entfernen des internen CSS nach Validierung der optischen Parität.

> [!NOTE]
> Dieser Report dient rein als Planungsgrundlage. Gemäß Anweisung wurden **keine** Dateiänderungen am HTML, JS oder CSS vorgenommen.

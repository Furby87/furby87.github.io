# Research: Performance & SEO Audit

**Date**: 2026-04-18
**Context**: Optimization of the TikLeap Documentation Suite

## 1. Preloader Refactoring
Initialer Zustand: Ein fester Timeout von 400ms.
Problem: Bei langsamen Verbindungen wurde die unfertige Seite (FOUC - Flash of Unstyled Content) angezeigt.

### Neue Logik:
- Start: Preloader wird sofort via CSS eingeblendet.
- Trigger: `window.addEventListener('load', ...)` sorgt dafür, dass alle Assets (Bilder, Fonts) geladen sein müssen.
- Safety-Fallback: Ein `setTimeout` von 3 Sekunden beendet den Preloader zwangsweise, falls ein Asset (z.B. ein externes Skript) blockiert.

## 2. SEO - Canonical Tags
Problem: Duplicate Content Gefahr durch Erreichbarkeit der Seiten mit/ohne `.html` Endung oder via verschiedene Repositories.

### Lösung:
Jede der 11 Seiten erhielt ein `<link rel="canonical">` Tag.
- Beispiel: `<link rel="canonical" href="https://furby87.github.io/tikleapcrawler.html">`
- Effekt: Suchmaschinen wissen genau, welche URL die "Quelle der Wahrheit" ist.

## 3. Asset-Loading (Lazy Loading)
Optimierung des Critical Rendering Paths durch natives `loading="lazy"` für alle Bilder unterhalb des "Above the fold" Bereichs.

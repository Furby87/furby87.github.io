# Research: VLC & RTMP Diagnostics

**Date**: 2026-04-17
**Context**: Support for TikTok Live Streaming via VLC

## Problemstellung

User haben oft Schwierigkeiten zu unterscheiden, ob ein Verbindungsproblem am Bot, am TikTok-Server oder an ihrer lokalen VLC-Konfiguration liegt.

## Lösung: Diagnostischer Test-Stream

Integration einer bekannten, stabilen HLS-Test-URL, die 24/7 online ist.

### Test-URL

`https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8` (HLS by Mux)

### Workflow für User

1. URL kopieren.
2. In VLC unter "Netzwerkstream öffnen" testen.
3. **Ergebnis**: Wenn dieser Stream läuft, ist VLC korrekt installiert. Schlägt dann ein TikTok RTMP-Link fehl, liegt es an der Quelle (Bot/Server), nicht an der Software.

## Technische Notiz zu RTMP

Manche modernen VLC-Versionen (speziell iOS/Android) benötigen manchmal alternative Apps, falls das RTMP-Protokoll (veraltet) nicht nativ greift. Empfehlung: "VLC for Mobile" oder spezialisierte RTMP-Player.

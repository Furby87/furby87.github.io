// config.js - Statische Konfiguration für das Frontend
// Bearbeite diese Datei, um Telegram-Namen, Links oder Github-Handles überall auf der Seite zu ändern.

const SITE_CONFIG = {
    // Telegram
    telegramHandle: "Furby1337",
    telegramLink: "https://t.me/Furby1337",
    
    // GitHub
    githubHandle: "Furby87",
    githubLink: "https://github.com/Furby87"
};

document.addEventListener("DOMContentLoaded", () => {
    // Telegram Texte ersetzen
    document.querySelectorAll('.config-telegram-handle').forEach(el => {
        el.textContent = '@' + SITE_CONFIG.telegramHandle;
    });
    
    // Telegram Links ersetzen
    document.querySelectorAll('.config-telegram-link').forEach(el => {
        el.href = SITE_CONFIG.telegramLink;
    });

    // GitHub Texte ersetzen
    document.querySelectorAll('.config-github-handle').forEach(el => {
        el.textContent = '@' + SITE_CONFIG.githubHandle;
    });

    // GitHub Links ersetzen
    document.querySelectorAll('.config-github-link').forEach(el => {
        el.href = SITE_CONFIG.githubLink;
    });
});

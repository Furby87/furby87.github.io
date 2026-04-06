// components.js - Zentrale Injektion von wiederkehrenden HTML Elementen

document.addEventListener("DOMContentLoaded", () => {
    const footerContainer = document.getElementById("global-footer");
    if (!footerContainer) return;

    const type = footerContainer.getAttribute("data-type") || "default";
    const currentYear = new Date().getFullYear();

    // Wir lesen die Daten direkt aus der config.js, falls vorhanden.
    const tgLink = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG.telegramLink : "https://t.me/Furby1337";
    const tgHandle = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG.telegramHandle : "Furby1337";
    const ghHandle = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG.githubHandle : "Furby87";

    if (type === "tiktok") {
        footerContainer.innerHTML = `
        <footer>
            <div class="credits">
                <p>© <span class="current-year">${currentYear}</span> TikTok Info Bot</p>
                <p>Ein Projekt von <a href="${tgLink}" class="credit-link" style="color: #fe2c55; text-decoration: none; font-weight: bold;">@${tgHandle}</a></p>
            </div>
            <p class="disclaimer" style="margin-top: 10px; font-size: 0.9em; opacity: 0.8;">Dieser Bot ist ein inoffizielles Tool und steht in keiner Verbindung zu TikTok.</p>
        </footer>
        `;
    } else if (type === "dante") {
        footerContainer.innerHTML = `
        <footer>
            <p>© <span class="current-year">${currentYear}</span> @${ghHandle} - Alle Rechte vorbehalten</p>
        </footer>
        `;
    } else if (type === "main") {
        footerContainer.innerHTML = `
        <footer class="glass" style="margin-top: 100px;">
            <p>&copy; <span class="current-year">${currentYear}</span> @${ghHandle}. Built with 💜 using Glassmorphism.</p>
        </footer>
        `;
    }
});

// Globale Utility Funktion: Text in Zwischenablage kopieren mit visuellem UX Feedback
window.copyToClipboard = function(text, buttonElement) {
    navigator.clipboard.writeText(text).then(() => {
        if(buttonElement) {
            const originalText = buttonElement.innerText;
            // Visuelles Feedback
            buttonElement.innerText = "✅ Kopiert!";
            buttonElement.style.color = "#4ade80"; 
            buttonElement.style.borderColor = "#4ade80";
            
            // Revert after 2 seconds
            setTimeout(() => {
                buttonElement.innerText = originalText;
                buttonElement.style.color = "";
                buttonElement.style.borderColor = "";
            }, 2000);
        }
    }).catch(err => {
        console.error('Kopieren fehlgeschlagen:', err);
    });
};

// Globaler Scroll Progress Bar Listener (greift auf allen Seiten mit .scroll-progress Div)
document.addEventListener("DOMContentLoaded", () => {
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            
            if(height > 0) {
                const scrolled = (winScroll / height) * 100;
                progressBar.style.width = scrolled + '%';
            } else {
                progressBar.style.width = '100%';
            }
        }, { passive: true });
    }
});

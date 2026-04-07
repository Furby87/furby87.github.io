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
    } else if (type === "tikleap") {
        footerContainer.innerHTML = `
        <footer class="glass" style="margin-top: 60px; text-align: center; padding: 30px 20px;">
            <p style="margin: 0; font-weight: 600;">&copy; <span class="current-year">${currentYear}</span> TikLeap Crawler Pro</p>
            <p style="margin: 8px 0 0; font-size: 0.9em; opacity: 0.7;">Developed by <a href="${tgLink}" style="color: #22d3ee; text-decoration: none; font-weight: 600;">@${ghHandle}</a></p>
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

// UI Refactoring: Globale AOS Animation, Back-to-Top Button und Smooth Scroll
document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialisiere AOS (Fade-Ins) global on load
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 1000, once: true });
    }

    // 2. Back to top visibility & click logic
    function initBackToTop() {
        let btt = document.querySelector('.back-to-top');
        if (!btt) {
            btt = document.createElement('a');
            btt.href = '#';
            btt.className = 'back-to-top';
            btt.innerHTML = '↑';
            document.body.appendChild(btt);
        }

        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            btt.style.display = winScroll > 300 ? "flex" : "none";
        }, { passive: true });

        btt.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    initBackToTop();

    // 3. Documentation Order & Navigation Flow
    function initDocNavigation() {
        const pages = [
            { url: 'tikleapcrawler.html', title: 'Dokumentation Hub' },
            { url: 'tikleapcrawler_wizard.html', title: 'Setup Wizard' },
            { url: 'tikleapcrawler_stats.html', title: 'Statistiken & Charts' },
            { url: 'tikleapcrawler_data.html', title: 'Daten & Export' },
            { url: 'tikleapcrawler_groups.html', title: 'Gruppen & Teams' },
            { url: 'tikleapcrawler_proxies.html', title: 'Proxy Management' },
            { url: 'tikleapcrawler_config.html', title: 'Konfiguration' },
            { url: 'tikleapcrawler_cli.html', title: 'CLI Modus' },
            { url: 'tikleapcrawler_changelog.html', title: 'Changelog' }
        ];

        // Verbessertes Path-Matching für lokale Dateien und Web-Server
        const currentPath = window.location.pathname.toLowerCase();
        const currentIndex = pages.findIndex(p => currentPath.endsWith(p.url.toLowerCase()));

        if (currentIndex !== -1 && currentIndex < pages.length - 1) {
            const next = pages[currentIndex + 1];
            
            // Container suchen oder erstellen
            let navContainer = document.getElementById('doc-nav');
            const footer = document.getElementById('global-footer');
            
            if (!navContainer && footer) {
                navContainer = document.createElement('div');
                navContainer.id = 'doc-nav';
                navContainer.className = 'container';
                footer.parentNode.insertBefore(navContainer, footer);
            }

            if (navContainer) {
                navContainer.innerHTML = `
                    <div class="doc-navigation glass" style="display: flex; justify-content: space-between; align-items: center; padding: 25px; margin-top: 40px; border-radius: 16px;">
                        <div class="nav-info">
                            <span style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.6; display: block; margin-bottom: 5px;">Nächstes Kapitel</span>
                            <h4 style="margin: 0; font-size: 1.2rem;">${next.title}</h4>
                        </div>
                        <a href="${next.url}" class="nav-btn next">Weiter <i class="fas fa-arrow-right"></i></a>
                    </div>
                `;
            }
        }
    }
    initDocNavigation();

    // 4. Smooth scroll functionality for intra-page anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        const href = anchor.getAttribute('href');
        if(href !== '#' && !anchor.classList.contains('back-to-top')) {
            anchor.addEventListener('click', function (e) {
                const target = document.querySelector(this.getAttribute('href'));
                if(target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    });
});

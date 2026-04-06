// Category Mapping Rules (Keywords in name or description)
const CATEGORIES = {
    bots: ['bot', 'recorder', 'live', 'sysbot', 'transcriber', 'FurbyBot'],
    tools: ['switcher', 'plugin', 'stats', 'scripts', 'tracker', 'API'],
    gaming: ['pokemon', 'arma', 'steam', 'connect4', 'bitburner', 'ts-fmod']
};

// Static projects from existing furby87.github.io for guaranteed display & links
const STATIC_PROJECTS = [
    {
        name: 'TikTok User Info Bot',
        description: 'Telegram Bot für TikTok User-Abfragen und Metadaten Tracker.',
        language: 'Python',
        stargazers_count: 5,
        html_url: 'https://github.com/Furby87/TT_USER_INFO_TG_BOT',
        demo_url: 'https://t.me/TikTokAbfrageBot',
        info_url: 'ttuserinfobot.html',
        category: 'bots',
        status: 'active'
    },
    {
        name: 'Dante Meltdown Bot',
        description: 'Telegram Audio & Music Player Bot für Meltdowns trigger.',
        language: 'Python',
        stargazers_count: 3,
        html_url: 'https://github.com/Furby87/AudioBot',
        demo_url: 'https://t.me/DanteMeltdownBot',
        info_url: 'dantebot.html',
        category: 'bots',
        status: 'maintenance'
    }
];

let allProjects = []; // Store combined projects listing

// Classify Project Category
function classifyProject(repo) {
    if (repo.fork) return 'forks';
    const name = repo.name.toLowerCase();
    const desc = (repo.description || '').toLowerCase();

    for (const [cat, keywords] of Object.entries(CATEGORIES)) {
        if (keywords.some(k => name.includes(k.toLowerCase()) || desc.includes(k.toLowerCase()))) {
            return cat;
        }
    }
    return 'tools'; // Default fallback
}

// Fetch GitHub Repositories
async function fetchRepos() {
    const username = 'Furby87';
    const container = document.getElementById('projects-container');

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        const repos = await response.json();

        container.innerHTML = '';

        if (repos.message === 'Not Found') {
            container.innerHTML = `<div class="project-card glass"><p>User not found.</p></div>`;
            return;
        }

        // Filter and categorize dynamic repos
        const dynamicProjects = repos
            .filter(repo => repo.name !== username && !STATIC_PROJECTS.some(s => s.html_url.includes(repo.name)))
            .map(repo => {
                const category = classifyProject(repo);
                return {
                    name: repo.name,
                    description: repo.description,
                    language: repo.language,
                    stargazers_count: repo.stargazers_count,
                    html_url: repo.html_url,
                    topics: repo.topics || [],
                    category: category
                };
            });

        // Combine with STATIC projects
        allProjects = [...STATIC_PROJECTS, ...dynamicProjects];

        renderProjects(allProjects);
        if (typeof updateFilterCounts === 'function') updateFilterCounts();

    } catch (error) {
        console.error('Error fetching repos:', error);
        container.innerHTML = `<div class="project-card glass"><p>Error loading projects. <a href="https://github.com/Furby87" target="_blank" style="color:var(--secondary)">View on GitHub</a></p></div>`;
    }
}

// Render Projects to DOM
function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    container.innerHTML = ''; // Clear

    if (projects.length === 0) {
        container.innerHTML = `<div class="project-card glass" style="grid-column: 1 / -1; text-align: center;"><p>No projects found in this category.</p></div>`;
        return;
    }

    projects.forEach(repo => {
        const card = document.createElement('div');
        card.className = 'project-card glass reveal active';
        card.setAttribute('data-category', repo.category);

        const description = repo.description ? repo.description : 'No description provided.';
        const language = repo.language ? repo.language : 'Code';
        let status = repo.status || 'active'; // Fallback
        if (['scripts', 'arma3scripts'].includes(repo.name.toLowerCase())) {
            status = 'offline';
        }
        if (repo.name.toLowerCase() === 'steamaccountswitcherold') {
            status = 'outdated';
        }

        // Render topics if available
        const topicsHtml = (repo.topics || []).map(topic => `<span class="topic-tag">${topic}</span>`).join('');

        // Custom links structure
        const demoLink = repo.demo_url ? `<a href="${repo.demo_url}" target="_blank" style="color:var(--secondary); text-decoration:none;"><i class="fas fa-play"></i> Live</a>` : '';
        const infoLink = repo.info_url ? `<a href="${repo.info_url}" style="color:var(--secondary); text-decoration:none;"><i class="fas fa-circle-info"></i> Info</a>` : '';

        const statusHtml = `<div class="project-status ${status}"><span></span>${
            status === 'active' ? 'Aktiv' : 
            status === 'maintenance' ? 'Wartung' : 
            status === 'outdated' ? 'Outdated' : 'Offline'
        }</div>`;

        card.innerHTML = `
            ${statusHtml}
            <div>
                <h3>${repo.name}</h3>
                <p>${description}</p>
                <div class="topics-container">${topicsHtml}</div>
            </div>
            <div class="project-meta">
                <span class="lang-tag">${language}</span>
                <div style="display: flex; gap: 12px; align-items: center; font-size: 0.85rem;">
                    ${demoLink}
                    ${infoLink}
                    <a href="${repo.html_url}" target="_blank" style="color: #fff; text-decoration: none; font-weight: 600;">
                         <i class="fab fa-github"></i> Code
                    </a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    initReveal();
}

// Reveal Animation on Scroll
function initReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.05
    });

    reveals.forEach(reveal => {
        observer.observe(reveal);
    });
}

// Smooth Scroll for Nav Links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Run on Load
document.addEventListener('DOMContentLoaded', () => {
    fetchRepos();
    initReveal();

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu on link click
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Global Stats Counters
    window.updateFilterCounts = function () {
        const buttons = document.querySelectorAll('.filter-btn');
        const counts = { all: allProjects.length };

        allProjects.forEach(p => {
            if (p.category) counts[p.category] = (counts[p.category] || 0) + 1;
        });

        buttons.forEach(btn => {
            const cat = btn.getAttribute('data-filter');
            const baseText = btn.textContent.split(' (')[0].trim();
            if (cat === 'all') {
                btn.innerHTML = `${baseText} <span style="font-size:0.8em; opacity:0.6">(${counts.all})</span>`;
            } else {
                const count = counts[cat] || 0;
                btn.innerHTML = `${baseText} <span style="font-size:0.8em; opacity:0.6">(${count})</span>`;
            }
        });
    };

    // Combined Filter & Search
    window.filterAndSearch = function () {
        const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
        const query = document.getElementById('projectSearch')?.value.toLowerCase() || '';

        const filtered = allProjects.filter(p => {
            const matchesCat = activeFilter === 'all' || p.category === activeFilter;
            const matchesQuery = p.name.toLowerCase().includes(query) || (p.description || '').toLowerCase().includes(query);
            return matchesCat && matchesQuery;
        });

        renderProjects(filtered);
    };

    document.getElementById('projectSearch')?.addEventListener('input', filterAndSearch);

    // Add Filter Listeners
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            filterAndSearch();
        });
    });

    // 1. Preloader Fade-out
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
        }, 400); // 400ms grace period for load
    }

    // 2. Typewriter Effect
    const words = ["Full-Stack Developer", "Telegram Bot Creator", "Automation Expert", "IoT Enthusiast", "Pentest Lover", "Nerd & Open-source Enthusiast", "always looking for new things to break and build."];
    let wordIndex = 0;
    let charIndex = 0;
    const speed = 100;
    const delayBetween = 2000;
    const typewriterElement = document.getElementById('typewriter');

    function typeLine() {
        if (!typewriterElement) return;
        if (charIndex < words[wordIndex].length) {
            typewriterElement.innerHTML += words[wordIndex].charAt(charIndex);
            charIndex++;
            setTimeout(typeLine, speed);
        } else {
            setTimeout(deleteLine, delayBetween);
        }
    }

    function deleteLine() {
        if (!typewriterElement) return;
        if (charIndex > 0) {
            typewriterElement.innerHTML = words[wordIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(deleteLine, speed / 2); // Faster deletion
        } else {
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(typeLine, speed);
        }
    }

    if (typewriterElement) {
        setTimeout(typeLine, 800); // Trigger during preloader fade
    }
});

// Scroll Listeners
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    const progress = document.querySelector('.scroll-progress');
    if (progress) progress.style.width = scrolled + "%";

    const btt = document.querySelector('.back-to-top');
    if (btt) {
        btt.style.display = winScroll > 300 ? "flex" : "none";
    }
});

// ==========================================
// 🌌 1. Vanilla Particle Mesh Background
// ==========================================
(function() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };

    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    
    // Global mousemove tracking for document
    window.addEventListener('mousemove', (e) => { 
        mouse.x = e.clientX; 
        mouse.y = e.clientY; 
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.7;
            this.vy = (Math.random() - 0.5) * 0.7;
            this.size = Math.random() * 1.5 + 1;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            
            // Mouse push/pull kinetic
            let dx = mouse.x - this.x; let dy = mouse.y - this.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < mouse.radius && mouse.x !== null) {
                this.x -= dx * 0.005; this.y -= dy * 0.005; 
            }
        }
        draw() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2); ctx.fill();
        }
    }

    for (let i = 0; i < 55; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 110) {
                    ctx.strokeStyle = `rgba(34, 211, 238, ${0.06 * (1 - dist/110)})`; // theme cyan glow
                    ctx.lineWidth = 0.8;
                    ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
})();

// ==========================================
// 🕵️‍♂️ 2. Cyberpunk Glitch Text Effect
// ==========================================
(function() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$@&%#!";
    document.querySelectorAll('.glitch-title').forEach(title => {
        title.addEventListener('mouseover', event => {
            let iterations = 0;
            const target = event.currentTarget; // safer than target on spans
            const targetText = target.getAttribute('data-value') || target.innerText;
            clearInterval(target.glitchInterval);
            
            target.glitchInterval = setInterval(() => {
                target.innerText = targetText.split("")
                    .map((letter, index) => {
                        if (index < iterations) return targetText[index];
                        return letters[Math.floor(Math.random() * letters.length)];
                    })
                    .join("");
                    
                if (iterations >= targetText.length) clearInterval(target.glitchInterval);
                iterations += 1 / 2; // speed
            }, 40);
        });
    });
})();

// ==========================================
// 📅 3. Dynamic Copyright Year Footer
// ==========================================
(function() {
    document.querySelectorAll('.current-year').forEach(el => {
        el.innerText = new Date().getFullYear();
    });
})();

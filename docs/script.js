// Category Mapping Rules (Keywords in name or description)
const CATEGORIES = {
    bots: ['bot', 'recorder', 'live', 'sysbot', 'transcriber', 'FurbyBot'],
    tools: ['switcher', 'plugin', 'stats', 'scripts', 'tracker', 'API'],
    gaming: ['pokemon', 'arma', 'steam', 'connect4', 'bitburner', 'ts-fmod']
};

let allProjects = []; // Store fetched projects globally for filtering

// Classify Project Category
function classifyProject(repo) {
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
        // Fetch up to 100 to get a richer set
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        const repos = await response.json();

        container.innerHTML = '';

        if (repos.message === 'Not Found') {
            container.innerHTML = `<div class="project-card glass"><p>User not found.</p></div>`;
            return;
        }

        // Filter out forks and the profile readme itself
        allProjects = repos
            .filter(repo => !repo.fork && repo.name !== username)
            .map(repo => {
                return {
                    ...repo,
                    category: classifyProject(repo)
                };
            });

        renderProjects(allProjects);

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
        // Add category as data attribute for future styling/debugging
        card.className = 'project-card glass reveal active';
        card.setAttribute('data-category', repo.category);
        
        const description = repo.description ? repo.description : 'No description provided.';
        const language = repo.language ? repo.language : 'Code';

        const topicsHtml = (repo.topics || []).map(topic => `<span class="topic-tag">${topic}</span>`).join('');

        card.innerHTML = `
            <div>
                <h3>${repo.name}</h3>
                <p>${description}</p>
                <div class="topics-container">${topicsHtml}</div>
            </div>
            <div class="project-meta">
                <span class="lang-tag">${language}</span>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <span><i class="fas fa-star" style="color:#ffd700; font-size:0.85rem;"></i> ${repo.stargazers_count}</span>
                    <a href="${repo.html_url}" target="_blank" style="color: var(--secondary); text-decoration: none; font-weight: 600;">
                        Code <i class="fas fa-external-link-alt" style="font-size: 0.8rem;"></i>
                    </a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    // Re-run reveal animations for newly added elements
    initReveal();
}

// Filter logic is handled via event listeners in DOMContentLoaded

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
    anchor.addEventListener('click', function(e) {
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

    // Add Filter Listeners
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.target.getAttribute('data-filter');
            
            // Update Active State
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            if (category === 'all') {
                renderProjects(allProjects);
            } else {
                const filtered = allProjects.filter(p => p.category === category);
                renderProjects(filtered);
            }
        });
    });
});

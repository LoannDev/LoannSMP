const WEBHOOK = "https://discord.com/api/webhooks/1450554538179170365/LV0yfmk3OL_4pskyVdsx-CwhsOKW4YOpxLfBHOp-OHuwDRj461qnbAxDWxlyBJ0NK4Xz";
let SERVER_IP = ""; // Chargé via config.json

// --- 1. TILT 3D ---
const tilt = document.getElementById('tilt');
const glare = document.getElementById('glare');
document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const rx = (cy - y) / 50;
    const ry = (x - cx) / 50;
    if (tilt) {
        tilt.classList.add('active');
        requestAnimationFrame(() => {
            tilt.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
            const rect = tilt.getBoundingClientRect();
            glare.style.setProperty('--x', `${x - rect.left}px`);
            glare.style.setProperty('--y', `${y - rect.top}px`);
        });
    }
});

document.addEventListener('mouseleave', () => {
    if (tilt) {
        tilt.classList.remove('active');
        tilt.style.transform = `rotateX(0deg) rotateY(0deg)`;
    }
});

// --- 2. ANIMATION TITRE ---
const str = "LOANNSMP";
const box = document.getElementById('animatedTitle');
if (box) {
    str.split('').forEach((c, i) => {
        const s = document.createElement('span');
        s.textContent = c;
        s.className = i >= 5 ? 'char orange' : 'char';
        // Delay sequential et animation plus dynamique
        s.style.animationDelay = `${0.5 + (i * 0.1)}s`;
        box.appendChild(s);
    });
}

// --- 3. TOAST SYSTEM ---
function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('active'), 10);
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// --- 4. DYNAMIC PARTICLES ---
function initParticles() {
    const container = document.getElementById('bg-particles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 4 + 2;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
        p.style.opacity = Math.random() * 0.5;
        container.appendChild(p);
    }
}

// Add animation to CSS via JS
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% { transform: translateY(0) rotate(0deg); opacity: 0; }
        20% { opacity: 0.5; }
        80% { opacity: 0.5; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }
`;
document.head.appendChild(style);

// --- 5. ENTRANCE ---
window.addEventListener('load', () => {
    initParticles();
    // On pourrait ajouter d'autres inits ici si besoin
});

// --- 6. KEYBOARD SHORTCUTS ---
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.overlay.active');
        if (activeModal) toggleM(activeModal.id, false);
    }
});

// --- 7. BACK TO TOP VISIBILITY ---
window.addEventListener('scroll', () => {
    const btn = document.getElementById('backToTop');
    if (btn) {
        if (window.scrollY > 500) btn.classList.add('active');
        else btn.classList.remove('active');
    }
});

// --- 8. CONFIGURATION DYNAMIQUE ---
async function loadConfig() {
    try {
        const res = await fetch('config.json');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const config = await res.json();
        if (config && config.serverIP) {
            SERVER_IP = config.serverIP;

            // Mise à jour de l'IP affichée et du statut
            const ipEl = document.getElementById('serverIP');
            if (ipEl) ipEl.textContent = SERVER_IP;

            console.log("Config chargée avec succès. IP:", SERVER_IP);
            await updateStatus();
        } else {
            throw new Error("Clé 'serverIP' manquante dans le JSON.");
        }
    } catch (e) {
        console.error("ERREUR CRITIQUE : Impossible de charger config.json.", e);
        const ipEl = document.getElementById('serverIP');
        if (ipEl) {
            ipEl.textContent = "ERREUR CONFIG";
            ipEl.style.color = "#ff4444";
        }
        showToast("⚠️ Impossible de lire config.json (vérifiez le serveur local)");
    }
}
loadConfig();

// --- 9. GESTION TÉLÉCHARGEMENT ---
let selectedUrl = "";
function selectVersion(type) {
    if (type === 'stable') {
        // Unselect others if any
        document.querySelectorAll('.dl-card').forEach(c => c.classList.remove('selected'));
        document.getElementById('optStable').classList.add('selected');

        const btn = document.getElementById('finalDlBtn');
        if (btn) btn.classList.remove('btn-disabled');
        selectedUrl = "https://github.com/LoannDev/LoannSMPLauncher/releases/download/LoannSMP/LauncherB1.exe";
    }
}
function startDownload() {
    if (selectedUrl !== "") {
        showToast("Téléchargement démarré...");
        setTimeout(() => window.location.href = selectedUrl, 500);
    }
}

// --- 10. GESTION MODALES ---
function toggleM(id, show) {
    const el = document.getElementById(id);
    if (!el) return;
    if (show) {
        el.style.display = 'flex';
        setTimeout(() => el.classList.add('active'), 10);
    } else {
        el.classList.remove('active');
        setTimeout(() => el.style.display = 'none', 400);
    }
}

// --- 11. PROGRESSION WHITELIST ---
const why = document.getElementById('wl_why');
const pbar = document.getElementById('pbar');
const pcount = document.getElementById('pcount');
const subWl = document.getElementById('subWl');

if (why) {
    why.addEventListener('input', () => {
        const len = why.value.length;
        const prg = Math.min((len / 100) * 100, 100);
        if (pbar) pbar.style.width = prg + "%";
        if (pcount) pcount.textContent = `${len} / 100`;
        if (len >= 100) {
            if (pbar) pbar.classList.add('valid');
            if (subWl) subWl.disabled = false;
        } else {
            if (pbar) pbar.classList.remove('valid');
            if (subWl) subWl.disabled = true;
        }
    });
}

// --- 12. ENVOI DISCORD ---
// --- 11. CAPTCHA SYSTEM (RETIRED) ---

async function sendToDiscord(payload) {
    return fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
}

const formWl = document.getElementById('formWl');
if (formWl) {
    formWl.onsubmit = async (e) => {
        e.preventDefault();

        if (subWl) subWl.textContent = "ENVOI...";
        const pseudoMc = document.getElementById('wl_mc').value;
        const pseudoDiscord = document.getElementById('wl_discord').value;

        await sendToDiscord({
            embeds: [{
                title: "📋 Nouvelle demande Whitelist",
                color: 0xff7a1a,
                fields: [
                    { name: "Pseudo MC", value: pseudoMc, inline: true },
                    { name: "Discord", value: pseudoDiscord, inline: true },
                    { name: "Motivation", value: why.value }
                ]
            }]
        });
        showToast("✅ Demande de Whitelist envoyée !");
        if (subWl) subWl.textContent = "ENVOYÉ ✓";
        setTimeout(() => {
            toggleM('mWl', false);
            e.target.reset();
            if (pbar) pbar.style.width = "0%";
            if (subWl) subWl.textContent = "ENVOYER LA DEMANDE";
        }, 1500);
    };
}

const formSug = document.getElementById('formSug');
if (formSug) {
    formSug.onsubmit = async (e) => {
        e.preventDefault();

        const btn = e.target.querySelector('button[type="submit"]');
        if (btn) btn.textContent = "ENVOI...";
        await sendToDiscord({
            embeds: [{
                title: "💡 Nouvelle Suggestion",
                color: 0x3b82f6,
                fields: [
                    { name: "Auteur", value: document.getElementById('sug_pseudo').value },
                    { name: "Idée", value: document.getElementById('sug_val').value }
                ]
            }]
        });
        showToast("💡 Merci pour votre suggestion !");
        if (btn) btn.textContent = "MERCI ! ✓";
        setTimeout(() => {
            toggleM('mSug', false);
            e.target.reset();
            if (btn) btn.textContent = "ENVOYER L'IDÉE";
        }, 1500);
    };
}

// --- 13. SERVER STATUS ---
async function updateStatus() {
    const dot = document.getElementById('statusDot');
    const text = document.getElementById('statusText');
    const pText = document.getElementById('playerText');
    const pPill = document.getElementById('pillPlayers');
    if (!dot || !text || !SERVER_IP) return;

    try {
        const res = await fetch(`https://api.mcsrvstat.us/2/${SERVER_IP}?t=${Date.now()}`);
        const data = await res.json();

        if (data.online) {
            dot.classList.add('online');
            text.textContent = "Serveur en ligne";

            if (pPill && pText) {
                const playersOnline = data.players ? data.players.online : 0;
                pText.textContent = `${playersOnline} joueur${playersOnline > 1 ? 's' : ''}`;
                pPill.style.display = 'inline-flex';
            }
        } else {
            dot.classList.remove('online');
            text.textContent = "Serveur hors-ligne";
            if (pPill) pPill.style.display = 'none';
        }
    } catch (e) {
        text.textContent = "Statut indisponible";
        if (pPill) pPill.style.display = 'none';
    }
}
setInterval(updateStatus, 60000);

// --- 14. COPY IP ---
function copyIP() {
    navigator.clipboard.writeText(SERVER_IP);
    showToast("IP Copiée dans le presse-papier !");
    const label = document.querySelector('.ip-banner span');
    if (!label) return;
    const original = label.textContent;
    label.textContent = "COPIÉ !";
    label.style.color = "#4ade80";
    setTimeout(() => {
        label.textContent = original;
        label.style.color = "";
    }, 2000);
}

// --- 15. SCROLL REVEAL ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.05, rootMargin: "0px 0px -50px 0px" });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


// --- 16. OPTIONS SPOTLIGHT ---
document.querySelectorAll('.dl-card').forEach(opt => {
    opt.addEventListener('mousemove', (e) => {
        const rect = opt.getBoundingClientRect();
        opt.style.setProperty('--x', `${e.clientX - rect.left}px`);
        opt.style.setProperty('--y', `${e.clientY - rect.top}px`);
    });
});
// Initialisation
window.addEventListener('load', () => {
    initParticles();
});

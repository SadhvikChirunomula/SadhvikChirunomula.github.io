/* ==========================================================================
   SADHVIK CHIRUNOMULA — Website Interactive Engine
   Particles · Ecosystem Map · Architecture Canvas · Terminal · Theme Toggle
   ========================================================================== */

(function () {
    'use strict';

    // ===================== THEME TOGGLE =====================
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;

    // Check saved preference or system preference
    function getPreferredTheme() {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function setTheme(theme) {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    setTheme(getPreferredTheme());

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = root.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    // ===================== CURSOR GLOW =====================
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorGlow.style.left = mouseX + 'px';
        cursorGlow.style.top = mouseY + 'px';
    });

    // ===================== SCROLL PROGRESS =====================
    const scrollProgress = document.getElementById('scrollProgress');
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    }

    // ===================== NAVBAR =====================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    function updateNavbar() {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // ===================== HERO PARTICLE CANVAS =====================
    const heroCanvas = document.getElementById('heroCanvas');
    const ctx = heroCanvas.getContext('2d');
    let particles = [];
    let canvasW, canvasH;

    function resizeHeroCanvas() {
        const hero = document.getElementById('hero');
        canvasW = heroCanvas.width = hero.offsetWidth;
        canvasH = heroCanvas.height = hero.offsetHeight;
    }

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvasW;
            this.y = Math.random() * canvasH;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 1.8 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.15;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            const dx = this.x - mouseX;
            const dy = this.y - (mouseY + window.scrollY);
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const force = (150 - dist) / 150;
                this.vx += dx / dist * force * 0.02;
                this.vy += dy / dist * force * 0.02;
            }
            this.vx *= 0.998;
            this.vy *= 0.998;
            if (this.x < 0 || this.x > canvasW) this.vx *= -1;
            if (this.y < 0 || this.y > canvasH) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(Math.floor((canvasW * canvasH) / 8000), 120);
        for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 140) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - dist / 140) * 0.15})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvasW, canvasH);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }

    resizeHeroCanvas();
    initParticles();
    animateParticles();
    window.addEventListener('resize', () => { resizeHeroCanvas(); initParticles(); });

    // ===================== TYPEWRITER EFFECT =====================
    const typedTextEl = document.getElementById('typedText');
    const phrases = [
        'Senior DevOps & Platform Engineer | Cloud-Native Infrastructure',
        'multi-tenant SaaS data platforms.',
        'Terraform IaC & Kubernetes orchestration.',
        'Apache Spark infrastructure at scale.',
        'CI/CD automation & GitOps pipelines.',
        'production observability & cost optimization.',
    ];
    let phraseIndex = 0, charIndex = 0, isDeleting = false, typeSpeed = 50;

    function typeWriter() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            typedTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 25;
        } else {
            typedTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 50;
        }
        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2500; isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; typeSpeed = 400;
        }
        setTimeout(typeWriter, typeSpeed);
    }
    setTimeout(typeWriter, 1200);

    // ===================== SCROLL REVEAL =====================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

    // ===================== ANIMATED COUNTERS =====================
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter').forEach(c => counterObserver.observe(c));

    function animateCounter(el, target) {
        const duration = 2000;
        const start = performance.now();
        function step(timestamp) {
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
        }
        requestAnimationFrame(step);
    }

    // ===================== TECH ECOSYSTEM INTERACTIVE MAP =====================
    const ecosystemCanvas = document.getElementById('ecosystemCanvas');
    const ecoTooltip = document.getElementById('ecosystemTooltip');

    const techNodes = [
        { id: 'center', label: 'Sadhvik', icon: '', emoji: '👨‍💻', x: 0.5, y: 0.5, r: 35, color: '#3B82F6', group: 'center', exp: '', desc: '', projects: '' },
        { id: 'aws', label: 'AWS', icon: 'amazonwebservices', emoji: '🔶', x: 0.22, y: 0.26, r: 23, color: '#f59e0b', group: 'cloud', exp: '6+ years', desc: 'Marketplace, EC2, S3, Lambda', projects: 'Lead Product Eng, Sr DevOps, Data Eng' },
        { id: 'azure', label: 'Azure', icon: 'microsoftazure', emoji: '🔷', x: 0.17, y: 0.5, r: 23, color: '#3B82F6', group: 'cloud', exp: '6+ years', desc: 'DevOps, AKS, ADLS, Marketplace', projects: 'Lead Product Eng, Sr DevOps, DevOps, Data Eng' },
        { id: 'gcp', label: 'GCP', icon: 'googlecloud', emoji: '🟢', x: 0.22, y: 0.74, r: 23, color: '#10b981', group: 'cloud', exp: '6+ years', desc: 'GKE, Cloud Functions, Stackdriver', projects: 'Lead Product Eng, Sr DevOps, DevOps, Data Eng' },

        { id: 'terraform', label: 'Terraform', icon: 'terraform', emoji: '🟪', x: 0.38, y: 0.22, r: 21, color: '#8B5CF6', group: 'infra', exp: '5+ years', desc: 'IaC for multi-cloud provisioning', projects: 'Lead Product Eng, Sr DevOps, DevOps Eng' },
        { id: 'kubernetes', label: 'K8s', icon: 'kubernetes', emoji: '☸️', x: 0.38, y: 0.78, r: 21, color: '#3B82F6', group: 'infra', exp: '5+ years', desc: 'Cluster orchestration, auto-scaling', projects: 'Lead Product Eng, DevOps Eng' },
        { id: 'docker', label: 'Docker', icon: 'docker', emoji: '🐳', x: 0.32, y: 0.38, r: 18, color: '#06b6d4', group: 'infra', exp: '6+ years', desc: 'Containerization, microservices', projects: 'Lead Product Eng' },
        { id: 'ansible', label: 'Ansible', icon: 'ansible', emoji: '⚙️', x: 0.28, y: 0.62, r: 16, color: '#ef4444', group: 'infra', exp: '4+ years', desc: 'Config management, provisioning', projects: 'DevOps Eng' },

        { id: 'kafka', label: 'Kafka', icon: 'apachekafka', emoji: '📡', x: 0.62, y: 0.22, r: 21, color: '#ec4899', group: 'data', exp: '5+ years', desc: 'Event streaming, real-time pipelines', projects: 'DevOps Eng, Data Eng' },
        { id: 'streamsets', label: 'StreamSets', icon: '', emoji: '🔄', x: 0.7, y: 0.38, r: 18, color: '#14b8a6', group: 'data', exp: '4+ years', desc: 'Data integration pipelines', projects: 'DevOps Eng, Data Eng' },
        { id: 'spark', label: 'Spark', icon: 'apachespark', emoji: '⚡', x: 0.62, y: 0.78, r: 21, color: '#f59e0b', group: 'data', exp: '4+ years', desc: 'Distributed data processing', projects: 'Lead Product Eng' },
        { id: 'postgres', label: 'PostgreSQL', icon: 'postgresql', emoji: '🐘', x: 0.72, y: 0.62, r: 16, color: '#3B82F6', group: 'data', exp: '6+ years', desc: 'Relational database systems', projects: 'Data Eng' },

        { id: 'prometheus', label: 'Prometheus', icon: 'prometheus', emoji: '🔴', x: 0.82, y: 0.25, r: 18, color: '#ef4444', group: 'obs', exp: '4+ years', desc: 'Metrics collection & alerting', projects: 'Sr DevOps' },
        { id: 'grafana', label: 'Grafana', icon: 'grafana', emoji: '📈', x: 0.85, y: 0.45, r: 18, color: '#f59e0b', group: 'obs', exp: '4+ years', desc: 'Dashboards & visualization', projects: 'Sr DevOps' },
        { id: 'elk', label: 'ELK Stack', icon: 'elasticstack', emoji: '🔍', x: 0.83, y: 0.65, r: 17, color: '#10b981', group: 'obs', exp: '4+ years', desc: 'Log aggregation & search', projects: 'Sr DevOps' },
        { id: 'splunk', label: 'Splunk', icon: 'splunk', emoji: '🔮', x: 0.88, y: 0.82, r: 16, color: '#ec4899', group: 'obs', exp: '3+ years', desc: 'SIEM & operational intelligence', projects: 'Sr DevOps, DevOps Eng' },

        { id: 'java', label: 'Java', icon: 'java', emoji: '☕', x: 0.5, y: 0.18, r: 18, color: '#ef4444', group: 'lang', exp: '6+ years', desc: 'Spring backend, ETL platforms', projects: 'Data Eng' },
        { id: 'python', label: 'Python', icon: 'python', emoji: '🐍', x: 0.5, y: 0.82, r: 18, color: '#3B82F6', group: 'lang', exp: '5+ years', desc: 'Automation, Data engineering', projects: 'System Automation' },
        { id: 'bash', label: 'Bash', icon: 'gnubash', emoji: '🖥️', x: 0.4, y: 0.92, r: 15, color: '#10b981', group: 'lang', exp: '6+ years', desc: 'Shell scripting, automation', projects: 'CI/CD Pipelines' },
        { id: 'github_actions', label: 'Actions', icon: 'githubactions', emoji: '🐙', x: 0.6, y: 0.92, r: 16, color: '#1f2937', group: 'tools', exp: '4+ years', desc: 'CI/CD Pipelines', projects: 'Sr DevOps' }
    ];

    const loadedIcons = {};
    techNodes.forEach(node => {
        if (node.icon) {
            const img = new Image();
            img.src = `https://cdn.simpleicons.org/${node.icon}/${node.color.replace('#', '')}`;
            img.onload = () => { loadedIcons[node.id] = img; };
        }
    });

    if (ecosystemCanvas && window.innerWidth > 900) {
        const ectx = ecosystemCanvas.getContext('2d');
        let ecoW, ecoH;

        const edges = techNodes.filter(n => n.id !== 'center').map(n => ({ from: 'center', to: n.id }));
        let hoveredNode = null;
        let ecoTime = 0;

        function resizeEcoCanvas() {
            const wrapper = ecosystemCanvas.parentElement;
            ecoW = ecosystemCanvas.width = wrapper.clientWidth;
            ecoH = ecosystemCanvas.height = wrapper.clientHeight;
        }

        function getNodePos(node) {
            return {
                x: node.x * ecoW + Math.sin(ecoTime * 0.5 + node.x * 10) * 3,
                y: node.y * ecoH + Math.cos(ecoTime * 0.3 + node.y * 10) * 3
            };
        }

        function drawEcosystem() {
            ectx.clearRect(0, 0, ecoW, ecoH);
            ecoTime += 0.016;

            edges.forEach(edge => {
                const fromNode = techNodes.find(n => n.id === edge.from);
                const toNode = techNodes.find(n => n.id === edge.to);
                const from = getNodePos(fromNode), to = getNodePos(toNode);
                const isHovered = hoveredNode && (hoveredNode.id === edge.to);
                const alpha = isHovered ? 0.5 : 0.08;

                ectx.beginPath();
                ectx.moveTo(from.x, from.y); ectx.lineTo(to.x, to.y);
                const grad = ectx.createLinearGradient(from.x, from.y, to.x, to.y);
                grad.addColorStop(0, `rgba(59,130,246,${alpha})`);
                grad.addColorStop(1, `rgba(139,92,246,${alpha})`);
                ectx.strokeStyle = grad;
                ectx.lineWidth = isHovered ? 2 : 0.8;
                ectx.stroke();

                if (isHovered) {
                    const pulse = (ecoTime * 0.5) % 1;
                    ectx.beginPath();
                    ectx.arc(from.x + (to.x - from.x) * pulse, from.y + (to.y - from.y) * pulse, 3, 0, Math.PI * 2);
                    ectx.fillStyle = toNode.color;
                    ectx.fill();
                }
            });

            techNodes.forEach(node => {
                const pos = getNodePos(node);
                const isHovered = hoveredNode && hoveredNode.id === node.id;
                const isCenter = node.id === 'center';
                const r = isHovered ? node.r * 1.2 : node.r;

                if (isHovered || isCenter) {
                    const glow = ectx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 2.5);
                    glow.addColorStop(0, node.color + '30');
                    glow.addColorStop(1, 'transparent');
                    ectx.beginPath();
                    ectx.arc(pos.x, pos.y, r * 2.5, 0, Math.PI * 2);
                    ectx.fillStyle = glow;
                    ectx.fill();
                }

                ectx.beginPath();
                ectx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
                ectx.fillStyle = isHovered ? node.color + '40' : (isCenter ? node.color + '25' : node.color + '12');
                ectx.fill();
                ectx.strokeStyle = isHovered ? node.color : node.color + '50';
                ectx.lineWidth = isHovered ? 2 : 1;
                ectx.stroke();

                if (loadedIcons[node.id]) {
                    const iconSize = r * 1.0;
                    ectx.drawImage(loadedIcons[node.id], pos.x - iconSize / 2, pos.y - iconSize / 2, iconSize, iconSize);
                } else if (isCenter) {
                    ectx.fillStyle = '#fff';
                    ectx.font = `600 ${r * 0.8}px "Space Grotesk", sans-serif`;
                    ectx.textAlign = 'center';
                    ectx.textBaseline = 'middle';
                    ectx.fillText('SC', pos.x, pos.y);
                } else {
                    ectx.fillStyle = isHovered ? '#fff' : node.color;
                    ectx.font = `${isHovered ? '600' : '400'} ${r * 0.8}px "Space Grotesk", sans-serif`;
                    ectx.textAlign = 'center';
                    ectx.textBaseline = 'middle';
                    ectx.fillText(node.emoji, pos.x, pos.y);
                }

                ectx.fillStyle = isHovered ? '#fff' : '#b0b8cc';
                ectx.font = `${isHovered ? '600' : '500'} 11px "Space Grotesk", sans-serif`;
                ectx.textAlign = 'center';
                ectx.textBaseline = 'middle';
                ectx.fillText(node.label, pos.x, pos.y + r + 14);
            });

            requestAnimationFrame(drawEcosystem);
        }

        ecosystemCanvas.addEventListener('mousemove', (e) => {
            const rect = ecosystemCanvas.getBoundingClientRect();
            const mx = e.clientX - rect.left, my = e.clientY - rect.top;
            hoveredNode = null;
            for (const node of techNodes) {
                if (node.id === 'center') continue;
                const pos = getNodePos(node);
                if (Math.sqrt((mx - pos.x) ** 2 + (my - pos.y) ** 2) < node.r + 8) {
                    hoveredNode = node; break;
                }
            }
            if (hoveredNode) {
                ecosystemCanvas.style.cursor = 'pointer';
                ecoTooltip.classList.add('visible');
                ecoTooltip.querySelector('.tooltip-name').textContent = hoveredNode.emoji + ' ' + hoveredNode.label;
                ecoTooltip.querySelector('.tooltip-exp').textContent = hoveredNode.exp;
                ecoTooltip.querySelector('.tooltip-desc').textContent = hoveredNode.desc;
                const projEl = ecoTooltip.querySelector('.tooltip-projects');
                if (projEl) {
                    if (hoveredNode.projects) {
                        projEl.textContent = '💼 ' + hoveredNode.projects;
                        projEl.style.display = 'block';
                    } else {
                        projEl.style.display = 'none';
                    }
                }
                let tx = e.clientX - rect.left + 16;
                let ty = e.clientY - rect.top - 10;
                if (tx + 250 > ecoW) tx = mx - 260;
                if (ty < 0) ty = 10;
                ecoTooltip.style.left = tx + 'px';
                ecoTooltip.style.top = ty + 'px';
            } else {
                ecosystemCanvas.style.cursor = 'default';
                ecoTooltip.classList.remove('visible');
            }
        });

        ecosystemCanvas.addEventListener('mouseleave', () => {
            hoveredNode = null;
            ecoTooltip.classList.remove('visible');
        });

        resizeEcoCanvas();
        drawEcosystem();
        window.addEventListener('resize', resizeEcoCanvas);
    }

    // (Architecture Canvas and Monitoring Simulation were replaced by CSS Mega-Diagram)

    // ===================== TERMINAL CONTACT =====================
    const terminalInput = document.getElementById('terminalInput');
    const terminalBody = document.getElementById('terminalBody');

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = terminalInput.value.trim();
                if (!command) return;
                const inputLine = terminalInput.closest('.terminal-input-line');
                const commandLine = document.createElement('div');
                commandLine.className = 'terminal-line';
                commandLine.innerHTML = `<span class="term-prompt">visitor@sadhvik:~$</span> <span class="term-text">${escapeHtml(command)}</span>`;
                terminalBody.insertBefore(commandLine, inputLine);

                let response = '';
                if (command.startsWith('send-message') || command.startsWith('send_message')) {
                    response = '✅ Message received! Sadhvik will get back to you soon.';
                } else if (command === 'help') {
                    response = 'Available: whoami, cat contact.json, help, send-message, clear, skills, location';
                } else if (command === 'whoami') {
                    response = 'Senior DevOps & Platform Engineer | 6.5+ years | Leading 30 engineers';
                } else if (command === 'clear') {
                    terminalBody.querySelectorAll('.terminal-line:not(.terminal-input-line), .terminal-output').forEach(el => el.remove());
                    terminalInput.value = '';
                    return;
                } else if (command.includes('skills') || command.includes('tech')) {
                    response = 'Terraform | Kubernetes | Docker | Kafka | GCP | Azure | AWS | Prometheus | Grafana | Java | Python';
                } else if (command.includes('location') || command.includes('where')) {
                    response = '📍 Hyderabad, Telangana, India';
                } else {
                    response = `Command not found: ${escapeHtml(command)}. Type "help" for available commands.`;
                }

                const responseLine = document.createElement('div');
                responseLine.className = 'terminal-output terminal-response';
                responseLine.textContent = response;
                terminalBody.insertBefore(responseLine, inputLine);
                terminalInput.value = '';
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }
        });
    }

    function escapeHtml(str) {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    // ===================== TIMELINE CARD TOGGLE =====================
    document.querySelectorAll('.h-timeline-card').forEach(card => {
        card.addEventListener('click', () => card.classList.toggle('expanded'));
    });

    // ===================== SMOOTH SCROLL =====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ===================== 3D TILT =====================
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -8;
            const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 8;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });

    // ===================== SCROLL HANDLER =====================
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollProgress();
                updateNavbar();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    updateNavbar();
    updateScrollProgress();

    // ===================== GENERATE MOBILE TECH GRID =====================
    const mobileGridEl = document.querySelector('.tech-grid-mobile');
    if (mobileGridEl) {
        const fullTechData = [
            { h: '☁️ Cloud Platforms', tags: [{ n: 'AWS', i: 'amazonwebservices', c: '#f59e0b', e: '🔶' }, { n: 'Azure', i: 'microsoftazure', c: '#3B82F6', e: '🔷' }, { n: 'GCP', i: 'googlecloud', c: '#10b981', e: '🟢' }] },
            { h: '🏗️ Infrastructure & IaC', tags: [{ n: 'Terraform', i: 'terraform', c: '#8B5CF6', e: '🟪' }, { n: 'Kubernetes', i: 'kubernetes', c: '#3B82F6', e: '☸️' }, { n: 'Docker', i: 'docker', c: '#06b6d4', e: '🐳' }, { n: 'Helm', i: 'helm', c: '#0f766e', e: '⎈' }, { n: 'Kustomize', i: 'kubernetes', c: '#3B82F6', e: '📋' }, { n: 'LXC', i: '', c: '#f97316', e: '📦' }, { n: 'Firecracker', i: '', c: '#f59e0b', e: '🔥' }, { n: 'Vagrant', i: 'vagrant', c: '#6366f1', e: '📦' }, { n: 'Packer', i: 'packer', c: '#06b6d4', e: '📦' }] },
            { h: '📡 Data & Messaging', tags: [{ n: 'Kafka', i: 'apachekafka', c: '#ec4899', e: '📡' }, { n: 'Confluent', i: 'confluent', c: '#ec4899', e: '🔀' }, { n: 'RabbitMQ', i: 'rabbitmq', c: '#f97316', e: '🐇' }, { n: 'StreamSets', i: '', c: '#14b8a6', e: '🔄' }, { n: 'Spark', i: 'apachespark', c: '#f59e0b', e: '⚡' }, { n: 'Delta Lake', i: '', c: '#ef4444', e: '🔺' }, { n: 'Apache Iceberg', i: '', c: '#3B82F6', e: '🧊' }, { n: 'Hive Metastore', i: 'apachehive', c: '#f59e0b', e: '🐝' }] },
            { h: '📊 Observability', tags: [{ n: 'Grafana', i: 'grafana', c: '#f59e0b', e: '📈' }, { n: 'Prometheus', i: 'prometheus', c: '#ef4444', e: '🔴' }, { n: 'Alertmanager', i: 'prometheus', c: '#ef4444', e: '🔔' }, { n: 'Splunk', i: 'splunk', c: '#ec4899', e: '🔮' }, { n: 'Dynatrace', i: 'dynatrace', c: '#6366f1', e: '🟣' }, { n: 'EFK/ELK Stack', i: 'elasticstack', c: '#10b981', e: '🔍' }, { n: 'Telegraf', i: 'influxdb', c: '#3B82F6', e: '📊' }, { n: 'InfluxDB', i: 'influxdb', c: '#3B82F6', e: '📊' }, { n: 'Stackdriver', i: 'googlecloud', c: '#10b981', e: '📡' }, { n: 'Spark History Server', i: 'apachespark', c: '#f59e0b', e: '⚡' }] },
            { h: '💻 Languages', tags: [{ n: 'Java', i: 'java', c: '#ef4444', e: '☕' }, { n: 'Python', i: 'python', c: '#3B82F6', e: '🐍' }, { n: 'Dart', i: 'dart', c: '#06b6d4', e: '🎯' }, { n: 'Bash', i: 'gnubash', c: '#10b981', e: '🖥️' }, { n: 'HCL', i: 'terraform', c: '#8B5CF6', e: '🟪' }, { n: 'SQL', i: '', c: '#3B82F6', e: '🗃️' }, { n: 'YAML', i: '', c: '#ef4444', e: '📄' }] },
            { h: '🧩 Frameworks', tags: [{ n: 'Spring Boot', i: 'springboot', c: '#10b981', e: '🍃' }, { n: 'Flask', i: 'flask', c: '#3B82F6', e: '🌶️' }, { n: 'Flutter', i: 'flutter', c: '#06b6d4', e: '🦋' }, { n: 'PySpark', i: 'apachespark', c: '#f59e0b', e: '⚡' }, { n: 'Spark SQL', i: 'apachespark', c: '#f59e0b', e: '⚡' }] },
            { h: '🔧 CI/CD & GitOps', tags: [{ n: 'GitHub Actions', i: 'githubactions', c: '#1f2937', e: '🐙' }, { n: 'Azure DevOps', i: 'azuredevops', c: '#3B82F6', e: '🔷' }, { n: 'Ansible', i: 'ansible', c: '#ef4444', e: '⚙️' }, { n: 'Puppet', i: 'puppet', c: '#f59e0b', e: '🤖' }, { n: 'Chef', i: 'chef', c: '#f97316', e: '🧑‍🍳' }, { n: 'Salt', i: 'saltproject', c: '#8B5CF6', e: '🧂' }, { n: 'Git', i: 'git', c: '#f05032', e: '🔀' }] },
            { h: '🗄️ Databases', tags: [{ n: 'PostgreSQL', i: 'postgresql', c: '#3B82F6', e: '🐘' }, { n: 'MongoDB Atlas', i: 'mongodb', c: '#10b981', e: '🍃' }, { n: 'MySQL', i: 'mysql', c: '#06b6d4', e: '🐬' }, { n: 'Oracle DB', i: 'oracle', c: '#ef4444', e: '🏛️' }, { n: 'InfluxDB', i: 'influxdb', c: '#3B82F6', e: '📊' }, { n: 'Cloud SQL', i: 'googlecloud', c: '#10b981', e: '☁️' }, { n: 'Azure SQL', i: 'microsoftazure', c: '#3B82F6', e: '🔷' }] },
            { h: '🌐 Networking & Proxy', tags: [{ n: 'Nginx', i: 'nginx', c: '#10b981', e: '🟩' }, { n: 'Traefik', i: 'traefikproxy', c: '#06b6d4', e: '🔀' }, { n: 'Istio', i: 'istio', c: '#3B82F6', e: '🕸️' }, { n: 'HAProxy', i: '', c: '#10b981', e: '⚖️' }, { n: 'VPC/VPN', i: '', c: '#8B5CF6', e: '🔒' }, { n: 'ALB/NLB', i: 'amazonwebservices', c: '#f59e0b', e: '⚖️' }, { n: 'Route 53', i: 'amazonwebservices', c: '#f59e0b', e: '🌍' }, { n: 'Cloud DNS', i: 'googlecloud', c: '#10b981', e: '🌍' }] },
            { h: '🔒 Security', tags: [{ n: 'JFrog Xray', i: 'jfrog', c: '#10b981', e: '🔍' }, { n: 'Snyk', i: 'snyk', c: '#8B5CF6', e: '🛡️' }, { n: 'Trivy', i: '', c: '#06b6d4', e: '🔒' }, { n: 'SonarQube', i: 'sonarqube', c: '#06b6d4', e: '📊' }, { n: 'OWASP ZAP', i: 'owasp', c: '#ef4444', e: '🕷️' }, { n: 'HashiCorp Vault', i: 'vault', c: '#f59e0b', e: '🔐' }, { n: 'Azure AD SSO', i: 'microsoftazure', c: '#3B82F6', e: '🔑' }] },
            { h: '🧪 Testing', tags: [{ n: 'Pytest', i: 'pytest', c: '#3B82F6', e: '🧪' }, { n: 'Selenium', i: 'selenium', c: '#10b981', e: '🌐' }, { n: 'OWASP ZAP', i: 'owasp', c: '#ef4444', e: '🕷️' }, { n: 'E2E Automation', i: '', c: '#8B5CF6', e: '🔄' }, { n: 'UI Regression', i: '', c: '#f59e0b', e: '🖥️' }] },
            { h: '📦 Build & Storage', tags: [{ n: 'Maven Central', i: 'apachemaven', c: '#ef4444', e: '🏗️' }, { n: 'PyPI', i: 'pypi', c: '#3B82F6', e: '📦' }, { n: 'JFrog Artifactory', i: 'jfrog', c: '#10b981', e: '📦' }, { n: 'S3', i: 'amazons3', c: '#ef4444', e: '☁️' }, { n: 'GCS', i: 'googlecloud', c: '#10b981', e: '☁️' }, { n: 'ADLS', i: 'microsoftazure', c: '#3B82F6', e: '☁️' }] },
            { h: '🤖 AI & Tooling', tags: [{ n: 'GitHub Copilot', i: 'githubcopilot', c: '#1f2937', e: '🤖' }, { n: 'Claude', i: 'anthropic', c: '#8B5CF6', e: '🧠' }, { n: 'GPT-4', i: 'openai', c: '#10b981', e: '🤖' }, { n: 'Gemini', i: 'google', c: '#3B82F6', e: '💎' }] }
        ];

        let html = '';
        fullTechData.forEach(cat => {
            html += `<div class="tech-category-m reveal-up"><h3>${cat.h}</h3><div class="tech-tags">`;
            cat.tags.forEach(t => {
                if (t.i) {
                    html += `<span><img src="https://cdn.simpleicons.org/${t.i}/${t.c.replace('#', '')}" alt="${t.n}" width="16" height="16" style="vertical-align: middle; margin-right: 5px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';"><span style="display:none">${t.e}</span> ${t.n}</span>`;
                } else {
                    html += `<span>${t.e} ${t.n}</span>`;
                }
            });
            html += `</div></div>`;
        });
        mobileGridEl.innerHTML = html;
    }

})();

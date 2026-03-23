/* =====================================================
   REVAPEX AI — Homepage Scripts
   Neural Network Canvas + Scroll Animations + Nav
   ===================================================== */

'use strict';

// ─── NEURAL NETWORK CANVAS ANIMATION ───
(function initCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const NAVY = [15, 30, 58];          // #0F1E3A
    const BLUE = [44, 102, 245];        // #2C66F5
    const BLUE_LIGHT = [100, 160, 255]; // subtle soft glow

    let W, H, raf;
    const NODES = [];
    const NODE_COUNT = window.innerWidth < 768 ? 40 : 70;
    const MAX_DIST = 180;

    class Node {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.45;
            this.vy = (Math.random() - 0.5) * 0.45;
            this.r = Math.random() * 2.4 + 1.2;
            this.pulse = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.012 + Math.random() * 0.018;
            this.opacity = 0.4 + Math.random() * 0.6;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.pulse += this.pulseSpeed;
            if (this.x < -20) this.x = W + 20;
            if (this.x > W + 20) this.x = -20;
            if (this.y < -20) this.y = H + 20;
            if (this.y > H + 20) this.y = -20;
        }
        draw() {
            const glow = Math.sin(this.pulse) * 0.5 + 0.5;
            const radius = this.r + glow * 1.8;
            const alpha = this.opacity * (0.6 + glow * 0.4);

            // Outer glow
            const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius * 4);
            grad.addColorStop(0, `rgba(${BLUE[0]},${BLUE[1]},${BLUE[2]},${alpha * 0.4})`);
            grad.addColorStop(1, `rgba(${BLUE[0]},${BLUE[1]},${BLUE[2]},0)`);
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius * 4, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            // Core node
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${BLUE_LIGHT[0]},${BLUE_LIGHT[1]},${BLUE_LIGHT[2]},${alpha})`;
            ctx.fill();
        }
    }

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function drawConnections() {
        for (let i = 0; i < NODES.length; i++) {
            for (let j = i + 1; j < NODES.length; j++) {
                const a = NODES[i], b = NODES[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) {
                    const strength = 1 - dist / MAX_DIST;
                    const alpha = strength * 0.25;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(${BLUE[0]},${BLUE[1]},${BLUE[2]},${alpha})`;
                    ctx.lineWidth = strength * 1.2;
                    ctx.stroke();
                }
            }
        }
    }

    function drawDataStreams(t) {
        // Slow diagonal particle streams
        const streams = 3;
        for (let s = 0; s < streams; s++) {
            const progress = ((t * 0.0004 + s / streams) % 1);
            const x = W * 0.1 + progress * W * 0.9;
            const y = H - progress * H * 0.7;
            const alpha = Math.sin(progress * Math.PI) * 0.15;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${BLUE[0]},${BLUE[1]},${BLUE[2]},${alpha})`;
            ctx.fill();
        }
    }

    function loop(t) {
        ctx.clearRect(0, 0, W, H);

        // Subtle vignette
        const vignette = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.8);
        vignette.addColorStop(0, 'rgba(15,30,58,0)');
        vignette.addColorStop(1, 'rgba(15,30,58,0.5)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, W, H);

        drawConnections();
        drawDataStreams(t);
        NODES.forEach(n => { n.update(); n.draw(); });

        raf = requestAnimationFrame(loop);
    }

    function init() {
        resize();
        NODES.length = 0;
        for (let i = 0; i < NODE_COUNT; i++) NODES.push(new Node());
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', () => {
        clearTimeout(window._resizeTimer);
        window._resizeTimer = setTimeout(() => { resize(); }, 200);
    });

    init();
})();

// ─── NAVBAR ───
(function initNav() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const dropdownItems = document.querySelectorAll('.nav-item-dropdown');

    // Sticky scroll tint
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    // Hamburger toggle
    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navMenu.classList.toggle('open');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on nav link click
    navMenu?.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('open');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Dropdown toggles
    dropdownItems.forEach(item => {
        const toggle = item.querySelector('.nav-dropdown-toggle');
        toggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = item.classList.contains('open');
            // Close all others
            dropdownItems.forEach(d => d.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
            toggle.setAttribute('aria-expanded', !isOpen);
        });
    });

    document.addEventListener('click', () => {
        dropdownItems.forEach(d => d.classList.remove('open'));
    });
})();

// ─── SCROLL ANIMATIONS ───
(function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger children if multiple
                const children = entry.target.querySelectorAll('[class*="pillar-card"], [class*="step-card"], [class*="stat-item"], [class*="trust-icon-item"], [class*="differentiator-card"], [class*="trust-badge"]');
                if (children.length) {
                    children.forEach((child, i) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, i * 80);
                    });
                }
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => {
        // Pre-set children for stagger
        el.querySelectorAll('[class*="pillar-card"], [class*="step-card"], [class*="stat-item"], [class*="trust-icon-item"], [class*="differentiator-card"]').forEach(child => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(24px)';
            child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        observer.observe(el);
    });
})();

// ─── SMOOTH ACTIVE NAV LINK ───
(function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(s => observer.observe(s));
})();

// ─── METHOD INTERACTIVE LAYOUT ───
(function initMethodInteractive() {
    const interactiveLayouts = document.querySelectorAll('.method-interactive-layout');

    interactiveLayouts.forEach(layout => {
        const featureItems = layout.querySelectorAll('.method-feature-item');
        const mainImg = layout.querySelector('.interactive-main-img');
        const glowBg = layout.querySelector('.img-glow-bg');

        if (!featureItems.length || !mainImg) return;

        featureItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove active from all
                featureItems.forEach(f => f.classList.remove('active'));
                // Add active to clicked
                item.classList.add('active');

                // Get new image src
                const newImgSrc = item.getAttribute('data-img');

                // Fade out current image
                mainImg.classList.add('fade-out');
                if (glowBg) glowBg.classList.remove('active');

                setTimeout(() => {
                    mainImg.src = newImgSrc;
                    mainImg.onload = () => {
                        mainImg.classList.remove('fade-out');
                        if (glowBg) glowBg.classList.add('active');
                    };
                }, 300); // match transition time
            });
        });
    });
})();

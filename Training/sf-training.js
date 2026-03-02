/* ============================
   SF TRAINING — JavaScript
   sf-training.js
   ============================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========== SCROLL ANIMATIONS ==========
    const animEls = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
    animEls.forEach(el => observer.observe(el));

    // ========== STICKY NAVBAR ==========
    const navbar = document.getElementById('navbar');
    function handleScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        // sticky bar logic (mobile)
        const bar = document.getElementById('sfStickyBar');
        if (bar) bar.classList.toggle('visible', window.scrollY > 400);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ========== MOBILE HAMBURGER ==========
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ========== TRAINING DROPDOWN (mobile touch) ==========
    const dropdownItems = document.querySelectorAll('.nav-item-dropdown');
    dropdownItems.forEach(item => {
        const toggle = item.querySelector('.nav-dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 900) {
                    e.preventDefault();
                    item.classList.toggle('open');
                }
            });
        }
    });

    // ========== CURRICULUM ACCORDION ==========
    const accItems = document.querySelectorAll('.sf-acc-item');
    accItems.forEach(item => {
        const header = item.querySelector('.sf-acc-header');
        const body = item.querySelector('.sf-acc-body');
        header.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            // Close all
            accItems.forEach(i => {
                i.classList.remove('open');
                i.querySelector('.sf-acc-body').style.maxHeight = '0';
            });
            if (!isOpen) {
                item.classList.add('open');
                body.style.maxHeight = body.scrollHeight + 'px';
            }
        });
    });
    // Open first item by default
    if (accItems.length) {
        accItems[0].classList.add('open');
        accItems[0].querySelector('.sf-acc-body').style.maxHeight =
            accItems[0].querySelector('.sf-acc-body').scrollHeight + 'px';
    }

    // ========== FAQ ACCORDION ==========
    const faqItems = document.querySelectorAll('.sf-faq-item');
    faqItems.forEach(item => {
        const q = item.querySelector('.sf-faq-q');
        const a = item.querySelector('.sf-faq-a');
        q.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            faqItems.forEach(i => {
                i.classList.remove('open');
                i.querySelector('.sf-faq-a').style.maxHeight = '0';
            });
            if (!isOpen) {
                item.classList.add('open');
                a.style.maxHeight = a.scrollHeight + 'px';
            }
        });
    });

    // ========== COURSE TABS ==========
    const tabs = document.querySelectorAll('.sf-tab');
    const panels = document.querySelectorAll('.sf-tab-panel');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const panel = document.getElementById('tab-' + target);
            if (panel) panel.classList.add('active');
        });
    });

    // ========== ANIMATED COUNTERS ==========
    const counters = document.querySelectorAll('[data-count]');
    const counted = new Set();
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting && !counted.has(e.target)) {
                counted.add(e.target);
                animateCount(e.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

    function animateCount(el) {
        const target = parseFloat(el.dataset.count);
        const isDecimal = el.dataset.count.includes('.');
        const duration = 2000;
        const start = performance.now();
        function easeOut(t) { return 1 - Math.pow(1 - t, 4); }
        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const val = target * easeOut(progress);
            el.textContent = isDecimal ? val.toFixed(1) : Math.round(val).toLocaleString();
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // ========== LEAD CAPTURE POPUP ==========
    const popup = document.getElementById('sfPopup');
    const popupBackdrop = popup ? popup.closest('.sf-popup-backdrop') : null;

    function openPopup() {
        if (!popupBackdrop) return;
        popupBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closePopup() {
        if (!popupBackdrop) return;
        popupBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    // All CTA triggers open popup
    document.querySelectorAll('.cta-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openPopup();
        });
    });

    // Close button
    const closeBtn = document.getElementById('popupClose');
    if (closeBtn) closeBtn.addEventListener('click', closePopup);

    // Backdrop click closes
    if (popupBackdrop) {
        popupBackdrop.addEventListener('click', (e) => {
            if (e.target === popupBackdrop) closePopup();
        });
    }

    // Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closePopup();
    });

    // ========== FORM VALIDATION + SUBMIT ==========
    const form = document.getElementById('sfLeadForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;

            const fields = [
                { id: 'sfName', msg: 'Please enter your full name.' },
                { id: 'sfPhone', msg: 'Please enter a valid phone number.', pattern: /^[0-9+\-\s]{7,15}$/ },
                { id: 'sfEmail', msg: 'Please enter a valid email address.', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
                { id: 'sfExperience', msg: 'Please select your experience level.' },
                { id: 'sfTrack', msg: 'Please select a track of interest.' },
            ];

            fields.forEach(f => {
                const input = document.getElementById(f.id);
                const errEl = document.getElementById(f.id + 'Err');
                let ok = input.value.trim() !== '';
                if (ok && f.pattern) ok = f.pattern.test(input.value.trim());
                if (!ok) {
                    input.classList.add('error');
                    if (errEl) errEl.textContent = f.msg;
                    valid = false;
                } else {
                    input.classList.remove('error');
                    const group = document.getElementById(f.id + 'Group');
                    if (group) group.classList.remove('sf-chip-error');
                    if (errEl) errEl.textContent = '';
                }
            });

            if (!valid) return;

            const submitBtn = form.querySelector('.sf-form-submit');
            submitBtn.textContent = 'Submitting…';
            submitBtn.disabled = true;

            // Build payload
            const payload = {
                name: document.getElementById('sfName').value.trim(),
                phone: document.getElementById('sfPhone').value.trim(),
                email: document.getElementById('sfEmail').value.trim(),
                experience: document.getElementById('sfExperience').value,
                track: document.getElementById('sfTrack').value,
                source: 'salesforce-training-page',
                submitted_at: new Date().toISOString()
            };

            // POST to webhook
            fetch('https://api.trustsolar.in/webhook-test/salesforce-training', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
                .then(res => {
                    // Accept any 2xx response or treat non-2xx gracefully
                    if (!res.ok && res.status >= 500) throw new Error('Server error');
                    return res;
                })
                .then(() => {
                    form.style.display = 'none';
                    const success = document.getElementById('sfSuccess');
                    if (success) success.classList.add('show');
                    setTimeout(closePopup, 3000);
                })
                .catch(() => {
                    // Even on network error, show success to user (lead is best-effort)
                    form.style.display = 'none';
                    const success = document.getElementById('sfSuccess');
                    if (success) success.classList.add('show');
                    setTimeout(closePopup, 3000);
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = '🚀 Book My Free Demo Class';
                });
        });

        // Clear error on typing / selecting
        form.querySelectorAll('input:not([type=hidden]), select').forEach(el => {
            el.addEventListener('input', () => {
                el.classList.remove('error');
                const errEl = document.getElementById(el.id + 'Err');
                if (errEl) errEl.textContent = '';
            });
        });
    }

    // ========== PARALLAX HERO ORBS ==========
    const sfOrbs = document.querySelectorAll('.sf-orb');
    window.addEventListener('mousemove', (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        sfOrbs.forEach((orb, i) => {
            const speed = (i + 1) * 0.008;
            orb.style.transform = `translate(${(e.clientX - cx) * speed}px, ${(e.clientY - cy) * speed}px)`;
        });
    }, { passive: true });

});

/* ============================================
   Portfolio interactions
   - Sticky navigation and active section state
   - Scroll progress and reveal animations
   - Mobile menu accessibility
   - Back-to-top control
   ============================================ */

(() => {
    const header = document.getElementById('siteHeader');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = [...document.querySelectorAll('.nav-link')];
    const sections = [...document.querySelectorAll('.section-anchor[id]')];
    const progress = document.getElementById('scrollProgress');
    const topButton = document.getElementById('topButton');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const closeMenu = () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', '메뉴 열기');
        navMenu.classList.remove('open');
        header.classList.remove('menu-active');
        document.body.classList.remove('menu-open');
    };

    const updateScrollUI = () => {
        const scrollTop = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

        progress.style.width = `${percent}%`;
        header.classList.toggle('scrolled', scrollTop > 20);
        topButton.classList.toggle('visible', scrollTop > 700);
    };

    const scrollToTarget = (target) => {
        const top = target.getBoundingClientRect().top + window.scrollY - 64;
        window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
    };

    // Mobile menu
    navToggle.addEventListener('click', () => {
        const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!isOpen));
        navToggle.setAttribute('aria-label', isOpen ? '메뉴 열기' : '메뉴 닫기');
        navMenu.classList.toggle('open', !isOpen);
        header.classList.toggle('menu-active', !isOpen);
        document.body.classList.toggle('menu-open', !isOpen);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navMenu.classList.contains('open')) {
            closeMenu();
            navToggle.focus();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 820) closeMenu();
    });

    // Accessible smooth anchor navigation
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;

            event.preventDefault();
            closeMenu();
            if (anchor.classList.contains('nav-link')) {
                navLinks.forEach((link) => link.classList.toggle('active', link === anchor));
            }
            scrollToTarget(target);
            history.pushState(null, '', anchor.getAttribute('href'));
        });
    });

    // Highlight the menu item for the section currently in view
    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                navLinks.forEach((link) => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
                });
            });
        }, { rootMargin: '-38% 0px -55% 0px', threshold: 0 });

        sections.forEach((section) => sectionObserver.observe(section));
    }

    // Reveal content once it enters the viewport
    const revealElements = [...document.querySelectorAll('[data-reveal]')];
    if ('IntersectionObserver' in window && !reducedMotion) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const delay = Number(entry.target.dataset.delay || 0);

                window.setTimeout(() => entry.target.classList.add('revealed'), delay);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

        revealElements.forEach((element) => revealObserver.observe(element));
    } else {
        revealElements.forEach((element) => element.classList.add('revealed'));
    }

    topButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });

    document.getElementById('currentYear').textContent = new Date().getFullYear();
    window.addEventListener('scroll', updateScrollUI, { passive: true });
    updateScrollUI();
})();

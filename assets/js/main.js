/*===== MENU SHOW =====*/
const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId)

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle', 'nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction() {
    const navMenu = document.getElementById('nav-menu')
    if (navMenu) navMenu.classList.remove('show')
}

navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () => {
    const scrollDown = window.scrollY

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 58,
            sectionId = current.getAttribute('id'),
            sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

        if (sectionsClass) {
            if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
                sectionsClass.classList.add('active-link')
            } else {
                sectionsClass.classList.remove('active-link')
            }
        }
    })
}

window.addEventListener('scroll', scrollActive)

/*===== SCROLL REVEAL =====*/
if (typeof ScrollReveal !== 'undefined') {
    const sr = ScrollReveal({
        origin: 'top',
        distance: '60px',
        duration: 2000,
        delay: 200,
    });

    sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text', {});
    sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img, .about__container .button', { delay: 400 });
    sr.reveal('.home__social-icon', { interval: 200 });
    sr.reveal('.skills__data, .work__img, .contact__input', { interval: 200 });
}

/* ==========================================================
   DESIGN PAGE SCRIPT
========================================================== */

// Jalankan hanya jika ada elemen design-content
if (document.getElementById('design-content')) {

    const SB_URL = localStorage.getItem('fahril_sb_url') || '';
    const SB_KEY = localStorage.getItem('fahril_sb_key') || '';

    function esc(s) {
        if (!s) return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    async function sbFetch(path) {
        const res = await fetch(SB_URL + '/rest/v1/' + path, {
            headers: {
                apikey: SB_KEY,
                Authorization: 'Bearer ' + SB_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            const e = await res.json().catch(() => ({}));
            throw new Error(e.message || 'Request gagal (' + res.status + ')');
        }

        const txt = await res.text();
        return txt ? JSON.parse(txt) : [];
    }

    function thumbUrl(url, width = 400) {
        if (!url) return '';

        try {
            const u = new URL(url);

            if (u.pathname.includes('/storage/v1/object/public/')) {
                u.pathname = u.pathname.replace(
                    '/storage/v1/object/public/',
                    '/storage/v1/render/image/public/'
                );

                u.searchParams.set('width', width);
                u.searchParams.set('quality', '75');
                u.searchParams.set('resize', 'contain');

                return u.toString();
            }
        } catch (_) { }

        return url;
    }

    const modal = document.getElementById('design-modal');
    const modalImg = document.getElementById('modal-img');
    const modalBar = document.getElementById('modal-bar');
    const modalLoader = document.getElementById('modal-loader');
    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('modal-close');

    function openModal(fullSrc, title) {
        modalLoader.classList.remove('hidden');
        modalImg.style.opacity = '0';
        modalBar.textContent = title || '';

        modal.classList.add('is-active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        const tempImg = new Image();

        tempImg.onload = () => {
            modalImg.src = fullSrc;
            modalImg.style.opacity = '1';
            modalLoader.classList.add('hidden');
        };

        tempImg.onerror = () => {
            modalLoader.classList.add('hidden');
            modalImg.src = fullSrc;
            modalImg.style.opacity = '1';
        };

        tempImg.src = fullSrc;
    }

    function closeModal() {
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
        modalImg.src = '';
        document.body.style.overflow = '';
    }

    if (overlay) overlay.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal?.classList.contains('is-active')) {
            closeModal();
        }
    });

    let currentFilter = 'all';

    function buildFilters(categories) {
        const bar = document.getElementById('filter-bar');
        if (!bar) return;

        bar.innerHTML = '';
        bar.style.display = '';

        const allBtn = document.createElement('button');
        allBtn.className = 'filter-btn active';
        allBtn.dataset.cat = 'all';
        allBtn.textContent = 'Semua';
        bar.appendChild(allBtn);

        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.dataset.cat = cat;
            btn.textContent = cat;
            bar.appendChild(btn);
        });

        bar.addEventListener('click', e => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;

            bar.querySelectorAll('.filter-btn')
                .forEach(b => b.classList.remove('active'));

            btn.classList.add('active');
            currentFilter = btn.dataset.cat;
            applyFilter();
        });
    }

    function applyFilter() {
        document.querySelectorAll('.year-section').forEach(sec => {
            if (currentFilter === 'all') {
                sec.classList.add('visible');
            } else {
                sec.classList.toggle(
                    'visible',
                    sec.dataset.cat === currentFilter
                );
            }
        });
    }

    const imgObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const img = entry.target;
            const src = img.dataset.src;

            if (!src) return;

            img.src = src;

            img.addEventListener('load', () => {
                img.classList.add('loaded');
            }, { once: true });

            imgObserver.unobserve(img);
        });
    }, {
        rootMargin: '200px'
    });

    function renderDesigns(data) {
        const container = document.getElementById('design-content');

        if (!data?.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>Belum ada karya design.</p>
                </div>`;
            return;
        }

        const catMap = {};

        data.forEach(item => {
            const cat = item.category || 'Lainnya';

            if (!catMap[cat]) catMap[cat] = [];
            catMap[cat].push(item);
        });

        const categories = Object.keys(catMap).sort();

        buildFilters(categories);

        let html = '';

        categories.forEach(cat => {
            html += `
            <div class="year-section visible" data-cat="${cat}">
                <h2>${cat}</h2>
                <div class="design-grid">
                    ${catMap[cat].map(item => `
                        <button
                            type="button"
                            class="design-card"
                            data-full="${item.image_url}"
                            data-title="${item.title || 'Design'}">

                            <img
                                class="thumb"
                                data-src="${thumbUrl(item.image_url)}"
                                alt="${item.title || 'Design'}">

                        </button>
                    `).join('')}
                </div>
            </div>`;
        });

        container.innerHTML = html;

        container.querySelectorAll('.thumb')
            .forEach(img => imgObserver.observe(img));

        container.querySelectorAll('.design-card')
            .forEach(card => {
                card.addEventListener('click', () => {
                    openModal(
                        card.dataset.full,
                        card.dataset.title
                    );
                });
            });
    }

    async function loadDesigns() {
        const container = document.getElementById('design-content');

        if (!SB_URL || !SB_KEY) {
            container.innerHTML = `<p>Supabase belum dikonfigurasi.</p>`;
            return;
        }

        try {
            const data = await sbFetch(
                'designs?select=*&order=category.asc,created_at.desc'
            );

            renderDesigns(data);

        } catch (err) {
            container.innerHTML = `
                <p>Gagal memuat data:
                ${esc(err.message)}</p>`;
        }
    }

    loadDesigns();
}
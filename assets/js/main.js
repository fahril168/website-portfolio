/* ==========================================================
   GLOBAL SUPABASE CONFIG
========================================================== */

const SB_URL =
    localStorage.getItem('fahril_sb_url') || 'https://hsytixfazdtsyvabkotz.supabase.co';

const SB_KEY =
    localStorage.getItem('fahril_sb_key') || 'sb_publishable_1_mMRJHjnQBf1BrxopH1Vw_-TZP-L4v';

/* ==========================================================
   HELPERS
========================================================== */

function esc(s) {
    if (!s) return '';

    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

async function sbFetch(path) {
    const res = await fetch(
        SB_URL + '/rest/v1/' + path,
        {
            headers: {
                apikey: SB_KEY,
                Authorization: 'Bearer ' + SB_KEY,
                'Content-Type': 'application/json'
            }
        }
    );

    if (!res.ok) {
        const e = await res
            .json()
            .catch(() => ({}));

        throw new Error(
            e.message ||
            'Request gagal (' + res.status + ')'
        );
    }

    const txt = await res.text();
    return txt ? JSON.parse(txt) : [];
}

function thumbUrl(url, bucket = 'designs') {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${SB_URL}/storage/v1/object/public/${bucket}/${url}`;
}

/* ==========================================================
   MENU SHOW
========================================================== */

const showMenu = (toggleId, navId) => {
    const toggle =
        document.getElementById(toggleId);

    const nav =
        document.getElementById(navId);

    if (toggle && nav) {
        toggle.addEventListener(
            'click',
            () => {
                nav.classList.toggle('show');
            }
        );
    }
};

showMenu('nav-toggle', 'nav-menu');

/* ==========================================================
   REMOVE MENU MOBILE
========================================================== */

const navLink =
    document.querySelectorAll('.nav__link');

function linkAction() {
    const navMenu =
        document.getElementById(
            'nav-menu'
        );

    if (navMenu) {
        navMenu.classList.remove('show');
    }
}

navLink.forEach(n =>
    n.addEventListener(
        'click',
        linkAction
    )
);

/* ==========================================================
   SCROLL ACTIVE LINK
========================================================== */

const sections =
    document.querySelectorAll(
        'section[id]'
    );

const scrollActive = () => {
    const scrollDown =
        window.scrollY;

    sections.forEach(current => {

        const sectionHeight =
            current.offsetHeight;

        const sectionTop =
            current.offsetTop - 58;

        const sectionId =
            current.getAttribute('id');

        const sectionsClass =
            document.querySelector(
                '.nav__menu a[href*=' +
                sectionId +
                ']'
            );

        if (sectionsClass) {
            if (
                scrollDown > sectionTop &&
                scrollDown <=
                sectionTop +
                sectionHeight
            ) {
                sectionsClass.classList.add(
                    'active-link'
                );
            } else {
                sectionsClass.classList.remove(
                    'active-link'
                );
            }
        }
    });
};

window.addEventListener(
    'scroll',
    scrollActive
);

/* ==========================================================
   SCROLL REVEAL
========================================================== */

if (
    typeof ScrollReveal !==
    'undefined'
) {
    const sr = ScrollReveal({
        origin: 'top',
        distance: '60px',
        duration: 2000,
        delay: 200,
    });

    sr.reveal(
        '.section-title, .home__data, .about__img',
        {}
    );

    sr.reveal(
        '.home__img, .about__subtitle, .about__text, .about__stat',
        { delay: 400 }
    );
    
    sr.reveal(
        '.about__container .button',
        { delay: 600 }
    );

    sr.reveal(
        '.home__social-icon',
        { interval: 200 }
    );

    sr.reveal(
        '.portfolio-header, .portfolio-grid, .contact__container',
        { delay: 200 }
    );
    
    sr.reveal(
        '.portfolio-more .button',
        { delay: 400 }
    );
    
    sr.reveal(
        '.contact__card',
        { interval: 200 }
    );

    // Animasi pudar (fade-in) pada elemen bentuk latar belakang
    sr.reveal(
        '.hero-shapes, .about-shapes, .contact-shapes',
        { delay: 300, distance: '0px', duration: 2500 }
    );
}

/* ==========================================================
   DESIGN PAGE
========================================================== */

if (
    document.getElementById(
        'design-content'
    )
) {

    const modal =
        document.getElementById(
            'design-modal'
        );

    const modalImg =
        document.getElementById(
            'modal-img'
        );

    const modalBar =
        document.getElementById(
            'modal-bar'
        );

    const modalLoader =
        document.getElementById(
            'modal-loader'
        );

    const overlay =
        document.getElementById(
            'modal-overlay'
        );

    const closeBtn =
        document.getElementById(
            'modal-close'
        );

    function openModal(
        fullSrc,
        title
    ) {

        modalLoader?.classList.remove(
            'hidden'
        );

        modalImg.style.opacity = '0';

        modalBar.textContent =
            title || '';

        modal.classList.add(
            'is-active'
        );

        modal.setAttribute(
            'aria-hidden',
            'false'
        );

        document.body.style.overflow =
            'hidden';

        const tempImg =
            new Image();

        tempImg.onload = () => {
            modalImg.src =
                fullSrc;

            modalImg.style.opacity =
                '1';

            modalLoader?.classList.add(
                'hidden'
            );
        };

        tempImg.onerror = () => {
            modalLoader?.classList.add(
                'hidden'
            );

            modalImg.src =
                fullSrc;

            modalImg.style.opacity =
                '1';
        };

        tempImg.src = fullSrc;
    }

    function closeModal() {
        modal.classList.remove(
            'is-active'
        );

        modal.setAttribute(
            'aria-hidden',
            'true'
        );

        modalImg.src = '';

        document.body.style.overflow =
            '';
    }

    overlay?.addEventListener(
        'click',
        closeModal
    );

    closeBtn?.addEventListener(
        'click',
        closeModal
    );

    document.addEventListener(
        'keydown',
        e => {
            if (
                e.key ===
                'Escape'
            ) {
                closeModal();
            }
        }
    );

    const imgObserver =
        new IntersectionObserver(
            entries => {
                entries.forEach(
                    entry => {
                        if (
                            !entry.isIntersecting
                        ) return;

                        const img =
                            entry.target;

                        const src =
                            img.dataset
                                .src;

                        if (!src)
                            return;

                        img.src =
                            src;

                        imgObserver.unobserve(
                            img
                        );
                    }
                );
            },
            {
                rootMargin:
                    '200px'
            }
        );

    function renderDesigns(
        data
    ) {

        const container =
            document.getElementById(
                'design-content'
            );

        if (
            !data?.length
        ) {
            container.innerHTML =
                `
                <div class="empty-state">
                    <p>Belum ada karya design.</p>
                </div>
            `;
            return;
        }

        const categories =
            {};

        data.forEach(
            item => {
                const cat =
                    item.category ||
                    'Lainnya';

                if (
                    !categories[
                        cat
                    ]
                ) {
                    categories[
                        cat
                    ] = [];
                }

                categories[
                    cat
                ].push(
                    item
                );
            }
        );

        let html =
            '';

        Object.keys(
            categories
        ).forEach(
            cat => {

                html += `
                <div class="year-section visible">
                    <h2>${esc(cat)}</h2>

                    <div class="design-grid">

                    ${categories[
                        cat
                    ]
                        .map(
                            item => `
                            <button
                                type="button"
                                class="design-card"
                                data-full="${item.image_url}"
                                data-title="${item.title || 'Design'}">

                                <img
                                    class="thumb"
                                    data-src="${thumbUrl(item.image_url, 'designs')}"
                                    alt="${item.title || 'Design'}">

                                <div class="design-card__overlay">
                                    <div class="design-card__zoom">
                                        <i class='bx bx-zoom-in'></i>
                                    </div>
                                </div>

                                <div class="design-card__label">
                                    ${item.title || 'Design'}
                                </div>

                            </button>
                        `
                        )
                        .join(
                            ''
                        )}

                    </div>
                </div>
                `;
            }
        );

        container.innerHTML =
            html;

        container.querySelectorAll('.thumb').forEach(img => {
            imgObserver.observe(img);

            const onImageReady = () => {
                img.classList.add('loaded');
                const card = img.closest('.design-card');
                if (card) card.classList.add('img-loaded');
            };

            img.addEventListener('load', onImageReady, { once: true });
            img.addEventListener('error', onImageReady, { once: true });
            
            // Jika gambar sudah ter-cache dan selesai dimuat seketika
            if (img.complete) {
                onImageReady();
            }
        });

        container
            .querySelectorAll(
                '.design-card'
            )
            .forEach(
                card => {
                    card.addEventListener(
                        'click',
                        () => {
                            openModal(
                                card.dataset
                                    .full,
                                card.dataset
                                    .title
                            );
                        }
                    );
                }
            );
    }

    async function loadDesigns() {

        const container =
            document.getElementById(
                'design-content'
            );

        try {
            const data =
                await sbFetch(
                    'designs?select=*&order=category.asc,created_at.desc'
                );

            renderDesigns(
                data
            );

        } catch (
            err
        ) {
            container.innerHTML =
                `
                <div class="error-state">
                    <p>${esc(err.message)}</p>
                </div>
            `;
        }
    }

    loadDesigns();
}

/* ==========================================================
   VIDEO PAGE
========================================================== */

if (
    document.getElementById(
        'video-content'
    )
) {

    async function loadVideos() {

        const container =
            document.getElementById(
                'video-content'
            );

        try {
            const data =
                await sbFetch(
                    'videos?select=*&order=year.desc,created_at.desc'
                );

            renderVideos(
                data
            );

        } catch (
            err
        ) {
            container.innerHTML =
                `
                <div class="error-state">
                    <p>Gagal memuat:
                    ${esc(err.message)}</p>
                </div>
            `;
        }
    }

    function renderVideos(
        data
    ) {

        const container =
            document.getElementById(
                'video-content'
            );

        if (
            !data?.length
        ) {
            container.innerHTML =
                `
                <div class="empty-state">
                    <i class='bx bx-video'></i>
                    <p>Belum ada video.</p>
                </div>
            `;
            return;
        }

        const years =
            {};

        data.forEach(
            item => {

                const y =
                    item.year ||
                    'Lainnya';

                if (
                    !years[y]
                ) {
                    years[
                        y
                    ] = [];
                }

                years[
                    y
                ].push(
                    item
                );
            }
        );

        let html =
            '';

        Object.keys(
            years
        )
            .sort(
                (
                    a,
                    b
                ) =>
                    b -
                    a
            )
            .forEach(
                year => {

                    html += `
                    <div class="year-section visible">

                        <h2>${year}</h2>

                        <div class="design-grid">

                        ${years[
                            year
                        ]
                            .map(
                                item => `
                                <a
                                    href="${item.video_url}"
                                    target="_blank"
                                    class="design-card img-loaded">

                                    <img
                                        class="thumb loaded"
                                        src="${thumbUrl(item.thumbnail_url, 'videos') || 'assets/img/work2.jpg'}"
                                        alt="${item.title || 'Video'}">

                                    <div class="design-card__overlay">
                                        <div class="design-card__zoom">
                                            <i class='bx bx-play'></i>
                                        </div>
                                    </div>

                                    <div class="design-card__label">
                                        ${item.title || 'Video'}
                                    </div>

                                </a>
                            `
                            )
                            .join(
                                ''
                            )}

                        </div>

                    </div>
                `;
                }
            );

        container.innerHTML =
            html;
    }

    loadVideos();
}

/* ==========================================================
   WEBSITE — LOAD & RENDER
========================================================= */
if (document.getElementById('website-content')) {
    function renderWebsites(data) {
        const container = document.getElementById('website-content');
        if (!data?.length) {
            container.innerHTML = `<div class="empty-state"><p>Belum ada karya website.</p></div>`;
            return;
        }

        let html = '<div class="year-section visible"><div class="design-grid website-grid">';
        data.forEach(item => {
            const imgSrc = item.image_url ? thumbUrl(item.image_url, 'designs') : 'assets/img/work4.jpg'; // default
            
            // Layout card untuk website: Menampilkan link demo dan github jika ada
            html += `
                <div class="design-card website-card img-loaded" style="cursor: default;">
                    <img class="thumb loaded" src="${imgSrc}" alt="${item.title || 'Website'}">
                    <div class="design-card__label" style="bottom: auto; top: 0; transform: translateY(-100%); background: linear-gradient(rgba(14, 36, 49, .72), transparent);">
                        ${item.title || 'Website'}
                    </div>
                    <div style="position: absolute; bottom: 15px; width: 100%; display: flex; justify-content: center; gap: 10px; z-index: 5;">
                        ${item.project_link ? `<a href="${item.project_link}" target="_blank" class="button" style="padding: 5px 15px; font-size: 0.8rem; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"><i class='bx bx-link-external'></i> Visit</a>` : ''}
                        ${item.github_link ? `<a href="${item.github_link}" target="_blank" class="button button-ghost" style="padding: 5px 15px; font-size: 0.8rem; background: rgba(255,255,255,0.9); box-shadow: 0 4px 10px rgba(0,0,0,0.3);"><i class='bx bxl-github'></i> Code</a>` : ''}
                    </div>
                </div>
            `;
        });
        html += '</div></div>';
        container.innerHTML = html;
    }

    async function loadWebsites() {
        const container = document.getElementById('website-content');
        let data = [];
        try {
            if (SB_URL) {
                data = await sbFetch('websites?select=*&order=created_at.desc');
            }
        } catch (err) {
            console.warn("Gagal mengambil data dari Supabase:", err.message);
            // Lanjutkan untuk menampilkan data dummy
        }
            
        // --- INJEKSI DATA DUMMY SEMENTARA ---
        if (!data || data.length === 0) {
            data = [
                {
                    title: "E-Commerce SportApp",
                    description: "Website e-commerce untuk perlengkapan olahraga dengan fitur payment gateway terintegrasi.",
                    image_url: "assets/img/work1.jpg",
                    project_link: "https://example.com",
                    github_link: "https://github.com",
                    created_at: new Date().toISOString()
                },
                {
                    title: "Dashboard Admin Pro",
                    description: "Sistem manajemen inventaris berbasis web dengan analitik real-time dan dark mode.",
                    image_url: "assets/img/work2.jpg",
                    project_link: "https://example.com",
                    github_link: null,
                    created_at: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    title: "Landing Page SaaS",
                    description: "Desain landing page modern untuk perusahaan Software as a Service.",
                    image_url: "assets/img/work3.jpg",
                    project_link: null,
                    github_link: "https://github.com",
                    created_at: new Date(Date.now() - 172800000).toISOString()
                }
            ];
        }
        // ------------------------------------
        
        renderWebsites(data);
    }

    loadWebsites();
}

/* ==========================================================
   PORTFOLIO DYNAMIC FETCH LOGIC (INDEX.HTML)
========================================================== */
if (document.getElementById('portfolio-grid')) {
    const grid = document.getElementById('portfolio-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const seeAllLink = document.getElementById('see-all-link');

    const categoryMap = {
        'website': { url: 'website.html', text: 'Lihat Semua Website', table: 'websites' },
        'design': { url: 'design.html', text: 'Lihat Semua Design', table: 'designs' },
        'video': { url: 'video.html', text: 'Lihat Semua Video', table: 'videos' },
        'dokumentasi': { url: 'dokumentasi.html', text: 'Lihat Semua Dokumentasi', table: 'dokumentasi' }
    };

    let currentCategory = 'website';
    
    // Caching state for each category
    const state = {
        'website': { data: [], offset: 0, hasMore: true, isLoading: false, initialized: false },
        'design':  { data: [], offset: 0, hasMore: true, isLoading: false, initialized: false },
        'video':   { data: [], offset: 0, hasMore: true, isLoading: false, initialized: false },
        'dokumentasi': { data: [], offset: 0, hasMore: true, isLoading: false, initialized: false }
    };

    // Navigation buttons logic
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            const cardWidth = grid.querySelector('.portfolio-card')?.offsetWidth || 320;
            const gap = 32; // 2rem = 32px
            grid.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', () => {
            const cardWidth = grid.querySelector('.portfolio-card')?.offsetWidth || 320;
            const gap = 32;
            grid.scrollBy({ left: (cardWidth + gap), behavior: 'smooth' });
        });
    }

    // Infinite scroll listener
    grid.addEventListener('scroll', () => {
        const catState = state[currentCategory];
        if (catState.isLoading || !catState.hasMore) return;
        if (grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 100) {
            loadMore();
        }
    });

    const renderCards = (items, category, append = false) => {
        if (!items || items.length === 0) {
            if (!append) {
                grid.innerHTML = `<div style="text-align:center; padding:2rem; width:100%; color:#6b7280;"><p>Belum ada data untuk kategori ini.</p></div>`;
            }
            return;
        }

        let html = '';
        items.forEach(item => {
            const title = item.title || 'Portfolio Item';
            const desc = item.description || (category === 'video' ? 'Karya video kreatif.' : 'Deskripsi portofolio.');
            
            const imgRaw = item.image_url || item.thumbnail_url;
            let bucket = 'designs';
            if (category === 'video') bucket = 'videos';
            if (category === 'dokumentasi') bucket = 'dokumentasi';
            
            const img = imgRaw ? thumbUrl(imgRaw, bucket) : 'assets/img/work1.jpg';
            
            const badgeText = (item.category || category).toUpperCase();
            
            // Tech stack handling (split by comma, pipe, semicolon, or slash)
            let techStacks = [];
            if (item.tech_stack) {
                if (Array.isArray(item.tech_stack)) {
                    techStacks = item.tech_stack;
                } else if (typeof item.tech_stack === 'string') {
                    // Split berdasarkan koma (,), garis tegak (|), titik koma (;), atau garis miring (/)
                    techStacks = item.tech_stack.split(/[,|;/]+/).map(s => s.trim()).filter(Boolean);
                }
            } else if (category === 'website') {
                // Default fallback if tech_stack is not specified for website
                techStacks = ['HTML', 'CSS', 'JavaScript'];
            }
            
            let tagsHtml = '';
            if (techStacks.length > 0) {
                tagsHtml = techStacks.map(tech => `<span class="tech-badge"><i class='bx bx-code-alt'></i> ${esc(tech)}</span>`).join('');
            } else {
                tagsHtml = `<span>${badgeText}</span>`;
            }
            
            let footerHtml = '';
            if (item.github_link) {
                footerHtml += `<a href="${item.github_link}" target="_blank" class="portfolio-card__link" onclick="event.stopPropagation()"><i class='bx bxl-github'></i> Code</a>`;
            }
            let demoLink = item.project_link || item.video_url || item.image_url;
            if (demoLink) {
                footerHtml += `<a href="${demoLink}" target="_blank" class="portfolio-card__link" onclick="event.stopPropagation()"><i class='bx bx-link-external'></i> View</a>`;
            }
            
            let cardClickHtml = '';
            if ((category === 'website' || category === 'video') && demoLink) {
                cardClickHtml = `onclick="window.open('${demoLink}', '_blank')" style="cursor: pointer;" title="Buka ${title}"`;
            } else if ((category === 'design' || category === 'dokumentasi') && imgRaw) {
                cardClickHtml = `onclick="window.openDesignModal('${thumbUrl(imgRaw, bucket)}', '${title.replace(/'/g, "\\'")}')" style="cursor: pointer;" title="Preview ${title}"`;
            }

            html += `
                <div class="portfolio-card" ${cardClickHtml}>
                    <div class="portfolio-card__img">
                        <img src="${img}" alt="${title}">
                        <span class="portfolio-card__tag-overlay">${badgeText}</span>
                    </div>
                    <div class="portfolio-card__body">
                        <h3 class="portfolio-card__title">${title}</h3>
                        <p class="portfolio-card__desc">${desc}</p>
                        <div class="portfolio-card__tags">${tagsHtml}</div>
                        <div class="portfolio-card__footer">
                            ${footerHtml || '<span style="color:#d1d5db;font-size:0.8rem;">No Links</span>'}
                        </div>
                    </div>
                </div>
            `;
        });

        if (append) {
            grid.insertAdjacentHTML('beforeend', html);
        } else {
            grid.innerHTML = html;
        }
    };

    const fetchCategoryData = async (category, offset) => {
        const mapping = categoryMap[category];
        if (!mapping || !mapping.table) return [];

        let order = 'created_at.desc';
        let query = `${mapping.table}?select=*`;
        
        if (category === 'video') {
            order = 'year.desc,created_at.desc';
        } else if (category === 'design') {
            order = 'created_at.desc';
        }
        // Change limit from 5 to 4
        query += `&order=${order}&limit=4&offset=${offset}`;

        let data = [];
        if (SB_URL) {
            data = await sbFetch(query);
            
            // Coba cari di tabel websites jika designs kosong atau user menaruhnya di tabel websites
            if ((!data || data.length === 0) && category === 'design') {
                let proj = await sbFetch(`websites?select=*&order=created_at.desc`);
                if (proj && proj.length > 0) {
                    data = proj.filter(p => p.category && (p.category.toLowerCase().includes('desain') || p.category.toLowerCase().includes('design'))).slice(offset, offset + 4);
                }
            }
        }
        return data || [];
    };

    const loadMore = async () => {
        const catState = state[currentCategory];
        if (!catState.hasMore) return;
        
        catState.isLoading = true;
        try {
            const data = await fetchCategoryData(currentCategory, catState.offset);
            if (data && data.length > 0) {
                catState.data = catState.data.concat(data);
                catState.offset += data.length;
                if (data.length < 4) catState.hasMore = false;
                
                // Only render if we are still on the same category
                if (currentCategory === currentCategory) {
                    renderCards(data, currentCategory, true);
                }
            } else {
                catState.hasMore = false;
            }
        } catch (e) {
            catState.hasMore = false;
        } finally {
            catState.isLoading = false;
        }
    };

    const getDummyData = (category) => {
        if (category === 'website') {
            return [
                { title: "E-Commerce SportApp", description: "Website e-commerce untuk perlengkapan olahraga dengan fitur payment gateway.", tech_stack: "React, Laravel, Tailwind CSS, MySQL", image_url: "assets/img/work1.jpg", project_link: "https://example.com", github_link: "#" },
                { title: "Dashboard Admin", description: "Sistem inventaris dan analitik data.", tech_stack: "Vue.js, Laravel, Bootstrap, PostgreSQL", image_url: "assets/img/work2.jpg", project_link: "#" }
            ];
        } else if (category === 'design') {
            return [
                { title: "Ocular Sentinel", description: "Deteksi gangguan proyek.", image_url: "assets/img/work1.jpg", project_link: "#" },
                { title: "UI/UX Mobile App", description: "Desain antarmuka pengguna.", image_url: "assets/img/work3.jpg", project_link: "#" }
            ];
        } else if (category === 'video') {
            return [
                { title: "Motion Graphics Ad", thumbnail_url: "assets/img/work2.jpg", video_url: "#" }
            ];
        }
        return [];
    };

    const switchCategoryUI = (category) => {
        currentCategory = category;
        const mapping = categoryMap[category];
        
        // Update Buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        const activeBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        // Update See All Link
        if (seeAllLink && mapping) {
            seeAllLink.href = mapping.url;
            seeAllLink.innerHTML = `${mapping.text} <i class='bx bx-right-arrow-alt'></i>`;
        }
        
        const catState = state[category];
        if (!catState.initialized) {
            grid.innerHTML = `<div style="text-align:center; padding:2rem; width:100%; color:#6b7280;"><p>Memuat data...</p></div>`;
        } else {
            renderCards(catState.data, category, false);
            // reset scroll position for new category
            grid.scrollLeft = 0;
        }
    };

    const loadCategory = (category) => {
        switchCategoryUI(category);
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.getAttribute('data-filter');
            loadCategory(cat);
        });
    });

    // Initialize all categories simultaneously
    const initializeAllCategories = async () => {
        // Prepare initial UI
        switchCategoryUI('website');
        
        const categoriesToFetch = ['website', 'design', 'video', 'dokumentasi'];
        
        await Promise.all(categoriesToFetch.map(async (cat) => {
            const catState = state[cat];
            try {
                const data = await fetchCategoryData(cat, 0);
                if (!data || data.length === 0) throw new Error("No data");
                
                catState.data = data;
                catState.offset = data.length;
                if (data.length < 4) catState.hasMore = false;
                catState.initialized = true;
            } catch (err) {
                // fallback to dummy data
                const dummy = getDummyData(cat);
                catState.data = dummy;
                catState.hasMore = false;
                catState.initialized = true;
            }
        }));

        // Render the currently selected category after everything is initialized
        if (state[currentCategory].initialized) {
            renderCards(state[currentCategory].data, currentCategory, false);
        }
    };

    // Fetch and load stats for About Section
    const loadStatsFront = async () => {
        try {
            if (typeof sbFetch !== 'function') return;
            const data = await sbFetch('about_stats?id=eq.1');
            if (data && data.length > 0) {
                const stat = data[0];
                const p = document.getElementById('front-stat-projects');
                const c = document.getElementById('front-stat-clients');
                const h = document.getElementById('front-stat-happy');
                const o = document.getElementById('front-stat-ongoing');
                if(p) p.innerText = stat.projects || '0';
                if(c) c.innerText = stat.clients || '0';
                if(h) h.innerText = stat.happy_clients || '0';
                if(o) o.innerText = stat.ongoing || '0';
            }
        } catch (e) {
            console.log('Using default stats', e);
        }
    };
    
    // Call it immediately if on index
    if (document.getElementById('front-stat-projects')) {
        loadStatsFront();
    }

    initializeAllCategories();
}

/* ==========================================================
   GLOBAL DESIGN PREVIEW MODAL
========================================================== */
window.openDesignModal = function(fullSrc, title) {
    const modal = document.getElementById('design-modal');
    if (!modal) return;
    
    const modalImg = document.getElementById('modal-img');
    const modalBar = document.getElementById('modal-bar');
    const modalLoader = document.getElementById('modal-loader');
    
    if (modalLoader) modalLoader.classList.remove('hidden');
    if (modalImg) modalImg.style.opacity = '0';
    if (modalBar) modalBar.textContent = title || '';
    
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    const tempImg = new Image();
    tempImg.onload = () => {
        if (modalImg) {
            modalImg.src = fullSrc;
            modalImg.style.opacity = '1';
        }
        if (modalLoader) modalLoader.classList.add('hidden');
    };
    tempImg.onerror = () => {
        if (modalLoader) modalLoader.classList.add('hidden');
        if (modalImg) {
            modalImg.src = fullSrc;
            modalImg.style.opacity = '1';
        }
    };
    tempImg.src = fullSrc;
};

window.closeDesignModal = function() {
    const modal = document.getElementById('design-modal');
    if (!modal) return;
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    const modalImg = document.getElementById('modal-img');
    if (modalImg) modalImg.src = '';
    document.body.style.overflow = '';
};

document.addEventListener('click', (e) => {
    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('modal-close');
    if (e.target === overlay || (closeBtn && closeBtn.contains(e.target))) {
        window.closeDesignModal();
    }
});

/* ==========================================================
   DOKUMENTASI — LOAD & RENDER
========================================================= */
if (document.getElementById('dokumentasi-content')) {
    function renderDokumentasi(data) {
        const container = document.getElementById('dokumentasi-content');
        if (!data?.length) {
            container.innerHTML = `<div class="empty-state"><p>Belum ada dokumentasi.</p></div>`;
            return;
        }

        let html = '<div class="year-section visible"><div class="design-grid">';
        data.forEach(item => {
            const imgSrc = item.image_url ? thumbUrl(item.image_url, 'dokumentasi') : 'assets/img/work1.jpg'; // default
            
            html += `
                <div class="design-card img-loaded" style="cursor: default; padding-bottom: 20px;">
                    <img class="thumb loaded" src="${imgSrc}" alt="${item.title || 'Dokumentasi'}">
                    <div class="design-card__label">
                        ${item.title || 'Dokumentasi'}
                    </div>
                </div>
            `;
        });
        html += '</div></div>';
        container.innerHTML = html;
    }

    async function loadDokumentasiPublic() {
        const container = document.getElementById('dokumentasi-content');
        let data = [];
        try {
            if (SB_URL) {
                data = await sbFetch('dokumentasi?select=*&order=created_at.desc');
            }
        } catch (err) {
            console.warn("Gagal mengambil data dari Supabase:", err.message);
        }
            
        renderDokumentasi(data);
    }

    loadDokumentasiPublic();
}

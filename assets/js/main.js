/* ==========================================================
   GLOBAL SUPABASE CONFIG
========================================================== */

const SB_URL =
    localStorage.getItem('fahril_sb_url') || '';

const SB_KEY =
    localStorage.getItem('fahril_sb_key') || '';

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

function thumbUrl(url, width = 400) {
    if (!url) return '';
    
    // Fitur Image Transformation Supabase (/render/image/public/) berbayar (Pro Plan) 
    // atau memiliki limit ketat di Free Plan. Jika gagal, gambar akan rusak.
    // Solusi: Kembalikan URL asli agar browser memuat gambar ukuran penuh (original).
    return url;
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
        '.home__data, .about__img, .skills__subtitle, .skills__text',
        {}
    );

    sr.reveal(
        '.home__img, .about__subtitle, .about__text, .skills__img, .about__container .button',
        { delay: 400 }
    );

    sr.reveal(
        '.home__social-icon',
        { interval: 200 }
    );

    sr.reveal(
        '.skills__data, .work__img, .contact__input',
        { interval: 200 }
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
                                    data-src="${thumbUrl(item.image_url)}"
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
                                    class="design-card">

                                    <img
                                        class="thumb loaded"
                                        src="${item.thumbnail_url}"
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

        let html = '<div class="year-section visible"><div class="design-grid">';
        data.forEach(item => {
            const imgSrc = item.image_url ? item.image_url : 'assets/img/work4.jpg'; // default
            
            // Layout card untuk website: Menampilkan link demo dan github jika ada
            html += `
                <div class="design-card" style="cursor: default; padding-bottom: 50px;">
                    <img class="thumb loaded" src="${imgSrc}" alt="${item.title || 'Website'}">
                    <div class="design-card__label" style="bottom: 45px;">
                        ${item.title || 'Website'}
                    </div>
                    <div style="position: absolute; bottom: 10px; width: 100%; display: flex; justify-content: center; gap: 10px; z-index: 5;">
                        ${item.project_link ? `<a href="${item.project_link}" target="_blank" class="button" style="padding: 5px 15px; font-size: 0.8rem;"><i class='bx bx-link-external'></i> Visit</a>` : ''}
                        ${item.github_link ? `<a href="${item.github_link}" target="_blank" class="button button-ghost" style="padding: 5px 15px; font-size: 0.8rem;"><i class='bx bxl-github'></i> Code</a>` : ''}
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
        'dokumentasi': { url: '#', text: 'Lihat Semua Dokumentasi', table: null }
    };

    let currentCategory = 'website';
    let currentOffset = 0;
    let isLoadingMore = false;
    let hasMoreData = true;

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
        if (isLoadingMore || !hasMoreData) return;
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
            const img = item.image_url || item.thumbnail_url || 'assets/img/work1.jpg';
            
            let tagsHtml = `<span>${category.toUpperCase()}</span>`;
            
            let footerHtml = '';
            if (item.github_link) {
                footerHtml += `<a href="${item.github_link}" target="_blank" class="portfolio-card__link"><i class='bx bxl-github'></i> Code</a>`;
            }
            let demoLink = item.project_link || item.video_url || item.image_url;
            if (demoLink) {
                footerHtml += `<a href="${demoLink}" target="_blank" class="portfolio-card__link"><i class='bx bx-link-external'></i> View</a>`;
            }

            html += `
                <div class="portfolio-card">
                    <div class="portfolio-card__img">
                        <img src="${img}" alt="${title}">
                        <span class="portfolio-card__tag-overlay">${category.toUpperCase()}</span>
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
        let order = 'created_at.desc';
        let query = `${mapping.table}?select=*`;
        
        if (category === 'video') {
            order = 'year.desc,created_at.desc';
        } else if (category === 'design') {
            order = 'created_at.desc';
        }
        query += `&order=${order}&limit=5&offset=${offset}`;

        let data = [];
        if (SB_URL) {
            data = await sbFetch(query);
            
            // Coba cari di tabel websites jika designs kosong atau user menaruhnya di tabel websites
            if ((!data || data.length === 0) && category === 'design') {
                let proj = await sbFetch(`websites?select=*&order=created_at.desc`);
                if (proj && proj.length > 0) {
                    data = proj.filter(p => p.category && (p.category.toLowerCase().includes('desain') || p.category.toLowerCase().includes('design'))).slice(offset, offset + 5);
                }
            }
        }
        return data;
    };

    const loadMore = async () => {
        if (!hasMoreData) return;
        isLoadingMore = true;

        try {
            const data = await fetchCategoryData(currentCategory, currentOffset);
            if (data && data.length > 0) {
                renderCards(data, currentCategory, true);
                currentOffset += data.length;
                if (data.length < 5) hasMoreData = false;
            } else {
                hasMoreData = false;
            }
        } catch (e) {
            hasMoreData = false;
        } finally {
            isLoadingMore = false;
        }
    };

    const loadCategory = async (category) => {
        currentCategory = category;
        currentOffset = 0;
        hasMoreData = true;
        isLoadingMore = false;

        const mapping = categoryMap[category];
        if (!mapping) return;

        filterBtns.forEach(b => b.classList.remove('active'));
        const activeBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        if (seeAllLink) {
            seeAllLink.href = mapping.url;
            seeAllLink.innerHTML = `${mapping.text} <i class='bx bx-right-arrow-alt'></i>`;
        }

        grid.innerHTML = `<div style="text-align:center; padding:2rem; width:100%; color:#6b7280;"><p>Memuat data...</p></div>`;

        if (!mapping.table) {
            grid.innerHTML = `<div style="text-align:center; padding:2rem; width:100%; color:#6b7280;"><p>Data segera hadir.</p></div>`;
            return;
        }

        try {
            const data = await fetchCategoryData(category, currentOffset);
            
            if (!data || data.length === 0) throw new Error("No data");
            
            if (data.length < 5) hasMoreData = false;
            
            renderCards(data, category, false);
            currentOffset += data.length;
        } catch (err) {
            let dummyData = [];
            if (category === 'website') {
                dummyData = [
                    { title: "E-Commerce SportApp", description: "Website e-commerce untuk perlengkapan olahraga dengan fitur payment gateway.", image_url: "assets/img/work1.jpg", project_link: "https://example.com", github_link: "#" },
                    { title: "Dashboard Admin", description: "Sistem inventaris.", image_url: "assets/img/work2.jpg", project_link: "#" }
                ];
            } else if (category === 'design') {
                dummyData = [
                    { title: "Ocular Sentinel", description: "Deteksi gangguan proyek.", image_url: "assets/img/work1.jpg", project_link: "#" },
                    { title: "UI/UX Mobile App", description: "Desain antarmuka pengguna.", image_url: "assets/img/work3.jpg", project_link: "#" }
                ];
            } else if (category === 'video') {
                dummyData = [
                    { title: "Motion Graphics Ad", thumbnail_url: "assets/img/work2.jpg", video_url: "#" }
                ];
            }
            renderCards(dummyData, category, false);
            hasMoreData = false;
        }
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.getAttribute('data-filter');
            loadCategory(cat);
        });
    });

    loadCategory('website');
}

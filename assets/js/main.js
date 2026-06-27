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
        try {
            const data = await sbFetch('projects?select=*&order=created_at.desc');
            renderWebsites(data);
        } catch (err) {
            container.innerHTML = `<div class="error-state"><p>${esc(err.message)}</p></div>`;
        }
    }

    loadWebsites();
}

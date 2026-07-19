// PORTFOL// PORTFOLIO FILTER (mit Isotope)
// Verhindert, dass der Browser sich die Scroll-Position beim Neuladen merkt
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.scrollTo(0, 0); 
const filterButtons = document.querySelectorAll('.filter-menu button');
const gallery = document.querySelector('.gallery');

// alle Bilder/Videos laden
imagesLoaded(gallery, function() {
    
    // Isotope initialisieren
    // Isotope initialisieren
    var iso = new Isotope(gallery, {
        itemSelector: '.item',
        layoutMode: 'masonry', 
        percentPosition: true, 
        transitionDuration: 0, 
        filter: '.item:not(.text-banner)', 
        masonry: {
            // NEU: Isotope orientiert sich jetzt immer am Grid-Sizer
            columnWidth: '.grid-sizer', 
            gutter: 0
        }
    });

    // Jedem Filter-Button einen Klick-Befehl geben
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            
            // 1. "active" Klasse umschalten
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 2. Filter-Wert auslesen
            const filterValue = button.getAttribute('data-filter');

            // --- BANNER LOGIK ---
            const codingBanner = document.getElementById('coding-banner');
            if(codingBanner) {
                if (filterValue === 'coding') {
                    codingBanner.style.display = 'block';
                } else {
                    codingBanner.style.display = 'none'; 
                }
            }

            // 3. Isotope anweisen
            const isotopeFilter = filterValue === 'all' ? '.item:not(.text-banner)' : `[data-category="${filterValue}"]`;
            iso.arrange({ filter: isotopeFilter });
        });
    });
});

// Seiten-Navigation 
const navButtons = document.querySelectorAll('.main-nav button');

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        document.querySelectorAll('.page-section').forEach(sec => {
            sec.classList.remove('active');
        });

        const targetId = button.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

// --- VIDEO INTERAKTION ---
const videoContainers = document.querySelectorAll('.gallery .item:has(video)');

videoContainers.forEach(container => {
    const video = container.querySelector('video');
    if (video) {
        container.addEventListener('mouseenter', () => {
            video.play().catch(error => console.log("Play blocked:", error));
        });
        container.addEventListener('mouseleave', () => {
            video.pause();
        });
    } 
});

// --- LIGHTBOX ---
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
    <div class="lightbox-wrapper">
        <span class="lightbox-close">&times;</span>
        <img id="lightbox-img" src="" alt="" style="display: none;">
        <video id="lightbox-video" autoplay loop muted playsinline style="display: none; outline: none;"></video>
        <div class="lightbox-info">
            <p id="lightbox-text"></p>
        </div>
    </div>
`;
document.body.appendChild(lightbox);

const lightboxImg = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');
const lightboxText = document.getElementById('lightbox-text');
const galleryItems = document.querySelectorAll('.gallery .item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        // Sicherung: Ignoriere Klicks auf die neuen Trenn-Banner
        if (item.classList.contains('text-banner')) return;

        const overlaySpan = item.querySelector('.overlay span');
        lightboxText.innerHTML = overlaySpan ? overlaySpan.innerHTML : ''; 
        
        const img = item.querySelector('img');
        const video = item.querySelector('video');

        if (img) {
            lightboxVideo.style.display = 'none'; 
            lightboxVideo.src = ''; 
            lightboxImg.style.display = 'block'; 
            lightboxImg.src = img.src;
        } else if (video) {
            lightboxImg.style.display = 'none'; 
            lightboxImg.src = '';
            lightboxVideo.style.display = 'block'; 
            const source = video.querySelector('source');
            lightboxVideo.src = source ? source.src : video.src;
        }
        
        lightbox.classList.add('active');
    });
});

lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg && e.target !== lightboxVideo && e.target.closest('.lightbox-info') === null) {
        lightbox.classList.remove('active');
        lightboxVideo.pause(); 
        lightboxVideo.src = ''; 
    }
});
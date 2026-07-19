// PORTFOLIO FILTER (mit Isotope)
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0); 

const filterButtons = document.querySelectorAll('.filter-menu button');
const gallery = document.querySelector('.gallery');

// --- NEU: Gespeicherte Werte aus dem Browser laden (oder Standardwerte nutzen) ---
const savedFilter = localStorage.getItem('activeFilter') || 'all';
const savedPage = localStorage.getItem('activePage') || 'portfolio';

// alle Bilder/Videos laden
imagesLoaded(gallery, function() {
    
    // Den initialen Filter bauen, basierend auf dem gespeicherten Wert
    const initialIsotopeFilter = savedFilter === 'all' ? '.item:not(.text-banner)' : `[data-category="${savedFilter}"]`;

    // Isotope initialisieren
    var iso = new Isotope(gallery, {
        itemSelector: '.item',
        layoutMode: 'masonry', 
        percentPosition: true, 
        transitionDuration: 0, 
        filter: initialIsotopeFilter, // Nutzt den gespeicherten Zustand!
        masonry: {
            columnWidth: '.grid-sizer', 
            gutter: 0
        }
    });

    // Die Filter-Buttons beim Laden richtig einfärben
    filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === savedFilter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Altes Coding-Banner beim Laden prüfen
    const codingBanner = document.getElementById('coding-banner');
    if (codingBanner) {
        codingBanner.style.display = (savedFilter === 'coding') ? 'block' : 'none';
    }

    // Klick-Event für die Filter-Buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            
            // --- NEU: DEN GEWÄHLTEN FILTER IM BROWSER SPEICHERN ---
            localStorage.setItem('activeFilter', filterValue);

            if (codingBanner) {
                codingBanner.style.display = (filterValue === 'coding') ? 'block' : 'none';
            }

            const isotopeFilter = filterValue === 'all' ? '.item:not(.text-banner)' : `[data-category="${filterValue}"]`;
            iso.arrange({ filter: isotopeFilter });
        });
    });
});

// --- SEITEN-NAVIGATION --- 
const navButtons = document.querySelectorAll('.main-nav button');

// Zustand der Haupt-Tabs beim ersten Laden wiederherstellen
navButtons.forEach(btn => {
    if (btn.getAttribute('data-target') === savedPage) {
        btn.classList.add('active');
    } else {
        btn.classList.remove('active');
    }
});
document.querySelectorAll('.page-section').forEach(sec => {
    if (sec.id === savedPage) {
        sec.classList.add('active');
    } else {
        sec.classList.remove('active');
    }
});

// Klick-Event für die Haupt-Navigation
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        document.querySelectorAll('.page-section').forEach(sec => {
            sec.classList.remove('active');
        });

        const targetId = button.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
        
        // --- NEU: DIE GEWÄHLTE SEITE IM BROWSER SPEICHERN ---
        localStorage.setItem('activePage', targetId);
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

const logoLink = document.querySelector('.logo-link');
if (logoLink) {
    logoLink.addEventListener('click', () => {
        localStorage.removeItem('activeFilter');
        localStorage.removeItem('activePage');
    });
}

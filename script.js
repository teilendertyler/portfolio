// PORTFOLIO FILTER (mit Isotope)
// Verhindert, dass der Browser sich die Scroll-Position beim Neuladen merkt
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Scrollt beim Laden der Seite hart nach ganz oben
window.scrollTo(0, 0); 
const filterButtons = document.querySelectorAll('.filter-menu button');
const gallery = document.querySelector('.gallery');

// alle Bilder/Videos laden
imagesLoaded(gallery, function() {
    
 // Isotope initialisieren
    var iso = new Isotope(gallery, {
        itemSelector: '.item',
        layoutMode: 'masonry', 
        percentPosition: true, 
        transitionDuration: 0, 
        masonry: {
            columnWidth: '.item:not(.text-banner)', 
            gutter: 0
        }
    });

   // Jedem Filter-Button einen Klick-Befehl geben
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            
            // 1. "active" Klasse umschalten (visuell)
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 2. Filter-Wert aus dem HTML auslesen (z.B. "illustrator" oder "all")
            const filterValue = button.getAttribute('data-filter');

            // --- NEU: BANNER LOGIK ---
            const codingBanner = document.getElementById('coding-banner');
            if (filterValue === 'coding') {
                codingBanner.style.display = 'block'; // Banner zeigen, wenn Coding aktiv ist
            } else {
                codingBanner.style.display = 'none';  // Banner verstecken bei allen anderen
            }
            // -------------------------

            // 3. Isotope Filter-Syntax bauen: Wenn 'all', zeige alles (*), sonst filtere nach Attribut
            const isotopeFilter = filterValue === 'all' ? '*' : `[data-category="${filterValue}"]`;
            
            // 4. Isotope anweisen, die Galerie flüssig neu anzuordnen
            iso.arrange({ filter: isotopeFilter });
        });
    });
});

// Seiten-Navigation 
const navButtons = document.querySelectorAll('.main-nav button');

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Alle Knöpfe auf inaktiv setzen, geklickten auf aktiv
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Alle Seiten ausblenden
        document.querySelectorAll('.page-section').forEach(sec => {
            sec.classList.remove('active');
        });

        // Nur die gewählte Seite einblenden
        const targetId = button.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

// --- VIDEO INTERAKTION (HOVER & KLICK) ---
// Wir suchen alle .item-Elemente, die ein Video enthalten
const videoContainers = document.querySelectorAll('.gallery .item:has(video)');

videoContainers.forEach(container => {
    // Wir holen uns das Video-Element innerhalb dieses Containers
    const video = container.querySelector('video');

    if (video) {
        // --- 1. HOVER VERHALTEN (für Desktops) ---

        // Wenn die Maus in das Bild fährt -> Abspielen
        container.addEventListener('mouseenter', () => {
            video.play().catch(error => {
                console.log("Video Play blocked by browser:", error);
            });
        });

        // Wenn die Maus das Bild verlässt -> Pause
       container.addEventListener('mouseleave', () => {
            video.pause();
        });
        
    } 
});
       

// 1. Lightbox-Struktur aufbauen (jetzt mit img UND video Tag im Hintergrund)
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

// 2. Klick-Funktion für ALLE Galerie-Elemente (.item)
const galleryItems = document.querySelectorAll('.gallery .item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        // Text holen (mit Absätzen)
        const overlaySpan = item.querySelector('.overlay span');
        lightboxText.innerHTML = overlaySpan ? overlaySpan.innerHTML : ''; 
        
        // Prüfen ob in diesem Item ein Bild oder Video steckt
        const img = item.querySelector('img');
        const video = item.querySelector('video');

        // Wenn es ein BILD ist
        if (img) {
            lightboxVideo.style.display = 'none'; // Video verstecken
            lightboxVideo.src = ''; 
            lightboxImg.style.display = 'block'; // Bild zeigen
            lightboxImg.src = img.src;
        } 
        // Wenn es ein VIDEO ist
        else if (video) {
            lightboxImg.style.display = 'none'; // Bild verstecken
            lightboxImg.src = '';
            lightboxVideo.style.display = 'block'; // Video zeigen
            // Quelle auslesen und in die Lightbox laden
            const source = video.querySelector('source');
            lightboxVideo.src = source ? source.src : video.src;
        }
        
        // Fenster öffnen
        lightbox.classList.add('active');
    });
});

// 3. Lightbox wieder schließen
lightbox.addEventListener('click', (e) => {
    // Schließen, solange man nicht auf das Bild, das Video oder den Info-Kasten klickt
    if (e.target !== lightboxImg && e.target !== lightboxVideo && e.target.closest('.lightbox-info') === null) {
        lightbox.classList.remove('active');
        lightboxVideo.pause(); // Video beim Schließen sofort stoppen
        lightboxVideo.src = ''; // Quelle leeren, damit es nicht im Hintergrund weiterläuft
    }
});
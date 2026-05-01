/* ============================================
   NOSATI PUB - Gallery Page JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initGalleryFilter();
    initLightbox();
});

// Gallery Filter
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.gallery-filter__btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;

            // Filter items with animation
            galleryItems.forEach((item, index) => {
                if (filter === 'sve') {
                    item.classList.remove('hidden');
                    item.style.animation = `fadeIn 0.4s ease ${index * 0.05}s forwards`;
                } else {
                    if (item.dataset.category === filter) {
                        item.classList.remove('hidden');
                        item.style.animation = `fadeIn 0.4s ease ${index * 0.05}s forwards`;
                    } else {
                        item.classList.add('hidden');
                    }
                }
            });
        });
    });
}

// Lightbox
function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentIndex = 0;
    let visibleItems = [];

    function getVisibleItems() {
        return Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
    }

    function openLightbox(index) {
        visibleItems = getVisibleItems();
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('show');
        document.body.style.overflow = '';
    }

    function updateLightbox() {
        const item = visibleItems[currentIndex];
        const img = item.querySelector('img');
        const category = item.querySelector('.gallery-item__category').textContent;
        const title = item.querySelector('h4').textContent;

        // Add loading animation
        lightboxImg.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImg.src = img.src.replace('w=600', 'w=1200').replace('w=800', 'w=1200');
            lightboxCategory.textContent = category;
            lightboxTitle.textContent = title;
            lightboxImg.style.opacity = '1';
        }, 200);
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % visibleItems.length;
        updateLightbox();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        updateLightbox();
    }

    // Event Listeners
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            visibleItems = getVisibleItems();
            const visibleIndex = visibleItems.indexOf(this);
            openLightbox(visibleIndex);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', nextImage);
    lightboxPrev.addEventListener('click', prevImage);

    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('show')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });

    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }
    }
}

// Add fadeIn animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }
`;
document.head.appendChild(style);

/* ============================================
   NOSATI PUB - JavaScript
   Author: Senior Web Developer
   Version: 1.0
   ============================================ */

// ============================================
// DOM Elements
// ============================================
const header = document.getElementById('header');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');
const backToTop = document.getElementById('back-to-top');
const preloader = document.querySelector('.preloader');

// Cart elements
const cartBtn = document.getElementById('cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const cartClose = document.getElementById('cart-close');
const cartOverlay = document.getElementById('cart-overlay');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');

// ============================================
// Preloader
// ============================================
window.addEventListener('load', () => {
    setTimeout(() => {
        preloader?.classList.add('hide');
    }, 500);
});

// ============================================
// Header Scroll Effect
// ============================================
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (window.scrollY > 500) {
        backToTop?.classList.add('show');
    } else {
        backToTop?.classList.remove('show');
    }
});

// ============================================
// Mobile Navigation
// ============================================
navToggle?.addEventListener('click', () => {
    navMenu?.classList.add('show');
    document.body.classList.add('no-scroll');
});

navClose?.addEventListener('click', () => {
    navMenu?.classList.remove('show');
    document.body.classList.remove('no-scroll');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu?.classList.remove('show');
        document.body.classList.remove('no-scroll');
    });
});

// ============================================
// Back to Top
// ============================================
backToTop?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ============================================
// AOS Initialization
// ============================================
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
}

// ============================================
// Menu Tabs
// ============================================
const tabBtns = document.querySelectorAll('.tab__btn');
const tabContents = document.querySelectorAll('.tab__content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;

        // Remove active class from all buttons and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked button and corresponding content
        btn.classList.add('active');
        document.getElementById(tabId)?.classList.add('active');
    });
});

// ============================================
// Shopping Cart System
// ============================================
let cart = JSON.parse(localStorage.getItem('nosatiCart')) || [];

// Update cart display
function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cartCount) cartCount.textContent = totalItems;
    if (cartTotal) cartTotal.textContent = `${totalPrice.toLocaleString('sr-RS')} RSD`;

    // Render cart items
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '';
        } else {
            cartItems.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <div class="cart-item__info">
                        <div class="cart-item__name">${item.name}</div>
                        <div class="cart-item__price">${item.price.toLocaleString('sr-RS')} RSD</div>
                    </div>
                    <div class="cart-item__quantity">
                        <button onclick="updateQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <button class="cart-item__remove" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    // Save to localStorage
    localStorage.setItem('nosatiCart', JSON.stringify(cart));
}

// Add to cart
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price: parseInt(price), quantity: 1 });
    }

    updateCartDisplay();
    showNotification(`${name} dodato u korpu!`);
}

// Update quantity
function updateQuantity(index, change) {
    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    updateCartDisplay();
}

// Remove from cart
function removeFromCart(index) {
    const itemName = cart[index].name;
    cart.splice(index, 1);
    updateCartDisplay();
    showNotification(`${itemName} uklonjen iz korpe`);
}

// Add to cart button handlers
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        const price = btn.dataset.price;
        addToCart(name, price);
    });
});

// Cart sidebar toggle
cartBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
});

cartClose?.addEventListener('click', closeCart);
cartOverlay?.addEventListener('click', closeCart);

function openCart() {
    cartSidebar?.classList.add('show');
    cartOverlay?.classList.add('show');
    document.body.classList.add('no-scroll');
}

function closeCart() {
    cartSidebar?.classList.remove('show');
    cartOverlay?.classList.remove('show');
    document.body.classList.remove('no-scroll');
}

// Initialize cart display
updateCartDisplay();

// ============================================
// Notification System
// ============================================
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: ${type === 'success' ? '#1a472a' : '#dc3545'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations to head
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// Testimonials Slider
// ============================================
const testimonialCards = document.querySelectorAll('.testimonial__card');
const testimonialPrev = document.querySelector('.testimonial__btn.prev');
const testimonialNext = document.querySelector('.testimonial__btn.next');
const testimonialDotsContainer = document.querySelector('.testimonials__dots');

let currentTestimonial = 0;

// Create dots
if (testimonialDotsContainer && testimonialCards.length > 0) {
    testimonialCards.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToTestimonial(index));
        testimonialDotsContainer.appendChild(dot);
    });
}

function updateTestimonials() {
    testimonialCards.forEach((card, index) => {
        card.classList.remove('active');
        if (index === currentTestimonial) {
            card.classList.add('active');
        }
    });

    // Update dots
    const dots = document.querySelectorAll('.testimonials__dots .dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentTestimonial);
    });
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    updateTestimonials();
}

function prevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
    updateTestimonials();
}

function goToTestimonial(index) {
    currentTestimonial = index;
    updateTestimonials();
}

testimonialNext?.addEventListener('click', nextTestimonial);
testimonialPrev?.addEventListener('click', prevTestimonial);

// Auto-slide testimonials
if (testimonialCards.length > 0) {
    setInterval(nextTestimonial, 5000);
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = header?.offsetHeight || 80;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ============================================
// Active Navigation Link on Scroll
// ============================================
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
});

// ============================================
// Gallery Lightbox
// ============================================
const galleryItems = document.querySelectorAll('.gallery-preview__item, .gallery__item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
            openLightbox(img.src, img.alt);
        }
    });
});

function openLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox__overlay"></div>
        <div class="lightbox__content">
            <img src="${src}" alt="${alt}">
            <button class="lightbox__close">&times;</button>
        </div>
    `;

    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    const overlay = lightbox.querySelector('.lightbox__overlay');
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
    `;

    const content = lightbox.querySelector('.lightbox__content');
    content.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
        animation: zoomIn 0.3s ease;
    `;

    const imgEl = lightbox.querySelector('img');
    imgEl.style.cssText = `
        max-width: 100%;
        max-height: 85vh;
        border-radius: 8px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    `;

    const closeBtn = lightbox.querySelector('.lightbox__close');
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 2.5rem;
        cursor: pointer;
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(lightbox);
    document.body.classList.add('no-scroll');

    // Close handlers
    overlay.addEventListener('click', () => closeLightbox(lightbox));
    closeBtn.addEventListener('click', () => closeLightbox(lightbox));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox(lightbox);
    });
}

function closeLightbox(lightbox) {
    lightbox.remove();
    document.body.classList.remove('no-scroll');
}

// Add lightbox animation
const lightboxStyle = document.createElement('style');
lightboxStyle.textContent = `
    @keyframes zoomIn {
        from {
            transform: scale(0.8);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
`;
document.head.appendChild(lightboxStyle);

// ============================================
// Form Validation Helper
// ============================================
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }

        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                input.classList.add('error');
            }
        }

        // Phone validation
        if (input.type === 'tel' && input.value) {
            const phoneRegex = /^[\d\s\+\-\(\)]{9,}$/;
            if (!phoneRegex.test(input.value)) {
                isValid = false;
                input.classList.add('error');
            }
        }
    });

    return isValid;
}

// ============================================
// Lazy Loading Images
// ============================================
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// ============================================
// Console Welcome Message
// ============================================
console.log(
    '%c🍺 Nosati Pub %c\n' +
    '%cVaše omiljeno mesto za craft pivo i dobru hranu!\n' +
    '%cwww.nosatipub.rs',
    'font-size: 24px; font-weight: bold; color: #d4a84b;',
    '',
    'font-size: 14px; color: #1a472a;',
    'font-size: 12px; color: #666;'
);

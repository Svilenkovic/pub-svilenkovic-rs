/* ============================================
    PUB DEMO - Order Page JavaScript
   ============================================ */

// DOM Elements
const categoryButtons = document.querySelectorAll('.category-btn');
const orderItems = document.querySelectorAll('.order-item');
const orderSummaryItems = document.getElementById('order-summary-items');
const subtotalEl = document.getElementById('subtotal');
const deliveryFeeEl = document.getElementById('delivery-fee');
const totalEl = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');

// Constants
const DELIVERY_FEE = 150;
const FREE_DELIVERY_THRESHOLD = 2000;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initCategoryFilter();
    initAddToOrderButtons();
    initModals();
    updateOrderSummary();
});

// Category Filter
function initCategoryFilter() {
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            categoryButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const category = this.dataset.category;

            // Filter items
            orderItems.forEach(item => {
                if (category === 'sve') {
                    item.classList.remove('hidden');
                } else {
                    if (item.dataset.category === category) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                }
            });
        });
    });
}

// Add to Order Buttons
function initAddToOrderButtons() {
    document.querySelectorAll('.order-item .btn--primary').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const item = this.closest('.order-item');
            const name = item.querySelector('h4').textContent;
            const priceText = item.querySelector('.order-item__price').textContent;
            const price = parseInt(priceText.replace(/[^\d]/g, ''));

            addToOrder(name, price);

            // Button animation
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Dodato';
            this.style.background = 'var(--color-success)';

            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.background = '';
            }, 1500);
        });
    });
}

// Order Management (using localStorage - DEMO only)
function getOrder() {
    const order = localStorage.getItem('pubDemoOrder');
    return order ? JSON.parse(order) : [];
}

function saveOrder(order) {
    localStorage.setItem('pubDemoOrder', JSON.stringify(order));
}

function addToOrder(name, price) {
    const order = getOrder();
    const existingItem = order.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        order.push({ name, price, quantity: 1 });
    }

    saveOrder(order);
    updateOrderSummary();
    showNotification(`${name} dodato u porudžbinu!`);
}

function updateQuantity(name, delta) {
    const order = getOrder();
    const item = order.find(i => i.name === name);

    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromOrder(name);
            return;
        }
        saveOrder(order);
        updateOrderSummary();
    }
}

function removeFromOrder(name) {
    let order = getOrder();
    order = order.filter(item => item.name !== name);
    saveOrder(order);
    updateOrderSummary();
    showNotification(`${name} uklonjen iz porudžbine`);
}

function updateOrderSummary() {
    const order = getOrder();

    if (order.length === 0) {
        orderSummaryItems.innerHTML = `
            <div class="order-summary__empty">
                <i class="fas fa-shopping-basket"></i>
                <p>Vaša porudžbina je prazna</p>
                <span>Dodajte proizvode iz menija</span>
            </div>
        `;
        subtotalEl.textContent = '0 RSD';
        deliveryFeeEl.textContent = '150 RSD';
        totalEl.textContent = '150 RSD';
        checkoutBtn.disabled = true;
        return;
    }

    // Render items
    orderSummaryItems.innerHTML = order.map(item => `
        <div class="order-summary__item">
            <div class="order-summary__item-info">
                <div class="order-summary__item-name">${item.name}</div>
                <div class="order-summary__item-price">${item.price} RSD × ${item.quantity}</div>
            </div>
            <div class="order-summary__item-controls">
                <button onclick="updateQuantity('${item.name}', -1)"><i class="fas fa-minus"></i></button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity('${item.name}', 1)"><i class="fas fa-plus"></i></button>
            </div>
            <i class="fas fa-trash-alt order-summary__item-remove" onclick="removeFromOrder('${item.name}')"></i>
        </div>
    `).join('');

    // Calculate totals
    const subtotal = order.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const total = subtotal + deliveryFee;

    subtotalEl.textContent = `${subtotal.toLocaleString()} RSD`;
    deliveryFeeEl.textContent = deliveryFee === 0 ? 'BESPLATNO' : `${deliveryFee} RSD`;
    totalEl.textContent = `${total.toLocaleString()} RSD`;

    checkoutBtn.disabled = false;
}

// Modals
function initModals() {
    // Open checkout modal (Demo)
    checkoutBtn.addEventListener('click', function() {
        if (getOrder().length === 0) return;
        openCheckoutModal();
    });

    // Close modals
    document.querySelectorAll('.modal__close, .modal__overlay').forEach(el => {
        el.addEventListener('click', closeModals);
    });
}

function openCheckoutModal() {
    // Just show the demo modal
    checkoutModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
    });
    document.body.style.overflow = '';
}

// Notification
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--color-success)' : 'var(--color-danger)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);



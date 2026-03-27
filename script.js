// Game Shop Data
const shopData = {
    gems: [
        { id: 1, name: 'Gem Starter', amount: 100, price: 4.99, bonus: 0 },
        { id: 2, name: 'Gem Bundle', amount: 500, price: 19.99, bonus: 50 },
        { id: 3, name: 'Gem Mega', amount: 1200, price: 39.99, bonus: 200, popular: true },
        { id: 4, name: 'Gem Ultra', amount: 2500, price: 79.99, bonus: 500 },
    ],
    coins: [
        { id: 5, name: 'Coin Pack', amount: 1000, price: 2.99, bonus: 0 },
        { id: 6, name: 'Coin Stack', amount: 5000, price: 12.99, bonus: 500 },
        { id: 7, name: 'Coin Vault', amount: 12000, price: 24.99, bonus: 2000 },
    ],
    bundles: [
        { id: 8, name: 'Ultimate Bundle', amount: '1500 Gems + 10000 Coins', price: 49.99, bonus: 0, popular: true },
        { id: 9, name: 'Legendary Pack', amount: '3500 Gems + 25000 Coins', price: 99.99, bonus: 0 },
        { id: 10, name: 'Starter Pack', amount: '500 Gems + 5000 Coins', price: 14.99, bonus: 0 },
    ]
};

// State
let currentBalance = 0;
let purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
let pendingPurchase = null;

// DOM Elements
const tabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const modal = document.getElementById('purchaseModal');
const closeBtn = document.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');
const confirmBtn = document.getElementById('confirmBtn');
const toast = document.getElementById('toast');
const balanceDisplay = document.getElementById('currentBalance');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderShop();
    setupEventListeners();
    loadBalance();
    updateHistoryDisplay();
});

// Setup Event Listeners
function setupEventListeners() {
    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });

    // Modal
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    confirmBtn.addEventListener('click', confirmPurchase);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// Render Shop
function renderShop() {
    // Gems
    const gemsGrid = document.getElementById('gemsGrid');
    gemsGrid.innerHTML = shopData.gems.map(item => createPackageCard(item)).join('');
    
    // Coins
    const coinsGrid = document.getElementById('coinsGrid');
    coinsGrid.innerHTML = shopData.coins.map(item => createPackageCard(item)).join('');
    
    // Bundles
    const bundlesGrid = document.getElementById('bundlesGrid');
    bundlesGrid.innerHTML = shopData.bundles.map(item => createPackageCard(item)).join('');

    // Add buy button listeners
    document.querySelectorAll('.btn-buy').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.dataset.id);
            const item = getAllItems().find(i => i.id === itemId);
            openModal(item);
        });
    });
}

// Create Package Card
function createPackageCard(item) {
    const popularClass = item.popular ? 'popular' : '';
    const popularBadge = item.popular ? '<div class="popular-badge">🔥 POPULAR</div>' : '';
    const bonus = item.bonus ? `<div class="package-bonus">+${item.bonus} Bonus</div>` : '';

    return `
        <div class="package-card ${popularClass}">
            ${popularBadge}
            <div class="package-amount">${item.amount}</div>
            <div class="package-name">${item.name}</div>
            ${bonus}
            <div class="price">$${item.price}</div>
            <button class="btn btn-buy" data-id="${item.id}">Buy Now</button>
        </div>
    `;
}

// Get all items
function getAllItems() {
    return [...shopData.gems, ...shopData.coins, ...shopData.bundles];
}

// Switch Tab
function switchTab(tabName) {
    tabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');

    if (tabName === 'history') {
        updateHistoryDisplay();
    }
}

// Modal Functions
function openModal(item) {
    pendingPurchase = item;
    document.getElementById('modalTitle').textContent = 'Purchase Confirmation';
    document.getElementById('modalItem').textContent = item.name;
    document.getElementById('modalPrice').textContent = `$${item.price}`;
    modal.classList.add('show');
}

function closeModal() {
    modal.classList.remove('show');
    pendingPurchase = null;
}

function confirmPurchase() {
    if (!pendingPurchase) return;

    // Simulate payment (in real app, integrate payment gateway)
    setTimeout(() => {
        currentBalance += Math.random() > 0.5 ? pendingPurchase.amount : pendingPurchase.amount * 0.5;
        balanceDisplay.textContent = currentBalance.toLocaleString();

        // Add to history
        purchaseHistory.unshift({
            name: pendingPurchase.name,
            price: pendingPurchase.price,
            timestamp: new Date().toLocaleString(),
            amount: pendingPurchase.amount
        });
        localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));

        // Save balance
        localStorage.setItem('currentBalance', currentBalance);

        showToast(`✅ Purchased ${pendingPurchase.name} successfully!`);
        closeModal();
    }, 500);
}

// Toast Notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// History Display
function updateHistoryDisplay() {
    const historyContainer = document.getElementById('historyContainer');
    
    if (purchaseHistory.length === 0) {
        historyContainer.innerHTML = '<div class="empty-history">No purchases yet</div>';
        return;
    }

    historyContainer.innerHTML = purchaseHistory.map(item => `
        <div class="history-item">
            <div class="history-left">
                <div class="history-item-name">${item.name}</div>
                <div class="history-item-time">${item.timestamp}</div>
            </div>
            <div class="history-item-price">$${item.price}</div>
        </div>
    `).join('');
}

// Load Balance
function loadBalance() {
    const saved = localStorage.getItem('currentBalance');
    if (saved) {
        currentBalance = parseFloat(saved);
        balanceDisplay.textContent = currentBalance.toLocaleString();
    }
}
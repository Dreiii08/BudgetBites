// =====================
// BUDGET BITES - JS
// =====================

let selectedMain = null;
let selectedSide = null;
let extras = [];

// ---- MAIN DISH ----
function selectMain(name, price, el) {
    document.querySelectorAll('.main').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    selectedMain = { name, price };
    selectedSide = null;
    document.querySelectorAll('.side').forEach(c => c.classList.remove('selected'));
    document.getElementById("sides").classList.remove("hidden");
    updateCart();
}

// ---- SIDE DISH ----
function addSide(name, price, el) {
    if (!selectedMain) {
        alert("Please select a main dish first! 🍱");
        return;
    }
    document.querySelectorAll('.side').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    selectedSide = { name, price };
    updateCart();
}

// ---- EXTRAS ----
function addExtra(name, price) {
    extras.push({ name, price });
    updateCart();
    // Flash feedback
    showToast(`${name} added! ✅`);
}

// ---- TOAST NOTIFICATION ----
function showToast(msg) {
    let toast = document.createElement('div');
    toast.innerText = msg;
    toast.style.cssText = `
        position: fixed; bottom: 30px; left: 50%;
        transform: translateX(-50%);
        background: #2b1a0e; color: #c9a46c;
        padding: 12px 25px; border-radius: 20px;
        font-weight: 600; font-size: 14px;
        z-index: 9999; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        animation: fadeIn 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// ---- UPDATE CART ----
function updateCart() {
    let list = document.getElementById("order-list");
    list.innerHTML = "";
    let total = 0;

    if (selectedMain) {
        total += selectedMain.price;
        list.innerHTML += `
            <li class="main-item">
                <span>🍱 ${selectedMain.name} — ₱${selectedMain.price}</span>
                <button onclick="removeMain()">✕</button>
            </li>`;
    }

    if (selectedSide) {
        total += selectedSide.price;
        list.innerHTML += `
            <li class="side-item">
                <span>🍟 ${selectedSide.name} — ₱${selectedSide.price}</span>
                <button onclick="removeSide()">✕</button>
            </li>`;
    }

    extras.forEach((e, i) => {
        total += e.price;
        list.innerHTML += `
            <li class="extra-item">
                <span>✨ ${e.name} — ₱${e.price}</span>
                <button onclick="removeExtra(${i})">✕</button>
            </li>`;
    });

    let count = (selectedMain ? 1 : 0) + (selectedSide ? 1 : 0) + extras.length;
    document.getElementById("cart-count").innerText = count;
    document.getElementById("total").innerText = total;
}

// ---- REMOVE ITEMS ----
function removeMain() {
    selectedMain = null;
    selectedSide = null;
    document.querySelectorAll('.main').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.side').forEach(c => c.classList.remove('selected'));
    document.getElementById("sides").classList.add("hidden");
    updateCart();
}

function removeSide() {
    selectedSide = null;
    document.querySelectorAll('.side').forEach(c => c.classList.remove('selected'));
    updateCart();
}

function removeExtra(i) {
    extras.splice(i, 1);
    updateCart();
}

// ---- TOGGLE CART ----
function toggleCart() {
    document.getElementById("cartDrawer").classList.toggle("open");
}

// ---- CHECKOUT ----
function checkout() {
    if (!selectedMain && extras.length === 0) {
        alert("Your cart is empty! Please select at least a main dish. 🍱");
        return;
    }

    let receipt = "";
    let total = 0;

    if (selectedMain) {
        receipt += `🍱 ${selectedMain.name}   ₱${selectedMain.price}\n`;
        total += selectedMain.price;
    }
    if (selectedSide) {
        receipt += `🍟 ${selectedSide.name}   ₱${selectedSide.price}\n`;
        total += selectedSide.price;
    }
    extras.forEach(e => {
        receipt += `✨ ${e.name}   ₱${e.price}\n`;
        total += e.price;
    });

    receipt += `\n--------------------------`;

    document.getElementById("receipt").innerText = receipt;
    document.getElementById("final-total").innerText = total;
    document.getElementById("modal").style.display = "block";
    document.getElementById("cartDrawer").classList.remove("open");
}

// ---- RESET ----
function resetOrder() {
    selectedMain = null;
    selectedSide = null;
    extras = [];
    document.querySelectorAll('.main, .side').forEach(c => c.classList.remove('selected'));
    document.getElementById("sides").classList.add("hidden");
    updateCart();
    document.getElementById("modal").style.display = "none";
}

// ---- SPIN WHEEL ----
const prizes = [
    "🧋 Bigbrew Milktea",
    "🖊️ Ballpen",
    "📸 Instax Photo",
    "🍩 Donut",
    "🍟 Fries",
    "📸 Instax Photo",
    "🍟 Fries",
    "🥞 Pancake"
];

let isSpinning = false;
let totalDeg = 0;

function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;

    let btn = document.querySelector('.spin-btn');
    btn.disabled = true;
    btn.innerText = "Spinning...";

    document.getElementById("result").innerText = "";

    let extraDeg = 1440 + Math.floor(Math.random() * 360);
    totalDeg += extraDeg;

    let wheel = document.getElementById("wheel");
    wheel.style.transform = `rotate(${totalDeg}deg)`;

    let index = Math.floor(Math.random() * prizes.length);

    setTimeout(() => {
        document.getElementById("result").innerText = "🎉 You got: " + prizes[index];
        isSpinning = false;
        btn.disabled = false;
        btn.innerText = "🎰 SPIN!";
    }, 2100);
}

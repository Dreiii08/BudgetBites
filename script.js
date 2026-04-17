// =====================
// BUDGET BITES - JS (UPGRADED)
// =====================

let selectedMains = [];
let selectedSides = [];
let extras = [];

// ---- MAIN DISH (MULTI SELECT) ----
function selectMain(name, price, el) {
    let index = selectedMains.findIndex(m => m.name === name);

    if (index > -1) {
        selectedMains.splice(index, 1);
        el.classList.remove("selected");
    } else {
        selectedMains.push({ name, price, el });
        el.classList.add("selected");
    }

    updateSides();
    updateCart();
}

// ---- SIDE DISH (LIMIT BASED ON MAINS) ----
function addSide(name, price, el) {
    if (selectedMains.length === 0) {
        alert("Please select a main dish first! 🍱");
        return;
    }

    let existing = selectedSides.find(s => s.name === name);

    if (existing) {
        selectedSides = selectedSides.filter(s => s.name !== name);
        el.classList.remove("selected");
    } else {
        if (selectedSides.length >= selectedMains.length) {
            alert(`You can only pick ${selectedMains.length} side(s)! 🍟`);
            return;
        }

        selectedSides.push({ name, price, el });
        el.classList.add("selected");
    }

    updateCart();
}

// ---- UPDATE SIDE VISIBILITY + INFO ----
function updateSides() {
    let sidesSection = document.getElementById("sides");
    let hint = document.getElementById("sideHint");

    if (selectedMains.length > 0) {
        sidesSection.classList.remove("hidden");
        if (hint) {
            hint.innerText = `You selected ${selectedMains.length} main(s) — pick up to ${selectedMains.length} side(s).`;
        }
    } else {
        sidesSection.classList.add("hidden");
        selectedSides = [];

        document.querySelectorAll('.side').forEach(c => c.classList.remove('selected'));

        if (hint) hint.innerText = "";
    }
}

// ---- EXTRAS ----
function addExtra(name, price) {
    extras.push({ name, price });
    updateCart();
    showToast(`${name} added! ✅`);
}

// ---- TOAST ----
function showToast(msg) {
    let toast = document.createElement('div');
    toast.innerText = msg;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: #2b1a0e;
        color: #c9a46c;
        padding: 12px 25px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 14px;
        z-index: 9999;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// ---- UPDATE CART ----
function updateCart() {
    let list = document.getElementById("order-list");
    list.innerHTML = "";
    let total = 0;

    // MAIN
    selectedMains.forEach(m => {
        total += m.price;
        list.innerHTML += `
            <li class="main-item">
                <span>🍱 ${m.name} — ₱${m.price}</span>
            </li>`;
    });

    // SIDE
    selectedSides.forEach(s => {
        total += s.price;
        list.innerHTML += `
            <li class="side-item">
                <span>🍟 ${s.name} — ₱${s.price}</span>
            </li>`;
    });

    // EXTRAS
    extras.forEach(e => {
        total += e.price;
        list.innerHTML += `
            <li class="extra-item">
                <span>✨ ${e.name} — ₱${e.price}</span>
            </li>`;
    });

    // CART COUNT
    let count = selectedMains.length + selectedSides.length + extras.length;

    document.getElementById("cart-count").innerText = count;
    document.getElementById("total").innerText = total;
}

// ---- REMOVE MAIN (RESET ALL MAINS) ----
function removeMain() {
    selectedMains = [];
    selectedSides = [];

    document.querySelectorAll('.main, .side')
        .forEach(c => c.classList.remove('selected'));

    document.getElementById("sides").classList.add("hidden");

    updateCart();
}

// ---- REMOVE SIDE ----
function removeSide(name) {
    selectedSides = selectedSides.filter(s => s.name !== name);
    document.querySelectorAll('.side').forEach(c => c.classList.remove('selected'));
    updateCart();
}

// ---- REMOVE EXTRA ----
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
    if (selectedMains.length === 0 && extras.length === 0) {
        alert("Your cart is empty! 🍱");
        return;
    }

    let receipt = "";
    let total = 0;

    selectedMains.forEach(m => {
        receipt += `🍱 ${m.name}   ₱${m.price}\n`;
        total += m.price;
    });

    selectedSides.forEach(s => {
        receipt += `🍟 ${s.name}   ₱${s.price}\n`;
        total += s.price;
    });

    extras.forEach(e => {
        receipt += `✨ ${e.name}   ₱${e.price}\n`;
        total += e.price;
    });

    document.getElementById("receipt").innerText = receipt;
    document.getElementById("final-total").innerText = total;
    document.getElementById("modal").style.display = "block";
    document.getElementById("cartDrawer").classList.remove("open");
}

// ---- RESET ----
function resetOrder() {
    selectedMains = [];
    selectedSides = [];
    extras = [];

    document.querySelectorAll('.main, .side')
        .forEach(c => c.classList.remove('selected'));

    document.getElementById("sides").classList.add("hidden");

    updateCart();
    document.getElementById("modal").style.display = "none";
}

// ---- SPIN WHEEL (UNCHANGED) ----
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
        document.getElementById("result").innerText =
            "🎉 You got: " + prizes[index];

        isSpinning = false;
        btn.disabled = false;
        btn.innerText = "🎰 SPIN!";
    }, 2100);
}
// =====================
// BUDGET BITES - JS (FIXED)
// =====================

let selectedMain = [];
let selectedSide = null;
let extras = [];

// ---- MAIN DISH (MULTI SELECT + COUNT) ----
function selectMain(name, price, el) {
    const items = document.querySelectorAll('.card.main');

    // toggle selection (pwede multiple)
    const index = selectedMain.findIndex(i => i.name === name);

    if (index > -1) {
        selectedMain.splice(index, 1);
        el.classList.remove('selected');
    } else {
        selectedMain.push({ name, price });
        el.classList.add('selected');
    }

    document.getElementById("sides").classList.remove("hidden");
    updateCart();
}

// ---- SIDE DISH (BASED ON MAIN COUNT) ----
function addSide(name, price, el) {
    if (selectedMain.length === 0) {
        alert("Please select at least 1 main dish first! 🍱");
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
    showToast(`${name} added! ✅`);
}

// ---- TOAST ----
function showToast(msg) {
    let toast = document.createElement('div');
    toast.innerText = msg;
    toast.style.cssText = `
        position: fixed; bottom: 30px; left: 50%;
        transform: translateX(-50%);
        background: #2b1a0e; color: #c9a46c;
        padding: 12px 25px; border-radius: 20px;
        font-weight: 600; font-size: 14px;
        z-index: 9999;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// ---- CART UPDATE ----
function updateCart() {
    let list = document.getElementById("order-list");
    list.innerHTML = "";
    let total = 0;

    // MAIN (MULTIPLE)
    selectedMain.forEach((m, i) => {
        total += m.price;
        list.innerHTML += `
            <li class="main-item">
                <span>🍱 ${m.name} — ₱${m.price}</span>
                <button onclick="removeMain(${i})">✕</button>
            </li>`;
    });

    // SIDE
    if (selectedSide) {
        total += selectedSide.price;
        list.innerHTML += `
            <li class="side-item">
                <span>🍟 ${selectedSide.name} — ₱${selectedSide.price}</span>
                <button onclick="removeSide()">✕</button>
            </li>`;
    }

    // EXTRAS
    extras.forEach((e, i) => {
        total += e.price;
        list.innerHTML += `
            <li class="extra-item">
                <span>✨ ${e.name} — ₱${e.price}</span>
                <button onclick="removeExtra(${i})">✕</button>
            </li>`;
    });

    document.getElementById("cart-count").innerText =
        selectedMain.length + (selectedSide ? 1 : 0) + extras.length;

    document.getElementById("total").innerText = total;
}

// ---- REMOVE MAIN (INDEX BASED) ----
function removeMain(i) {
    selectedMain.splice(i, 1);

    document.querySelectorAll('.card.main')[i]?.classList.remove('selected');

    if (selectedMain.length === 0) {
        document.getElementById("sides").classList.add("hidden");
        selectedSide = null;
        document.querySelectorAll('.side').forEach(c => c.classList.remove('selected'));
    }

    updateCart();
}

// ---- REMOVE SIDE ----
function removeSide() {
    selectedSide = null;
    document.querySelectorAll('.side').forEach(c => c.classList.remove('selected'));
    updateCart();
}

// ---- REMOVE EXTRA ----
function removeExtra(i) {
    extras.splice(i, 1);
    updateCart();
}

// ---- CART ----
function toggleCart() {
    document.getElementById("cartDrawer").classList.toggle("open");
}

// ---- CHECKOUT ----
function checkout() {
    if (selectedMain.length === 0 && extras.length === 0) {
        alert("Empty cart! 🍱");
        return;
    }

    let receipt = "";
    let total = 0;

    selectedMain.forEach(m => {
        receipt += `🍱 ${m.name} ₱${m.price}\n`;
        total += m.price;
    });

    if (selectedSide) {
        receipt += `🍟 ${selectedSide.name} ₱${selectedSide.price}\n`;
        total += selectedSide.price;
    }

    extras.forEach(e => {
        receipt += `✨ ${e.name} ₱${e.price}\n`;
        total += e.price;
    });

    document.getElementById("receipt").innerText = receipt;
    document.getElementById("final-total").innerText = total;
    document.getElementById("modal").style.display = "block";
}

// ---- RESET ----
function resetOrder() {
    selectedMain = [];
    selectedSide = null;
    extras = [];

    document.querySelectorAll('.selected').forEach(c => c.classList.remove('selected'));
    document.getElementById("sides").classList.add("hidden");

    updateCart();
    document.getElementById("modal").style.display = "none";
}

// ---- SPIN WHEEL (UNCHANGED SAFE) ----
const prizes = [
    "🧋 Milktea","🖊️ Ballpen","📸 Instax","🍩 Donut",
    "🍟 Fries","🥞 Pancake","🍫 Chips","🍬 Gummy"
];

let isSpinning = false;
let totalDeg = 0;

function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;

    let btn = document.querySelector('.spin-btn');
    btn.disabled = true;

    let extraDeg = 1440 + Math.floor(Math.random() * 360);
    totalDeg += extraDeg;

    document.getElementById("wheel").style.transform = `rotate(${totalDeg}deg)`;

    let index = Math.floor(Math.random() * prizes.length);

    setTimeout(() => {
        document.getElementById("result").innerText = "🎉 " + prizes[index];
        isSpinning = false;
        btn.disabled = false;
    }, 2100);
}
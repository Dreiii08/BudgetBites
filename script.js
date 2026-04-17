// =====================
// BUDGET BITES - FINAL JS (QUANTITY SYSTEM)
// =====================

let mains = {};      // multiple mains with quantity
let selectedSide = null;
let extras = [];

// ---------------------
// MAIN DISH (QUANTITY)
// ---------------------
function changeMainQty(name, price, el, change) {
    if (!mains[name]) {
        mains[name] = { name, price, qty: 0 };
    }

    mains[name].qty += change;

    if (mains[name].qty < 0) mains[name].qty = 0;

    // update UI qty
    const qtyEl = document.getElementById("qty-" + name);
    if (qtyEl) qtyEl.innerText = mains[name].qty;

    // show side section if may main na
    const hasMain = Object.values(mains).some(m => m.qty > 0);
    if (hasMain) {
        document.getElementById("sides").classList.remove("hidden");
    } else {
        document.getElementById("sides").classList.add("hidden");
        selectedSide = null;
        document.querySelectorAll('.side').forEach(c => c.classList.remove('selected'));
    }

    updateCart();
}

// ---------------------
// SIDE DISH
// ---------------------
function addSide(name, price, el) {
    const totalMains = getTotalMainQty();

    if (totalMains === 0) {
        alert("Select main dish first 🍱");
        return;
    }

    document.querySelectorAll('.side').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');

    selectedSide = { name, price };
    updateCart();
}

// ---------------------
// EXTRAS
// ---------------------
function addExtra(name, price) {
    extras.push({ name, price });
    showToast(name + " added!");
    updateCart();
}

// ---------------------
// CART UPDATE
// ---------------------
function updateCart() {
    let list = document.getElementById("order-list");
    list.innerHTML = "";
    let total = 0;
    let count = 0;

    // MAIN ITEMS
    for (let key in mains) {
        let item = mains[key];
        if (item.qty > 0) {
            let subTotal = item.qty * item.price;
            total += subTotal;
            count += item.qty;

            list.innerHTML += `
                <li class="main-item">
                    <span>🍱 ${item.name} x${item.qty} — ₱${subTotal}</span>
                    <button onclick="removeMain('${item.name}')">✕</button>
                </li>
            `;
        }
    }

    // SIDE
    if (selectedSide) {
        total += selectedSide.price;
        count += 1;

        list.innerHTML += `
            <li class="side-item">
                <span>🍟 ${selectedSide.name} — ₱${selectedSide.price}</span>
                <button onclick="removeSide()">✕</button>
            </li>
        `;
    }

    // EXTRAS
    extras.forEach((e, i) => {
        total += e.price;
        count += 1;

        list.innerHTML += `
            <li class="extra-item">
                <span>✨ ${e.name} — ₱${e.price}</span>
                <button onclick="removeExtra(${i})">✕</button>
            </li>
        `;
    });

    document.getElementById("cart-count").innerText = count;
    document.getElementById("total").innerText = total;
}

// ---------------------
// HELPERS
// ---------------------
function getTotalMainQty() {
    let total = 0;
    for (let k in mains) {
        total += mains[k].qty;
    }
    return total;
}

// ---------------------
// REMOVE MAIN
// ---------------------
function removeMain(name) {
    if (mains[name]) {
        mains[name].qty = 0;
        document.getElementById("qty-" + name).innerText = 0;
    }

    updateCart();
}

// ---------------------
// REMOVE SIDE
// ---------------------
function removeSide() {
    selectedSide = null;
    document.querySelectorAll('.side').forEach(c => c.classList.remove('selected'));
    updateCart();
}

// ---------------------
// REMOVE EXTRA
// ---------------------
function removeExtra(i) {
    extras.splice(i, 1);
    updateCart();
}

// ---------------------
// CART TOGGLE
// ---------------------
function toggleCart() {
    document.getElementById("cartDrawer").classList.toggle("open");
}

// ---------------------
// CHECKOUT
// ---------------------
function checkout() {
    let total = 0;
    let receipt = "";

    let hasOrder = false;

    for (let k in mains) {
        let item = mains[k];
        if (item.qty > 0) {
            hasOrder = true;
            let sub = item.qty * item.price;
            total += sub;
            receipt += `🍱 ${item.name} x${item.qty} = ₱${sub}\n`;
        }
    }

    if (selectedSide) {
        total += selectedSide.price;
        receipt += `🍟 ${selectedSide.name} = ₱${selectedSide.price}\n`;
    }

    extras.forEach(e => {
        total += e.price;
        receipt += `✨ ${e.name} = ₱${e.price}\n`;
    });

    if (!hasOrder && extras.length === 0 && !selectedSide) {
        alert("Empty cart 🍱");
        return;
    }

    document.getElementById("receipt").innerText = receipt;
    document.getElementById("final-total").innerText = total;
    document.getElementById("modal").style.display = "flex";
    document.getElementById("cartDrawer").classList.remove("open");
}

// ---------------------
// RESET
// ---------------------
function resetOrder() {
    mains = {};
    selectedSide = null;
    extras = [];

    document.querySelectorAll('.side').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('[id^="qty-"]').forEach(el => el.innerText = 0);

    document.getElementById("sides").classList.add("hidden");
    document.getElementById("modal").style.display = "none";

    updateCart();
}

// ---------------------
// TOAST
// ---------------------
function showToast(msg) {
    let t = document.createElement("div");
    t.innerText = msg;
    t.style.cssText = `
        position:fixed;bottom:30px;left:50%;
        transform:translateX(-50%);
        background:#2b1a0e;color:#c9a46c;
        padding:10px 20px;border-radius:20px;
        z-index:9999;
    `;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1500);
}

// ---------------------
// SPIN WHEEL (UNCHANGED)
// ---------------------
let isSpinning = false;
let totalDeg = 0;

function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;

    let btn = document.querySelector(".spin-btn");
    btn.disabled = true;

    let extra = 1440 + Math.random() * 360;
    totalDeg += extra;

    document.getElementById("wheel").style.transform = `rotate(${totalDeg}deg)`;

    setTimeout(() => {
        document.getElementById("result").innerText = "🎉 You got prize!";
        isSpinning = false;
        btn.disabled = false;
    }, 2000);
}
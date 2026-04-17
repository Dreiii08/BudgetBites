// =====================
// BUDGET BITES - FIXED WORKING VERSION
// =====================

let mains = {};
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

    let qtyEl = document.getElementById("qty-" + name);
    if (qtyEl) qtyEl.innerText = mains[name].qty;

    let hasMain = Object.values(mains).some(m => m.qty > 0);

    document.getElementById("sides").classList.toggle("hidden", !hasMain);

    updateCart();
}

// ---------------------
// SIDE DISH
// ---------------------
function addSide(name, price, el) {
    let totalMain = Object.values(mains).reduce((a, b) => a + b.qty, 0);

    if (totalMain === 0) {
        alert("Pumili ka muna ng main dish 🍱");
        return;
    }

    document.querySelectorAll(".side").forEach(c => c.classList.remove("selected"));
    el.classList.add("selected");

    selectedSide = { name, price };
    updateCart();
}

// ---------------------
// EXTRAS
// ---------------------
function addExtra(name, price) {
    extras.push({ name, price });
    updateCart();
}

// ---------------------
// UPDATE CART
// ---------------------
function updateCart() {
    let list = document.getElementById("order-list");
    list.innerHTML = "";
    let total = 0;
    let count = 0;

    for (let k in mains) {
        let m = mains[k];
        if (m.qty > 0) {
            let sub = m.qty * m.price;
            total += sub;
            count += m.qty;

            list.innerHTML += `
                <li>
                    🍱 ${m.name} x${m.qty} — ₱${sub}
                    <button onclick="removeMain('${m.name}')">✕</button>
                </li>
            `;
        }
    }

    if (selectedSide) {
        total += selectedSide.price;
        count++;
        list.innerHTML += `
            <li>
                🍟 ${selectedSide.name} — ₱${selectedSide.price}
                <button onclick="removeSide()">✕</button>
            </li>
        `;
    }

    extras.forEach((e, i) => {
        total += e.price;
        count++;
        list.innerHTML += `
            <li>
                ✨ ${e.name} — ₱${e.price}
                <button onclick="removeExtra(${i})">✕</button>
            </li>
        `;
    });

    document.getElementById("cart-count").innerText = count;
    document.getElementById("total").innerText = total;
}

// ---------------------
// REMOVE MAIN
// ---------------------
function removeMain(name) {
    if (mains[name]) {
        mains[name].qty = 0;
        let qtyEl = document.getElementById("qty-" + name);
        if (qtyEl) qtyEl.innerText = 0;
    }

    updateCart();
}

// ---------------------
// REMOVE SIDE
// ---------------------
function removeSide() {
    selectedSide = null;
    document.querySelectorAll(".side").forEach(c => c.classList.remove("selected"));
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
// CART
// ---------------------
function toggleCart() {
    document.getElementById("cartDrawer").classList.toggle("open");
}

// ---------------------
// CHECKOUT
// ---------------------
function checkout() {
    let receipt = "";
    let total = 0;
    let has = false;

    for (let k in mains) {
        let m = mains[k];
        if (m.qty > 0) {
            has = true;
            let sub = m.qty * m.price;
            total += sub;
            receipt += `🍱 ${m.name} x${m.qty} = ₱${sub}\n`;
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

    if (!has && extras.length === 0 && !selectedSide) {
        alert("Empty cart");
        return;
    }

    document.getElementById("receipt").innerText = receipt;
    document.getElementById("final-total").innerText = total;
    document.getElementById("modal").style.display = "flex";
}

// ---------------------
// RESET
// ---------------------
function resetOrder() {
    mains = {};
    selectedSide = null;
    extras = [];

    document.querySelectorAll(".side").forEach(c => c.classList.remove("selected"));
    document.querySelectorAll('[id^="qty-"]').forEach(el => el.innerText = 0);

    document.getElementById("sides").classList.add("hidden");
    document.getElementById("modal").style.display = "none";

    updateCart();
}
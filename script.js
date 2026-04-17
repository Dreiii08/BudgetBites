// =====================
// BUDGET BITES FINAL JS
// =====================

let selectedMain = [];
let selectedSide = null;
let extras = [];

// ---- MAIN DISH (MULTI SELECT) ----
function selectMain(name, price, el) {
    const index = selectedMain.findIndex(m => m.name === name);

    if (index > -1) {
        selectedMain.splice(index, 1);
        el.classList.remove('selected');
    } else {
        selectedMain.push({ name, price, el });
        el.classList.add('selected');
    }

    if (selectedMain.length > 0) {
        document.getElementById("sides").classList.remove("hidden");
    } else {
        document.getElementById("sides").classList.add("hidden");
        selectedSide = null;
        document.querySelectorAll('.side').forEach(c => c.classList.remove('selected'));
    }

    updateCart();
}

// ---- SIDE DISH ----
function addSide(name, price, el) {
    if (selectedMain.length === 0) {
        alert("Please select at least 1 main dish 🍱");
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
}

// ---- CART UPDATE ----
function updateCart() {
    let list = document.getElementById("order-list");
    list.innerHTML = "";
    let total = 0;

    selectedMain.forEach((m, i) => {
        total += m.price;
        list.innerHTML += `
        <li class="main-item">
            <span>🍱 ${m.name} — ₱${m.price}</span>
            <button onclick="removeMain(${i})">✕</button>
        </li>`;
    });

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

    document.getElementById("cart-count").innerText =
        selectedMain.length + (selectedSide ? 1 : 0) + extras.length;

    document.getElementById("total").innerText = total;
}

// ---- REMOVE MAIN ----
function removeMain(i) {
    selectedMain[i].el.classList.remove('selected');
    selectedMain.splice(i, 1);

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
        alert("Empty cart 🍱");
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
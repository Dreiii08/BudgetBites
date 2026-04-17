// =====================
// BUDGET BITES - FIXED SIDE DISH LOGIC
// =====================

let mains = {};
let selectedSides = [];
let extras = [];

// ---------------------
// MAIN DISH (QUANTITY)
// ---------------------
function changeMainQty(name, price, el, change) {
    if (!mains[name]) {
        mains[name] = { name, price, qty: 0 };
    }

    let newQty = mains[name].qty + change;
    if (newQty < 0) newQty = 0;
    
    let oldQty = mains[name].qty;
    mains[name].qty = newQty;

    let qtyEl = document.getElementById("qty-" + name);
    if (qtyEl) qtyEl.innerText = mains[name].qty;

    let totalMainQty = getTotalMainQty();
    let hasMain = totalMainQty > 0;

    document.getElementById("sides").classList.toggle("hidden", !hasMain);
    
    updateSideHint();
    
    // Adjust sides if quantity decreased
    if (newQty < oldQty) {
        trimSidesToMatch(totalMainQty);
    }
    
    if (totalMainQty === 0) {
        clearAllSides();
    }

    updateCart();
}

function getTotalMainQty() {
    return Object.values(mains).reduce((a, b) => a + b.qty, 0);
}

function updateSideHint() {
    let totalMain = getTotalMainQty();
    let sideHint = document.getElementById("sideHint");
    let currentSideCount = selectedSides.length;
    
    if (totalMain > 0) {
        if (currentSideCount < totalMain) {
            let remaining = totalMain - currentSideCount;
            sideHint.innerHTML = `✨ You can choose ${remaining} more side dish(es) (${currentSideCount}/${totalMain} selected)`;
            sideHint.style.color = "#c9a46c";
            sideHint.style.fontWeight = "500";
        } else if (currentSideCount === totalMain) {
            sideHint.innerHTML = `✅ All ${totalMain} side dish(es) selected! Click a side to change it.`;
            sideHint.style.color = "#4caf50";
            sideHint.style.fontWeight = "500";
        }
    } else {
        sideHint.innerHTML = "";
    }
}

function trimSidesToMatch(maxCount) {
    while (selectedSides.length > maxCount) {
        let removed = selectedSides.pop();
        let removedCard = document.querySelector(`.side[data-side-name="${removed.name}"]`);
        if (removedCard) removedCard.classList.remove("selected");
    }
    updateSideSelectionUI();
}

function clearAllSides() {
    selectedSides.forEach(side => {
        let card = document.querySelector(`.side[data-side-name="${side.name}"]`);
        if (card) card.classList.remove("selected");
    });
    selectedSides = [];
    updateSideSelectionUI();
}

function updateSideSelectionUI() {
    updateSideHint();
    updateCart();
}

// ---------------------
// SIDE DISH - Fixed: Can select up to main quantity, can change selection
// ---------------------
function addSide(name, price, el) {
    let totalMainQty = getTotalMainQty();
    
    if (totalMainQty === 0) {
        alert("📢 Pumili ka muna ng main dish!");
        return;
    }
    
    // Check if this side is already selected
    let existingIndex = selectedSides.findIndex(s => s.name === name);
    
    // If already selected, remove it (unselect)
    if (existingIndex !== -1) {
        selectedSides.splice(existingIndex, 1);
        el.classList.remove("selected");
        updateSideHint();
        updateCart();
        animateCart();
        return;
    }
    
    // Check if we can add more sides
    if (selectedSides.length < totalMainQty) {
        selectedSides.push({ name, price });
        el.classList.add("selected");
        animateCart();
        updateSideHint();
        updateCart();
    } else {
        // If at limit, ask user to replace a side
        let replaceChoice = confirm(`You already have ${selectedSides.length} side(s). Replace the last side with "${name}"?`);
        
        if (replaceChoice) {
            // Remove the last selected side
            let removed = selectedSides.pop();
            let removedCard = document.querySelector(`.side[data-side-name="${removed.name}"]`);
            if (removedCard) removedCard.classList.remove("selected");
            
            // Add the new side
            selectedSides.push({ name, price });
            el.classList.add("selected");
            updateSideHint();
            updateCart();
            animateCart();
        }
    }
}

// ---------------------
// EXTRAS
// ---------------------
function addExtra(name, price) {
    extras.push({ name, price });
    updateCart();
    animateCart();
}

// ---------------------
// UPDATE CART
// ---------------------
function updateCart() {
    let list = document.getElementById("order-list");
    if (!list) return;
    
    list.innerHTML = "";
    let total = 0;
    let count = 0;

    // Main dishes
    for (let k in mains) {
        let m = mains[k];
        if (m.qty > 0) {
            let sub = m.qty * m.price;
            total += sub;
            count += m.qty;

            list.innerHTML += `
                <li class="main-item">
                    🍱 ${m.name} x${m.qty} — ₱${sub}
                    <button onclick="removeMain('${m.name}')">✕</button>
                </li>
            `;
        }
    }

    // Side dishes
    selectedSides.forEach((side, idx) => {
        total += side.price;
        count++;
        list.innerHTML += `
            <li class="side-item">
                🍟 ${side.name} (Side #${idx + 1}) — ₱${side.price}
                <button onclick="removeSideItem(${idx})">✕</button>
            </li>
        `;
    });

    // Extras
    extras.forEach((e, i) => {
        total += e.price;
        count++;
        list.innerHTML += `
            <li class="extra-item">
                ✨ ${e.name} — ₱${e.price}
                <button onclick="removeExtra(${i})">✕</button>
            </li>
        `;
    });
    
    if (list.innerHTML === "") {
        list.innerHTML = '<div style="text-align:center; padding:40px; color:#aaa;">🛒 Your cart is empty</div>';
    }

    document.getElementById("cart-count").innerText = count;
    document.getElementById("total").innerText = total;
}

// ---------------------
// REMOVE FUNCTIONS
// ---------------------
function removeMain(name) {
    if (mains[name]) {
        mains[name].qty = 0;
        let qtyEl = document.getElementById("qty-" + name);
        if (qtyEl) qtyEl.innerText = 0;
    }
    
    let totalMainQty = getTotalMainQty();
    trimSidesToMatch(totalMainQty);
    
    if (totalMainQty === 0) {
        document.getElementById("sides").classList.add("hidden");
        clearAllSides();
    }
    
    updateCart();
}

function removeSideItem(index) {
    let removed = selectedSides[index];
    let removedCard = document.querySelector(`.side[data-side-name="${removed.name}"]`);
    if (removedCard) removedCard.classList.remove("selected");
    selectedSides.splice(index, 1);
    updateSideHint();
    updateCart();
}

function removeExtra(i) {
    extras.splice(i, 1);
    updateCart();
}

// ---------------------
// CART DRAWER
// ---------------------
function toggleCart() {
    document.getElementById("cartDrawer").classList.toggle("open");
}

// ---------------------
// ANIMATION
// ---------------------
function animateCart() {
    let cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.classList.add('cart-bump');
        setTimeout(() => {
            cartIcon.classList.remove('cart-bump');
        }, 300);
    }
}

// ---------------------
// CHECKOUT
// ---------------------
function checkout() {
    let receipt = "";
    let total = 0;
    let hasItems = false;
    
    receipt += "═".repeat(30) + "\n";
    receipt += "   BUDGET BITES\n";
    receipt += "═".repeat(30) + "\n\n";

    for (let k in mains) {
        let m = mains[k];
        if (m.qty > 0) {
            hasItems = true;
            let sub = m.qty * m.price;
            total += sub;
            receipt += `🍱 ${m.name} x${m.qty} = ₱${sub}\n`;
        }
    }

    if (selectedSides.length > 0) {
        receipt += `\n🍟 SIDES:\n`;
        selectedSides.forEach((side, idx) => {
            total += side.price;
            receipt += `   ${idx + 1}. ${side.name} = ₱${side.price}\n`;
        });
    }

    if (extras.length > 0) {
        receipt += `\n✨ ADD-ONS:\n`;
        extras.forEach(e => {
            total += e.price;
            receipt += `   • ${e.name} = ₱${e.price}\n`;
        });
    }

    if (!hasItems && selectedSides.length === 0 && extras.length === 0) {
        alert("🛒 Empty cart!");
        return;
    }

    receipt += "\n" + "─".repeat(30) + "\n";
    receipt += `💰 TOTAL: ₱${total}\n`;
    receipt += "═".repeat(30) + "\n";
    receipt += "Thank you! ♡";

    document.getElementById("receipt").innerText = receipt;
    document.getElementById("final-total").innerText = total;
    document.getElementById("modal").style.display = "flex";
}

// ---------------------
// RESET ORDER
// ---------------------
function resetOrder() {
    mains = {};
    selectedSides = [];
    extras = [];

    document.querySelectorAll(".side").forEach(c => c.classList.remove("selected"));
    document.querySelectorAll('[id^="qty-"]').forEach(el => el.innerText = "0");
    
    document.getElementById("sides").classList.add("hidden");
    document.getElementById("modal").style.display = "none";
    document.getElementById("sideHint").innerHTML = "";

    updateCart();
}

// Close modal when clicking outside
window.onclick = function(event) {
    let modal = document.getElementById("modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Add data attributes to side cards on load
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".side").forEach(card => {
        let name = card.querySelector("h3")?.innerText;
        if (name) {
            card.setAttribute("data-side-name", name);
        }
    });
});
// =====================
// BUDGET BITES - WORKING VERSION
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

    let sidesSection = document.getElementById("sides");
    if (sidesSection) {
        if (hasMain) {
            sidesSection.classList.remove("hidden");
        } else {
            sidesSection.classList.add("hidden");
        }
    }
    
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
    let total = 0;
    for (let k in mains) {
        total += mains[k].qty;
    }
    return total;
}

function updateSideHint() {
    let totalMain = getTotalMainQty();
    let sideHint = document.getElementById("sideHint");
    let currentSideCount = selectedSides.length;
    
    if (sideHint) {
        if (totalMain > 0) {
            if (currentSideCount < totalMain) {
                let remaining = totalMain - currentSideCount;
                sideHint.innerHTML = `✨ Pwede ka pang pumili ng ${remaining} side dish(es) (${currentSideCount}/${totalMain} napili)`;
                sideHint.style.color = "#c9a46c";
            } else if (currentSideCount === totalMain) {
                sideHint.innerHTML = `✅ Napili mo na lahat ng ${totalMain} side dish(es)! Click a side to change it.`;
                sideHint.style.color = "#4caf50";
            }
        } else {
            sideHint.innerHTML = "";
        }
    }
}

function trimSidesToMatch(maxCount) {
    while (selectedSides.length > maxCount) {
        let removed = selectedSides.pop();
        let removedCard = document.querySelector(`.side[data-name="${removed.name}"]`);
        if (removedCard) removedCard.classList.remove("selected");
    }
}

function clearAllSides() {
    selectedSides.forEach(side => {
        let card = document.querySelector(`.side[data-name="${side.name}"]`);
        if (card) card.classList.remove("selected");
    });
    selectedSides = [];
    updateSideHint();
}

// ---------------------
// SIDE DISH - DIRECT ONCLICK FIX
// ---------------------
function selectSide(name, price, element) {
    let totalMainQty = getTotalMainQty();
    
    if (totalMainQty === 0) {
        alert("📢 Pumili ka muna ng main dish!");
        return;
    }
    
    // Check if this side is already selected
    let existingIndex = selectedSides.findIndex(s => s.name === name);
    
    // If already selected, remove it
    if (existingIndex !== -1) {
        selectedSides.splice(existingIndex, 1);
        element.classList.remove("selected");
        updateSideHint();
        updateCart();
        animateCart();
        return;
    }
    
    // Check if we can add more sides
    if (selectedSides.length < totalMainQty) {
        selectedSides.push({ name, price });
        element.classList.add("selected");
        animateCart();
        updateSideHint();
        updateCart();
    } else {
        alert(`⚠️ ${totalMainQty} main dish(es) = ${totalMainQty} side(s) lang! Pwede mong i-remove muna ang isang side bago mag-add ng bago.`);
    }
}

// ---------------------
// EXTRAS
// ---------------------
function addExtraItem(name, price, element) {
    extras.push({ name, price });
    updateCart();
    animateCart();
    
    // Visual feedback
    element.style.transform = "scale(0.95)";
    setTimeout(() => {
        element.style.transform = "scale(1)";
    }, 150);
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
                <li style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #fff3e0; border-radius: 10px; margin-bottom: 8px;">
                    <span>🍱 ${m.name.replace('_', ' ')} x${m.qty}</span>
                    <span>₱${sub}</span>
                    <button onclick="removeMain('${m.name}')" style="background: #e74c3c; color: white; border: none; padding: 3px 8px; border-radius: 6px; cursor: pointer;">✕</button>
                </li>
            `;
        }
    }

    // Side dishes
    selectedSides.forEach((side, idx) => {
        total += side.price;
        count++;
        list.innerHTML += `
            <li style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f5f5f5; border-radius: 10px; margin-bottom: 8px;">
                <span>🍟 ${side.name}</span>
                <span>₱${side.price}</span>
                <button onclick="removeSideItem(${idx})" style="background: #e74c3c; color: white; border: none; padding: 3px 8px; border-radius: 6px; cursor: pointer;">✕</button>
            </li>
        `;
    });

    // Extras
    extras.forEach((e, i) => {
        total += e.price;
        count++;
        list.innerHTML += `
            <li style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #fafafa; border-radius: 10px; margin-bottom: 8px;">
                <span>✨ ${e.name}</span>
                <span>₱${e.price}</span>
                <button onclick="removeExtra(${i})" style="background: #e74c3c; color: white; border: none; padding: 3px 8px; border-radius: 6px; cursor: pointer;">✕</button>
            </li>
        `;
    });
    
    if (list.innerHTML === "") {
        list.innerHTML = '<div style="text-align:center; padding:40px; color:#aaa;">🛒 Walang laman ang cart</div>';
    }

    let cartCount = document.getElementById("cart-count");
    let totalSpan = document.getElementById("total");
    if (cartCount) cartCount.innerText = count;
    if (totalSpan) totalSpan.innerText = total;
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
        let sidesSection = document.getElementById("sides");
        if (sidesSection) sidesSection.classList.add("hidden");
        clearAllSides();
    }
    
    updateCart();
}

function removeSideItem(index) {
    let removed = selectedSides[index];
    let removedCard = document.querySelector(`.side[data-name="${removed.name}"]`);
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
    let drawer = document.getElementById("cartDrawer");
    if (drawer) drawer.classList.toggle("open");
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
            receipt += `🍱 ${m.name.replace('_', ' ')} x${m.qty} = ₱${sub}\n`;
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
        alert("🛒 Walang laman ang cart!");
        return;
    }

    receipt += "\n" + "─".repeat(30) + "\n";
    receipt += `💰 TOTAL: ₱${total}\n`;
    receipt += "═".repeat(30) + "\n";
    receipt += "Salamat sa order! ♡";

    let receiptEl = document.getElementById("receipt");
    let finalTotal = document.getElementById("final-total");
    let modal = document.getElementById("modal");
    
    if (receiptEl) receiptEl.innerText = receipt;
    if (finalTotal) finalTotal.innerText = total;
    if (modal) modal.style.display = "flex";
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
    
    let sidesSection = document.getElementById("sides");
    let modal = document.getElementById("modal");
    let sideHint = document.getElementById("sideHint");
    
    if (sidesSection) sidesSection.classList.add("hidden");
    if (modal) modal.style.display = "none";
    if (sideHint) sideHint.innerHTML = "";

    updateCart();
}

// Close modal when clicking outside
window.onclick = function(event) {
    let modal = document.getElementById("modal");
    if (event.target === modal && modal) {
        modal.style.display = "none";
    }
}
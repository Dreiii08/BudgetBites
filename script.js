// =====================
// BUDGET BITES - ENHANCED VERSION
// =====================

let mains = {};
let selectedSides = []; // Array of side dishes (one per main dish quantity)
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

    // Show/hide sides section
    document.getElementById("sides").classList.toggle("hidden", !hasMain);
    
    // Update side hint
    updateSideHint();
    
    // Adjust sides if quantity decreased
    if (newQty < oldQty) {
        trimSidesToMatch(totalMainQty);
    }
    
    // Clear side selection if no mains
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
            sideHint.innerHTML = `✅ All ${totalMain} side dish(es) selected! You can still change them.`;
            sideHint.style.color = "#4caf50";
            sideHint.style.fontWeight = "500";
        }
    } else {
        sideHint.innerHTML = "";
    }
}

function trimSidesToMatch(maxCount) {
    while (selectedSides.length > maxCount) {
        selectedSides.pop();
    }
    updateSideSelectionUI();
}

function clearAllSides() {
    selectedSides = [];
    updateSideSelectionUI();
}

function updateSideSelectionUI() {
    // Remove selected class from all side cards
    document.querySelectorAll(".side").forEach(c => c.classList.remove("selected"));
    
    // Add selected class to currently selected sides
    selectedSides.forEach(side => {
        let sideCard = document.querySelector(`.side[data-side-name="${side.name}"]`);
        if (sideCard) sideCard.classList.add("selected");
    });
    
    updateSideHint();
    updateCart();
}

// ---------------------
// SIDE DISH (One per main quantity)
// ---------------------
function addSide(name, price, el) {
    let totalMainQty = getTotalMainQty();
    
    if (totalMainQty === 0) {
        alert("📢 Please select a main dish first!");
        return;
    }
    
    // Check if we already have selected this side
    let existingIndex = selectedSides.findIndex(s => s.name === name);
    
    if (existingIndex !== -1) {
        // Remove if already selected
        selectedSides.splice(existingIndex, 1);
        el.classList.remove("selected");
    } else {
        // Add if we haven't reached the limit
        if (selectedSides.length < totalMainQty) {
            selectedSides.push({ name, price });
            el.classList.add("selected");
        } else {
            alert(`⚠️ You can only choose ${totalMainQty} side dish(es) (one per main dish). Remove a side first or reduce main dish quantity.`);
            return;
        }
    }
    
    updateSideHint();
    updateCart();
}

// ---------------------
// EXTRAS
// ---------------------
function addExtra(name, price) {
    extras.push({ name, price });
    updateCart();
    
    // Add animation feedback
    let btn = event.currentTarget;
    btn.style.transform = "scale(0.95)";
    setTimeout(() => { btn.style.transform = "scale(1)"; }, 150);
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
                <li class="cart-item main-item">
                    <div class="cart-item-info">
                        <span class="cart-item-name">🍱 ${m.name}</span>
                        <span class="cart-item-qty">x${m.qty}</span>
                    </div>
                    <div class="cart-item-price">₱${sub}</div>
                    <button class="remove-btn" onclick="removeMain('${m.name}')">✕</button>
                </li>
            `;
        }
    }

    // Side dishes (show each individually)
    selectedSides.forEach((side, idx) => {
        total += side.price;
        count++;
        list.innerHTML += `
            <li class="cart-item side-item">
                <div class="cart-item-info">
                    <span class="cart-item-name">🍟 ${side.name}</span>
                    <span class="cart-item-label">Side #${idx + 1}</span>
                </div>
                <div class="cart-item-price">₱${side.price}</div>
                <button class="remove-btn" onclick="removeSideItem(${idx})">✕</button>
            </li>
        `;
    });

    // Extras
    extras.forEach((e, i) => {
        total += e.price;
        count++;
        list.innerHTML += `
            <li class="cart-item extra-item">
                <div class="cart-item-info">
                    <span class="cart-item-name">✨ ${e.name}</span>
                </div>
                <div class="cart-item-price">₱${e.price}</div>
                <button class="remove-btn" onclick="removeExtra(${i})">✕</button>
            </li>
        `;
    });
    
    if (list.innerHTML === "") {
        list.innerHTML = '<div class="empty-cart">🛒 Your cart is empty<br><span>Add some delicious items!</span></div>';
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
    selectedSides.splice(index, 1);
    updateSideSelectionUI();
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
// CHECKOUT
// ---------------------
function checkout() {
    let receipt = "";
    let total = 0;
    let hasItems = false;
    
    receipt += "═".repeat(30) + "\n";
    receipt += "   BUDGET BITES - RECEIPT\n";
    receipt += "═".repeat(30) + "\n\n";

    for (let k in mains) {
        let m = mains[k];
        if (m.qty > 0) {
            hasItems = true;
            let sub = m.qty * m.price;
            total += sub;
            receipt += `🍱 ${m.name}\n   x${m.qty} @ ₱${m.price} = ₱${sub}\n\n`;
        }
    }

    if (selectedSides.length > 0) {
        receipt += `🍟 SIDE DISHES (${selectedSides.length} pcs):\n`;
        selectedSides.forEach((side, idx) => {
            total += side.price;
            receipt += `   ${idx + 1}. ${side.name} = ₱${side.price}\n`;
        });
        receipt += "\n";
    }

    if (extras.length > 0) {
        receipt += `✨ ADD-ONS:\n`;
        extras.forEach(e => {
            total += e.price;
            receipt += `   • ${e.name} = ₱${e.price}\n`;
        });
        receipt += "\n";
    }

    if (!hasItems && selectedSides.length === 0 && extras.length === 0) {
        alert("🛒 Your cart is empty! Add some items first.");
        return;
    }

    receipt += "─".repeat(30) + "\n";
    receipt += `💰 TOTAL AMOUNT: ₱${total}\n`;
    receipt += "═".repeat(30) + "\n";
    receipt += "Thank you for ordering!\n";
    receipt += "Budget Bites ♡";

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

// Add data attributes to side cards for easier selection
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".side").forEach(card => {
        let name = card.querySelector("h3")?.innerText;
        if (name) {
            card.setAttribute("data-side-name", name);
        }
    });
});
// Add cart animation when adding items
function animateCart() {
    let cartIcon = document.querySelector('.cart-icon');
    cartIcon.classList.add('cart-bump');
    setTimeout(() => {
        cartIcon.classList.remove('cart-bump');
    }, 300);
}

// Modify your addExtra function to include animation
// Replace your existing addExtra function with this:
function addExtra(name, price) {
    extras.push({ name, price });
    updateCart();
    animateCart(); // Add this line
}

// Modify addSide function to include animation  
// Replace your existing addSide function with this:
function addSide(name, price, el) {
    let totalMainQty = getTotalMainQty();
    
    if (totalMainQty === 0) {
        alert("📢 Please select a main dish first!");
        return;
    }
    
    let existingIndex = selectedSides.findIndex(s => s.name === name);
    
    if (existingIndex !== -1) {
        selectedSides.splice(existingIndex, 1);
        el.classList.remove("selected");
    } else {
        if (selectedSides.length < totalMainQty) {
            selectedSides.push({ name, price });
            el.classList.add("selected");
            animateCart(); // Add this line
        } else {
            alert(`⚠️ You can only choose ${totalMainQty} side dish(es) (one per main dish).`);
            return;
        }
    }
    
    updateSideHint();
    updateCart();
}

// Modify changeMainQty to add animation when increasing quantity
// Add this inside changeMainQty function after increasing quantity:
// if (change > 0) animateCart();
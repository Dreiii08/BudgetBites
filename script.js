// =====================
// BUDGET BITES - COMPLETE VERSION
// with Duplicate Sides Allowed, Badge Counter, Full Cart System
// =====================

let mains = {};
let selectedSides = [];
let extras = [];

// ---------------------
// MAIN DISH FUNCTIONS
// ---------------------
function changeMainQty(name, price, el, change) {
    if (!mains[name]) {
        mains[name] = { name: name, price: price, qty: 0 };
    }

    let newQty = mains[name].qty + change;
    if (newQty < 0) newQty = 0;
    
    let oldQty = mains[name].qty;
    mains[name].qty = newQty;

    // Update display
    let qtyEl = document.getElementById("qty-" + name);
    if (qtyEl) qtyEl.innerText = mains[name].qty;

    let totalMainQty = getTotalMainQty();
    let sidesSection = document.getElementById("sides");
    
    // Show/hide sides section
    if (sidesSection) {
        if (totalMainQty > 0) {
            sidesSection.classList.remove("hidden");
        } else {
            sidesSection.classList.add("hidden");
        }
    }
    
    updateSideHint();
    
    // Remove extra sides if main quantity decreased
    if (newQty < oldQty) {
        while (selectedSides.length > totalMainQty) {
            let removed = selectedSides.pop();
            updateSideHighlight(removed.name);
        }
    }
    
    // Clear all sides if no main dishes
    if (totalMainQty === 0) {
        selectedSides = [];
        document.querySelectorAll(".side").forEach(card => {
            card.classList.remove("selected");
            let badge = card.querySelector('.selected-count');
            if (badge) badge.style.display = 'none';
        });
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

// ---------------------
// SIDE DISH FUNCTIONS
// ---------------------
function updateSideHint() {
    let totalMain = getTotalMainQty();
    let sideHint = document.getElementById("sideHint");
    let currentSideCount = selectedSides.length;
    
    if (sideHint && totalMain > 0) {
        if (currentSideCount < totalMain) {
            let remaining = totalMain - currentSideCount;
            sideHint.innerHTML = `✨ Pwede ka pang pumili ng ${remaining} side dish (${currentSideCount}/${totalMain} napili)`;
            sideHint.style.color = "#c9a46c";
        } else {
            sideHint.innerHTML = `✅ Complete na! ${currentSideCount}/${totalMain} sides. Pwede mong i-remove ang isang side para magpalit.`;
            sideHint.style.color = "#4caf50";
        }
        sideHint.style.fontSize = "13px";
        sideHint.style.marginBottom = "15px";
        sideHint.style.padding = "8px 15px";
        sideHint.style.background = "#fff3e0";
        sideHint.style.borderRadius = "20px";
        sideHint.style.display = "inline-block";
    } else if (sideHint) {
        sideHint.innerHTML = "";
    }
}

function updateSideHighlight(name) {
    let count = selectedSides.filter(s => s.name === name).length;
    let card = document.querySelector(`.side[data-name="${name}"]`);
    
    if (card) {
        if (count > 0) {
            card.classList.add("selected");
            let badge = card.querySelector('.selected-count');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'selected-count';
                badge.style.cssText = 'position:absolute; top:-8px; right:-8px; background:#c9a46c; color:#2b1a0e; border-radius:50%; width:24px; height:24px; font-size:12px; font-weight:bold; display:flex; align-items:center; justify-content:center; border:2px solid white;';
                card.style.position = 'relative';
                card.appendChild(badge);
            }
            badge.textContent = count;
            badge.style.display = 'flex';
        } else {
            card.classList.remove("selected");
            let badge = card.querySelector('.selected-count');
            if (badge) badge.style.display = 'none';
        }
    }
}

function selectSide(name, price, element) {
    let totalMainQty = getTotalMainQty();
    
    if (totalMainQty === 0) {
        alert("📢 Pumili ka muna ng main dish!");
        return;
    }
    
    // Check if reached the limit
    if (selectedSides.length >= totalMainQty) {
        alert(`⚠️ Puno na! ${totalMainQty} main dish = ${totalMainQty} side dish lang. I-remove mo muna ang isang side bago mag-add ng bago.`);
        return;
    }
    
    // Add side (duplicate allowed!)
    selectedSides.push({ name: name, price: price });
    updateSideHighlight(name);
    updateSideHint();
    updateCart();
    
    // Visual feedback
    element.style.transform = "scale(0.95)";
    setTimeout(() => {
        element.style.transform = "scale(1)";
    }, 150);
    
    // Cart animation
    animateCart();
}

// ---------------------
// EXTRA FUNCTIONS
// ---------------------
function addExtraItem(name, price, element) {
    extras.push({ name: name, price: price });
    updateCart();
    animateCart();
    
    // Visual feedback
    element.style.transform = "scale(0.95)";
    setTimeout(() => {
        element.style.transform = "scale(1)";
    }, 150);
}

// ---------------------
// CART FUNCTIONS
// ---------------------
function updateCart() {
    let list = document.getElementById("order-list");
    if (!list) return;
    
    list.innerHTML = "";
    let total = 0;
    let count = 0;

    // Display Main Dishes
    for (let k in mains) {
        let m = mains[k];
        if (m.qty > 0) {
            let sub = m.qty * m.price;
            total += sub;
            count += m.qty;
            list.innerHTML += `
                <li style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #fff3e0; margin-bottom: 8px; border-radius: 10px; border-left: 4px solid #c9a46c;">
                    <div style="flex: 1;">
                        <strong>🍱 ${m.name.replace('_', ' ')}</strong>
                        <span style="margin-left: 10px; color: #888;">x${m.qty}</span>
                    </div>
                    <div style="margin: 0 15px; font-weight: bold; color: #2b1a0e;">₱${sub}</div>
                    <button onclick="removeMain('${m.name}')" style="background: #e74c3c; color: white; border: none; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-size: 14px;">✕</button>
                </li>
            `;
        }
    }

    // Display Side Dishes (with individual numbers)
    if (selectedSides.length > 0) {
        selectedSides.forEach((side, idx) => {
            total += side.price;
            count++;
            list.innerHTML += `
                <li style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f5f5f5; margin-bottom: 8px; border-radius: 10px; border-left: 4px solid #c9a46c;">
                    <div style="flex: 1;">
                        <strong>🍟 ${side.name}</strong>
                        <span style="margin-left: 10px; color: #888; font-size: 12px;">Side #${idx + 1}</span>
                    </div>
                    <div style="margin: 0 15px; font-weight: bold; color: #2b1a0e;">₱${side.price}</div>
                    <button onclick="removeSideItem(${idx})" style="background: #e74c3c; color: white; border: none; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-size: 14px;">✕</button>
                </li>
            `;
        });
    }

    // Display Extras
    extras.forEach((e, i) => {
        total += e.price;
        count++;
        list.innerHTML += `
            <li style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #fafafa; margin-bottom: 8px; border-radius: 10px; border-left: 4px solid #c9a46c;">
                <div style="flex: 1;">
                    <strong>✨ ${e.name}</strong>
                </div>
                <div style="margin: 0 15px; font-weight: bold; color: #2b1a0e;">₱${e.price}</div>
                <button onclick="removeExtra(${i})" style="background: #e74c3c; color: white; border: none; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-size: 14px;">✕</button>
            </li>
        `;
    });
    
    // Empty cart message
    if (list.innerHTML === "") {
        list.innerHTML = `
            <div style="text-align: center; padding: 50px 20px; color: #aaa;">
                🛒 Walang laman ang cart<br>
                <span style="font-size: 12px;">Mag-add ng main dish para makapili ng sides</span>
            </div>
        `;
    }

    // Update counters
    let cartCount = document.getElementById("cart-count");
    let totalSpan = document.getElementById("total");
    if (cartCount) cartCount.innerText = count;
    if (totalSpan) totalSpan.innerText = total;
}

function animateCart() {
    let cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.style.transform = "scale(1.1)";
        cartIcon.style.transition = "transform 0.2s";
        setTimeout(() => {
            cartIcon.style.transform = "scale(1)";
        }, 200);
    }
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
    
    let totalMain = getTotalMainQty();
    
    // Remove excess sides
    while (selectedSides.length > totalMain) {
        let removed = selectedSides.pop();
        updateSideHighlight(removed.name);
    }
    
    // Hide sides section if no mains
    if (totalMain === 0) {
        selectedSides = [];
        document.querySelectorAll(".side").forEach(card => {
            card.classList.remove("selected");
            let badge = card.querySelector('.selected-count');
            if (badge) badge.style.display = 'none';
        });
        let sidesSection = document.getElementById("sides");
        if (sidesSection) sidesSection.classList.add("hidden");
    }
    
    updateSideHint();
    updateCart();
}

function removeSideItem(index) {
    let removed = selectedSides[index];
    selectedSides.splice(index, 1);
    updateSideHighlight(removed.name);
    updateSideHint();
    updateCart();
}

function removeExtra(index) {
    extras.splice(index, 1);
    updateCart();
}

// ---------------------
// CART DRAWER
// ---------------------
function toggleCart() {
    let drawer = document.getElementById("cartDrawer");
    if (drawer) {
        drawer.classList.toggle("open");
    }
}

// ---------------------
// CHECKOUT & RECEIPT
// ---------------------
function checkout() {
    let hasItems = false;
    for (let k in mains) {
        if (mains[k].qty > 0) {
            hasItems = true;
            break;
        }
    }
    
    if (!hasItems && selectedSides.length === 0 && extras.length === 0) {
        alert("🛒 Walang laman ang cart! Mag-add ka muna ng order.");
        return;
    }
    
    let receipt = "";
    let total = 0;
    
    receipt += "╔════════════════════════════════╗\n";
    receipt += "║        BUDGET BITES            ║\n";
    receipt += "║    Sa Unang Kagat, I Miss You  ║\n";
    receipt += "╚════════════════════════════════╝\n\n";
    
    receipt += "📋 ORDER SUMMARY:\n";
    receipt += "─".repeat(40) + "\n\n";
    
    // Main dishes
    for (let k in mains) {
        let m = mains[k];
        if (m.qty > 0) {
            let sub = m.qty * m.price;
            total += sub;
            receipt += `🍱 ${m.name.replace('_', ' ')}\n`;
            receipt += `   x${m.qty} @ ₱${m.price} = ₱${sub}\n\n`;
        }
    }
    
    // Side dishes
    if (selectedSides.length > 0) {
        receipt += `🍟 SIDE DISHES (${selectedSides.length} pcs):\n`;
        selectedSides.forEach((side, idx) => {
            total += side.price;
            receipt += `   ${idx + 1}. ${side.name} = ₱${side.price}\n`;
        });
        receipt += "\n";
    }
    
    // Extras
    if (extras.length > 0) {
        receipt += `✨ ADD-ONS:\n`;
        extras.forEach(e => {
            total += e.price;
            receipt += `   • ${e.name} = ₱${e.price}\n`;
        });
        receipt += "\n";
    }
    
    receipt += "─".repeat(40) + "\n";
    receipt += `💰 TOTAL AMOUNT: ₱${total}\n`;
    receipt += "─".repeat(40) + "\n\n";
    receipt += "🙏 Salamat sa iyong order!\n";
    receipt += "🏫 CSN - Budget Bites\n";
    receipt += "⭐ Rate us 5 stars! ⭐\n";
    
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
    
    // Reset all side cards
    document.querySelectorAll(".side").forEach(card => {
        card.classList.remove("selected");
        let badge = card.querySelector('.selected-count');
        if (badge) badge.style.display = 'none';
    });
    
    // Reset all quantity displays
    document.querySelectorAll('[id^="qty-"]').forEach(el => {
        el.innerText = "0";
    });
    
    // Hide sides section
    let sidesSection = document.getElementById("sides");
    if (sidesSection) sidesSection.classList.add("hidden");
    
    // Hide modal
    let modal = document.getElementById("modal");
    if (modal) modal.style.display = "none";
    
    // Clear side hint
    let sideHint = document.getElementById("sideHint");
    if (sideHint) sideHint.innerHTML = "";
    
    // Update cart
    updateCart();
}

// ---------------------
// CLOSE MODAL ON OUTSIDE CLICK
// ---------------------
window.onclick = function(event) {
    let modal = document.getElementById("modal");
    if (event.target === modal && modal) {
        modal.style.display = "none";
    }
}

// ---------------------
// INITIALIZE ON PAGE LOAD
// ---------------------
document.addEventListener("DOMContentLoaded", function() {
    console.log("Budget Bites - Ready!");
    updateCart();
});
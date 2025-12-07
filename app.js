let selectedCategory = "All";
let currentPage = 1;
const itemsPerPage = 6;

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
    document.getElementById("cartCount").innerText = cart.length;
}

function addToCart(item) {
    const exist = cart.find(c => c.id === item.id);
    if (exist) {
        exist.qty++;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    saveCart();
    updateCartCount();
    alert(`${item.name} added to cart!`);
}

function buyNow(item) {
    localStorage.setItem("buyItem", JSON.stringify(item));
    window.location.href = "checkout.html";
}

function renderProducts() {
    const container = document.getElementById("productGrid");
    container.innerHTML = "";

    let filtered = selectedCategory === "All"
        ? products
        : products.filter(p => p.category === selectedCategory);

    const start = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);

    paginated.forEach(p => {
        container.innerHTML += `
        <div class="card">
            <img src="${p.img}">
            <h3 class="card-title">${p.name}</h3>
            <p class="card-price">$${p.price.toFixed(2)}</p>
            <div class="btn-row">
                <button class="btn1" onclick='addToCart(${JSON.stringify(p)})'>Add to Cart</button>
                <button class="btn2" onclick='buyNow(${JSON.stringify(p)})'>Buy Now</button>
            </div>
        </div>`;
    });

    renderPagination(filtered.length);
}

function renderPagination(totalItems) {
    const pages = Math.ceil(totalItems / itemsPerPage);
    const container = document.getElementById("pagination");
    container.innerHTML = "";

    if (currentPage > 1) container.innerHTML += `<button onclick="prevPage()">Prev</button>`;
    
    for (let i = 1; i <= pages; i++) {
        container.innerHTML += `<button class="${i===currentPage?'active':''}" onclick="gotoPage(${i})">${i}</button>`;
    }

    if (currentPage < pages) container.innerHTML += `<button onclick="nextPage()">Next</button>`;
}

function prevPage() { currentPage--; renderProducts(); }
function nextPage() { currentPage++; renderProducts(); }
function gotoPage(p) { currentPage = p; renderProducts(); }

function renderRecommended() {
    const rec = document.getElementById("recGrid");
    rec.innerHTML = "";

    recommended.forEach(r => {
        rec.innerHTML += `
        <div class="card">
            <img src="${r.img}">
            <h3 class="card-title">${r.name}</h3>
            <p class="card-price">$${r.price.toFixed(2)}</p>
            <div class="btn-row">
                <button class="btn1" onclick='addToCart(${JSON.stringify(r)})'>Add to Cart</button>
                <button class="btn2" onclick='buyNow(${JSON.stringify(r)})'>Buy Now</button>
            </div>
        </div>`;
    });
}

document.querySelectorAll(".sidebar li").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".sidebar li.active")?.classList.remove("active");
        btn.classList.add("active");
        selectedCategory = btn.dataset.category;
        currentPage = 1;
        renderProducts();
    });
});

document.querySelector(".search-btn").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const container = document.getElementById("productGrid");
    container.innerHTML = "";

    const filtered = products.filter(p => p.name.toLowerCase().includes(query));

    filtered.forEach(p => {
        container.innerHTML += `
        <div class="card">
            <img src="${p.img}">
            <h3 class="card-title">${p.name}</h3>
            <p class="card-price">$${p.price.toFixed(2)}</p>
            <div class="btn-row">
                <button class="btn1" onclick='addToCart(${JSON.stringify(p)})'>Add to Cart</button>
                <button class="btn2" onclick='buyNow(${JSON.stringify(p)})'>Buy Now</button>
            </div>
        </div>`;
    });

    document.getElementById("pagination").innerHTML = "";
});

renderProducts();
renderRecommended();
updateCartCount();

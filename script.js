let products = JSON.parse(localStorage.getItem("products")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || []; // YANGI
let currentCategory = 'Hammasi';

// Mahsulotlarni ko‘rsatish
function renderProducts(category = 'Hammasi', searchQuery = "") {
    const shop = document.getElementById("shop");
    if (!shop) return;

    products = JSON.parse(localStorage.getItem("products")) || products;
    shop.innerHTML = "";

    let filtered = products.filter(p => {
        const matchesCategory = (category === 'Hammasi' || p.category === category);
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        shop.innerHTML = "<p style='text-align:center; color:#999; font-size:18px;'>Mahsulot topilmadi 😔</p>";
        return;
    }

    filtered.forEach((p, i) => {
        const isFavorite = favorites.some(f => f.name === p.name);
        shop.innerHTML += `
        <div class="product">
            <div class="favorite ${isFavorite ? 'active' : ''}" onclick="toggleFavorite(${i})">${isFavorite ? '❤️' : '♡'}</div>
            <img src="${p.image}" alt="${p.name}">
            <div class="product-info">
                <h3>${p.name}</h3>
                <p class="price">${Number(p.price).toLocaleString()} so‘m</p>
                <p class="desc">${p.description || "Yuqori sifatli va yangi mahsulot"}</p>
                <div class="quantity">
                    <button onclick="changeQty(${i}, -1)">−</button>
                    <span id="qty-${i}">1</span>
                    <button onclick="changeQty(${i}, 1)">+</button>
                </div>
                <button onclick="addToCart(${i})">Savatchaga qo‘shish</button>
            </div>
        </div>`;
    });
}

// Sevimlilarga qo‘shish/o‘chirish
function toggleFavorite(index) {
    products = JSON.parse(localStorage.getItem("products")) || products;
    const product = products[index];
    const existingIndex = favorites.findIndex(f => f.name === product.name);

    if (existingIndex > -1) {
        favorites.splice(existingIndex, 1);
        alert("♡ Sevimlilardan o‘chirildi");
    } else {
        favorites.push(product);
        alert("❤️ Sevimlilarga qo‘shildi!");
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderProducts(currentCategory); // yurakcha rangi o‘zgarishi uchun
    updateFavoritesCount();
}

// Sevimlilar sonini headerda ko‘rsatish
function updateFavoritesCount() {
    favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const favLinks = document.querySelectorAll("a[href='favorites.html']");
    favLinks.forEach(link => {
        link.innerHTML = `Sevimlilar (${favorites.length}) ❤️`;
    });
}

// Qolgan funksiyalar (addToCart, changeQty, search, filter, updateCartCount) o‘zgarmaydi
// ... (oldingi kodlaringizni shu yerga qo‘yavering, faqat toggleFavorite va updateFavoritesCount qo‘shildi)

// Yuklanganda
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("shop")) {
        renderProducts();
        updateCartCount();
        updateFavoritesCount();
    }
    if (document.getElementById("favoritesList")) {
        renderFavorites();
        updateFavoritesCount();
    }
    if (document.getElementById("cartItems")) {
        updateCartCount();
    }
});
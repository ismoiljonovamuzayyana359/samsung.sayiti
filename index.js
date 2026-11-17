
// ===================================
// SAMSUNG WEBSITE - JAVASCRIPT
// ===================================

// ELEMENTS
const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".dot");
const nextSlide = document.getElementById("nextSlide");
const prevSlide = document.getElementById("prevSlide");

let currentSlide = 0;
let slideTimer;

// ===================================
// HERO SLIDER
// ===================================

function showSlide(index) {
    slides[currentSlide].classList.remove("active");
    dots[currentSlide].classList.remove("active");

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
}

function startSlider() {
    clearInterval(slideTimer);

    slideTimer = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
}

nextSlide.addEventListener("click", () => {
    showSlide(currentSlide + 1);
    startSlider();
});

prevSlide.addEventListener("click", () => {
    showSlide(currentSlide - 1);
    startSlider();
});

dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        showSlide(index);
        startSlider();
    });
});

startSlider();


// ===================================
// MOBILE MENU
// ===================================

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    const icon = menuBtn.querySelector("i");

    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-times");
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");

        menuBtn.querySelector("i").classList.add("fa-bars");
        menuBtn.querySelector("i").classList.remove("fa-times");
    });
});


// ===================================
// SEARCH
// ===================================

const searchBtn = document.getElementById("searchBtn");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");
const closeSearch = document.getElementById("closeSearch");

searchBtn.addEventListener("click", () => {
    searchBox.classList.toggle("active");

    if (searchBox.classList.contains("active")) {
        searchInput.focus();
    } else {
        searchInput.value = "";
        filterProducts();
    }
});

closeSearch.addEventListener("click", () => {
    searchBox.classList.remove("active");
    searchInput.value = "";
    filterProducts();
});


// ===================================
// PRODUCT FILTER
// ===================================

const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");

let selectedCategory = "all";

function filterProducts() {
    const searchValue = searchInput.value.toLowerCase().trim();

    productCards.forEach(card => {
        const category = card.dataset.category;
        const name = card.dataset.name.toLowerCase();

        const categoryMatch =
            selectedCategory === "all" ||
            category === selectedCategory;

        const searchMatch = name.includes(searchValue);

        card.classList.toggle(
            "hide",
            !(categoryMatch && searchMatch)
        );
    });
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        selectedCategory = button.dataset.filter;

        filterProducts();
    });
});

searchInput.addEventListener("input", filterProducts);


// ===================================
// SHOPPING CART
// ===================================

const cartBtn = document.getElementById("cartBtn");
const closeCart = document.getElementById("closeCart");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

let cart = [];

try {
    const savedCart = JSON.parse(localStorage.getItem("samsungCart"));

    if (Array.isArray(savedCart)) {
        cart = savedCart.filter(item =>
            item &&
            typeof item.name === "string" &&
            typeof item.price === "number" &&
            typeof item.quantity === "number" &&
            Number.isFinite(item.price) &&
            Number.isFinite(item.quantity) &&
            item.price >= 0 &&
            item.quantity > 0
        );
    }
} catch (error) {
    cart = [];
}

function formatPrice(price) {
    return price.toLocaleString("uz-UZ") + " so'm";
}

function saveCart() {
    localStorage.setItem("samsungCart", JSON.stringify(cart));
}

function openCart() {
    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");
}

function closeCartSidebar() {
    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
}

cartBtn.addEventListener("click", openCart);

closeCart.addEventListener("click", closeCartSidebar);

cartOverlay.addEventListener("click", closeCartSidebar);


// ADD PRODUCT

function addToCart(name, price) {
    const existingProduct = cart.find(item => item.name === name);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    updateCart();

    openCart();
}


// PRODUCT BUTTONS

productCards.forEach(card => {
    const button = card.querySelector(".add-cart");

    button.addEventListener("click", () => {
        const name = card.dataset.name;
        const price = Number(card.dataset.price);

        addToCart(name, price);
    });
});


// UPDATE CART

function updateCart() {
    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty.</p>';
    }

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        count += item.quantity;

        const itemElement = document.createElement("div");

        itemElement.className = "cart-item";

        const info = document.createElement("div");
        info.className = "cart-item-info";

        const name = document.createElement("h4");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent = formatPrice(item.price);

        info.append(name, price);

        const actions = document.createElement("div");
        actions.className = "cart-item-actions";

        const minus = document.createElement("button");
        minus.textContent = "-";
        minus.setAttribute("aria-label", "Kamaytirish");

        minus.addEventListener("click", () => {
            changeQuantity(index, -1);
        });

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const plus = document.createElement("button");
        plus.textContent = "+";
        plus.setAttribute("aria-label", "Ko'paytirish");

        plus.addEventListener("click", () => {
            changeQuantity(index, 1);
        });

        const remove = document.createElement("button");
        remove.className = "remove-item";
        remove.innerHTML = '<i class="fas fa-trash"></i>';
        remove.setAttribute("aria-label", "O'chirish");

        remove.addEventListener("click", () => {
            removeProduct(index);
        });

        actions.append(minus, quantity, plus, remove);

        itemElement.append(info, actions);

        cartItems.appendChild(itemElement);
    });

    cartCount.textContent = count;
    cartTotal.textContent = formatPrice(total);

    saveCart();
}


// CHANGE QUANTITY

function changeQuantity(index, amount) {
    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    updateCart();
}


// REMOVE PRODUCT

function removeProduct(index) {
    cart.splice(index, 1);
    updateCart();
}


// INITIAL CART

updateCart();


// ===================================
// PRODUCT DETAIL MODAL
// ===================================

const productModal = document.getElementById("productModal");
const closeModal = document.getElementById("closeModal");

const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalAddCart = document.getElementById("modalAddCart");

let selectedProduct = null;

productCards.forEach(card => {
    card.addEventListener("click", event => {

        if (event.target.closest(".add-cart")) {
            return;
        }

        selectedProduct = {
            name: card.dataset.name,
            price: Number(card.dataset.price)
        };

        modalImage.src = card.querySelector("img").src;
        modalName.textContent = selectedProduct.name;
        modalDescription.textContent =
            card.querySelector("p").textContent;

        modalPrice.textContent =
            formatPrice(selectedProduct.price);

        productModal.classList.add("active");
    });
});

function hideModal() {
    productModal.classList.remove("active");
}

closeModal.addEventListener("click", hideModal);

productModal.addEventListener("click", event => {
    if (event.target === productModal) {
        hideModal();
    }
});

modalAddCart.addEventListener("click", () => {
    if (!selectedProduct) return;

    addToCart(
        selectedProduct.name,
        selectedProduct.price
    );

    hideModal();
});


// ===================================
// NEWSLETTER
// ===================================

const newsletterForm = document.getElementById("newsletterForm");

newsletterForm.addEventListener("submit", event => {
    event.preventDefault();

    const email = document.getElementById("emailInput").value.trim();

    if (!email) return;

    alert("Rahmat! " + email + " muvaffaqiyatli qabul qilindi.");

    newsletterForm.reset();
});


// ===================================
// CHECKOUT
// ===================================

const checkoutBtn = document.getElementById("checkoutBtn");

checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Savatingiz hozircha bo'sh!");
        return;
    }

    alert(
        "Buyurtmangiz tayyorlandi!\n" +
        "Umumiy summa: " +
        formatPrice(
            cart.reduce((sum, item) =>
                sum + item.price * item.quantity, 0
            )
        ) +
        "\nBu demo sayt. Haqiqiy to'lov tizimi hali ulanmagan."
    );
});


// ===================================
// KEYBOARD SHORTCUTS
// ===================================

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCartSidebar();
        hideModal();
        searchBox.classList.remove("active");
    }
});

console.log("Samsung Website successfully loaded!");

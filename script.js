
const products = [
  { id:1,  name:'iPhone 16 Pro',       category:'Electronics', price:89999, oldPrice:110000, rating:4.9, reviews:1243, emoji:'📱', badge:'New',  desc:'Titanium design with A18 Pro chip. Stunning camera system with 5x optical zoom.',                     sizes:['64GB','128GB','256GB','512GB'] },
  { id:2,  name:'AirMax Pro Elite',    category:'Footwear',    price:4299,  oldPrice:6999,   rating:4.7, reviews:892,  emoji:'👟', badge:'Sale', desc:'Engineered mesh upper with responsive cushioning. Perfect for everyday wear or the gym.',            sizes:['UK6','UK7','UK8','UK9','UK10','UK11'] },
  { id:3,  name:'Silk Kurta Set',      category:'Fashion',     price:2199,  oldPrice:3500,   rating:4.6, reviews:541,  emoji:'👗', badge:'Sale', desc:'Premium silk with intricate embroidery. Hand-stitched by master craftsmen.',                         sizes:['XS','S','M','L','XL','XXL'] },
  { id:4,  name:'Sony WH-1000XM6',    category:'Electronics', price:28999, oldPrice:35000,  rating:4.8, reviews:2100, emoji:'🎧', badge:'Hot',  desc:'Industry-leading noise cancelling with up to 30 hours of battery life and crystal clear audio.',     sizes:['One Size'] },
  { id:5,  name:'Matte Lipstick Kit', category:'Beauty',      price:899,   oldPrice:1499,   rating:4.5, reviews:673,  emoji:'💄', badge:'Sale', desc:'Long-lasting matte finish in 12 bold shades. Vegan and cruelty-free formula.',                       sizes:['Shade 1','Shade 2','Shade 3','Shade 4'] },
  { id:6,  name:'Aromatherapy Diffuser', category:'Home',     price:1599,  oldPrice:2200,   rating:4.4, reviews:387,  emoji:'🕯️', badge:'New',  desc:'Ultrasonic diffuser with 7 color LED lights. Creates a calming spa atmosphere at home.',           sizes:['300ml','500ml'] },
  { id:7,  name:'Cricket Bat Pro',    category:'Sports',      price:3499,  oldPrice:4999,   rating:4.7, reviews:219,  emoji:'🏏', badge:'Hot',  desc:'English willow, Grade A. Perfect balance and sweet spot. Used by state-level players.',             sizes:['Short Handle','Long Handle'] },
  { id:8,  name:'Samsung Galaxy Tab', category:'Electronics', price:45999, oldPrice:55000,  rating:4.6, reviews:988,  emoji:'📟', badge:'New',  desc:'10.9-inch AMOLED display with S-Pen support. Perfect for creativity and productivity.',            sizes:['64GB','128GB','256GB'] },
  { id:9,  name:'Linen Joggers',      category:'Fashion',     price:1299,  oldPrice:2000,   rating:4.3, reviews:445,  emoji:'👖', badge:'Sale', desc:'Breathable linen blend for all-day comfort. Relaxed fit with elastic waistband.',                   sizes:['XS','S','M','L','XL'] },
  { id:10, name:'Running Shoes X',    category:'Footwear',    price:3199,  oldPrice:4500,   rating:4.5, reviews:765,  emoji:'🏃', badge:'Sale', desc:'Carbon fiber plate technology for explosive energy return. Ultralight at just 180g.',              sizes:['UK6','UK7','UK8','UK9','UK10'] },
  { id:11, name:'Skincare Gift Set',  category:'Beauty',      price:2499,  oldPrice:3999,   rating:4.8, reviews:1120, emoji:'🧴', badge:'Hot',  desc:'Complete 5-step routine with Vitamin C serum, hyaluronic acid, SPF 50+ and night cream.',          sizes:['One Size'] },
  { id:12, name:'Yoga Mat Premium',   category:'Sports',      price:1899,  oldPrice:2500,   rating:4.6, reviews:534,  emoji:'🧘', badge:'New',  desc:'6mm thick with non-slip grip. Eco-friendly natural rubber. Includes carry strap.',                 sizes:['Standard','XL'] },
];

// =============================================
// STATE
// =============================================
let cart        = [];
let wishlist    = [];
let activeFilter = 'All';
let currentProduct = null;
let activeSize  = null;
let timerEnd    = Date.now() + 8 * 3600000 + 45 * 60000 + 30000;

// =============================================
// PRODUCT RENDERING
// =============================================
const categoryBg = {
  Electronics: 'linear-gradient(135deg,#1a1a2e,#16213e)',
  Footwear:    'linear-gradient(135deg,#0f0c29,#302b63)',
  Fashion:     'linear-gradient(135deg,#1a0a1a,#3d0a3d)',
  Beauty:      'linear-gradient(135deg,#1a0a0a,#3d1a1a)',
  Home:        'linear-gradient(135deg,#0a1a0a,#1a3d1a)',
  Sports:      'linear-gradient(135deg,#0a0a1a,#1a2a1a)',
  default:     'linear-gradient(135deg,#1a1a1a,#2a2a2a)',
};

function renderProducts(list) {
  const grid = document.getElementById('productsGrid');
  if (!list.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--muted)">No products found 😢</div>';
    return;
  }
  grid.innerHTML = list.map(p => {
    const disc   = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    const inWish = wishlist.some(w => w.id === p.id);
    const bg     = categoryBg[p.category] || categoryBg.default;
    const stars  = '★'.repeat(Math.floor(p.rating)) + '☆'.repeat(5 - Math.floor(p.rating));
    return `
      <div class="product-card" onclick="openModal(${p.id})">
        <div class="product-img" style="background:${bg}">
          <span class="product-img-emoji">${p.emoji}</span>
          ${p.badge ? `<span class="product-badge badge-${p.badge.toLowerCase()}">${p.badge}${disc ? ' -' + disc + '%' : ''}</span>` : ''}
          <div class="product-actions">
            <div class="action-btn heart-btn ${inWish ? 'active' : ''}"
                 onclick="event.stopPropagation();toggleWishlistItem(${p.id},this)"
                 title="Wishlist">♡</div>
            <div class="action-btn"
                 onclick="event.stopPropagation();quickAdd(${p.id})"
                 title="Quick Add">+</div>
          </div>
        </div>
        <div class="product-body">
          <div class="product-cat">${p.category}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-rating">
            <span class="stars">${stars}</span>
            <span class="rating-count">${p.rating} (${p.reviews.toLocaleString()})</span>
          </div>
          <div class="product-footer">
            <div>
              <span class="product-price">₹${p.price.toLocaleString()}</span>
              ${p.oldPrice ? `<span class="product-price-old">₹${p.oldPrice.toLocaleString()}</span>` : ''}
            </div>
            <button class="add-btn" onclick="event.stopPropagation();quickAdd(${p.id})" title="Add to cart">+</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

// =============================================
// FILTERS & SORT
// =============================================
function filterProducts(cat, btn) {
  activeFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
}

function filterByCategory(cat) {
  activeFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.trim() === cat);
  });
  applyFilters();
}

function sortProducts() {
  applyFilters();
}

function filterSearch() {
  applyFilters();
}

function applyFilters() {
  const q    = document.getElementById('searchInput').value.toLowerCase();
  const sort = document.getElementById('sortSelect').value;

  let list = products.filter(p =>
    (activeFilter === 'All' || p.category === activeFilter) &&
    (p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
  );

  if      (sort === 'price-asc')  list.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  else if (sort === 'rating')     list.sort((a, b) => b.rating - a.rating);

  renderProducts(list);
}

// =============================================
// CART
// =============================================
function openCart() {
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartPanel').classList.add('open');
  renderCart();
}

function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartPanel').classList.remove('open');
}

function renderCart() {
  const itemsEl  = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');

  if (!cart.length) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <h4>Your cart is empty</h4>
        <p>Add some products to get started!</p>
      </div>`;
    footerEl.style.display = 'none';
    return;
  }

  footerEl.style.display = 'block';
  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-cat">${item.category}${item.size ? ' · ' + item.size : ''}</div>
        <div class="cart-item-footer">
          <span class="cart-item-price">₹${(item.price * item.qty).toLocaleString()}</span>
          <div style="display:flex;align-items:center;gap:10px">
            <div class="qty-control">
              <div class="qty-btn" onclick="changeQty(${item.id},'${item.size}',-1)">−</div>
              <span class="qty-num">${item.qty}</span>
              <div class="qty-btn" onclick="changeQty(${item.id},'${item.size}',1)">+</div>
            </div>
            <button class="cart-remove" onclick="removeItem(${item.id},'${item.size}')">🗑</button>
          </div>
        </div>
      </div>
    </div>`).join('');

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('cartTotal').textContent = '₹' + total.toLocaleString();
}

function addToCart(id, size = '') {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const ex = cart.find(i => i.id === id && i.size === size);
  if (ex) ex.qty++;
  else cart.push({ ...p, qty: 1, size });
  updateCartBadge();
  renderCart();
  showToast('✅', 'Added to cart', p.name);
}

function quickAdd(id) {
  const p = products.find(x => x.id === id);
  addToCart(id, p.sizes[0]);
}

function changeQty(id, size, delta) {
  const ex = cart.find(i => i.id === id && i.size === size);
  if (!ex) return;
  ex.qty += delta;
  if (ex.qty <= 0) cart = cart.filter(i => !(i.id === id && i.size === size));
  updateCartBadge();
  renderCart();
}

function removeItem(id, size) {
  cart = cart.filter(i => !(i.id === id && i.size === size));
  updateCartBadge();
  renderCart();
}

function updateCartBadge() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cartBadge');
  badge.textContent     = total;
  badge.style.display   = total ? 'flex' : 'none';
}

function checkout() {
  showToast('🎉', 'Order placed!', 'Thank you for shopping with us!');
  cart = [];
  updateCartBadge();
  renderCart();
  closeCart();
}

// =============================================
// WISHLIST
// =============================================
function toggleWishlistItem(id, btn) {
  const p  = products.find(x => x.id === id);
  const ex = wishlist.findIndex(w => w.id === id);
  if (ex >= 0) {
    wishlist.splice(ex, 1);
    btn && btn.classList.remove('active');
    showToast('💔', 'Removed from wishlist', p.name);
  } else {
    wishlist.push(p);
    btn && btn.classList.add('active');
    showToast('❤️', 'Added to wishlist', p.name);
  }
  updateWishBadge();
}

function toggleWishlist() {
  showToast('🛍', 'Wishlist', wishlist.length ? wishlist.map(w => w.name).join(', ') : 'Empty');
}

function updateWishBadge() {
  const b = document.getElementById('wishlistBadge');
  b.textContent   = wishlist.length;
  b.style.display = wishlist.length ? 'flex' : 'none';
}

// =============================================
// PRODUCT MODAL
// =============================================
function openModal(id) {
  const p = products.find(x => x.id === id);
  currentProduct = p;
  activeSize     = p.sizes[0];

  const stars = '★'.repeat(Math.floor(p.rating)) + '☆'.repeat(5 - Math.floor(p.rating));

  document.getElementById('modalTitle').textContent   = p.name;
  document.getElementById('modalImg').innerHTML       = `<span style="font-size:100px">${p.emoji}</span>`;
  document.getElementById('modalCat').textContent     = p.category;
  document.getElementById('modalName').textContent    = p.name;
  document.getElementById('modalStars').textContent   = stars;
  document.getElementById('modalRating').textContent  = `${p.rating} · ${p.reviews.toLocaleString()} reviews`;
  document.getElementById('modalPrice').textContent   = '₹' + p.price.toLocaleString();
  document.getElementById('modalOld').textContent     = p.oldPrice ? '₹' + p.oldPrice.toLocaleString() : '';
  document.getElementById('modalDesc').textContent    = p.desc;

  document.getElementById('sizeGrid').innerHTML = p.sizes.map((s, i) =>
    `<button class="size-btn ${i === 0 ? 'active' : ''}" onclick="selectSize('${s}',this)">${s}</button>`
  ).join('');

  const inWish = wishlist.some(w => w.id === p.id);
  const wishBtn = document.getElementById('modalWishBtn');
  wishBtn.textContent = inWish ? '♥' : '♡';
  wishBtn.onclick = () => {
    toggleWishlistItem(p.id, null);
    wishBtn.textContent = wishlist.some(w => w.id === p.id) ? '♥' : '♡';
  };

  document.getElementById('modalAddBtn').onclick = () => {
    addToCart(p.id, activeSize);
    closeModal(null, true);
  };

  document.getElementById('modalOverlay').classList.add('open');
}

function selectSize(s, btn) {
  activeSize = s;
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function closeModal(e, force) {
  if (force || !e || e.target === document.getElementById('modalOverlay')) {
    document.getElementById('modalOverlay').classList.remove('open');
  }
}

// =============================================
// TOAST NOTIFICATIONS
// =============================================
function showToast(icon, title, sub = '') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <div>
      <div class="toast-title">${title}</div>
      ${sub ? `<div class="toast-sub">${sub.substring(0, 40)}</div>` : ''}
    </div>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity    = '0';
    toast.style.transform  = 'translateX(100px)';
    toast.style.transition = 'all 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// =============================================
// COUNTDOWN TIMER
// =============================================
function updateTimer() {
  const diff = Math.max(0, timerEnd - Date.now());
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById('t-hours').textContent = String(h).padStart(2, '0');
  document.getElementById('t-mins').textContent  = String(m).padStart(2, '0');
  document.getElementById('t-secs').textContent  = String(s).padStart(2, '0');
}
setInterval(updateTimer, 1000);
updateTimer();

// =============================================
// SCROLL EVENTS
// =============================================
window.addEventListener('scroll', () => {
  // Scroll-to-top button visibility
  document.getElementById('scrollTop')
    .classList.toggle('visible', window.scrollY > 400);

  // Navbar background opacity on scroll
  document.getElementById('navbar').style.background =
    window.scrollY > 50
      ? 'rgba(13,13,13,0.95)'
      : 'rgba(13,13,13,0.85)';
});

// =============================================
// NEWSLETTER
// =============================================
function subscribeNewsletter() {
  const val = document.getElementById('emailInput').value;
  if (!val || !val.includes('@')) {
    showToast('⚠️', 'Enter a valid email');
    return;
  }
  showToast('🎉', 'Subscribed!', 'Welcome to ShopWave deals!');
  document.getElementById('emailInput').value = '';
}

// =============================================
// INIT
// =============================================
renderProducts(products);
updateCartBadge();
updateWishBadge();
async function loadProducts() {

    const response = await fetch(
        "http://127.0.0.1:8000/products"
    );

    const products = await response.json();
    console.log(products);

    const container =
        document.getElementById("productsGrid");

    container.innerHTML = "";

    products.forEach(product => {

        container.innerHTML += `
            <div class="card">

                <div class="card-content">

                    <h3>${product.name}</h3>

                    <p class="price">
                        ₹${product.price}
                    </p>

                    <p>
                        ${product.category || "No Category"}
                    </p>

                    <button class="add-btn">
                        Add To Cart
                    </button>

                </div>

            </div>
        `;
    });
}

window.onload = loadProducts;
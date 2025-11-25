// main.js - cleaned & fixed (products, preview, cart, checkout modal + leaflet/google fallback)
// Logo path (uploaded asset)
const LOGO_PATH = "/mnt/data/Logo for Hydro Plantura - Aquascape Business.png";

// ---------------------------
// DATA PRODUK
// ---------------------------
const PRODUCTS = [
  { id:1, name:'Cryptocoryne wendtii', price:35000, tag:'Tanaman', img:'https://www.aquariumcoop.com/cdn/shop/files/cryptocoryne-wendtii-red-810055291144-31465817178181_1024x.jpg?v=1697613137', preview: true },
  { id:2, name:'Neon Tetra - Pack 10', price:45000, tag:'Ikan', img:'https://www.completekoi.com/cdn/shop/articles/Neon-Tetra_b2d4e48c-39b0-42c7-9480-2f594b1cee8d_780x.jpg?v=1754314656', preview: true },
  { id:3, name:'Driftwood Rustic 30cm', price:120000, tag:'Hardscape', img:'https://www.shutterstock.com/image-photo/dead-wood-roots-used-aquascape-600nw-2035962437.jpg', preview: true },
  { id:4, name:'SUNSUN XBL - 300', price:120000, tag:'Filter', img:'https://sc04.alicdn.com/kf/H1194b738259643ff825fd174d1091984Z.jpg' },
  { id:5, name:'Substrat Master Soil 3L', price:88000, tag:'Substrat', img:'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//catalog-image/98/MTA-142754129/master_soil_japan_master_soil_substrate_aquascape_3_liter_3l_full01_prtjqolw.jpg'},
  { id:6, name:'CO₂ Kit Basic + Regulator', price:220000, tag:'CO2', img:'https://aquaforestaquarium.com/cdn/shop/products/ArchaeaAccu-ProCO2systemkit_square2_sml_rev3_1024x1024.jpg?v=1676840634' },
  { id:7, name:'Manfish Zebra', price:15000, tag:'Ikan', img:'https://mollyjaya.id/wp-content/uploads/2025/10/gambar-ikan-manfish-zebra.webp' },
  { id:8, name:'White Cloud Minnow', price:10000, tag:'Ikan', img:'https://cdn.shopify.com/s/files/1/1167/8568/files/Picture10_ca530204-fcec-4ab0-9751-fbf68956a31e.jpg?v=1637179413' },
  { id:9, name:'Platy', price:10000, tag:'Ikan', img:'https://cdn.shopify.com/s/files/1/1167/8568/files/Picture6_9d0ecc50-2b87-4fa7-99e3-87d97b067e07.jpg?v=1637179558' },
  { id:10, name:'Guppy', price:20000, tag:'Ikan', img:'https://cdn.shopify.com/s/files/1/1167/8568/files/Picture4_0ebc4800-7fb6-4369-a7b8-4f81f99c04eb.jpg?v=1637183251' },
  { id:11, name:'Corydoras', price:15000, tag:'Ikan', img:'https://cdn.shopify.com/s/files/1/1167/8568/files/IMG_9959-Edit_1.jpg?v=1637183603' },
  { id:12, name:'Dwarf Gourami', price:10000, tag:'Ikan', img:'https://cdn.shopify.com/s/files/1/1167/8568/files/Picture1_744aa685-603e-4095-adb6-f19ff89d4b7b.jpg?v=1637183941' },
  { id:13, name:'Anubias Coffeefolia', price:15000, tag:'Tanaman', img:'https://bibitonline.com/wp-content/uploads/Anubias-Coffeefolia.jpg' },
  { id:14, name:'Cabomba Caroliniana', price:10000, tag:'Tanaman', img:'https://bibitonline.com/wp-content/uploads/Cabomba-Caroliniana.jpg' },
  { id:15, name:'Echinodorus Tenellus', price:5000, tag:'Tanaman', img:'https://bibitonline.com/wp-content/uploads/Echinodorus-Tenellus.jpg' },
  { id:16, name:'Hydrocotyle Leucocephala', price:5000, tag:'Tanaman', img:'https://bibitonline.com/wp-content/uploads/Hydrocotyle-Leucocephala.jpg' },
  { id:17, name:'Blepharostoma Trichophyllum', price:10000, tag:'Tanaman', img:'https://bibitonline.com/wp-content/uploads/Blepharostoma-Trichophyllum.jpg' },
  { id:18, name:'Egeria Densa', price:10000, tag:'Tanaman', img:'https://bibitonline.com/wp-content/uploads/Egeria-Densa.jpg' },
  { id:19, name:'Ceratophyllum Demersum', price:10000, tag:'Tanaman', img:'https://bibitonline.com/wp-content/uploads/Ceratophyllum-Demersum.jpg' },
  { id:20, name:'Seiryu Stone', price:20000, tag:'Hardscape', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF0LUCa8jgp16FgxHXaPOOQQ8u-EDLs5-3mw&s' },
  { id:21, name:'Lava Rock 1kg', price:50000, tag:'Hardscape', img:'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//111/MTA-36299784/no_brand_batu_lava_rock_1kg_aquascape_aquarium_lavarock_larva_rock_1_kg_kilo_full01_marwx1z2.jpg' },
];

// ---------------------------
// Helpers
// ---------------------------
function formatIDR(n){
  return new Intl.NumberFormat("id-ID", { style:"currency", currency:"IDR" }).format(n);
}
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]); });
}

// Ensure setCoords exists (used by map callbacks)
function setCoords(lat, lng){
  const latEl = document.getElementById('checkout-lat');
  const lngEl = document.getElementById('checkout-lng');
  if(latEl) latEl.value = (typeof lat === 'number')?lat.toFixed(6):lat;
  if(lngEl) lngEl.value = (typeof lng === 'number')?lng.toFixed(6):lng;
  const openLink = document.getElementById('open-in-google');
  if(openLink && lat!=null && lng!=null){
    openLink.href = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    openLink.style.display = 'inline-block';
  }
}

// ---------------------------
// RENDER (products + preview)
// ---------------------------
function renderProducts(filterCategory = 'all', search = ''){
  const grid = document.getElementById("products-grid");
  if(!grid) return;
  const q = (search || '').toLowerCase();
  const list = PRODUCTS.filter(p => {
    if(filterCategory !== 'all' && filterCategory !== '' && p.tag !== filterCategory) return false;
    if(q && !(p.name.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q))) return false;
    return true;
  });
  grid.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product';
    card.innerHTML = `
      <div class="thumb"><img src="${p.img}" alt="${escapeHtml(p.name)}"></div>
      <div style="font-weight:600">${escapeHtml(p.name)}</div>
      <div class="muted small">${escapeHtml(p.tag)}</div>
      <div class="p-meta">
        <div class="price">${formatIDR(p.price)}</div>
        <button class="add" onclick="addToCart(${p.id})">Tambah</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderProductsPreview(limit = 6){
  const previewGrid = document.getElementById('preview-grid');
  if(!previewGrid) return;
  let featured = PRODUCTS.filter(p => p.preview === true);
  if(!featured.length) featured = PRODUCTS.slice(0, limit);
  else featured = featured.slice(0, limit);
  previewGrid.innerHTML = '';
  featured.forEach(p => {
    const c = document.createElement('div');
    c.className = 'preview-card';
    c.innerHTML = `
      <div class="thumb"><img src="${p.img}" alt="${escapeHtml(p.name)}"></div>
      <div style="margin-top:8px;font-weight:600">${escapeHtml(p.name)}</div>
      <div class="muted small">${escapeHtml(p.tag)}</div>
      <div class="meta">
        <div class="price">${formatIDR(p.price)}</div>
        <button class="add" onclick="addToCart(${p.id})">Tambah</button>
      </div>
    `;
    previewGrid.appendChild(c);
  });
}

// ---------------------------
// CART (localStorage) + qty controls
// ---------------------------
let CART = JSON.parse(localStorage.getItem("hp_cart") || "[]");

function saveCart(){
  localStorage.setItem("hp_cart", JSON.stringify(CART));
  updateCartUI();
}

function addToCart(id){
  const prod = PRODUCTS.find(p => p.id === id);
  if(!prod) return;
  const existing = CART.find(i => i.id === id);
  if(existing) existing.qty++;
  else CART.push({ id:prod.id, name:prod.name, price:prod.price, img:prod.img, qty:1 });
  saveCart();
  openCart();
}

function decreaseQty(id){
  const idx = CART.findIndex(i => i.id === id);
  if(idx === -1) return;
  CART[idx].qty = CART[idx].qty - 1;
  if(CART[idx].qty <= 0) CART.splice(idx,1);
  saveCart();
}
function increaseQty(id){
  const item = CART.find(i => i.id === id);
  if(!item) return;
  item.qty++;
  saveCart();
}
function removeFromCart(id){
  CART = CART.filter(i => i.id !== id);
  saveCart();
}

function updateCartUI(){
  const list = document.getElementById("cart-items");
  const count = document.getElementById("cart-count");
  const subtotalEl = document.getElementById("cart-subtotal");
  if(!list) return;
  if(!CART.length){
    list.innerHTML = "<p class='muted small'>Keranjang kosong</p>";
    if(count) count.style.display = "none";
    if(subtotalEl) subtotalEl.textContent = formatIDR(0);
    return;
  }
  const totalQty = CART.reduce((a,b)=>a+b.qty,0);
  const subtotal = CART.reduce((a,b)=>a+(b.price*b.qty),0);
  if(count){ count.style.display="inline-block"; count.textContent = totalQty; }
  if(subtotalEl) subtotalEl.textContent = formatIDR(subtotal);

  list.innerHTML = CART.map(c => `
    <div class="cart-item" data-id="${c.id}">
      <img src="${c.img}" alt="${escapeHtml(c.name)}">
      <div style="flex:1">
        <div style="font-weight:600">${escapeHtml(c.name)}</div>
        <small class="muted">${formatIDR(c.price)} each</small>
        <div style="margin-top:8px;display:flex;gap:8px;align-items:center">
          <button onclick="decreaseQty(${c.id})" style="padding:6px 8px;border-radius:6px;border:1px solid #ddd;background:#fff;cursor:pointer">−</button>
          <div style="min-width:28px;text-align:center;font-weight:600">${c.qty}</div>
          <button onclick="increaseQty(${c.id})" style="padding:6px 8px;border-radius:6px;border:1px solid #ddd;background:#fff;cursor:pointer">+</button>
          <button onclick="removeFromCart(${c.id})" style="margin-left:8px;padding:6px 8px;border-radius:6px;border:1px solid #f3c2c2;background:#fff;color:#b33;cursor:pointer">Hapus</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ---------------------------
// Cart drawer open/close
// ---------------------------
function openCart(){
  const el = document.getElementById("cart-drawer");
  if(el) el.style.display = "block";
}
function closeCart(){ const el=document.getElementById("cart-drawer"); if(el) el.style.display="none"; }

// ---------------------------
// CHECKOUT modal + map + WA submit
// ---------------------------

let map, marker, autocompleteInstance;

// initCheckoutMap will try to use google if available, otherwise leaflet fallback
function initCheckoutMap(){
  const mapEl = document.getElementById("checkout-map");
  if(!mapEl) return;

  const defaultPos = { lat: -6.200000, lng: 106.816666 };

  // helper to set coords + open-in-google link
  function setCoordsAndLink(lat, lng){
    setCoords(lat, lng);
    const openLink = document.getElementById('open-in-google');
    if(openLink){
      const gUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      openLink.href = gUrl;
      openLink.style.display = 'inline-block';
    }
  }

  // If Google Maps available, init google map
  if(typeof google !== 'undefined' && google.maps){
    map = new google.maps.Map(mapEl, { center: defaultPos, zoom: 12, disableDefaultUI: true });
    marker = new google.maps.Marker({ position: defaultPos, map: map, draggable: true });

    marker.addListener('dragend', () => {
      const pos = marker.getPosition();
      setCoordsAndLink(pos.lat(), pos.lng());
    });

    map.addListener('click', (e) => {
      marker.setPosition(e.latLng);
      setCoordsAndLink(e.latLng.lat(), e.latLng.lng());
      map.panTo(e.latLng);
    });

    const input = document.getElementById('checkout-address');
    if(input && google.maps.places){
      autocompleteInstance = new google.maps.places.Autocomplete(input, { fields: ["formatted_address","geometry","name"] });
      autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();
        if(!place.geometry) return;
        const loc = place.geometry.location;
        marker.setPosition(loc);
        map.panTo(loc);
        setCoordsAndLink(loc.lat(), loc.lng());
      });
    }

    setCoordsAndLink(defaultPos.lat, defaultPos.lng);
    return;
  }

  // Leaflet fallback
  if(typeof L === 'undefined'){
    setCoordsAndLink(defaultPos.lat, defaultPos.lng);
    return;
  }

  // create leaflet map if not exists
  if(!map){
    const leafletMap = L.map(mapEl, { center:[defaultPos.lat, defaultPos.lng], zoom:12, attributionControl: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(leafletMap);

    const leafletMarker = L.marker([defaultPos.lat, defaultPos.lng], { draggable: true }).addTo(leafletMap);

    leafletMarker.on('dragend', function(e){
      const pos = e.target.getLatLng();
      setCoordsAndLink(pos.lat, pos.lng);
    });

    leafletMap.on('click', function(e){
      leafletMarker.setLatLng(e.latlng);
      setCoordsAndLink(e.latlng.lat, e.latlng.lng);
    });

    map = leafletMap;
    marker = leafletMarker;
    setCoordsAndLink(defaultPos.lat, defaultPos.lng);
  }
}

// geolocation button handler (use-browser-loc)
document.addEventListener('click', function(e){
  if(e.target && e.target.id === 'use-browser-loc'){
    if(!navigator.geolocation){
      alert('Geolocation tidak tersedia di browser Anda.');
      return;
    }
    navigator.geolocation.getCurrentPosition(function(position){
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      if(typeof google !== 'undefined' && map && google.maps && marker && marker.setPosition){
        const latlng = new google.maps.LatLng(lat, lng);
        marker.setPosition(latlng);
        map.panTo(latlng);
      } else if(typeof L !== 'undefined' && map && marker && marker.setLatLng){
        marker.setLatLng([lat, lng]);
        map.panTo([lat, lng]);
      }
      setCoords(lat, lng);
      const openLink = document.getElementById('open-in-google');
      if(openLink){
        openLink.href = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        openLink.style.display = 'inline-block';
      }
    }, function(err){
      alert('Gagal mendapatkan lokasi: ' + (err.message || err.code));
    }, { enableHighAccuracy: true, timeout: 10000 });
  }
});

// openCheckout shows modal, inits map (if needed) and invalidates size
function openCheckout(){
  if(!CART.length){
    alert("Keranjang kosong — tambahkan produk terlebih dahulu.");
    return;
  }
  const modal = document.getElementById("checkout-modal");
  if(!modal){
    alert("Checkout modal tidak ada pada halaman.");
    return;
  }

  modal.style.display = "flex";

  // init map once
  try { initCheckoutMap(); } catch(err){ console.warn('initCheckoutMap err', err); }

  // wait a bit then force redraw
  setTimeout(() => {
    if(typeof L !== 'undefined' && map && map.invalidateSize) {
      try {
        map.invalidateSize();
        map.eachLayer(layer => { if(layer && typeof layer.redraw === 'function') layer.redraw(); });
      } catch(e){ console.warn('leaflet resize/redraw error', e); }
    }
    if(typeof google !== 'undefined' && google.maps && map && google.maps.event) {
      try { google.maps.event.trigger(map, 'resize'); } catch(e){/*ignore*/ }
    }
  }, 300);
}

function closeCheckout(){
  const modal = document.getElementById("checkout-modal");
  if(modal) modal.style.display = "none";
}

// submitCheckout -> build WA message & open WA
function submitCheckout(e){
  e.preventDefault();
  const name = (document.getElementById('checkout-name') || {}).value || '';
  const email = (document.getElementById('checkout-email') || {}).value || '';
  const address = (document.getElementById('checkout-address') || {}).value || '';
  const lat = (document.getElementById('checkout-lat') || {}).value || '';
  const lng = (document.getElementById('checkout-lng') || {}).value || '';

  if(!name.trim() || !email.trim() || !address.trim()){
    alert("Mohon isi semua kolom wajib (Nama, Email, Alamat).");
    return;
  }
  if(!CART.length){
    alert("Keranjang kosong.");
    closeCheckout();
    return;
  }

  const itemsText = CART.map(i => `- ${i.name} x${i.qty} = ${formatIDR(i.price * i.qty)}`).join('\n');
  const subtotal = CART.reduce((a,b)=>a + (b.price*b.qty), 0);

  const message = [
    `*Order Baru — Hydro Plantura*`,
    ``,
    `*Nama:* ${name}`,
    `*Email:* ${email}`,
    `*Alamat:* ${address}`,
    `*Koordinat:* ${lat || '-'}, ${lng || '-'}`,
    ``,
    `*Items:*`,
    `${itemsText}`,
    ``,
    `*Subtotal:* ${formatIDR(subtotal)}`,
    ``,
    `Silakan konfirmasi ketersediaan & biaya kirim. Terima kasih!`
  ].join('\n');

  const encoded = encodeURIComponent(message);
  const waLink = `https://wa.me/6287780313222?text=${encoded}`;
  window.open(waLink, '_blank');

  closeCheckout();
}

// ---------------------------
// Utilities + init
// ---------------------------
function scrollToProducts(){ location.href = 'products.html'; }
function scrollToGuides(){ location.href = 'guides.html'; }

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderProductsPreview();
  updateCartUI();

  // bind cart buttons
  const openBtns = document.querySelectorAll('#open-cart, .cart-btn');
  openBtns.forEach(b => b.addEventListener('click', openCart));

  // Robust checkout button handling
  const cartFooter = document.querySelector('.cart-footer');
  if (cartFooter) {
    // find existing textual checkout buttons
    const allButtons = Array.from(cartFooter.querySelectorAll('button'));
    const existingCheckoutButtons = allButtons.filter(btn => btn.textContent && btn.textContent.trim().toLowerCase() === 'checkout');

    if (existingCheckoutButtons.length > 1) {
      let keep = cartFooter.querySelector('#cart-checkout-btn') || existingCheckoutButtons[0];
      existingCheckoutButtons.forEach(btn => { if (btn !== keep) btn.remove(); });
    }

    const hasBtnById = !!cartFooter.querySelector('#cart-checkout-btn');
    const hasBtnByText = existingCheckoutButtons.length > 0;

    if (!hasBtnById && !hasBtnByText) {
      const btn = document.createElement('button');
      btn.id = 'cart-checkout-btn';
      btn.className = 'btn-primary';
      btn.textContent = 'Checkout';
      btn.onclick = () => { closeCart(); openCheckout(); };
      cartFooter.appendChild(btn);
    } else if (!hasBtnById && hasBtnByText) {
      const existing = existingCheckoutButtons[0];
      existing.id = 'cart-checkout-btn';
      existing.classList.add('btn-primary');
      existing.onclick = () => { closeCart(); openCheckout(); };
    } else if (hasBtnById) {
      const btnById = cartFooter.querySelector('#cart-checkout-btn');
      btnById.onclick = () => { closeCart(); openCheckout(); };
    }
  }

  // set footer year
  const yr = document.getElementById('yr');
  if(yr) yr.textContent = new Date().getFullYear();
});

// Smooth page transitions - skip buttons and elements marked [data-no-transition]
(function(){
  const DURATION = 360;
  const root = document.getElementById('site-root');
  if(!root) return;

  root.classList.add('page-enter');
  requestAnimationFrame(() => root.classList.remove('page-enter'));

  document.addEventListener('click', function(e){
    // skip if clicked a button or element with data-no-transition
    if(e.target.closest('button') || e.target.closest('[data-no-transition]')) return;

    const a = e.target.closest('a');
    if(!a) return;
    const href = a.getAttribute('href');
    if(!href || href.startsWith('#')) return;
    if(a.target === '_blank') return;

    try {
      const url = new URL(href, location.href);
      if(url.origin !== location.origin) return;
    } catch(err){
      return;
    }

    const dest = (new URL(href, location.href)).pathname;
    if(dest === location.pathname) return;

    e.preventDefault();
    root.style.pointerEvents = 'none';
    root.classList.add('page-exit');

    setTimeout(()=> location.href = href, DURATION);
  });

  window.addEventListener('pageshow', (ev) => {
    if(ev.persisted){
      root.classList.remove('page-exit');
      root.classList.add('page-enter');
      requestAnimationFrame(()=> root.classList.remove('page-enter'));
    }
  });
})();

document.addEventListener("DOMContentLoaded", () => {

  const nav = document.querySelector(".main-nav");
  if (!nav) return;

  let toggle = document.getElementById("nav-toggle");
  if (!toggle) {
    toggle = document.createElement("button");
    toggle.id = "nav-toggle";
    toggle.className = "nav-inject-toggle";
    toggle.innerHTML = `<span class="bar"></span>`;
    document.body.appendChild(toggle);
  }

  function openNav() {
    nav.classList.add("open");
    document.body.classList.add("menu-open");
    document.body.style.overflow = "hidden";
  }

  function closeNav() {
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
    document.body.style.overflow = "";
  }

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    if (nav.classList.contains("open")) closeNav();
    else openNav();
  });

  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("open")) return;
    if (nav.contains(e.target) || toggle.contains(e.target)) return;
    closeNav();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  window.addEventListener("resize", () => {
    if (innerWidth > 900) closeNav();
  });

});
(function(){
  const nav=document.querySelector('.main-nav');
  const toggle=document.getElementById('nav-toggle')||document.querySelector('.nav-inject-toggle');
  if(!nav) return;
  nav.addEventListener('click', function(e){ e.stopPropagation(); });
  if(toggle) toggle.addEventListener('click', function(e){ e.stopPropagation(); });
})();



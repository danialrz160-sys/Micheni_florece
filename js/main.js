/* ==========================================
   MICHENÍ - LÓGICA PRINCIPAL
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    initClickFlowers();
    
    // Si estamos en la página de catálogo
    if (document.getElementById('products-grid')) {
        renderProducts(PRODUCTS_DATA);
        initSearch();
        initFilters();
    }

    // Si estamos en la página de producto individual
    if (document.getElementById('product-detail-container')) {
        loadProductDetail();
    }
});

const WPP_NUMBER = "573000000000"; // Reemplaza por tu número de WhatsApp real

/* 1. EFECTO DE FLORECITA AL HACER CLIC EN CUALQUIER PARTE */
function initClickFlowers() {
    const flowers = ['🌸', '🌷', '✨', '🎀', '🌺'];
    
    document.addEventListener('click', (e) => {
        // Evita interferir si se hace clic en botones de WhatsApp o enlaces
        const flower = document.createElement('span');
        flower.className = 'click-flower';
        flower.innerText = flowers[Math.floor(Math.random() * flowers.length)];
        
        flower.style.left = `${e.clientX}px`;
        flower.style.top = `${e.clientY}px`;
        
        document.body.appendChild(flower);
        
        setTimeout(() => {
            flower.remove();
        }, 1000);
    });
}

/* 2. RENDERIZAR PRODUCTOS EN EL CATÁLOGO */
function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = '';
    
    if (products.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--texto-suave); padding: 40px;">No encontramos productos con ese nombre 🌸</p>`;
        return;
    }

    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <a href="producto.html?id=${p.id}" style="text-decoration: none; color: inherit;">
                <img src="${p.image}" alt="${p.name}" class="product-img" onerror="this.src='https://via.placeholder.com/300x230/F7DCE3/4A3E3D?text=Foto+Michení'">
            </a>
            <div class="product-info">
                <span class="badge" style="font-size:0.75rem; align-self: flex-start;">${p.category.toUpperCase()}</span>
                <h3 style="font-size: 1.1rem; margin: 8px 0 5px;">${p.name}</h3>
                <p style="color: var(--texto-suave); font-size: 0.85rem; margin-bottom: 15px; flex-grow: 1;">${p.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                    <span style="font-weight: 700; color: var(--rosa-principal); font-size: 1.1rem;">${p.price}</span>
                    <a href="producto.html?id=${p.id}" class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.85rem;">
                        Ver detalle ✨
                    </a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

/* 3. FILTROS Y BÚSQUEDA */
function initSearch() {
    const input = document.getElementById('search-input');
    if (!input) return;
    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = PRODUCTS_DATA.filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
        renderProducts(filtered);
    });
}

function initFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.category;
            if (cat === 'todos') renderProducts(PRODUCTS_DATA);
            else renderProducts(PRODUCTS_DATA.filter(p => p.category === cat));
        });
    });
}

/* 4. CARGAR DETALLE DE PRODUCTO INDIVIDUAL */
function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')) || 1;
    const product = PRODUCTS_DATA.find(p => p.id === productId) || PRODUCTS_DATA[0];

    const container = document.getElementById('product-detail-container');
    if (!container) return;

    // Galería de imágenes (si el producto tiene array de imágenes o usa la principal repetida de ejemplo)
    const galleryImages = product.gallery || [product.image, product.image, product.image];

    container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 40px; align-items: start;">
            <!-- GALERÍA DE FOTOS -->
            <div>
                <img id="main-product-img" src="${product.image}" alt="${product.name}" style="width: 100%; height: 400px; object-fit: cover; border-radius: 25px; box-shadow: var(--sombra-suave);" onerror="this.src='https://via.placeholder.com/500x400/F7DCE3/4A3E3D?text=Foto+Producto'">
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    ${galleryImages.map((img, index) => `
                        <img src="${img}" class="thumb-img" onclick="changeMainImage('${img}')" style="width: 80px; height: 80px; object-fit: cover; border-radius: 12px; cursor: pointer; border: 2px solid var(--rosa-palo);" onerror="this.src='https://via.placeholder.com/80x80/F7DCE3/4A3E3D?text=Foto'">
                    `).join('')}
                </div>
            </div>

            <!-- INFORMACIÓN Y DETALLES -->
            <div>
                <span class="badge" style="background: var(--rosa-palo); color: var(--rosa-principal); padding: 6px 16px; border-radius: 20px; font-weight: 600;">${product.category.toUpperCase()}</span>
                <h1 style="font-family: 'Satisfy', cursive; font-size: 3rem; color: var(--texto-oscuro); margin: 10px 0;">${product.name}</h1>
                <p style="font-size: 1.8rem; font-weight: 700; color: var(--rosa-principal); margin-bottom: 20px;">${product.price}</p>
                <p style="color: var(--texto-suave); font-size: 1.05rem; line-height: 1.8; margin-bottom: 25px;">${product.description}</p>
                
                <div style="background: var(--blanco); padding: 20px; border-radius: 20px; border: 1px solid var(--rosa-palo); margin-bottom: 25px;">
                    <h4 style="margin-bottom: 10px; color: var(--texto-oscuro);">✨ Detalles artesanales:</h4>
                    <ul style="list-style: none; color: var(--texto-suave); font-size: 0.95rem; line-height: 1.8;">
                        <li>🌸 Creado 100% a mano con limpiapipas de alambre moldeable y felpa suave.</li>
                        <li>🎨 Colores duraderos que nunca pierden su tonalidad.</li>
                        <li>🎀 Incluye empaque de regalo listo para entregar.</li>
                    </ul>
                </div>

                <a href="https://wa.me/${WPP_NUMBER}?text=¡Hola%20Michení!%20Quiero%20hacer%20el%20pedido%20de:%20${encodeURIComponent(product.name)}" target="_blank" class="btn btn-primary" style="background: #25D366; font-size: 1.1rem; padding: 16px 32px; width: 100%; justify-content: center;">
                    Pedir por WhatsApp <i class="fa-brands fa-whatsapp"></i>
                </a>
            </div>
        </div>
    `;
}

function changeMainImage(src) {
    document.getElementById('main-product-img').src = src;
}
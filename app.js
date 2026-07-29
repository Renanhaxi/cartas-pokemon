/* ==========================================================================
   POKÉVAULT - JAVASCRIPT REFACTOR (BOOSTERS & PACOTES OFICIAIS)
   ========================================================================== */

// 1. BASE DE DADOS DE PACOTES, COMBOS E BOOSTER BOXES
const pokemonProducts = [
  {
    id: 1,
    name: "Booster Avulso - Escarlate e Violeta",
    type: "booster",
    rarity: "6 Cartas Lacradas",
    tagline: "Sinta a emoção de abrir e tirar uma Ultra Rara!",
    price: 14.90,
    image: "https://images.pokemontcg.io/sv1/pack_hires.png",
    fallbackImg: "https://images.pokemontcg.io/swsh35/74_hires.png"
  },
  {
    id: 2,
    name: "Combo Treinador (5x Boosters)",
    type: "combo",
    rarity: "30 Cartas no Total",
    tagline: "O melhor custo-benefício para começar sua coleção.",
    price: 69.90,
    image: "https://images.pokemontcg.io/swsh4/188_hires.png"
  },
  {
    id: 3,
    name: "Combo Mestre (10x Boosters + 1 Card Promo)",
    type: "combo",
    rarity: "60 Cartas + Brinde VIP",
    tagline: "Ideal para quem quer rasgar muitos pacotes e aumentar as chances!",
    price: 135.00,
    image: "https://images.pokemontcg.io/swsh7/218_hires.png"
  },
  {
    id: 4,
    name: "Booster Box Lacre de Fábrica (36 Boosters)",
    type: "box",
    rarity: "216 Cartas Lacradas",
    tagline: "Caixa oficial selada com garantia de Hit Raro garantido!",
    price: 489.00,
    image: "https://images.pokemontcg.io/pgo/79_hires.png"
  },
  {
    id: 5,
    name: "Kit Unboxing Comunidade (3x Boosters + Sleeve)",
    type: "combo",
    rarity: "Perfeito para Trocas",
    tagline: "Vem com Sleeves de proteção para guardar suas melhores cartas.",
    price: 49.90,
    image: "https://images.pokemontcg.io/swshp/SWSH103_hires.png"
  },
  {
    id: 6,
    name: "Booster Box Coleção Especial Destinos de Paldea",
    type: "box",
    rarity: "36 Boosters Shiny Rare",
    tagline: "Caixa selada com os Pokémons Brilhantes mais desejados.",
    price: 520.00,
    image: "https://images.pokemontcg.io/swsh7/215_hires.png"
  }
];

// Estado global do carrinho
let deckCart = [];

// 2. INICIALIZAÇÃO DA PÁGINA
document.addEventListener("DOMContentLoaded", () => {
  renderCatalog(pokemonProducts);
  initIntersectionObserver();
});

// 3. RENDERIZAÇÃO DO CATÁLOGO DE PRODUTOS
function renderCatalog(products) {
  const container = document.getElementById("cards-container");
  container.innerHTML = "";

  products.forEach(product => {
    const cardElement = document.createElement("div");
    cardElement.className = "poke-card-wrapper reveal";

    cardElement.innerHTML = `
      <div class="poke-card" data-tilt data-tilt-max="12" data-tilt-speed="400" data-tilt-glare data-tilt-max-glare="0.4">
        <div class="card-meta-top">
          <span class="card-rarity">${product.rarity}</span>
          <span class="card-hp">OFICIAL</span>
        </div>

        <div class="card-img-container">
          <img src="${product.image}" alt="${product.name}" class="card-img" loading="lazy" onerror="this.src='${product.fallbackImg}'">
          <div class="holo-foil"></div>
        </div>

        <h3 class="card-title">${product.name}</h3>
        <p class="card-attack-desc">${product.tagline}</p>

        <div class="card-footer">
          <div class="card-price-box">
            <span class="price-label">Preço Promocional</span>
            <span class="card-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
          </div>
          <button class="btn-add-deck" onclick="addToDeck(${product.id})">
            ➕ Adicionar
          </button>
        </div>
      </div>
    `;

    container.appendChild(cardElement);
  });

  // Re-inicializar Vanilla-Tilt
  if (window.VanillaTilt) {
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"));
  }
}

// 4. FILTRAGEM POR CATEGORIA
function filterCards(type) {
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");

  if (type === "all") {
    renderCatalog(pokemonProducts);
  } else {
    const filtered = pokemonProducts.filter(p => p.type === type);
    renderCatalog(filtered);
  }

  initIntersectionObserver();
}

// 5. INTERSECTION OBSERVER (SCROLL REVEAL PERFORMÁTICO)
function initIntersectionObserver() {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

// 6. GERENCIADOR DE CARRINHO / PEDIDOS
function addToDeck(productId) {
  const product = pokemonProducts.find(p => p.id === productId);
  if (!product) return;

  deckCart.push(product);
  updateCartUI();

  const badge = document.getElementById("cart-count");
  badge.style.transform = "scale(1.4)";
  setTimeout(() => badge.style.transform = "scale(1)", 200);
}

function updateCartUI() {
  const count = deckCart.length;
  const total = deckCart.reduce((sum, item) => sum + item.price, 0);

  document.getElementById("cart-count").innerText = count;
  document.getElementById("dock-count").innerText = count;
  document.getElementById("dock-total-price").innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;

  const dock = document.getElementById("cart-dock");
  if (count > 0) {
    dock.classList.add("active");
  } else {
    dock.classList.remove("active");
  }
}

// 7. CHECKOUT INTEGRADO VIA WHATSAPP
function sendWhatsAppOrder() {
  if (deckCart.length === 0) return;

  const phone = "5511999999999";
  let message = "🔥 *NOVO PEDIDO DE BOOSTERS POKÉVAULT* 🔥\n\n";
  message += "Olá! Gostaria de comprar os seguintes pacotes lacrados:\n\n";

  deckCart.forEach((item, idx) => {
    message += `${idx + 1}. *${item.name}* - R$ ${item.price.toFixed(2).replace('.', ',')}\n`;
  });

  const total = deckCart.reduce((sum, item) => sum + item.price, 0);
  message += `\n💰 *VALOR TOTAL:* R$ ${total.toFixed(2).replace('.', ',')}\n`;
  message += "📦 *Frete:* Gostaria de calcular o envio para o meu CEP!";

  const encodedUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(encodedUrl, "_blank");
}

// 8. FAQ ACCORDION TOGGLE
function toggleFaq(button) {
  const faqItem = button.parentElement;
  faqItem.classList.toggle("active");
}

function scrollToCatalog() {
  document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
}

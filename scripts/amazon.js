import { cart, addToCart, showCartNotification } from '../data/cart.js';
import { products } from '../data/products.js';

document.querySelector('.js-amazon-header').innerHTML = `
  <input class="search-bar js-search-input" type="text" placeholder="Search">
  <button class="search-button js-search-button">
    <img class="search-icon" src="images/icons/search-icon.png">
  </button>
`;

const searchInput = document.querySelector('.js-search-input');
const searchButton = document.querySelector('.js-search-button');
const productsGrid = document.querySelector('.js-products-grid');

function renderProducts(productList) {
  let productsHTML = '';

  productList.forEach((product) => {
    productsHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image" src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="${product.getStarsUrl()}">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          ${product.getPrice()}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector-${product.id}">
            ${Array.from({ length: 10 }, (_, i) =>
              `<option value="${i + 1}" ${i === 0 ? 'selected' : ''}>
                ${i + 1}
              </option>`
            ).join('')}
          </select>
        </div>

        <div class="product-spacer"></div>

        <div class="size-chart">
          ${product.extraInfoHTML()}
        </div>

        <div class="js-added-notification-${product.id} addedToCart">
          <img src="images/icons/checkmark.png">
          <span>Added to Cart</span>
        </div>

        <button class="addedToCartButton button-primary js-add-to-cart"
          data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  });

  productsGrid.innerHTML = productsHTML;

  attachAddToCartListeners();
}

function attachAddToCartListeners() {
  document.querySelectorAll('.js-add-to-cart').forEach(button => {
    button.addEventListener('click', () => {

      const productId = button.dataset.productId;

      const quantitySelector = document.querySelector(
        `.js-quantity-selector-${productId}`
      );

      const quantity = Number(quantitySelector.value);

      addToCart(productId, quantity);
      showCartNotification(productId);
      updateCartQuantity();
    });
  });
}

function updateCartQuantity() {
  let cartQuantity = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const cartElement = document.querySelector('.js-cart-quantity');
  if (cartElement) {
    cartElement.innerText = cartQuantity;
  }
}

function searchProducts() {
  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    renderProducts(products);
    return;
  }

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.keywords?.some(keyword =>
      keyword.toLowerCase().includes(query)
    )
  );

  renderProducts(filtered);
}

searchButton.addEventListener('click', searchProducts);

searchInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    searchProducts();
  }

  if (searchInput.value.trim() === '') {
    renderProducts(products);
  }
});

renderProducts(products);
updateCartQuantity();

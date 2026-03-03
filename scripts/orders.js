import { cart, addToCart } from '../data/cart.js';
import { orders } from '../data/orders.js';
import { getProduct } from '../data/products.js';

document.querySelector('.js-amazon-header').innerHTML = `
    <input class="search-bar js-order-search" type="text" placeholder="Search">

    <button class="search-button js-order-search-btn">
      <img class="search-icon" src="images/icons/search-icon.png">
    </button>
`;

const grid = document.querySelector('.js-orders-grid');

function renderOrders(list) {

  let html = '';

  list.forEach(order => {

    html += `
      <div class="order-container">

        <div class="order-header">

          <div>
            <div>Order Placed</div>
            <div>${order.date}</div>
          </div>

          <div>
            <div>Order Total</div>
            <div>${order.total}</div>
          </div>

          <div>
            <div>Order ID</div>
            <div>${order.id}</div>
          </div>

        </div>

        <div class="order-details-grid">

          ${order.items.map(item => {

            const product = getProduct(item.productId);

            if (!product) return '';

            return `
              <div class="product-image-container">
                <img src="${product.image}">
              </div>

              <div class="product-details">

                <div class="product-name">
                  ${product.name}
                </div>

                <div class="product-delivery-date">
                  Arriving on: ${item.deliveryDate}
                </div>

                <div class="product-quantity">
                  Quantity: ${item.quantity}
                </div>

                <button class="buy-again-button button-primary"
                  data-product-id="${product.id}">
                  <img class="buy-again-icon"
                    src="images/icons/buy-again.png">
                  <span class="buy-again-message">
                    Buy it again
                  </span>
                </button>

              </div>

              <div class="product-actions">
                <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
                  <button class="track-package-button button-secondary">
                    Track package
                  </button>
                </a>
              </div>
            `;
          }).join('')}

        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

const searchInput = document.querySelector('.js-order-search');
const searchBtn = document.querySelector('.js-order-search-btn');

function searchOrders() {

  if (!searchInput) return;

  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    renderOrders(orders);
    return;
  }

  const filtered = orders.filter(order => {

    if (order.id.toLowerCase().includes(query)) {
      return true;
    }

    return order.items.some(item => {

      const product = getProduct(item.productId);

      return product &&
        product.name.toLowerCase().includes(query);
    });

  });

  renderOrders(filtered);
}

searchBtn?.addEventListener('click', searchOrders);

searchInput?.addEventListener('keyup', e => {

  if (e.key === 'Enter') {
    searchOrders();
  }

  if (!searchInput.value.trim()) {
    renderOrders(orders);
  }

});

function updateCartCount() {

  document.querySelector('.js-cart-quantity').innerText =
    cart.reduce((s, i) => s + i.quantity, 0);
}

document.addEventListener('click', e => {

  const btn = e.target.closest('.buy-again-button');

  if (!btn) return;

  addToCart(btn.dataset.productId, 1);

  btn.innerText = "Added ✔";

  setTimeout(() => {
    btn.innerText = "Buy it again";
  }, 2000);

  updateCartCount();
});

renderOrders(orders);

updateCartCount();

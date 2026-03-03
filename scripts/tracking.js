import { orders } from '../data/orders.js';
import { getProduct } from '../data/products.js';
import { cart } from '../data/cart.js';

function updateCartCount() {
  document.querySelector('.js-cart-quantity').innerText =
    cart.reduce((s, i) => s + i.quantity, 0);
}

const urlParams = new URLSearchParams(window.location.search);

const orderId = urlParams.get('orderId');
const productId = urlParams.get('productId');

function renderTracking() {

  const container = document.querySelector('.js-tracking-container');

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    container.innerHTML = `<h2>Order not found</h2>`;
    return;
  }

  const productItem = order.items.find(
    item => item.productId === productId
  );

  if (!productItem) {
    container.innerHTML = `<h2>Product not found</h2>`;
    return;
  }

  const product = getProduct(productId);

  container.innerHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      Arriving on: ${productItem.deliveryDate}
    </div>

    <div class="product-info">
      ${product.name}
    </div>

    <div class="product-info">
      Quantity: ${productItem.quantity}
    </div>

    <div class="product-info current-status">
      Status: Preparing
    </div>

    <img class="product-image" src="${product.image}">

    <div class="progress-labels-container">
      <div class="progress-label current-status">Preparing</div>
      <div class="progress-label">Shipped</div>
      <div class="progress-label">Delivered</div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: 20%"></div>
    </div>
  `;
}

renderTracking();
updateCartCount();

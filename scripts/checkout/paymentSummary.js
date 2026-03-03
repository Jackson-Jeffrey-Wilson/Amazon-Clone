import { cart, updateCartCount } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/money.js';
import { orders, saveOrders } from '../../data/orders.js';

export function renderPaymentSummary() {

  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach(item => {

    const product = getProduct(item.productId);
    productPriceCents += product.priceCents * item.quantity;

    const deliveryOption = getDeliveryOption(item.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;

  });

  const totalBeforeTax = productPriceCents + shippingPriceCents;
  const tax = totalBeforeTax * 0.1;
  const total = totalBeforeTax + tax;

  let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const html = `
    <div class="payment-summary-title">Order Summary</div>

    <div class="payment-summary-row">
      <div>Items (${totalItems})</div>
      <div class="payment-summary-money">
        $${formatCurrency(productPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping & handling</div>
      <div class="payment-summary-money">
        $${formatCurrency(shippingPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax</div>
      <div class="payment-summary-money total-value">
        $${formatCurrency(totalBeforeTax)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%)</div>
      <div class="payment-summary-money">
        $${formatCurrency(tax)}
      </div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total</div>
      <div class="payment-summary-money">
        $${formatCurrency(total)}
      </div>
    </div>

    <button class="place-order-button button-primary js-place-order">
      Place your order
    </button>
  `;

  document.querySelector('.js-payment-summary').innerHTML = html;

  setTimeout(() => {
    document.querySelector('.js-place-order')
      ?.addEventListener('click', placeOrder);
  }, 0);

}

/* ===== Place Order Logic ===== */

function placeOrder() {

  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  const items = cart.map(item => {

    const product = getProduct(item.productId);
    const deliveryOption = getDeliveryOption(item.deliveryOptionId);

    return {
      productId: item.productId,
      quantity: item.quantity,
      deliveryDate: new Date(
        Date.now() + deliveryOption.deliveryDays * 86400000
      ).toDateString()
    };

  });

  const totalText = document.querySelector('.total-value').innerText;

  orders.push({
    id: crypto.randomUUID(),
    date: new Date().toDateString(),
    total: totalText,
    items
  });

  saveOrders();

  localStorage.removeItem('cart');

  updateCartCount();

  window.location.href = "orders.html";
}

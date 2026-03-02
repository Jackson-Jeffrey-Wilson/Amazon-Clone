import { renderOrderSummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
import { getTotalCartQuantity } from '../data/cart.js';

function renderCheckoutHeader() {
  document.querySelector('.js-checkout-header').innerHTML = `
    Checkout (<a class="return-to-home-link js-cart-quantity" href="amazon.html">
      ${getTotalCartQuantity()} items
    </a>)
  `;
}

renderOrderSummary();
renderPaymentSummary();
renderCheckoutHeader();
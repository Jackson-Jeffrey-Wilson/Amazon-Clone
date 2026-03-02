import { products } from '../data/products.js';

export let cart = JSON.parse(localStorage.getItem('cart')) || [];

export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, quantity) {
  let matchingItem = cart.find(item => item.productId === productId);

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
      deliveryOptionId: '1'
    });
  }

  saveToStorage();
}

export function removeFromCart(productId) {
  cart = cart.filter(item => item.productId !== productId);
  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  const item = cart.find(item => item.productId === productId);

  if (item) {
    item.deliveryOptionId = deliveryOptionId;
    saveToStorage();
  }
}

export function showCartNotification(productId) {

  const notification = document.querySelector(
    `.js-added-notification-${productId}`
  );

  if (!notification) return;

  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}

export function updateQuantity(productId, change) {
  const cartItem = cart.find(item => item.productId === productId);

  if (!cartItem) return;

  cartItem.quantity += change;

  if (cartItem.quantity <= 0) {
    removeFromCart(productId);
  }

  saveToStorage();
}

export function updateCartCount() {
  let totalQuantity = 0;

  cart.forEach((item) => {
    totalQuantity += item.quantity;
  });

  document.querySelector('.js-cart-quantity')
    .innerHTML = totalQuantity;
}

export function setQuantity(productId, newQuantity) {
  const cartItem = cart.find(item => item.productId === productId);

  if (!cartItem) return;

  if (newQuantity <= 0) {
    removeFromCart(productId);
  } else {
    cartItem.quantity = newQuantity;
  }

  saveToStorage();
}

export function getTotalCartQuantity() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}
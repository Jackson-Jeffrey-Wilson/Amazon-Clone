export let orders = JSON.parse(localStorage.getItem('orders')) || [];

export function saveOrders() {
  localStorage.setItem('orders', JSON.stringify(orders));
}
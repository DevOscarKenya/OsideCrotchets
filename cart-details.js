let cartItems = [
  { id: 1, name: "Summer Breeze Dress", price: 4500, quantity: 1 },
  { id: 2, name: "Boho Chic Top", price: 2800, quantity: 1 }
];

function updateCart() {
  const cartItemsContainer = document.getElementById('cartItems');
  cartItemsContainer.innerHTML = cartItems.map(item => `
      <div class="flex items-start gap-4 py-6">
          <h3 class="font-semibold">${item.name}</h3>
          <p class="text-primary">KSH ${item.price}</p>
          <div class="flex items-center gap-4 mt-2">
              <button onclick="updateQuantity(${item.id}, -1)">-</button>
              <span>${item.quantity}</span>
              <button onclick="updateQuantity(${item.id}, 1)">+</button>
          </div>
      </div>
  `).join('');
  updateTotals();
}

function updateTotals() {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  document.getElementById('subtotal').textContent = `KSH ${subtotal}`;
}

function updateQuantity(id, change) {
  const item = cartItems.find(item => item.id === id);
  if (item) {
      item.quantity = Math.max(1, item.quantity + change);
      updateCart();
  }
}

function checkout() {
  alert("Proceeding to checkout...");
}

updateCart();
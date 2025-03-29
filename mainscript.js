// ====== PRODUCT DATA MANAGEMENT ======
// Initialize productData from localStorage or use default
// Default products (will be overridden by localStorage if available)
let productData = JSON.parse(localStorage.getItem('products')) || {
  'Summer Breeze Dress': {
      price: 'KSH 4,500',
      description: 'A beautiful handcrafted crochet dress perfect for summer days...',
      features: ['100% cotton', 'Lightweight', 'Adjustable straps'],
      image: 'https://preview.redd.it/summer-dress-v0-d3qu6h9o24ad1.jpg'
  },
  'Boho Chic Top': {
      price: 'KSH 2,800',
      description: 'A versatile crochet top for layering or wearing solo...',
      features: ['Acrylic blend', 'Bohemian pattern', 'Machine washable'],
      image: 'https://by-katerina.com/wp-content/uploads/2018/05/20180511_135758-600x487.jpg'
  },
  'Cozy Winter Sweater': {
      price: 'KSH 3,200',
      description: 'Warm and stylish sweater for chilly days...',
      features: ['Wool blend', 'Oversized fit', 'Hand-wash only'],
      image: 'https://i.ibb.co/0jQH8Pb/sweater.jpg'
  },
  'Sunflower Hat': {
      price: 'KSH 1,800',
      description: 'Chic sunflower-patterned hat for sun protection...',
      features: ['Cotton yarn', 'Adjustable chin strap', 'One size fits all'],
      image: 'https://i.ibb.co/7Y3d2L0/hat.jpg'
  },
  'Autumn Scarf': {
      price: 'KSH 1,500',
      description: 'Long, warm scarf with autumn leaf patterns...',
      features: ['Wool blend', 'Reversible design', 'Hand-wash only'],
      image: './assets/scarf.jpg'
  },
  'Elegant Handbag': {
      price: 'KSH 3,500',
      description: 'Sturdy crochet handbag with leather straps...',
      features: ['Reinforced base', 'Inner lining', 'Zipper closure'],
      image: 'https://i.ibb.co/4W2yXzJ/handbag.jpg'
  }
};

// handle the filter of our collection section
function filterProducts(category) {
const productGrid = document.querySelector('.product-grid');
productGrid.innerHTML = '';

Object.entries(productData).forEach(([name, product]) => {
    // Show all products if "All" is selected, or filter by category
    if (category === 'all' || product.category === category) {
        const productCard = document.createElement('div');
        productCard.className = 'bg-white rounded-lg shadow-md overflow-hidden relative cursor-pointer';
        productCard.innerHTML = `
            <button onclick="deleteProduct(this)" class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 transition-opacity duration-300 hover:bg-red-600 designer-only">
                <i class="ri-delete-bin-line"></i>
            </button>
            <img src="${product.image}" alt="${name}" class="w-full h-80 object-cover" onerror="this.src='https://placehold.co/300'">
            <div class="p-4">
                <h3 class="text-lg font-semibold">${name}</h3>
                <p class="text-gray-600 mb-4">${product.price}</p>
                <button class="w-full bg-primary text-white py-2 !rounded-button hover:bg-opacity-90" onclick="addToCart(event, this)">
                    Add to Cart
                </button>
            </div>
        `;
        productCard.onclick = () => showProductDetails(productCard);
        productGrid.appendChild(productCard);
    }
});
}


// ====== SAVE PRODUCTS TO LOCALSTORAGE ======
function saveProductsToStorage() {
localStorage.setItem('products', JSON.stringify(productData));
}

// ====== FILE UPLOAD HANDLING ======
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadContent = document.getElementById('uploadContent');
const previewContainer = document.getElementById('previewContainer');
const imagePreview = document.getElementById('imagePreview');
const removeImage = document.getElementById('removeImage');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const errorMessage = document.getElementById('errorMessage');

const showError = (message) => {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
  setTimeout(() => {
      errorMessage.classList.add('hidden');
  }, 3000);
};

const handleFile = (file) => {
  if (!file.type.startsWith('image/')) {
      showError('Please upload an image file');
      return;
  }
  if (file.size > 5 * 1024 * 1024) {
      showError('File size must be less than 5MB');
      return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
      imagePreview.src = e.target.result;
      uploadContent.classList.add('hidden');
      previewContainer.classList.remove('hidden');
      simulateUpload();
  };
  reader.readAsDataURL(file);
};

const simulateUpload = () => {
  progressContainer.classList.remove('hidden');
  let progress = 0;
  const interval = setInterval(() => {
      progress += 5;
      progressBar.style.width = `${progress}%`;
      progressText.textContent = `${progress}%`;
      if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
              progressContainer.classList.add('hidden');
          }, 500);
      }
  }, 100);
};

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('border-primary');
});

dropZone.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dropZone.classList.remove('border-primary');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('border-primary');
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) handleFile(file);
});

removeImage.addEventListener('click', () => {
  fileInput.value = '';
  previewContainer.classList.add('hidden');
  uploadContent.classList.remove('hidden');
  progressContainer.classList.add('hidden');
  progressBar.style.width = '0%';
  progressText.textContent = '0%';
});

dropZone.addEventListener('click', () => {
  if (!previewContainer.classList.contains('hidden')) return;
  fileInput.click();
});

// ====== CART FUNCTIONALITY ======
let cartItems = [];

function addToCart(event, button) {
  event.stopPropagation();
  const productCard = button.closest('.bg-white');
  const productName = productCard.querySelector('h3').textContent;
  const productPrice = productCard.querySelector('.text-gray-600').textContent;
  const productImage = productCard.querySelector('img').src;
  const priceValue = parseInt(productPrice.replace('KSH ', '').replace(',', ''));
  const existingItem = cartItems.find(item => item.name === productName);
  
  if (existingItem) {
      existingItem.quantity += 1;
  } else {
      cartItems.push({
          name: productName,
          price: priceValue,
          image: productImage,
          quantity: 1
      });
  }
  
  updateCartUI();
  const notification = document.getElementById('cartNotification');
  const notificationImage = document.getElementById('notificationImage');
  const notificationName = document.getElementById('notificationName');
  const notificationPrice = document.getElementById('notificationPrice');
  notificationImage.src = productImage;
  notificationName.textContent = productName;
  notificationPrice.textContent = productPrice;
  notification.classList.remove('hidden');
  button.innerHTML = 'Added ✓';
  button.classList.remove('bg-primary');
  button.classList.add('bg-green-500');
  setTimeout(() => {
      notification.classList.add('hidden');
      button.innerHTML = 'Add to Cart';
      button.classList.add('bg-primary');
      button.classList.remove('bg-green-500');
  }, 3000);
}

function updateCartUI() {
  const cartCounter = document.getElementById('cartCounter');
  const cartItemsElement = document.getElementById('cartItems');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  cartCounter.textContent = totalQuantity;
  cartItemsElement.innerHTML = cartItems.map(item => `
      <div class="flex items-center gap-4 py-2">
          <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
          <div class="flex-1">
              <p class="font-semibold">${item.name}</p>
              <p class="text-primary">KSH ${item.price.toLocaleString()}</p>
              <div class="flex items-center mt-1">
                  <button onclick="updateQuantity('${item.name}', -1)" class="text-gray-500 hover:text-primary">
                      <i class="ri-subtract-line"></i>
                  </button>
                  <span class="mx-2">${item.quantity}</span>
                  <button onclick="updateQuantity('${item.name}', 1)" class="text-gray-500 hover:text-primary">
                      <i class="ri-add-line"></i>
                  </button>
              </div>
          </div>
          <button onclick="removeItem('${item.name}')" class="text-gray-400 hover:text-red-500">
              <i class="ri-close-line"></i>
          </button>
      </div>
  `).join('');
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartSubtotal.textContent = `KSH ${subtotal.toLocaleString()}`;
}

function toggleCart() {
  const cartDropdown = document.getElementById('cartDropdown');
  cartDropdown.classList.toggle('hidden');
}

function updateQuantity(productName, change) {
  const item = cartItems.find(item => item.name === productName);
  if (item) {
      item.quantity = Math.max(0, item.quantity + change);
      if (item.quantity === 0) {
          cartItems = cartItems.filter(item => item.name !== productName);
      }
      updateCartUI();
  }
}

function removeItem(productName) {
  cartItems = cartItems.filter(item => item.name !== productName);
  updateCartUI();
}

function viewCart() {
  console.log('View cart clicked');
}

function checkout() {
  console.log('Checkout clicked');
}

document.addEventListener('click', (event) => {
  const cartDropdown = document.getElementById('cartDropdown');
  const cartButton = event.target.closest('button');
  if (!cartDropdown.contains(event.target) && !cartButton) {
      cartDropdown.classList.add('hidden');
  }
});

// ====== PRODUCT MANAGEMENT ======
function generateProductCards() {
const productGrid = document.querySelector('.product-grid');
productGrid.innerHTML = '';

Object.entries(productData).forEach(([name, product]) => {
    const productCard = document.createElement('div');
    productCard.className = 'bg-white rounded-lg shadow-md overflow-hidden relative cursor-pointer';
    productCard.innerHTML = `
        ${isLoggedIn ? `
        <button onclick="event.stopPropagation(); deleteProduct(this)" 
                class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600">
            <i class="ri-delete-bin-line"></i>
        </button>
        ` : ''}
        <img src="${product.image}" alt="${name}" class="w-full h-80 object-cover">
        <div class="p-4">
            <h3 class="text-lg font-semibold">${name}</h3>
            <p class="text-gray-600 mb-4">${product.price}</p>
            <button class="w-full bg-primary text-white py-2 !rounded-button hover:bg-opacity-90" 
                    onclick="event.stopPropagation(); addToCart(event, this)">
                Add to Cart
            </button>
        </div>
    `;
    productCard.onclick = () => showProductDetails(productCard);
    productGrid.appendChild(productCard);
});
}

function showProductDetails(element) {
  const productName = element.querySelector('h3').textContent;
  const product = productData[productName];
  const mainImage = document.getElementById('modalProductImage');
  mainImage.src = product.image;
  document.getElementById('modalProductName').textContent = productName;
  document.getElementById('modalProductPrice').textContent = product.price;
  document.getElementById('modalProductDescription').textContent = product.description;
  const featuresList = document.getElementById('modalProductFeatures');
  featuresList.innerHTML = '';
  product.features.forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature;
      featuresList.appendChild(li);
  });
  const thumbnails = document.querySelectorAll('#productDetailsModal .grid img');
  thumbnails.forEach((thumb, index) => {
      thumb.src = product.image;
      if(index === 0) {
          thumb.classList.add('border-2', 'border-primary');
      } else {
          thumb.classList.remove('border-2', 'border-primary');
      }
  });
  document.getElementById('productDetailsModal').classList.add('active');
}

function updateMainImage(src) {
  const mainImage = document.getElementById('modalProductImage');
  const thumbnails = document.querySelectorAll('#productDetailsModal .grid img');
  mainImage.src = src;
  thumbnails.forEach(thumb => {
      if(thumb.src === src) {
          thumb.classList.add('border-2', 'border-primary');
      } else {
          thumb.classList.remove('border-2', 'border-primary');
      }
  });
}

function closeProductDetails() {
  document.getElementById('productDetailsModal').classList.remove('active');
}

function updateQuantity(change) {
  const quantityInput = document.getElementById('quantity');
  let quantity = parseInt(quantityInput.value) + change;
  quantity = Math.max(1, quantity);
  quantityInput.value = quantity;
}

// ====== PRODUCT UPLOAD ======
const uploadForm = document.getElementById('uploadForm');
const successModal = document.getElementById('successModal');
uploadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (!uploadForm.checkValidity()) {
      uploadForm.reportValidity();
      return;
  }

  const productName = e.target.querySelector('input[type="text"]').value;
  const price = e.target.querySelector('input[type="number"]').value;
  const category = e.target.querySelector('select').value;
  const image = document.getElementById('imagePreview').src;

  // Add to productData and save to storage
  productData[productName] = {
      price: `KSH ${price}`,
      category: category,
      image: image,
      description: '',
      features: []
  };
  
  saveProductsToStorage();

  // Refresh the product grid
  generateProductCards();

  // Show success and reset form
  successModal.classList.add('active');
  setTimeout(() => {
      successModal.classList.remove('active');
      uploadForm.reset();
      document.getElementById('previewContainer').classList.add('hidden');
      document.getElementById('uploadContent').classList.remove('hidden');
      document.getElementById('progressContainer').classList.add('hidden');
      document.getElementById('progressBar').style.width = '0%';
      document.getElementById('progressText').textContent = '0%';
  }, 2000);
});

// ====== AUTHENTICATION ======
const uploadBtn = document.getElementById('uploadBtn');
const loginModal = document.getElementById('loginModal');
const uploadModal = document.getElementById('uploadModal');
const loginForm = document.getElementById('loginForm');
let isLoggedIn = false;
const DESIGNER_CREDENTIALS = {
  username: 'shaldrine',
  password: '@osidecrotchets'
};

uploadBtn.addEventListener('click', () => {
  if (isLoggedIn) {
      uploadModal.classList.add('active');
  } else {
      loginModal.classList.add('active');
  }
});

// ====== Updated Login Handler ======
loginForm.addEventListener('submit', (e) => {
e.preventDefault();
const username = document.getElementById('username').value;
const password = document.getElementById('password').value;
const loginError = document.getElementById('loginError');

if (username === DESIGNER_CREDENTIALS.username && password === DESIGNER_CREDENTIALS.password) {
    isLoggedIn = true;
    document.body.classList.add('is-designer'); // ← New line added
    loginModal.classList.remove('active');
    uploadModal.classList.add('active');
    loginError.classList.add('hidden');
    loginForm.reset();
    generateProductCards(); // Refresh to show delete buttons
} else {
    loginError.textContent = 'Invalid username or password';
    loginError.classList.remove('hidden');
}
});

function closeLoginModal() {
  loginModal.classList.remove('active');
  loginForm.reset();
  document.getElementById('loginError').classList.add('hidden');
}

function closeUploadModal() {
  uploadModal.classList.remove('active');
}

// ====== PRODUCT DELETION ======
function deleteProduct(button) {
if (!isLoggedIn) {
    loginModal.classList.add('active');
    return;
}

const productCard = button.closest('.bg-white');
const productName = productCard.querySelector('h3').textContent;

// Create confirmation modal
const confirmDelete = document.createElement('div');
confirmDelete.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
confirmDelete.innerHTML = `
    <div class="bg-white p-6 rounded-lg max-w-sm mx-4">
        <h3 class="text-xl font-semibold mb-4">Confirm Delete</h3>
        <p class="text-gray-600 mb-6">Delete "${productName}" permanently?</p>
        <div class="flex justify-end space-x-4">
            <button onclick="this.closest('.fixed').remove()" 
                    class="px-4 py-2 text-gray-600 hover:text-gray-800">
                Cancel
            </button>
            <button onclick="confirmDeleteProduct('${productName}')" 
                    class="px-4 py-2 bg-red-500 text-white rounded-button hover:bg-red-600">
                Delete
            </button>
        </div>
    </div>
`;

document.body.appendChild(confirmDelete);
}

function confirmDeleteProduct(productName) {
delete productData[productName];
saveProductsToStorage();
generateProductCards();
document.querySelector('.fixed').remove();
}
// ====== TESTIMONIALS ======
// Initialize testimonials from localStorage or empty array
let testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];

const commentForm = document.getElementById('commentForm');
const stars = document.querySelectorAll('.rating-star');

// Function to save testimonials to localStorage
function saveTestimonialsToStorage() {
    localStorage.setItem('testimonials', JSON.stringify(testimonials));
}

// Function to render all testimonials
function renderTestimonials() {
    const testimonialSlider = document.querySelector('.testimonial-slider');
    testimonialSlider.innerHTML = '';
    
    testimonials.forEach((testimonial, index) => {
        const newTestimonial = document.createElement('div');
        newTestimonial.className = 'testimonial-slide min-w-[300px] md:min-w-[400px] bg-white p-6 rounded-lg shadow-md mx-4 relative';
        
        // Add delete button only if designer is logged in
        const deleteButton = isLoggedIn ? `
            <button onclick="deleteTestimonial(${index})" 
                    class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                <i class="ri-delete-bin-line text-sm"></i>
            </button>
        ` : '';
        
        newTestimonial.innerHTML = `
            ${deleteButton}
            <div class="flex items-center mb-4">
                <img src="${testimonial.photoUrl}" alt="${testimonial.name}" class="w-12 h-12 rounded-full object-cover">
                <div class="ml-4">
                    <h4 class="font-semibold">${testimonial.name}</h4>
                    <div class="flex text-yellow-400">
                        ${Array(testimonial.rating).fill('<i class="ri-star-fill"></i>').join('')}
                    </div>
                </div>
            </div>
            <p class="text-gray-600">"${testimonial.text}"</p>
        `;
        testimonialSlider.appendChild(newTestimonial);
    });
}

// Function to delete a testimonial
function deleteTestimonial(index) {
    if (!isLoggedIn) {
        loginModal.classList.add('active');
        return;
    }
    
    // Create confirmation modal
    const confirmDelete = document.createElement('div');
    confirmDelete.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
    confirmDelete.innerHTML = `
        <div class="bg-white p-6 rounded-lg max-w-sm mx-4">
            <h3 class="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p class="text-gray-600 mb-6">Delete testimonial from ${testimonials[index].name}?</p>
            <div class="flex justify-end space-x-4">
                <button onclick="this.closest('.fixed').remove()" 
                        class="px-4 py-2 text-gray-600 hover:text-gray-800">
                    Cancel
                </button>
                <button onclick="confirmTestimonialDelete(${index})" 
                        class="px-4 py-2 bg-red-500 text-white rounded-button hover:bg-red-600">
                    Delete
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmDelete);
}

// Function to confirm testimonial deletion
function confirmTestimonialDelete(index) {
    testimonials.splice(index, 1);
    saveTestimonialsToStorage();
    renderTestimonials();
    document.querySelector('.fixed').remove();
}

stars.forEach((star, index) => {
    star.addEventListener('click', () => {
        stars.forEach((s, i) => {
            const starIcon = s.querySelector('i');
            if (i <= index) {
                starIcon.classList.remove('ri-star-line');
                starIcon.classList.add('ri-star-fill');
                s.classList.add('text-yellow-400');
            } else {
                starIcon.classList.add('ri-star-line');
                starIcon.classList.remove('ri-star-fill');
                s.classList.remove('text-yellow-400');
            }
        });
    });
});

document.getElementById('testimonialForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = e.target.querySelector('input[type="text"]').value;
    const testimonialText = e.target.querySelector('textarea').value;
    const rating = document.querySelectorAll('.rating-star.text-yellow-400').length;
    const photoInput = e.target.querySelector('input[type="file"]');
    
    if (!name || !testimonialText || rating === 0) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4';
        errorMessage.textContent = 'Please fill in all required fields and provide a rating';
        e.target.insertBefore(errorMessage, e.target.firstChild);
        setTimeout(() => errorMessage.remove(), 3000);
        return;
    }
    
    let photoUrl = 'https://readdy.ai/api/search-image?query=professional headshot portrait of person smiling&width=100&height=100&flag=234c11d18d787c342147a32935078c87&seq=' + Math.random() + '&orientation=squarish';
    
    if (photoInput.files && photoInput.files[0]) {
        photoUrl = URL.createObjectURL(photoInput.files[0]);
    }
    
    // Create testimonial object
    const newTestimonial = {
        name: name,
        text: testimonialText,
        rating: rating,
        photoUrl: photoUrl,
        date: new Date().toISOString()
    };
    
    // Add to testimonials array and save to storage
    testimonials.unshift(newTestimonial);
    saveTestimonialsToStorage();
    
    // Render all testimonials (including the new one)
    renderTestimonials();
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4';
    successMessage.textContent = 'Thank you for your testimonial!';
    e.target.insertBefore(successMessage, e.target.firstChild);
    
    // Reset form
    e.target.reset();
    stars.forEach(star => {
        const starIcon = star.querySelector('i');
        starIcon.classList.add('ri-star-line');
        starIcon.classList.remove('ri-star-fill');
        star.classList.remove('text-yellow-400');
    });
    
    // Remove success message after delay
    setTimeout(() => successMessage.remove(), 3000);
});

// ====== INITIALIZATION ======
document.addEventListener('DOMContentLoaded', function() {
    // Ensure we're using the latest from localStorage
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        try {
            productData = JSON.parse(storedProducts);
        } catch (e) {
            console.error("Error parsing stored products, using defaults", e);
        }
    }
    
    // Load testimonials from localStorage
    const storedTestimonials = localStorage.getItem('testimonials');
    if (storedTestimonials) {
        try {
            testimonials = JSON.parse(storedTestimonials);
        } catch (e) {
            console.error("Error parsing stored testimonials, using empty array", e);
            testimonials = [];
        }
    }
    
    generateProductCards();
    renderTestimonials(); // Render testimonials on page load
});
// Initialize current year
document.querySelector('.current-year').textContent = new Date().getFullYear();

// Notification system
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">×</button>
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Load books with admin controls
function loadBooks() {
  // Load books from localStorage and static data
  const staticBooks = window.books || [];
  const userBooks = JSON.parse(localStorage.getItem('libraryBooks')) || [];
  const allBooks = [...userBooks, ...staticBooks];
  
  // Create "New Arrivals" carousel with admin controls
  addCarousel("New Arrivals", "Recently added books", allBooks.slice(0, 10), true);
  
  // Check for success message
  const urlParams = new URLSearchParams(window.location.search);
  if(urlParams.has('added')) {
    showNotification('Book added successfully!', 'success');
  }
}

// Modified addCarousel function with admin controls
function addCarousel(title, subtitle, books, isAdmin = false) {
  const container = document.getElementById("book-carousels-container");
  
  const itemsHTML = books.map(book => `
    <div class="carousel-item">
      <div class="static-card">
        <a href="bookPage.html?id=${book.id}" class="card-link">
          <div class="book-cover-container">
            <img src="${book.cover}" alt="${book.title}">
            ${book.badge ? `<span class="book-badge badge-${book.badge}">${formatBadgeText(book.badge)}</span>` : ''}
          </div>
        </a>
      </div>
      <a href="Author page.html?name=${encodeURIComponent(book.author)}" class="book-info">${book.author}</a>
    </div>
  `).join('');

  const adminControls = isAdmin ? `
    <div class="admin-controls">
      <button onclick="location.href='book-page-admin.html?target=new-arrivals'">
        <i class="fas fa-plus"></i> Add Book
      </button>
    </div>
  ` : '';

  const carouselHTML = `
    <div class="section-wrapper">
      <div class="section-header">
        <h2><i class="fas fa-star"></i> ${title}</h2>
        <p class="section-subtitle">${subtitle}</p>
      </div>
      <div class="book-carousel">
        <button class="carousel-nav prev"><i class="fas fa-chevron-left"></i></button>
        <div class="carousel-track">${itemsHTML}</div>
        <button class="carousel-nav next"><i class="fas fa-chevron-right"></i></button>
      </div>
      ${adminControls}
    </div>
  `;

  container.insertAdjacentHTML('beforeend', carouselHTML);
  initializeCarousels();
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function() {
  loadBooks();
  // Any other admin-specific initialization
});
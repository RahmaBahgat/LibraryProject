// Load books from data.js + localStorage
function loadBooks() {
    // 1. Static books from data.js
    const staticBooks = window.books || [];
    
    // 2. User-added books from localStorage
    const userBooks = JSON.parse(localStorage.getItem('libraryBooks')) || [];
    
    // 3. Combine them (newest first)
    const allBooks = [...userBooks, ...staticBooks];
    
    // 4. Display in carousel
    addCarousel("Just Added", "Fresh picks for your reading list", allBooks.slice(0, 10)); // Show 10 newest
  }
  
  // Helper: Add a new carousel to the page
  function addCarousel(title, subtitle, books) {
    const container = document.getElementById("book-carousels-container");
    
    const itemsHTML = books.map(book => `
      <div class="carousel-item">
        <div class="static-card">
          <a href="bookPage.html?id=${book.id}" class="card-link">
            <div class="book-cover-container">
              <img src="${book.cover}" alt="${book.title}">
              ${book.badge ? <span class="book-badge badge-${book.badge}">${formatBadgeText(book.badge)}</span> : ''}
            </div>
          </a>
        </div>
        <a href="Author page.html?name=${encodeURIComponent(book.author)}" class="book-info">${book.author}</a>
      </div>
    `).join('');
  
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
      </div>
    `;
  
    container.insertAdjacentHTML('afterbegin', carouselHTML);
    initializeCarousels(); // Reuse your existing carousel logic
  }
  
  // Reuse your existing badge formatter
  function formatBadgeText(badgeType) {
    const badgeTexts = {
      'bestselling': 'Bestseller',
      'new-release': 'New',
      'trending': 'Trending'
    };
    return badgeTexts[badgeType] || badgeType;
  }
  
  // Initialize when page loads
  document.addEventListener("DOMContentLoaded", loadBooks);

// DOM Elements
const booksContainer = document.getElementById("booksContainer");
const reviewFormTemplate = document.getElementById("reviewFormTemplate");
const modal = document.getElementById("bookModal");
const modalBody = modal.querySelector(".modal-body");

// Modal Functions
function showBookDetails(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (!book) return;

  modalBody.innerHTML = `
        <div class="modal-book-cover">
            <img src="${book.cover}" alt="${book.title}">
        </div>
        <div class="modal-book-info">
            <h2 class="book-title">${book.title}</h2>
            <p class="book-author">${book.author}</p>
            <div class="book-rating">
                ${createStarRating(book.rating).outerHTML}
                <span>(${book.rating})</span>
            </div>
            <p class="book-description">${book.description}</p>
            
            <div class="reviews-section">
                <h3 class="section-title">Reviews</h3>
                <div class="reviews-list">
                    ${book.reviews
                      .map(
                        (review) => `
                        <div class="review-item">
                            ${createStarRating(review.rating).outerHTML}
                            <p>${review.text}</p>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
            
            <div class="related-books">
                <h3 class="section-title">Related Books</h3>
                <div class="related-books-grid">
                    ${getRelatedBooks(book.id)
                      .map(
                        (relatedBook) => `
                        <div class="related-book">
                            <div class="related-book-cover">
                                <img src="${relatedBook.cover}" alt="${relatedBook.title}">
                            </div>
                            <div class="related-book-info">
                                <h4>${relatedBook.title}</h4>
                                <p>${relatedBook.author}</p>
                                <button class="view-details" data-book-id="${relatedBook.id}">
                                    View Details
                                </button>
                            </div>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
        </div>
        <div style="clear: both;"></div>
    `;

  // nested view details
  modalBody.querySelectorAll(".view-details").forEach((button) => {
    button.addEventListener("click", (e) => {
      const relatedBookId = e.target.dataset.bookId;
      showBookDetails(relatedBookId);
    });
  });

  modal.style.display = "block";
}

// Star Rating Handling
function createStarRating(rating, interactive = false) {
  const starsContainer = document.createElement("div");
  starsContainer.className = "star-rating";
  starsContainer.dataset.rating = rating;

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.className = `star ${i <= rating ? 'selected' : ''}`;
    star.dataset.value = i;
    
    if (interactive) {
      star.addEventListener('click', handleStarClick);
      star.style.cursor = 'pointer';
    }
    
    // Add star SVG
    star.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>`;
    
    starsContainer.appendChild(star);
  }

  return starsContainer;
}

function handleStarClick(e) {
  const starsContainer = e.target.closest('.star-rating');
  const value = parseInt(e.target.dataset.value);
  
  starsContainer.dataset.rating = value;
  starsContainer.querySelectorAll('.star').forEach((star, index) => {
    star.classList.toggle('selected', index < value);
  });
  
  const ratingText = starsContainer.nextElementSibling;
  if (ratingText) {
    ratingText.textContent = `${value}/5 Stars`;
  }
}

function createRelatedBooks(bookId) {
  const relatedBooksElement = document.createElement("div");
  relatedBooksElement.className = "related-books";

  const title = document.createElement("h3");
  title.className = "section-title";
  title.textContent = "Related Books";
  relatedBooksElement.appendChild(title);

  const grid = document.createElement("div");
  grid.className = "related-books-grid";

  getRelatedBooks(bookId).forEach((book) => {
    const relatedBook = document.createElement("div");
    relatedBook.className = "related-book";
    relatedBook.innerHTML = `
            <div class="related-book-cover">
                <img src="${book.cover}" alt="${book.title}">
            </div>
            <div class="related-book-info">
                <h4>${book.title}</h4>
                <p>${book.author}</p>
                <button class="add-to-favorites" data-book-id="${book.id}">
                    ${
                      book.isFavorite
                        ? "❤️ Remove Favorite"
                        : "♡ Add to Favorites"
                    }
                </button>
            </div>
        `;
    grid.appendChild(relatedBook);
  });

  relatedBooksElement.appendChild(grid);
  return relatedBooksElement;
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-favorites")) {
    const bookId = e.target.dataset.bookId;
    const book = books.find((b) => b.id === bookId);
    const wasFavorite = book.isFavorite;

    // Toggle favorite status
    book.isFavorite = !book.isFavorite;

    document
      .querySelectorAll(`[data-book-id="${bookId}"]`)
      .forEach((button) => {
        button.textContent = book.isFavorite
          ? "❤️ Remove Favorite"
          : "♡ Add to Favorites";
      });

    if (book.isFavorite && !wasFavorite) {
      // Add newly favorited book to the page
      if (!document.querySelector(`.book-card[data-book-id="${bookId}"]`)) {
        const bookCard = createBookCard(book);
        bookCard.dataset.bookId = bookId;
        bookCard.style.opacity = "0";
        booksContainer.prepend(bookCard);

        setTimeout(() => {
          bookCard.style.transform = "translateY(0)";
          bookCard.style.opacity = "1";
        }, 10);
      }
    } else if (!book.isFavorite && wasFavorite) {
      // Remove from page
      const bookCard = document.querySelector(
        `.book-card[data-book-id="${bookId}"]`
      );
      if (bookCard) {
        bookCard.style.transform = "translateX(-100%)";
        bookCard.style.opacity = "0";
        setTimeout(() => bookCard.remove(), 300);
      }
    }

    // Refresh related books
    const currentModalBookId = document
      .querySelector(".modal-book-info")
      ?.querySelector(".book-title")?.dataset?.bookId;
    if (currentModalBookId) {
      showBookDetails(currentModalBookId);
    }
  }
});


function calculateExpansionSpace(card) {
  const container = booksContainer;
  const containerRect = container.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();
  
  const availableRight = containerRect.right - cardRect.left;
  const neededSpace = 700 - 300; // Expanded width - original width
  
  return {
    canExpandRight: availableRight >= neededSpace,
    overflow: neededSpace - availableRight
  };
}

document.querySelectorAll('.book-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const { canExpandRight, overflow } = calculateExpansionSpace(card);
    
    if (!canExpandRight) {
      card.style.transform = `translateX(-${overflow}px)`;
    } else {
      card.style.transform = 'translateX(0)';
    }
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});



function handleToggleExpand(bookElement, book) {
  const expandedContent = bookElement.querySelector(".expanded-content");
  const toggleBtn = bookElement.querySelector(".toggle-btn");

  book.expanded = !book.expanded;
  expandedContent.classList.toggle("active");

  toggleBtn.innerHTML = book.expanded
    ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`
    : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
}

function handleAddReview(bookElement, book) {
  const reviewsSection = bookElement.querySelector(".reviews-section");
  const existingForm = reviewsSection.querySelector(".review-form");

  if (existingForm) {
    existingForm.remove();
    return;
  }

  const reviewForm = reviewFormTemplate.content.cloneNode(true);
  const formElement = reviewForm.querySelector(".review-form");
  const starsContainer = formElement.querySelector('.star-rating');
  createStarRating(0, true, starsContainer);

  formElement.querySelector(".btn-submit").addEventListener("click", () => {
    const reviewText = formElement.querySelector("textarea").value.trim();
    const rating = parseInt(starsContainer.dataset.rating);

    if (!reviewText || rating === 0) {
      alert('Please add a rating and review text');
      return;
    }

    const review = {
      id: Date.now(),
      text: reviewText,
      rating: rating,
    };

    book.reviews.push(review);
    renderReviews(bookElement, book);
    formElement.remove();
  });

  reviewsSection.insertBefore(
    formElement,
    reviewsSection.querySelector(".reviews-list")
  );
}

function initializeReviewForm(form) {
  const starsContainer = form.querySelector('.star-rating');
  const ratingText = form.querySelector('.rating-text');
  const textarea = form.querySelector('textarea');
  let currentRating = 0;

  // Create interactive stars
  starsContainer.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.className = 'star';
    star.dataset.value = i;
    star.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>`;
    
    star.addEventListener('click', () => {
      currentRating = parseInt(star.dataset.value);
      starsContainer.querySelectorAll('.star').forEach((s, idx) => {
        s.classList.toggle('selected', idx < currentRating);
      });
      ratingText.textContent = `${currentRating}/5 Stars`;
    });
    
    starsContainer.appendChild(star);
  }

  // Cancel button handler
  form.querySelector('.btn-cancel').addEventListener('click', () => {
    form.remove();
  });

  // Submit button handler
  form.querySelector('.btn-submit').addEventListener('click', (e) => {
    e.preventDefault();
    const reviewText = textarea.value.trim();
    
    if (!reviewText || currentRating === 0) {
      alert('Please provide both a rating and review text');
      return;
    }

    const review = {
      id: Date.now(),
      text: reviewText,
      rating: currentRating
    };

    // Add review to book object
    const bookId = form.closest('.book-card').dataset.bookId;
    const book = books.find(b => b.id === bookId);
    book.reviews.push(review);

    // Refresh reviews list
    const reviewsList = form.closest('.reviews-section').querySelector('.reviews-list');
    const reviewItem = document.createElement('div');
    reviewItem.className = 'review-item';
    reviewItem.innerHTML = `
      ${createStarRating(currentRating).outerHTML}
      <p>${reviewText}</p>
    `;
    reviewsList.appendChild(reviewItem);

    form.remove();
  });
}

// Modify handleAddReview function
function handleAddReview(bookElement, book) {
  const reviewsSection = bookElement.querySelector(".reviews-section");
  const existingForm = reviewsSection.querySelector(".review-form");

  if (existingForm) {
    existingForm.remove();
    return;
  }

  const formClone = document.importNode(reviewFormTemplate.content, true);
  const reviewForm = formClone.querySelector('.review-form');
  reviewsSection.insertBefore(formClone, reviewsSection.querySelector(".reviews-list"));
  
  // Initialize the form functionality
  initializeReviewForm(reviewForm);
}

// Update createStarRating function
function createStarRating(rating, interactive = false) {
  const starsContainer = document.createElement("div");
  starsContainer.className = "star-rating";
  starsContainer.dataset.rating = rating;

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.className = `star ${i <= rating ? 'selected' : ''}`;
    star.dataset.value = i;
    
    star.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>`;

    if (interactive) {
      star.style.cursor = 'pointer';
      star.addEventListener('click', handleStarClick);
    }
    
    starsContainer.appendChild(star);
  }

  return starsContainer;
}

function renderReviews(bookElement, book) {
  const reviewsList = bookElement.querySelector(".reviews-list");
  reviewsList.innerHTML = "";

  book.reviews.forEach((review) => {
    const reviewElement = document.createElement("div");
    reviewElement.className = "review-item";
    reviewElement.innerHTML = `
        <div class="book-rating">
        ${createStarRating(review.rating).outerHTML}
        </div>
        <p>${review.text}</p>
        `;
    reviewsList.appendChild(reviewElement);
  });
}
function createBookCard(book) {
  const bookElement = document.createElement("div");
  bookElement.className = "book-card fade-in";
  bookElement.dataset.bookId = book.id;

  // Pin button SVG
  const pinButtonSVG = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 17v-4m0 0V8m0 5h5l-5 5h5m-5-5H7l5-5H7"/>
        </svg>
    `;

    bookElement.innerHTML = `
    <button class="pin-button" aria-label="Pin book">
      ${pinButtonSVG}
    </button>
    <div class="book-content">
      <div class="book-cover">
        <img src="${book.cover}" alt="${book.title}">
      </div>
      <div class="book-details">
        ${createBookHeader(book)}
        ${createExpandedContent(book)}
      </div>
    </div>
  `;

  // Pin functionality
  const pinBtn = bookElement.querySelector(".pin-button");
  pinBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const wasPinned = bookElement.classList.contains("pinned");

    // Unpin all other cards
    document.querySelectorAll(".book-card.pinned").forEach((card) => {
      if (card !== bookElement) card.classList.remove("pinned");
    });

    bookElement.classList.toggle("pinned", !wasPinned);
  });

  let hoverTimeout;
  bookElement.addEventListener("mouseenter", () => {
    hoverTimeout = setTimeout(() => {
      if (!document.querySelector(".book-card.pinned")) {
        bookElement.classList.add("hover-expand");
      }
    }, 300);
  });

  bookElement.addEventListener("mouseleave", () => {
    clearTimeout(hoverTimeout);
    if (!bookElement.classList.contains("pinned")) {
      bookElement.classList.remove("hover-expand");
    }
  });

  const toggleBtn = bookElement.querySelector(".toggle-btn");
  const addReviewBtn = bookElement.querySelector(".add-review-btn");

  toggleBtn.addEventListener("click", () =>
    handleToggleExpand(bookElement, book)
  );
  addReviewBtn.addEventListener("click", () =>
    handleAddReview(bookElement, book)
  );

  // Initial render of reviews
  renderReviews(bookElement, book);

  return bookElement;
}

function createBookHeader(book) {
  return `
        <div class="book-header">
            <div class="book-meta">
                <h2 class="book-title">${book.title}</h2>
                <p class="book-author">${book.author}</p>
                <p class="book-description">${book.description}</p>
                <div class="book-rating">
                    ${createStarRating(book.rating).outerHTML}
                    <span class="rating-value">(${book.rating})</span>
                </div>
            </div>
            <button class="toggle-btn" aria-label="Toggle book details">
                ${toggleButtonSVG}
            </button>
        </div>
    `;
}

function createExpandedContent(book) {
  return `
        <div class="expanded-content">
            ${createReviewsSection(book)}
            ${createRelatedBooks(book.id).outerHTML}
        </div>
    `;
}

function createReviewsSection(book) {
  return `
        <div class="reviews-section">
            <div class="reviews-header">
                <h3 class="section-title">Reviews</h3>
                <button class="add-review-btn">
                    ${plusIconSVG}
                    Add Review
                </button>
            </div>
            <div class="reviews-list"></div>
        </div>
    `;
}

const toggleButtonSVG = `
    <svg width="24" height="24" viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" stroke-width="2" 
        stroke-linecap="round" stroke-linejoin="round">
        <path d="m6 9 6 6 6-6"/>
    </svg>
`;

const plusIconSVG = `
    <svg width="16" height="16" 
        viewBox="0 0 24 24" fill="none" stroke="currentColor" 
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 5v14M5 12h14"/>
    </svg>
`;

// Initialize the page
function initializePage() {
  // Filter only favorite books
  const favoriteBooks = books.filter((book) => book.isFavorite);
  favoriteBooks.forEach((book) => {
    const bookCard = createBookCard(book);
    booksContainer.appendChild(bookCard);
  });
}

// Start
document.addEventListener("DOMContentLoaded", initializePage);

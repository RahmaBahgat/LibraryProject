// Book Page Controller
document.addEventListener("DOMContentLoaded", function() {
  // Initialize books array from localStorage
  let books = JSON.parse(localStorage.getItem('books')) || [];
  
  // Load and display the book data
  loadBookData();
  
  // Set up event listeners
  document.getElementById('fav-btn')?.addEventListener('click', toggleFavorite);
});

// Get book ID from URL parameters
function getBookIdFromUrl() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('id');
}

// Find book by ID, checking both localStorage and default books array
function findBookById(bookId) {
  // First check localStorage (for admin-added books)
  const localBooks = JSON.parse(localStorage.getItem('libraryBooks')) || [];
  const localBook = localBooks.find(book => book.id === bookId);
  
  if (localBook) return localBook;
  
  // Then check the original books array
  return books.find(book => book.id === bookId);
}

// Update the book page with the current book's data
function updateBookPage(book) {
  if (!book) return;

  // Update required fields
  document.querySelector('.book-title').textContent = book.title;
  document.querySelector('.book-author').textContent = book.author;
  document.querySelector('.p-description').textContent = book.description;
  
  // Handle category/classification
  const categoryElement = document.querySelector('.book-category');
  if (book.category) {
    categoryElement.textContent = Array.isArray(book.category) 
      ? book.category.join(', ') 
      : book.category;
  } else if (book.genre) {
    categoryElement.textContent = book.genre;
  } else {
    categoryElement.textContent = 'Uncategorized';
  }
  
  // Update cover image
  const imgContainer = document.querySelector('.img-container img');
  if (imgContainer) {
    imgContainer.src = book.cover;
    imgContainer.alt = `${book.title} cover`;
  }
  
  // Update availability status
  const available = book.status !== 'Want to Read';
  const availabilityElement = document.querySelector('.avl');
  if (availabilityElement) {
    availabilityElement.textContent = available ? 'Available' : 'Not Available';
  }
  
  // Update favorite button
  updateFavoriteButton(book);
}

// Update the favorite button state
function updateFavoriteButton(book) {
  const favBtn = document.getElementById('fav-btn');
  if (!favBtn) return;

  const favText = favBtn.querySelector('.fav-text') || favBtn;
  const icon = favBtn.querySelector('.icon');
  
  // Handle both versions of the button structure
  if (icon) {
    favBtn.classList.toggle('active', book.isFavorite);
    if (favText.classList.contains('add-to-favorites')) {
      favText.textContent = book.isFavorite ? 'Remove from Favorites' : 'Add to Favorites';
    }
    icon.textContent = book.isFavorite ? '❤️' : '♡';
  } else {
    favBtn.innerHTML = book.isFavorite 
      ? '❤️ Remove from Favorites' 
      : '♡ Add to Favorites';
  }
}

// Toggle favorite status for the current book
function toggleFavorite() {
  const bookId = getBookIdFromUrl();
  if (!bookId) return;

  // Refresh books from localStorage
  books = JSON.parse(localStorage.getItem('books')) || [];
  let book = findBookById(bookId);
  
  if (book) {
    // Toggle favorite status
    book.isFavorite = !book.isFavorite;
    
    // Save back to localStorage
    localStorage.setItem('books', JSON.stringify(books));
    
    // Update all favorite buttons for this book
    document.querySelectorAll(`[data-book-id="${bookId}"]`).forEach(btn => {
      btn.innerHTML = book.isFavorite 
        ? '❤️ Remove Favorite' 
        : '♡ Add to Favorites';
    });
    
    // Update the current page
    updateBookPage(book);
    
    // If on favorites page, refresh the view
    if (window.location.pathname.includes('FavouriteBooks')) {
      window.location.reload();
    }
  }
}

// Load and display the book data
function loadBookData() {
  const bookId = getBookIdFromUrl();
  if (!bookId) {
    console.error('No book ID found in URL');
    return;
  }
  
  const book = findBookById(bookId);
  if (!book) {
    console.error('Book not found with ID:', bookId);
    return;
  }
  
  updateBookPage(book);
}
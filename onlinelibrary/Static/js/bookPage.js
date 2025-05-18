// Book Page Controller
document.addEventListener("DOMContentLoaded", function() {
  // The book data is already loaded from Django view into the template
  // Just setup the event listeners
  document.getElementById('fav-btn')?.addEventListener('click', toggleFavorite);
  document.getElementById('borrow-btn')?.addEventListener('click', borrowBook);
  
  // If the book data wasn't properly rendered in the template, try to get it from the URL
  const bookId = getBookIdFromUrl();
  if (bookId && document.querySelector('.book-title').textContent === 'Book Title') {
    // This means the template didn't receive the book data
    fetchBookData(bookId);
  }
});

function getBookIdFromUrl() {
  const pathParts = window.location.pathname.split('/');
  // URL format should be /book/123/ where 123 is the book ID
  for (let i = 0; i < pathParts.length; i++) {
    if (pathParts[i] === 'book' && i+1 < pathParts.length) {
      return pathParts[i+1];
    }
  }
  
  // Fallback to query string
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('id');
}

function fetchBookData(bookId) {
  // Make an AJAX request to get book data
  fetch(`/api/books/${bookId}/`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Book not found');
      }
      return response.json();
    })
    .then(data => {
      updateBookPage(data.book);
      updateBorrowButton(data.book);
    })
    .catch(error => {
      console.error('Error fetching book:', error);
    });
}

// Update the borrow button state based on whether book is already borrowed
function updateBorrowButton(book) {
  const borrowBtn = document.getElementById('borrow-btn');
  if (!borrowBtn) return;

  // Check if book is already borrowed
  if (borrowBtn.classList.contains('borrowed')) {
    // Button was already updated by Django template
    return;
  }

  // If we need to update based on AJAX data
  if (book.is_borrowed) {
    borrowBtn.textContent = 'Borrowed';
    borrowBtn.classList.add('borrowed');
    borrowBtn.disabled = true;
  } else {
    borrowBtn.textContent = 'Borrow';
    borrowBtn.classList.remove('borrowed');
    borrowBtn.disabled = false;
  }
}

function updateBookPage(book) {
  if (!book) return;

  // Update required fields
  document.querySelector('.book-title').textContent = book.title;
  document.querySelector('.book-author').textContent = book.author;
  document.querySelector('.p-description').textContent = book.description;
  
  // Update category
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
  
  // Update book cover
  const imgContainer = document.querySelector('.img-container img');
  if (imgContainer) {
    imgContainer.src = book.image || book.cover_path || '/static/images/books/default-cover.jpg';
    imgContainer.alt = `${book.title} cover`;
  }
  
  updateFavoriteButton(book);
}

function updateFavoriteButton(book) {
  const favBtn = document.getElementById('fav-btn');
  if (!favBtn) return;

  favBtn.innerHTML = '';
  const icon = document.createElement('span');
  icon.className = 'icon';
  icon.textContent = book.is_favorite ? '❤️' : '♡';

  const text = document.createElement('span');
  text.className = 'fav-text';
  text.textContent = book.is_favorite ? 'Remove from Favorites' : 'Add to Favorites';

  favBtn.appendChild(text);
  favBtn.appendChild(icon);

  // Update button class
  if (book.is_favorite) {
    favBtn.classList.add('favorited');
  } else {
    favBtn.classList.remove('favorited');
  }
}

function toggleFavorite() {
  const bookId = getBookIdFromUrl();
  if (!bookId) return;

  // Send request to toggle favorite status
  fetch(`/book/${bookId}/toggle-favorite/`, {
    method: 'POST',
    headers: {
      'X-CSRFToken': getCSRFToken(),
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Update the button state
      const favBtn = document.getElementById('fav-btn');
      if (favBtn) {
        const icon = favBtn.querySelector('.icon');
        const text = favBtn.querySelector('.fav-text');
        
        if (data.is_favorite) {
          icon.textContent = '❤️';
          text.textContent = 'Remove from Favorites';
          favBtn.classList.add('favorited');
        } else {
          icon.textContent = '♡';
          text.textContent = 'Add to Favorites';
          favBtn.classList.remove('favorited');
        }
      }
    }
  })
  .catch(error => console.error('Error:', error));
}

function borrowBook() {
  const bookId = getBookIdFromUrl();
  if (!bookId) return;

  // Send request to borrow the book
  fetch(`/book/${bookId}/borrow/`, {
    method: 'POST',
    headers: {
      'X-CSRFToken': getCSRFToken(),
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Update the borrow button
      const borrowBtn = document.getElementById('borrow-btn');
      borrowBtn.textContent = 'Borrowed';
      borrowBtn.classList.add('borrowed');
      borrowBtn.disabled = true;
      
      // Show success message
      alert(data.message || `Book has been borrowed successfully!`);
    } else {
      // Show error message
      alert(data.message || 'Failed to borrow the book. Please try again.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  });
}

// Helper function to get CSRF token for AJAX requests
function getCSRFToken() {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith('csrftoken=')) {
      return cookie.substring('csrftoken='.length, cookie.length);
    }
  }
  return '';
}
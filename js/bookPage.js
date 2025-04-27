// Book Page Controller
document.addEventListener("DOMContentLoaded", function() {
  let books = JSON.parse(localStorage.getItem('books')) || [];
    loadBookData();
  
  document.getElementById('fav-btn')?.addEventListener('click', toggleFavorite);
  document.getElementById('borrow-btn')?.addEventListener('click', borrowBook);
});


function getBookIdFromUrl() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('id');
}

function findBookById(bookId) {

  const localBooks = JSON.parse(localStorage.getItem('libraryBooks')) || [];
  const localBook = localBooks.find(book => book.id === bookId);
  
  if (localBook) return localBook;
  
  return books.find(book => book.id === bookId);
}


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
  updateBorrowButton(book); 
}

// Update the borrow button state based on whether book is already borrowed
function updateBorrowButton(book) {
  const borrowBtn = document.getElementById('borrow-btn');
  if (!borrowBtn) return;

  const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooksData')) || [];
  const isBorrowed = borrowedBooks.some(b => b.title === book.title && b.status === "Not Returned");
  
  if (isBorrowed) {
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
  

  const imgContainer = document.querySelector('.img-container img');
  if (imgContainer) {
    imgContainer.src = book.cover;
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
  icon.textContent = book.isFavorite ? '❤️' : '♡';

  const text = document.createElement('span');
  text.className = 'fav-text';
  text.textContent = book.isFavorite ? 'Remove from Favorites' : 'Add to Favorites';

  favBtn.appendChild(text);
  favBtn.appendChild(icon);

  // Update button class
  if (book.isFavorite) {
    favBtn.classList.add('favorited');
  } else {
    favBtn.classList.remove('favorited');
  }
}


function toggleFavorite() {
  const bookId = getBookIdFromUrl();
  if (!bookId) return;

  // Refresh books from localStorage
  books = JSON.parse(localStorage.getItem('books')) || [];
  let book = findBookById(bookId);
  
  if (book) {
  
    book.isFavorite = !book.isFavorite;
    
   
    localStorage.setItem('books', JSON.stringify(books));
    
   
    document.querySelectorAll(`[data-book-id="${bookId}"]`).forEach(btn => {
      btn.innerHTML = book.isFavorite 
        ? '❤️ Remove Favorite' 
        : '♡ Add to Favorites';
    });
 
    updateBookPage(book);
  }
}


function borrowBook() {
  const bookId = getBookIdFromUrl();
  if (!bookId) return;


  const book = findBookById(bookId);
  if (!book) return;


  const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooksData')) || [];
  
  const alreadyBorrowed = borrowedBooks.some(b => b.title === book.title && b.status === "Not Returned");
  if (alreadyBorrowed) {
    alert('You have already borrowed this book!');
    return;
  }

  // Check if user has reached borrow limit (5 books)
  const currentBorrowCount = borrowedBooks.filter(b => b.status === "Not Returned").length;
  if (currentBorrowCount >= 5) {
    alert('You cannot borrow more than 5 books. Please return a book to borrow a new one.');
    return;
  }

  // Add book to borrowed list
  const borrowedBook = {
    title: book.title,
    author: book.author,
    category: book.category ? (Array.isArray(book.category) ? book.category.join(', ') : book.category) : book.genre,
    borrowedOn: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    status: "Not Returned",
    reviews: []
  };

  borrowedBooks.push(borrowedBook);
  localStorage.setItem('borrowedBooksData', JSON.stringify(borrowedBooks));

  // Update the book's borrowed status in the main books list
  books = JSON.parse(localStorage.getItem('books')) || [];
  const bookIndex = books.findIndex(b => b.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex].isBorrowed = true;
    localStorage.setItem('books', JSON.stringify(books));
  }

  // Update the borrow button state
  updateBorrowButton(book);
  
  alert(`"${book.title}" has been added to your borrowed books!`);
}
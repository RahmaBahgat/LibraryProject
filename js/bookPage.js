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
<<<<<<< HEAD
    
    const favBtn = document.getElementById('fav-btn');
    favBtn.textContent = book.isFavorite ? '❤️ Remove from Favorites' : '♡ Add to Favorites';
    
    // document.querySelector('.fa-xmark').style.display = available ? 'none' : 'inline-block';
    // document.querySelector('.fa-check').style.display = available ? 'inline-block' : 'none';
    // document.querySelector('.avl').textContent = available ? 'Available' : 'Not Available';
    
  const available = book.status !== 'Want to Read'; 
  document.querySelector('.avl').textContent = available ? 'Available' : 'Not Available';
  

// Check borrow status from user data
const loggedInUser = JSON.parse(localStorage.getItem('loggedIn'));
let isBorrowed = false;

if (loggedInUser && loggedInUser.books) {
  isBorrowed = loggedInUser.books.borrowed.some(b => 
    b.id === book.id && b.status === "Not Returned"
  );
}

const borrowBtn = document.getElementById('borrow-btn');
if (isBorrowed) {
  borrowBtn.disabled = true;
  borrowBtn.textContent = "Already Borrowed";
  borrowBtn.style.backgroundColor = "#AC9C8D"; 
} else {
  borrowBtn.disabled = false;
  borrowBtn.textContent = "Borrow";
  borrowBtn.style.backgroundColor = "#72383D"; 
}
}

  function updateFavoriteButton(book) {
    const favBtn = document.getElementById('fav-btn');
    if (!favBtn) return;
=======
  }
>>>>>>> 0b75406a3f49b281399b6f83bca9e1e0b085d226
  
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

<<<<<<< HEAD
  document.addEventListener('DOMContentLoaded', () => {
    books = JSON.parse(localStorage.getItem('books')) || [];
    loadBookData();
    
    document.getElementById('fav-btn')?.addEventListener('click', toggleFavorite);

  });

  function handleBorrow() {
    const bookId = getBookIdFromUrl();
    const book = findBookById(bookId);
    
    if (!book) {
      alert('Book not found!');
      return;
    }
  
    const loggedInUser = JSON.parse(localStorage.getItem('loggedIn'));
    if (!loggedInUser) {
      alert('Please login first!');
      window.location.href = 'login.html';
      return;
    }
  
    let users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(u => u.email === loggedInUser.email);
  
    // Check if already borrowed
    const isAlreadyBorrowed = users[userIndex].books.borrowed.some(b => 
      b.id === bookId && b.status === "Not Returned"
    );
  
    if (isAlreadyBorrowed) {
      alert('You already have this book borrowed!');
      return;
    }
  
    // Add to borrowed books
    users[userIndex].books.borrowed.push({
      id: bookId,
      title: book.title,
      author: book.author,
      cover: book.cover,
      borrowedOn: new Date().toLocaleDateString(),
      status: "Not Returned"
    });
  
    // Update local storage
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedIn', JSON.stringify(users[userIndex]));
  
    // Show confirmation and update UI
    alert('Book borrowed successfully!');
    updateBookPage(book); // Refresh button state
  }
=======
  // Refresh books from localStorage
  books = JSON.parse(localStorage.getItem('books')) || [];
  let book = findBookById(bookId);
>>>>>>> 0b75406a3f49b281399b6f83bca9e1e0b085d226
  
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
<<<<<<< HEAD

  document.getElementById('borrow-btn')?.addEventListener('click', (e) => {
    try {
      handleBorrow();
    } catch (error) {
      console.error('Borrow error:', error);
      alert('An error occurred during borrowing. Please try again.');
    }
  });

  document.addEventListener('DOMContentLoaded', loadBookData);
=======
  
  const book = findBookById(bookId);
  if (!book) {
    console.error('Book not found with ID:', bookId);
    return;
  }
  
  updateBookPage(book);
}
>>>>>>> 0b75406a3f49b281399b6f83bca9e1e0b085d226

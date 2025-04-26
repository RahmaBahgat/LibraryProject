
function getBookIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('id');
  }
  
  // Function to find book by ID
  function findBookById(bookId) {
    return books.find(book => book.id === bookId);
  }
  

  function updateBookPage(book) {
    
    document.querySelector('.book-title').textContent = book.title;
    document.querySelector('.book-author').textContent = book.author;
    document.querySelector('.book-category').textContent = book.category.join(', ');
    document.querySelector('.p-description').textContent = book.description;
    
    
    const imgContainer = document.querySelector('.img-container img');
    imgContainer.src = book.cover;
    imgContainer.alt = `${book.title} cover`;
    
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
  
    const favText = favBtn.querySelector('.fav-text');
    const icon = favBtn.querySelector('.icon');
    
    favBtn.classList.toggle('active', book.isFavorite);
    favText.textContent = book.isFavorite ? 'Remove from Favorites' : 'Add to Favorites';
    icon.textContent = book.isFavorite ? '❤️' : '♡';
    
  }
  
  function toggleFavorite() {
    const bookId = getBookIdFromUrl();
    if (!bookId) return;
  
    // Refresh from localStorage
    books = JSON.parse(localStorage.getItem('books')) || [];
    const book = books.find(b => b.id === bookId);
    
    if (book) {
      // Force boolean toggle
      book.isFavorite = !Boolean(book.isFavorite);
      localStorage.setItem('books', JSON.stringify(books));
  
      // Update all buttons immediately
      document.querySelectorAll(`[data-book-id="${bookId}"]`).forEach(btn => {
        btn.innerHTML = book.isFavorite ? 
          '❤️ Remove Favorite' : 
          '♡ Add to Favorites';
      });
  
      // If on favorites page, refresh
      if (window.location.pathname.includes('FavouriteBooks')) {
        initializePage();
      }
    }
    updateBookPage(book)
  }

  document.getElementById('fav-btn').addEventListener('click', toggleFavorite);

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
  
  function loadBookData() {
    books = JSON.parse(localStorage.getItem('books'));
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

  document.getElementById('borrow-btn')?.addEventListener('click', (e) => {
    try {
      handleBorrow();
    } catch (error) {
      console.error('Borrow error:', error);
      alert('An error occurred during borrowing. Please try again.');
    }
  });

  document.addEventListener('DOMContentLoaded', loadBookData);
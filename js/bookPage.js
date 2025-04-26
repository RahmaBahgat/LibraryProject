
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
  

  document.addEventListener('DOMContentLoaded', loadBookData);
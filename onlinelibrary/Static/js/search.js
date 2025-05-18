document.addEventListener('DOMContentLoaded', bookSearch);

function bookSearch() {

  
  const searchInput = document.getElementById('searchBar');
  const bookCards = document.getElementById('data-book');
  const resultsContainer = document.getElementById('results');
  const bookCarouselsContainer = document.getElementById('book-carousels-container');

  const allBooks = JSON.parse(bookCards.getAttribute('data-books'));
  console.log('All books loaded:', allBooks);
  
  let originalCarouselsHTML = bookCarouselsContainer.innerHTML;
  
  searchInput.addEventListener('input', function() {
    const searchValue = this.value.toLowerCase().trim();
    console.log('Searching for:', searchValue);
    
    if (searchValue === '') {
      bookCarouselsContainer.innerHTML = originalCarouselsHTML;
      resultsContainer.innerHTML = '';
      initializeCarousels(); // Reinitialize carousel functionality
      console.log('Search cleared - showing all books');
      return;
    }
    
    const matchingBooks = allBooks.filter(book => {
      const matches = book.title.toLowerCase().includes(searchValue) ||
                     book.author.toLowerCase().includes(searchValue) ||
                     (book.category && book.category.toString().toLowerCase().includes(searchValue));
      return matches;
    });
    
    console.log('Matched books:', matchingBooks);
    
    displaySearchResults(matchingBooks);
  });
  
  function displaySearchResults(matchingBooks) {
    if (matchingBooks.length === 0) {
      resultsContainer.innerHTML = '<p class="no-results">No books found matching your search.</p>';
      bookCarouselsContainer.innerHTML = '';
      return;
    }
    
    resultsContainer.innerHTML = `
      <div class="search-results-header">
        <h3>Found ${matchingBooks.length} ${matchingBooks.length === 1 ? 'book' : 'books'}</h3>
      </div>
    `;
    
    const booksHTML = matchingBooks.map(book => {
      // Get the correct image path
      const imagePath = book.image
        ? (book.image.startsWith('/') ? book.image : '/media/' + book.image)
        : (book.cover_path ? '/static/' + book.cover_path : '/static/images/books/default-cover.jpg');
      
      return `
        <div class="carousel-item" data-book-id="${book.id}">
          <div class="static-card">
            <a href="/library-admin/books/book/${book.id}/" class="card-link">
              <img src="${imagePath}" alt="${book.title}" onerror="this.onerror=null; this.src='/static/images/books/default-cover.jpg';">
            </a>
          </div>
          <a href="Author page.html?name=${encodeURIComponent(book.author)}" class="book-info">
            ${book.author}
          </a>
        </div>
      `;
    }).join('');
    
    bookCarouselsContainer.innerHTML = `
      <div class="section-wrapper">
        <div class="book-carousel search-results-carousel">
          <button class="carousel-nav prev" aria-label="Previous">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="carousel-track">${booksHTML}</div>
          <button class="carousel-nav next" aria-label="Next">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    `;
    
    // Initialize carousel functionality for search results
    initializeCarousels();
  }
}



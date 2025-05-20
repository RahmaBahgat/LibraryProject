document.addEventListener('DOMContentLoaded', bookSearch);

function bookSearch() {
  const searchInput = document.getElementById('searchBar');
  const bookCards = document.getElementById('data-book');
  const resultsContainer = document.getElementById('results');
  const bookCarouselsContainer = document.getElementById('book-carousels-container');
  const searchForm = document.getElementById('searchForm');

<<<<<<< Updated upstream
  console.log('=== Search Functionality Initialized ==='); 
  
  if (!searchInput) console.error('Search input element not found!');
  if (!bookCards) console.error('Book cards container not found!');
  if (!resultsContainer) console.error('Results container not found!');
  if (!bookCarouselsContainer) console.error('Book carousels container not found!');

  
  const booksData = bookCards.getAttribute('data-books');
  if (!booksData) {
    console.error('No books data found in data-books attribute!');
    return;
  }

  try {
    const allBooks = JSON.parse(booksData);
    console.log('Books data loaded successfully');
    console.log('Total books:', allBooks.length);
    console.log('Sample book data:', allBooks[0]);
  } catch (error) {
    console.error('Error parsing books data:', error);
    return;
  }

  const allBooks = JSON.parse(booksData);
  let originalCarouselsHTML = bookCarouselsContainer.innerHTML;
  
  searchInput.addEventListener('input', function() {
    const searchValue = this.value.toLowerCase().trim();
    const allBookCards = document.querySelectorAll('.book-card');
    if (!searchValue) {
      allBookCards.forEach(card => card.style.display = '');
      resultsContainer.innerHTML = '';
      return;
    }
    allBookCards.forEach(card => {
      const title = card.querySelector('.book-title')?.textContent.toLowerCase() || '';
      const author = card.querySelector('.book-author')?.textContent.toLowerCase() || '';
      if (title.includes(searchValue) || author.includes(searchValue)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
    resultsContainer.innerHTML = '';
  });
  
  function displaySearchResults(matchingBooks) {
    console.log('\n=== Displaying Search Results ===');
    console.log(`Displaying ${matchingBooks.length} books`);
    
    if (matchingBooks.length === 0) {
      console.log('No books found - showing empty state');
      resultsContainer.innerHTML = '<p class="no-results">No books found matching your search.</p>';
      bookCarouselsContainer.innerHTML = '';
=======
  // Store original carousels HTML
  let originalCarouselsHTML = bookCarouselsContainer ? bookCarouselsContainer.innerHTML : '';
  
  // Get books data from the data-book element
  let allBooks = [];
  try {
    const booksData = bookCards ? bookCards.getAttribute('data-books') : '[]';
    allBooks = JSON.parse(booksData);
    console.log('All books loaded:', allBooks);
    
    if (!Array.isArray(allBooks) || allBooks.length === 0) {
      console.error('No books data found or invalid format');
      return;
    }
  } catch (error) {
    console.error('Error loading books data:', error);
    return;
  }

  // Debug: print all loaded books
  console.log('DEBUG: All loaded books:', allBooks);

  // Handle form submission
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const searchValue = searchInput.value.toLowerCase().trim();
      performSearch(searchValue);
    });
  }

  // Handle input changes
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchValue = this.value.toLowerCase().trim();
      performSearch(searchValue);
    });
  }

  function performSearch(searchValue) {
    console.log('Searching for:', searchValue);
    
    if (!searchValue) {
      if (bookCarouselsContainer) {
        bookCarouselsContainer.innerHTML = originalCarouselsHTML;
      }
      if (resultsContainer) {
        resultsContainer.innerHTML = '';
      }
      if (typeof initializeCarousels === 'function') {
        initializeCarousels();
      }
      console.log('Search cleared - showing all books');
      return;
    }
    
    const matchingBooks = allBooks.filter(book => {
      if (!book) return false;
      
      const searchFields = [
        book.title,
        book.author,
        book.category,
        ...(book.genres || [])
      ].filter(Boolean).map(field => String(field).toLowerCase());
      
      return searchFields.some(field => field.includes(searchValue));
    });
    
    // Debug: print matched books
    console.log('DEBUG: Matched books:', matchingBooks);
    displaySearchResults(matchingBooks);
  }

  function displaySearchResults(matchingBooks) {
    if (!resultsContainer) return;

    if (matchingBooks.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-results-header">
          <h3>No books found matching your search.</h3>
          <p>Try different keywords or browse our collection.</p>
        </div>
      `;
      if (bookCarouselsContainer) {
        bookCarouselsContainer.innerHTML = '';
      }
>>>>>>> Stashed changes
      return;
    }
    
    resultsContainer.innerHTML = '';
    
<<<<<<< Updated upstream
    const booksHTML = matchingBooks.map(book => {
      let imagePath;
      if (book.image) {
        if (book.image.startsWith('/media/')) {
          imagePath = book.image;
        } else {
          imagePath = '/static/images/books/' + book.image;
        }
      } else {
        imagePath = '/static/images/books/default-cover.jpg';
      }
      return `
        <a href="/book/${book.id}/" class="book-card" style="text-decoration: none; color: inherit;">
          <div class="book-cover-container">
            <img src="${imagePath}" alt="${book.title}" class="book-cover" onerror="this.onerror=null; this.src='/static/images/books/default-cover.jpg';">
          </div>
          <div class="book-overlay">
            <div class="book-title">${book.title}</div>
          </div>
          <div class="book-author" style="text-align:center; margin-top:0.5rem; font-weight:600;">${book.author}</div>
        </a>
      `;
    }).join('');
    
    bookCarouselsContainer.innerHTML = `
      <div class="section-wrapper" style="margin-top: 2.5rem;">
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
    
    console.log('Search results displayed');
    initializeCarousels();
=======
    if (bookCarouselsContainer) {
      const booksHTML = matchingBooks.map(book => {
        if (!book) return '';
        
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
            <div class="book-info">
              <h4>${book.title}</h4>
              <a href="Author page.html?name=${encodeURIComponent(book.author)}" class="author-link">
                ${book.author}
              </a>
              ${book.category ? `<p class="category">${book.category}</p>` : ''}
              ${book.genres && book.genres.length > 0 ? 
                `<p class="genres">${book.genres.join(', ')}</p>` : ''}
            </div>
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
      if (typeof initializeCarousels === 'function') {
        initializeCarousels();
      }
    }
>>>>>>> Stashed changes
  }
}

// Initialize search functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  bookSearch();
});



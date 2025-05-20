// Search functionality for InOtherWords library
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchBar');
  const bookCards = document.getElementById('data-book');
  const resultsContainer = document.getElementById('results');
  const bookCarouselsContainer = document.getElementById('book-carousels-container');
  const searchForm = document.getElementById('searchForm');

  console.log('=== Search Functionality Initialized ===');
  
  // Check if required elements exist
  if (!searchInput) console.error('Search input element not found!');
  if (!bookCards) console.error('Book cards container not found!');
  if (!resultsContainer) console.error('Results container not found!');
  if (!bookCarouselsContainer) console.error('Book carousels container not found!');

  // Store original carousels HTML to restore when search is cleared
  const originalCarouselsHTML = bookCarouselsContainer ? bookCarouselsContainer.innerHTML : '';
  
  // Get books data from the data-books attribute
  let allBooks = [];
  try {
    const booksData = bookCards.getAttribute('data-books');
    if (booksData) {
      allBooks = JSON.parse(booksData);
      console.log('Books data loaded successfully');
      console.log('Total books:', allBooks.length);
      if (allBooks.length > 0) {
        console.log('Sample book data:', allBooks[0]);
      }
    } else {
      console.error('No books data found in data-books attribute!');
      return;
    }
  } catch (error) {
    console.error('Error parsing books data:', error);
    return;
  }

  // Handle search form submission
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      performSearch(searchInput.value);
    });
  }

  // Handle input changes for real-time search
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      performSearch(this.value);
    });
  }

  function performSearch(searchValue) {
    const trimmedSearch = searchValue.toLowerCase().trim();
    console.log('Searching for:', trimmedSearch);
    
    // If search is empty, restore original content
    if (!trimmedSearch) {
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
    
    console.log('Total books to search through:', allBooks.length);
    
    // Filter books based on search
    const matchingBooks = allBooks.filter(book => {
      // Skip invalid books or books without IDs
      if (!book || !book.id) {
        console.log('Skipping invalid book:', book);
        return false;
      }
      
      const searchFields = [
        book.title,
        book.author,
        book.category,
        ...(book.genres || [])
      ].filter(Boolean).map(field => String(field).toLowerCase());
      
      const hasMatch = searchFields.some(field => field.includes(trimmedSearch));
      
      if (hasMatch) {
        console.log('Match found:', book.title, 'by', book.author);
      }
      
      return hasMatch;
    });
    
    console.log(`Found ${matchingBooks.length} matches for "${trimmedSearch}"`);
    displaySearchResults(matchingBooks);
  }

  function displaySearchResults(matchingBooks) {
    console.log('\n=== Displaying Search Results ===');
    console.log(`Displaying ${matchingBooks.length} books`);
    
    if (!matchingBooks || matchingBooks.length === 0) {
      console.log('No books found - showing empty state');
      
      if (resultsContainer) {
        resultsContainer.innerHTML = '<p class="no-results">No books found matching your search.</p>';
      }
      
      bookCarouselsContainer.innerHTML = `
        <div class="section-wrapper">
          <div class="section-header">
            <h2><i class="fas fa-search"></i> Search Results</h2>
          </div>
          <p style="text-align: center; padding: 2rem;">No books found matching your search.</p>
        </div>
      `;
      return;
    }
    
    // Clear existing results
    if (resultsContainer) {
      resultsContainer.innerHTML = '';
    }
    
    // Build book cards for search results
    const booksHTML = matchingBooks.map(book => {
      // Skip invalid books or books without valid IDs
      if (!book || !book.id) return '';
      
      // Get the correct image path
      let imagePath;
      if (book.image) {
        if (book.image.startsWith('/media/')) {
          imagePath = book.image;
        } else {
          imagePath = '/media/' + book.image;
        }
      } else if (book.cover_path) {
        imagePath = '/static/' + book.cover_path;
      } else {
        imagePath = '/static/images/books/default-cover.jpg';
      }
      
      // Always link to the book detail page at /book/id/
      return `
        <div class="carousel-item">
          <div class="book-card">
            <a href="/book/${book.id}/" class="book-link">
              <div class="book-cover-container">
                <img src="${imagePath}" alt="${book.title}" class="book-cover" 
                    onerror="this.onerror=null; this.src='/static/images/books/default-cover.jpg';">
              </div>
              <div class="book-info">
                <div class="book-details">
                  <h3 class="book-title">${book.title || 'Unknown Title'}</h3>
                  <p class="book-author">by ${book.author || 'Unknown Author'}</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      `;
    }).filter(html => html !== '').join('');
    
    // Display the search results
    bookCarouselsContainer.innerHTML = `
      <div class="section-wrapper" style="margin-top: 2.5rem;">
        <div class="section-header">
          <h2><i class="fas fa-search"></i> Search Results</h2>
          <p class="section-subtitle">Found ${matchingBooks.length} books matching your search</p>
        </div>
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
    
    // Initialize carousel for search results
    if (typeof initializeCarousels === 'function') {
      initializeCarousels();
    }
  }
});



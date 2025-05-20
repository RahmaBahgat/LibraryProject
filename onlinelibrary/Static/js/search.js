document.addEventListener('DOMContentLoaded', bookSearch);

function bookSearch() {
  const searchInput = document.getElementById('searchBar');
  const bookCards = document.getElementById('data-book');
  const resultsContainer = document.getElementById('results');
  const bookCarouselsContainer = document.getElementById('book-carousels-container');

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
      return;
    }
    
    resultsContainer.innerHTML = '';
    
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
  }
}


